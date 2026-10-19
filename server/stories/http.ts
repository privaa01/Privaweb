import type { IncomingMessage, ServerResponse } from "node:http";
import {
  StoryError,
  uuidPattern,
} from "../../src/lib/story-management-contract.ts";
import { AdminError } from "../../src/lib/admin-contract.ts";
import {
  SESSION_COOKIE,
  cookies,
  csrf,
  sameSecret,
} from "../admin/sessions.ts";
import type { StoriesService } from "./service.ts";
import type { StoryMedia } from "./media.ts";
export function createStoriesHandler(o: {
  service: StoriesService;
  media: StoryMedia;
  origin: string;
  csrfKey: Buffer;
  log?: (v: {
    operationId: string | undefined;
    kind: string;
    status: number;
    duration: number;
  }) => void;
}) {
  const { service: s, media } = o;
  const r = s.repository.admin;
  const limit = (key: string, max: number) =>
    r.transaction(() => {
      const now = r.clock();
      r.db.prepare("DELETE FROM admin_abuse WHERE windowEnd<=?").run(now);
      r.db
        .prepare(
          "INSERT INTO admin_abuse VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1",
        )
        .run(key, now + 60000);
      return (
        Number(
          r.db.prepare("SELECT count FROM admin_abuse WHERE bucket=?").get(key)!
            .count,
        ) <= max
      );
    });
  return async (
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<boolean> => {
    const raw = (req.url ?? "").split("?")[0],
      url = new URL(req.url ?? "/", o.origin),
      path = url.pathname;
    if (
      !raw.startsWith("/api/admin/historias") &&
      !raw.startsWith("/api/public/historias") &&
      !raw.startsWith("/media/public/")
    )
      return false;
    const began = Date.now();
    let op: string | undefined;
    const method = req.method ?? "GET",
      token = cookies(req.headers.cookie)[SESSION_COOKIE];
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    const json = (status: number, v: unknown) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify(v));
    };
    try {
      if (raw !== path || /[%\\]|\/\//.test(raw) || url.search)
        throw new StoryError(404, "not_found");
      const priv = path.startsWith("/api/admin/");
      if (priv) {
        if (
          req.headers["x-priva-request"] !== "1" ||
          req.headers["sec-fetch-site"] === "cross-site" ||
          (req.headers.origin !== undefined && req.headers.origin !== o.origin)
        )
          throw new StoryError(403, "forbidden");
        s.authorize(token);
        if (!["GET", "HEAD"].includes(method)) {
          if (
            req.headers.origin !== o.origin ||
            !sameSecret(
              req.headers["x-csrf-token"],
              csrf(o.csrfKey, "session", token!),
            )
          )
            throw new StoryError(403, "forbidden");
          const account = s.authorize(token);
          if (!limit("stories:" + account, 60))
            throw new StoryError(429, "busy");
        }
      }
      const sendMedia = (
        resource: ReturnType<typeof s.repository.resource>,
      ) => {
        if (!["GET", "HEAD"].includes(method))
          throw new StoryError(405, "method_not_allowed");
        media.verify(resource);
        const range = req.headers.range;
        let start = 0,
          end = resource.bytes - 1,
          status = 200;
        if (range) {
          const m = /^bytes=(\d*)-(\d*)$/.exec(range);
          if (!m || (!m[1] && !m[2])) {
            res.setHeader("Content-Range", `bytes */${resource.bytes}`);
            throw new StoryError(416, "invalid_range");
          }
          if (m[1]) {
            start = Number(m[1]);
            end = m[2] ? Math.min(Number(m[2]), end) : end;
          } else start = Math.max(0, resource.bytes - Number(m[2]));
          if (
            !Number.isSafeInteger(start) ||
            !Number.isSafeInteger(end) ||
            start > end ||
            start >= resource.bytes
          ) {
            res.setHeader("Content-Range", `bytes */${resource.bytes}`);
            throw new StoryError(416, "invalid_range");
          }
          status = 206;
          res.setHeader(
            "Content-Range",
            `bytes ${start}-${end}/${resource.bytes}`,
          );
        }
        const stream =
          method === "HEAD" ? null : media.stream(resource, start, end);
        res.writeHead(status, {
          "Content-Type": resource.mime,
          "Content-Length": end - start + 1,
          "Accept-Ranges": "bytes",
        });
        if (stream) {
          stream.on("error", () => res.destroy());
          res.on("close", () => stream.destroy());
          stream.pipe(res);
        } else res.end();
      };
      if (path === "/api/public/historias") {
        if (method !== "GET") throw new StoryError(405, "method_not_allowed");
        json(200, s.catalog());
        return true;
      }
      let m = /^\/media\/public\/([a-f0-9-]+)$/.exec(path);
      if (m && uuidPattern.test(m[1])) {
        sendMedia(r.transaction(() => s.repository.publicResource(m![1])));
        return true;
      }
      m = /^\/api\/admin\/historias\/recursos\/([a-f0-9-]+)$/.exec(path);
      if (m && uuidPattern.test(m[1])) {
        sendMedia(
          r.withAuthorizedTransaction(token, () =>
            s.repository.resource(m![1]),
          ),
        );
        return true;
      }
      m = /^\/api\/admin\/historias\/operaciones\/([a-f0-9-]+)$/.exec(path);
      if (m && uuidPattern.test(m[1])) {
        if (method !== "GET") throw new StoryError(405, "method_not_allowed");
        json(200, s.repository.receipt(token, m[1]));
        return true;
      }
      const idPattern =
        "(?:historia-[a-f0-9-]{36}|enlace-falso|llamada-sospechosa|contrasena-compartida)";
      m = new RegExp(
        "^/api/admin/historias/(" + idPattern + ")/recursos/([a-f0-9-]+)$",
      ).exec(path);
      if (m && uuidPattern.test(m[2])) {
        if (method !== "PUT") throw new StoryError(405, "method_not_allowed");
        const kind = req.headers["x-resource-kind"];
        if (kind !== "image" && kind !== "audio")
          throw new StoryError(422, "invalid");
        if (!limit("stories-upload:" + s.authorize(token), 10))
          throw new StoryError(429, "busy");
        json(201, await media.upload(token, m[1], m[2], kind, req));
        return true;
      }
      if (path === "/api/admin/historias" && method === "GET") {
        json(200, s.list(token));
        return true;
      }
      m = new RegExp(
        "^/api/admin/historias/(" + idPattern + ")(?:/(publicar|activacion))?$",
      ).exec(path);
      if (m && !m[2] && method === "GET") {
        json(200, s.get(token, m[1]));
        return true;
      }
      const kind =
        path === "/api/admin/historias" && method === "POST"
          ? "create"
          : m && !m[2] && method === "PUT"
            ? "save"
            : m?.[2] === "publicar" && method === "POST"
              ? "publish"
              : m?.[2] === "activacion" && method === "POST"
                ? "activate"
                : null;
      if (!kind)
        throw new StoryError(
          path === "/api/admin/historias" || m ? 405 : 404,
          "not_found",
        );
      if (
        !/^application\/json(?:;\s*charset=utf-8)?$/i.test(
          req.headers["content-type"] ?? "",
        )
      )
        throw new StoryError(415, "invalid");
      const chunks: Buffer[] = [];
      let bytes = 0;
      const timer = setTimeout(() => req.destroy(), 30000);
      let data: unknown;
      try {
        for await (const part of req) {
          const chunk = Buffer.from(part);
          bytes += chunk.length;
          if (bytes > 262144) throw new StoryError(413, "invalid");
          chunks.push(chunk);
        }
        try {
          data = JSON.parse(
            new TextDecoder("utf-8", { fatal: true }).decode(
              Buffer.concat(chunks),
            ),
          );
        } catch {
          throw new StoryError(400, "invalid");
        }
      } finally {
        clearTimeout(timer);
      }
      op = (data as { operationId?: string })?.operationId;
      json(
        kind === "create" ? 201 : 200,
        s.change(token, kind, m?.[1] ?? null, data),
      );
    } catch (e) {
      if (res.headersSent) {
        res.destroy();
        return true;
      }
      if (e instanceof StoryError || e instanceof AdminError) {
        if (e.status === 429) res.setHeader("Retry-After", "60");
        json(e.status, {
          result: e.result,
          ...(e instanceof StoryError ? { errors: e.errors } : {}),
        });
      } else json(503, { result: "unavailable" });
    } finally {
      if (path.startsWith("/api/admin/"))
        o.log?.({
          operationId:
            typeof op === "string" && uuidPattern.test(op) ? op : undefined,
          kind: method,
          status: res.statusCode,
          duration: Date.now() - began,
        });
    }
    return true;
  };
}
