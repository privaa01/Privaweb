import {mediaBinary} from '../server/stories/macos-media.ts';
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { inspect, runSandbox, sandboxArgs } from "../server/stories/media.ts";
// Generates trusted synthetic input only; inspection of uploads always uses the sandbox launcher.
test("real sandbox decodes static image and WAV, derives metadata and denies invalid image/audio formats", async () => {
  const dir = mkdtempSync(join(tmpdir(), "priva-real-media-"));
  try {
    const png = join(dir, "image.png"),
      wav = join(dir, "audio.wav");
    execFileSync(mediaBinary("ffmpeg"), [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=c=green:s=16x16",
      "-frames:v",
      "1",
      "-threads",
      "1",
      png,
    ]);
    execFileSync(mediaBinary("ffmpeg"), [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=1",
      "-threads",
      "1",
      wav,
    ]);
    const image = await inspect(png, "image");
    assert.equal(image.mime, "image/png");
    assert.equal(image.width, 16);
    assert.equal(image.height, 16);
    const audio = await inspect(wav, "audio");
    assert.equal(audio.mime, "audio/wav");
    assert.ok(audio.durationSeconds! >= 0.9 && audio.durationSeconds! <= 1.1);
    await assert.rejects(() => inspect(wav, "image"));
    await assert.rejects(() => inspect(png, "audio"));
    writeFileSync(join(dir, "bad.png"), readFileSync(png).subarray(0, 20));
    await assert.rejects(() => inspect(join(dir, "bad.png"), "image"));
    assert.deepEqual(readdirSync(dir).sort(), [
      "audio.wav",
      "bad.png",
      "image.png",
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("same sandbox cannot read host sentinel and respects total wall deadline", async () => {
  const dir = mkdtempSync(join(tmpdir(), "priva-media-boundary-"));
  try {
    const p = join(dir, "input.wav"),
      secret = join(dir, "private-sentinel");
    writeFileSync(p, "invalid");
    writeFileSync(secret, "synthetic sentinel");
    await assert.rejects(() =>
      runSandbox(p, "ffprobe", ["-v", "error", "-show_format", secret]),
    );
    await assert.rejects(() =>
      runSandbox(p, "ffprobe", ["-show_format", "/input"], 0),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("actual JPEG/WebP and MP3 are supported; oversized dimensions are rejected", async () => {
  const dir = mkdtempSync(join(tmpdir(), "priva-formats-"));
  try {
    for (const [extension, mime] of [
      ["jpg", "image/jpeg"],
      ["webp", "image/webp"],
    ] as const) {
      const path = join(dir, "image." + extension);
      execFileSync(mediaBinary("ffmpeg"), [
        "-v",
        "error",
        "-f",
        "lavfi",
        "-i",
        "color=c=green:s=16x16",
        "-frames:v",
        "1",
        "-threads",
        "1",
        path,
      ]);
      assert.equal((await inspect(path, "image")).mime, mime);
    }
    const mp3 = join(dir, "sound.mp3");
    execFileSync(mediaBinary("ffmpeg"), [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=1",
      "-threads",
      "1",
      mp3,
    ]);
    assert.equal((await inspect(mp3, "audio")).mime, "audio/mpeg");
    const large = join(dir, "wide.png");
    execFileSync(mediaBinary("ffmpeg"), [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "color=c=green:s=8194x2",
      "-frames:v",
      "1",
      "-threads",
      "1",
      large,
    ]);
    await assert.rejects(() => inspect(large, "image"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

if(process.platform!=='darwin')test(
  "sandbox policy actually denies host file access, writes/network and excess memory/CPU/output",
  { timeout: 40000 },
  async () => {
    const { readlinkSync } = await import("node:fs");
    const dir = mkdtempSync(join(tmpdir(), "priva-policy-"));
    try {
      const input = join(dir, "input"),
        sentinel = join(dir, "private");
      writeFileSync(input, "synthetic input");
      writeFileSync(sentinel, "synthetic private sentinel");
      const args = sandboxArgs(input, "ffprobe", []);
      args[args.length - 1] = "/usr/bin/python3";
      const script = `import os,resource,socket,json
assert resource.getrlimit(resource.RLIMIT_AS)==(536870912,536870912)
assert resource.getrlimit(resource.RLIMIT_CPU)==(20,21)
assert resource.getrlimit(resource.RLIMIT_NOFILE)==(32,32)
assert resource.getrlimit(resource.RLIMIT_CORE)==(0,0)
assert os.readlink('/proc/self/ns/net')!=${JSON.stringify(readlinkSync("/proc/self/ns/net"))}
assert 'NoNewPrivs:\\t1' in open('/proc/self/status').read()
for path in [${JSON.stringify(sentinel)},'/input']:
 try:
  f=open(path,'wb' if path=='/input' else 'rb');f.close();raise AssertionError('forbidden file access allowed')
 except OSError: pass
try:
 socket.create_connection(('198.51.100.1',443),timeout=1);raise AssertionError('network allowed')
except OSError: pass
try:
 bytearray(536870912);raise AssertionError('memory bound absent')
except MemoryError: pass
print('policy-denials-verified')`;
      assert.match(
        execFileSync("/usr/bin/prlimit", [...args, "-c", script], {
          env: {},
          timeout: 5000,
          encoding: "utf8",
        }),
        /policy-denials-verified/,
      );
      let cpuLimited = false;
      try {
        execFileSync("/usr/bin/prlimit", [...args, "-c", "while True: pass"], {
          env: {},
          timeout: 30000,
          stdio: ["ignore", "pipe", "pipe"],
        });
      } catch (e) {
        const error = e as { status: number | null; signal: string | null };
        cpuLimited = error.status === 152 || error.signal === "SIGXCPU";
      }
      assert.equal(
        cpuLimited,
        true,
        "CPU quota, not generic launch failure, must stop the worker",
      );
      const wave = join(dir, "output-bound.wav");
      execFileSync(mediaBinary("ffmpeg"), [
        "-v",
        "error",
        "-f",
        "lavfi",
        "-i",
        "sine=frequency=440:duration=5",
        "-threads",
        "1",
        wave,
      ]);
      await assert.rejects(() =>
        runSandbox(wave, "ffprobe", [
          "-v",
          "error",
          "-protocol_whitelist",
          "file",
          "-show_packets",
          "-show_data",
          "-of",
          "json",
          "/input",
        ]),
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  },
);

test("MP3 codec in an unapproved container cannot be mislabeled as an MP3 file", async () => {
  const dir = mkdtempSync(join(tmpdir(), "priva-container-"));
  try {
    const path = join(dir, "audio.mka");
    execFileSync(mediaBinary("ffmpeg"), [
      "-v",
      "error",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=1",
      "-c:a",
      "libmp3lame",
      "-threads",
      "1",
      path,
    ]);
    await assert.rejects(() => inspect(path, "audio"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
