import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
export class ReplyCrypto {
  keys: Map<string, Buffer>;
  current: string;
  constructor(keys: Map<string, Buffer>, current = "v1") {
    this.keys = keys;
    this.current = current;
    if (keys.get(current)?.length !== 32) throw Error("Missing reply key");
  }
  seal(aad: string, value: unknown) {
    const iv = randomBytes(12),
      c = createCipheriv("aes-256-gcm", this.keys.get(this.current)!, iv);
    c.setAAD(Buffer.from(aad));
    const data = Buffer.concat([
      c.update(JSON.stringify(value), "utf8"),
      c.final(),
    ]);
    return JSON.stringify({
      v: this.current,
      iv: iv.toString("base64"),
      tag: c.getAuthTag().toString("base64"),
      data: data.toString("base64"),
    });
  }
  open<T>(aad: string, envelope: string): T {
    const e = JSON.parse(envelope),
      key = this.keys.get(e.v);
    if (!key) throw Error("Missing retained reply key");
    const c = createDecipheriv("aes-256-gcm", key, Buffer.from(e.iv, "base64"));
    c.setAAD(Buffer.from(aad));
    c.setAuthTag(Buffer.from(e.tag, "base64"));
    return JSON.parse(
      Buffer.concat([
        c.update(Buffer.from(e.data, "base64")),
        c.final(),
      ]).toString("utf8"),
    ) as T;
  }
}
