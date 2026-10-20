import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac } from "node:crypto";
import { InboxService } from "./service.ts";
import { InboxError } from "../../src/lib/inbox-contract.ts";
import {
  SESSION_COOKIE,
  cookies,
  csrf,
  sameSecret,
} from "../admin/sessions.ts";
import { AdminError } from "../../src/lib/admin-contract.ts";
import { securityHeaders } from "../admin/http.ts";
export function createInboxHandler(o: {
  service: InboxService;
  origin: string;
  csrfKey: Buffer;
  log?: (v: { event: string; code: string; duration: number }) => void;
}) {
  const r = o.service.repository,
    admin = r.admin;
  const rate = (account: string, key: string, max: number) =>
    admin.transaction(() => {
      const now = r.now(),
        bucket = createHmac("sha256", o.csrfKey)
          .update("inbox:" + account + ":" + key)
          .digest("hex");
      admin.db.prepare("DELETE FROM admin_abuse WHERE windowEnd<=?").run(now);
      const found = admin.db
        .prepare("SELECT count FROM admin_abuse WHERE bucket=?")
        .get(bucket);
      if (found && Number(found.count) >= max)
        throw new InboxError(429, "rate");
      admin.db
        .prepare(
          "INSERT INTO admin_abuse VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1",
        )
        .run(bucket, now + 60000);
    });
  return async (
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<boolean> => {
    if (!(req.url ?? "").startsWith("/api/admin/contacto")) return false;
    const start = Date.now();
    let status = 200,
      code = "ok";
    for (const [k, v] of Object.entries(securityHeaders)) res.setHeader(k, v);
    const json = (n: number, v: unknown) => {
      status = n;
      res.writeHead(n, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ schemaVersion: 1, ...(v as object) }));
    };
    try {
      const raw = req.url ?? "",
        url = new URL(raw, o.origin);
      if (raw !== url.pathname || /[\\%]|\/\//.test(raw))
        throw new InboxError(404, "not_found");
      if (
        req.headers["x-priva-request"] !== "1" ||
        req.headers["sec-fetch-site"] === "cross-site" ||
        (req.headers.origin !== undefined && req.headers.origin !== o.origin)
      )
        throw new InboxError(403, "forbidden");
      const token = cookies(req.headers.cookie)[SESSION_COOKIE];
      o.service.authorize(token);
      const account = admin.session(token)!.account.id;
      if (!["POST", "GET"].includes(req.method ?? ""))
        throw new InboxError(405, "method_not_allowed");
      let body: unknown;
      if (req.method === "POST") {
        if (
          req.headers.origin !== o.origin ||
          !sameSecret(
            req.headers["x-csrf-token"],
            csrf(o.csrfKey, "session", token!),
          )
        )
          throw new InboxError(403, "forbidden");
        if (
          !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(
            req.headers["content-type"] ?? "",
          )
        )
          throw new InboxError(415, "invalid");
        if (Number(req.headers["content-length"]) > 32768)
          throw new InboxError(413, "invalid");
        const chunks: Buffer[] = [];
        let size = 0;
        const timer = setTimeout(() => req.destroy(), 30000);
        try {
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 32768) throw new InboxError(413, "invalid");
            chunks.push(Buffer.from(chunk));
          }
          try {
            body = JSON.parse(
              new TextDecoder("utf-8", { fatal: true }).decode(
                Buffer.concat(chunks),
              ),
            );
          } catch {
            throw new InboxError(400, "invalid");
          }
        } finally {
          clearTimeout(timer);
        }
      }
      const path = url.pathname,
        base = "/api/admin/contacto";
      let v: any;
      if (path === base + "/listado" && req.method === "POST") {
        rate(account, "read", 60);
        v = o.service.list(token, body);
      } else if (path === base + "/resumen" && req.method === "GET") {
        rate(account, "read", 60);
        v = o.service.summary(token);
      } else {
        const detail = path.match(
            /^\/api\/admin\/contacto\/consultas\/([^/]+)(?:\/(historial|respuestas))?$/,
          ),
          op = path.match(/^\/api\/admin\/contacto\/operaciones\/([^/]+)$/);
        if (detail) {
          const [, id, action] = detail;
          if (!action && req.method === "GET") {
            rate(account, "read", 60);
            v = o.service.detail(token, id);
          } else if (action === "historial" && req.method === "POST") {
            rate(account, "read", 60);
            v = o.service.history(token, id, body);
          } else if (action === "respuestas" && req.method === "POST") {
            const opId = (body as any)?.operationId;
            if (typeof opId !== "string" || !r.op(opId)) {
              rate(account, "send", 10);
              rate(id, "consultation", 2);
            }
            v = o.service.send(token, id, body);
            json(v.replay ? 200 : 202, v);
            return true;
          } else throw new InboxError(405, "method_not_allowed");
        } else if (op && req.method === "GET") {
          rate(account, "read", 60);
          v = o.service.operation(token, op[1]);
        } else throw new InboxError(404, "not_found");
      }
      json(200, v);
    } catch (e) {
      if (e instanceof InboxError || e instanceof AdminError) {
        code = e instanceof InboxError ? e.code : e.result;
        const n = e.status;
        if (n === 429) res.setHeader("Retry-After", "60");
        json(n, { result: "error", code });
      } else {
        code = "unavailable";
        json(503, { result: "error", code });
      }
    } finally {
      o.log?.({ event: "inbox_operation", code, duration: Date.now() - start });
    }
    return true;
  };
}
