import {
  randomBytes,
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
export const IDLE = 30 * 60 * 1000,
  ABSOLUTE = 8 * 60 * 60 * 1000,
  PREAUTH = 5 * 60 * 1000,
  RESET = 15 * 60 * 1000;
export const SESSION_COOKIE = "__Host-priva_session",
  PREAUTH_COOKIE = "__Host-priva_preauth";
export function randomToken() {
  return randomBytes(32).toString("base64url");
}
export function canonicalToken(t: unknown): t is string {
  return (
    typeof t === "string" &&
    /^[A-Za-z0-9_-]{43}$/.test(t) &&
    Buffer.from(t, "base64url").toString("base64url") === t
  );
}
export function digest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
export function csrf(key: Buffer, type: "session" | "preauth", token: string) {
  return createHmac("sha256", key)
    .update(type + ":" + digest(token))
    .digest("base64url");
}
export function sameSecret(a: unknown, b: string) {
  if (typeof a !== "string") return false;
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function cookie(name: string, token: string, maxAge: number) {
  return `${name}=${token}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.max(0, Math.floor(maxAge / 1000))}`;
}
export function cookies(header: string | undefined) {
  const out: Record<string, string> = {};
  for (const pair of (header ?? "").split(";")) {
    const i = pair.indexOf("=");
    if (i > 0) {
      const k = pair.slice(0, i).trim();
      if (k in out) out[k] = "";
      else out[k] = pair.slice(i + 1).trim();
    }
  }
  return out;
}
