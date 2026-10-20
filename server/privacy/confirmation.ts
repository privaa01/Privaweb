import { randomBytes, createHmac, timingSafeEqual } from "node:crypto";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function challenge() {
  const bytes = randomBytes(10);
  let bits = 0,
    value = 0,
    out = "";
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += alphabet[(value >>> bits) & 31];
    }
  }
  return out;
}
export function challengeDigest(key: Buffer, id: string, code: string) {
  if (key.length !== 32) throw Error("Invalid privacy challenge key");
  return createHmac("sha256", key)
    .update("privacy009:" + id + ":" + code)
    .digest("hex");
}
export function matches(
  key: Buffer,
  id: string,
  code: unknown,
  expected: string,
) {
  if (
    typeof code !== "string" ||
    !/^[A-Z2-7]{16}$/.test(code) ||
    !/^[a-f0-9]{64}$/.test(expected)
  )
    return false;
  return timingSafeEqual(
    Buffer.from(challengeDigest(key, id, code), "hex"),
    Buffer.from(expected, "hex"),
  );
}
