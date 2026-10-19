import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  constants,
  createReadStream,
  closeSync,
  fsyncSync,
  openSync,
  lstatSync,
  realpathSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  readdirSync,
} from "node:fs";
import { open, rename, unlink } from "node:fs/promises";
import { join, resolve, relative, isAbsolute } from "node:path";
import type { IncomingMessage } from "node:http";
import {
  StoryError,
  uuidPattern,
  type StoryResource,
} from "../../src/lib/story-management-contract.ts";
import type { StoriesRepository } from "./sqlite-repository.ts";
const MAX_OUTPUT = 1048576;
let slots = 0;
export function sandboxArgs(
  path: string,
  program: "ffprobe" | "ffmpeg",
  args: string[],
) {
  return [
    "--as=536870912",
    "--cpu=20:21",
    "--nofile=32",
    "--core=0",
    "--",
    "/usr/bin/bwrap",
    "--unshare-all",
    "--die-with-parent",
    "--new-session",
    "--cap-drop",
    "ALL",
    "--clearenv",
    "--setenv",
    "PATH",
    "/usr/bin",
    "--ro-bind",
    "/usr",
    "/usr",
    "--ro-bind",
    "/lib",
    "/lib",
    "--ro-bind",
    "/lib64",
    "/lib64",
    "--ro-bind",
    "/etc/ld.so.cache",
    "/etc/ld.so.cache",
    "--ro-bind",
    "/etc/alternatives",
    "/etc/alternatives",
    "--proc",
    "/proc",
    "--dev",
    "/dev",
    "--ro-bind",
    path,
    "/input",
    "--",
    "/usr/bin/" + program,
    ...args,
  ];
}
export async function runSandbox(
  path: string,
  program: "ffprobe" | "ffmpeg",
  args: string[],
  timeout = 30000,
  signal?: AbortSignal,
): Promise<string> {
  return new Promise((yes, no) => {
    const child = spawn("/usr/bin/prlimit", sandboxArgs(path, program, args), {
      detached: true,
      env: {},
      stdio: ["ignore", "pipe", "pipe"],
    });
    let bytes = 0,
      out = "",
      failed = false;
    const stop = () => {
      try {
        process.kill(-child.pid!, "SIGKILL");
      } catch {}
    };
    const fail = () => {
      if (!failed) {
        failed = true;
        stop();
      }
    };
    const timer = setTimeout(fail, timeout);
    const abort = () => fail();
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) fail();
    for (const [stream, keep] of [
      [child.stdout, true],
      [child.stderr, false],
    ] as const)
      stream.on("data", (b: Buffer) => {
        bytes += b.length;
        if (bytes > MAX_OUTPUT) fail();
        if (keep && bytes <= MAX_OUTPUT) out += b.toString("utf8");
      });
    child.once("error", () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      no(new StoryError(503, "media_isolation_unavailable"));
    });
    child.once("close", (code) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      if (code !== 0 || failed)
        no(new StoryError(503, "media_inspection_failed"));
      else yes(out);
    });
  });
}
export async function inspect(
  path: string,
  kind: "image" | "audio",
  signal?: AbortSignal,
) {
  const start = Date.now();
  let info: any;
  try {
    info = JSON.parse(
      await runSandbox(
        path,
        "ffprobe",
        [
          "-v",
          "error",
          "-protocol_whitelist",
          "file",
          "-threads",
          "1",
          "-show_streams",
          "-show_format",
          "-of",
          "json",
          "/input",
        ],
        30000,
        signal,
      ),
    );
  } catch (e) {
    throw e instanceof StoryError ? e : new StoryError(422, "invalid_media");
  }
  const streams = info.streams;
  if (!Array.isArray(streams) || streams.length !== 1)
    throw new StoryError(422, "invalid_media");
  const s = streams[0];
  let mime: string,
    width: number | null = null,
    height: number | null = null,
    durationSeconds: number | null = null;
  if (kind === "image") {
    mime = (
      { png: "image/png", mjpeg: "image/jpeg", webp: "image/webp" } as Record<
        string,
        string
      >
    )[s.codec_name];
    width = Number(s.width);
    height = Number(s.height);
    if (
      !mime ||
      !String(info.format?.format_name)
        .split(",")
        .includes(
          (
            {
              png: "png_pipe",
              mjpeg: "jpeg_pipe",
              webp: "webp_pipe",
            } as Record<string, string>
          )[s.codec_name],
        ) ||
      s.codec_type !== "video" ||
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width! <= 0 ||
      height! <= 0 ||
      width! * height! > 20000000 ||
      Math.max(width!, height!) > 8192 ||
      Number(s.nb_frames ?? 1) !== 1
    )
      throw new StoryError(422, "invalid_media");
  } else {
    mime =
      s.codec_name === "mp3" &&
      String(info.format?.format_name).split(",").includes("mp3")
        ? "audio/mpeg"
        : /^pcm_/.test(s.codec_name) &&
            String(info.format?.format_name).split(",").includes("wav")
          ? "audio/wav"
          : "";
    durationSeconds = Number(info.format?.duration ?? s.duration);
    if (
      !mime ||
      s.codec_type !== "audio" ||
      !Number.isFinite(durationSeconds) ||
      durationSeconds! <= 0 ||
      durationSeconds! > 1800
    )
      throw new StoryError(422, "invalid_media");
  }
  // APNG/WebP animation signatures must never be accepted as static images.
  if (kind === "image") {
    const buf = readFileSync(path);
    if (
      (mime === "image/png" && buf.includes(Buffer.from("acTL"))) ||
      (mime === "image/webp" && buf.includes(Buffer.from("ANIM")))
    )
      throw new StoryError(422, "invalid_media");
  }
  const remain = 30000 - (Date.now() - start);
  if (remain <= 0) throw new StoryError(503, "media_inspection_failed");
  await runSandbox(
    path,
    "ffmpeg",
    [
      "-v",
      "error",
      "-xerror",
      "-protocol_whitelist",
      "file",
      "-threads",
      "1",
      "-i",
      "/input",
      "-threads",
      "1",
      "-f",
      "null",
      "-",
    ],
    remain,
    signal,
  );
  return { mime, width, height, durationSeconds };
}
export class StoryMedia {
  activePaths = new Set<string>();
  directory: string;
  repository: StoriesRepository;
  constructor(repository: StoriesRepository, directory: string) {
    this.repository = repository;
    this.directory = resolve(directory);
    for (const root of [
      resolve(import.meta.dirname, "../.."),
      "public",
      "dist",
      ".git",
      ".private-build",
    ]) {
      const rel = relative(resolve(root), this.directory);
      if (!rel || (!rel.startsWith("..") && !isAbsolute(rel)))
        throw Error("Unsafe media root");
    }
    mkdirSync(this.directory, { mode: 0o700, recursive: true });
    const st = lstatSync(this.directory);
    if (
      st.isSymbolicLink() ||
      !st.isDirectory() ||
      st.mode & 0o077 ||
      realpathSync(this.directory) !== this.directory
    )
      throw Error("Unsafe media root");
  }
  path(resource: StoryResource) {
    if (!uuidPattern.test(resource.storageKey))
      throw new StoryError(404, "not_found");
    return join(this.directory, resource.storageKey);
  }
  verify = (resource: StoryResource) => {
    const p = this.path(resource);
    let fd: number | undefined;
    try {
      fd = openSync(p, constants.O_RDONLY | constants.O_NOFOLLOW);
      const st = lstatSync(p);
      if (
        !st.isFile() ||
        st.isSymbolicLink() ||
        st.mode & 0o077 ||
        st.size !== resource.bytes ||
        createHash("sha256").update(readFileSync(fd)).digest("hex") !==
          resource.sha256
      )
        throw Error();
    } catch {
      throw new StoryError(503, "media_unavailable");
    } finally {
      if (fd !== undefined) closeSync(fd);
    }
  };
  async upload(
    token: string | undefined,
    storyId: string,
    id: string,
    kind: "image" | "audio",
    req: IncomingMessage,
  ) {
    const account = this.repository.admin.withAuthorizedTransaction(
      token,
      (_db, a) => {
        this.repository.get(storyId);
        return a.id;
      },
    );
    if (slots >= 2) throw new StoryError(429, "busy");
    slots++;
    const temp = join(this.directory, randomUUID());
    this.activePaths.add(temp);
    let dest: string | undefined;
    let registered = false;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      req.destroy();
    }, 120000);
    try {
      const file = await open(temp, "wx", 0o600);
      let bytes = 0;
      const hash = createHash("sha256");
      try {
        for await (const part of req) {
          if (controller.signal.aborted) throw new StoryError(503, "unknown");
          const chunk = Buffer.from(part);
          bytes += chunk.length;
          if (bytes > (kind === "image" ? 8 : 50) * 1048576)
            throw new StoryError(413, "invalid_media");
          hash.update(chunk);
          await file.writeFile(chunk);
        }
        await file.sync();
      } finally {
        await file.close();
      }
      if (!bytes) throw new StoryError(422, "invalid_media");
      const sha256 = hash.digest("hex");
      const existing = this.repository.admin.withAuthorizedTransaction(
        token,
        () => {
          try {
            return this.repository.resource(id);
          } catch (e) {
            if (e instanceof StoryError && e.status === 404) return null;
            throw e;
          }
        },
      );
      if (existing) {
        if (
          existing.storyId !== storyId ||
          existing.uploadedBy !== account ||
          existing.sha256 !== sha256 ||
          existing.kind !== kind
        )
          throw new StoryError(409, "conflict");
        return {
          id: existing.id,
          kind: existing.kind,
          mime: existing.mime,
          state: existing.state,
        };
      }
      const metadata = await inspect(temp, kind, controller.signal);
      const declared = (req.headers["content-type"] ?? "").split(";")[0];
      if (declared !== metadata.mime)
        throw new StoryError(415, "invalid_media");
      dest = join(this.directory, randomUUID());
      await rename(temp, dest);
      const dir = openSync(this.directory, constants.O_RDONLY);
      try {
        fsyncSync(dir);
      } finally {
        closeSync(dir);
      }
      const key = dest.split("/").pop()!;
      const result = this.repository.admin.withAuthorizedTransaction(
        token,
        (_db, a) => {
          this.repository.get(storyId);
          if (a.id !== account || controller.signal.aborted)
            throw new StoryError(401, "unauthenticated");
          if (
            this.repository.admin.db
              .prepare("SELECT 1 FROM stories_resources WHERE id=?")
              .get(id)
          )
            throw new StoryError(409, "conflict");
          this.repository.admin.db
            .prepare(
              "INSERT INTO stories_resources VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            )
            .run(
              id,
              storyId,
              kind,
              key,
              sha256,
              bytes,
              metadata.mime,
              metadata.width,
              metadata.height,
              metadata.durationSeconds,
              "ready",
              this.repository.admin.clock(),
              a.id,
            );
          return { id, kind, mime: metadata.mime, state: "ready" };
        },
      );
      registered = true;
      return result;
    } finally {
      clearTimeout(timer);
      this.activePaths.delete(temp);
      slots--;
      await unlink(temp).catch(() => {});
      if (dest && !registered) await unlink(dest).catch(() => {});
    }
  }
  cleanup() {
    const referenced = new Set(
      this.repository.admin.db
        .prepare("SELECT storageKey FROM stories_resources")
        .all()
        .map((r) => r.storageKey),
    );
    for (const name of readdirSync(this.directory)) {
      if (!uuidPattern.test(name) || referenced.has(name)) continue;
      const p = join(this.directory, name),
        st = lstatSync(p);
      if (
        !this.activePaths.has(p) &&
        st.isFile() &&
        !st.isSymbolicLink() &&
        Date.now() - st.mtimeMs > 86400000
      )
        unlinkSync(p);
    }
  }
  stream(resource: StoryResource, start?: number, end?: number) {
    const p = this.path(resource);
    const fd = openSync(p, constants.O_RDONLY | constants.O_NOFOLLOW);
    return createReadStream(p, { fd, autoClose: true, start, end });
  }
}
