import type { IncomingMessage, ServerResponse } from "node:http";
import { PrivacyService } from "./service.ts";
import { PrivacyError } from "./policy.ts";
import { AdminError } from "../../src/lib/admin-contract.ts";
import {
  cookies,
  SESSION_COOKIE,
  csrf,
  sameSecret,
} from "../admin/sessions.ts";
import { securityHeaders } from "../admin/http.ts";
export function createPrivacyHandler(o: {
  service: PrivacyService;
  origin: string;
  csrfKey: Buffer;
  log?: (e: { event: string; code: string; duration: number }) => void;
}) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<boolean> => {
    if (!(req.url ?? "").startsWith("/api/admin/privacidad")) return false;
    const start = Date.now();
    let code = "ok";
    for (const [k, v] of Object.entries(securityHeaders)) res.setHeader(k, v);
    const json = (n: number, value: unknown) => {
      res.writeHead(n, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(value));
    };
    try {
      const raw = req.url ?? "",
        url = new URL(raw, o.origin);
      if (raw !== url.pathname || /[\\%]|\/\//.test(raw))
        throw new PrivacyError(404, "not_found");
      if (
        req.headers["x-priva-request"] !== "1" ||
        req.headers["sec-fetch-site"] === "cross-site" ||
        (req.headers.origin !== undefined && req.headers.origin !== o.origin)
      )
        throw new PrivacyError(403, "forbidden");
      const token = cookies(req.headers.cookie)[SESSION_COOKIE];
      o.service.repository.admin.withAuthorizedTransaction(
        token,
        () => true,
        false,
      );
      let data: unknown;
      if (req.method === "POST") {
        if (
          req.headers.origin !== o.origin ||
          !sameSecret(
            req.headers["x-csrf-token"],
            csrf(o.csrfKey, "session", token!),
          )
        )
          throw new PrivacyError(403, "forbidden");
        if (
          !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(
            req.headers["content-type"] ?? "",
          )
        )
          throw new PrivacyError(415, "invalid");
        if (Number(req.headers["content-length"]) > 16384)
          throw new PrivacyError(413, "invalid");
        const chunks: Buffer[] = [];
        let size = 0;
        const timer = setTimeout(() => req.destroy(), 30000);
        try {
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 16384) throw new PrivacyError(413, "invalid");
            chunks.push(Buffer.from(chunk));
          }
          try {
            data = JSON.parse(
              new TextDecoder("utf-8", { fatal: true }).decode(
                Buffer.concat(chunks),
              ),
            );
          } catch {
            throw new PrivacyError(400, "invalid");
          }
        } finally {
          clearTimeout(timer);
        }
      }
      const base = "/api/admin/privacidad/solicitudes",
        match = url.pathname.match(
          /^\/api\/admin\/privacidad\/solicitudes\/([a-f0-9-]{36})(\/confirmar)?$/i,
        );
      if (url.pathname === base && req.method === "POST")
        json(202, o.service.create(token, data));
      else if (match && !match[2] && req.method === "GET")
        json(200, o.service.status(token, match[1]));
      else if (match && match[2] && req.method === "POST")
        json(200, o.service.confirm(token, match[1], data));
      else throw new PrivacyError(404, "not_found");
    } catch (e) {
      if (res.headersSent) {
        res.destroy();
        return true;
      }
      if (e instanceof PrivacyError || e instanceof AdminError) {
        code = e instanceof PrivacyError ? e.code : e.result;
        if (e.status === 429) res.setHeader("Retry-After", "1800");
        json(e.status, { result: "error", code });
      } else {
        code = "unavailable";
        json(503, { result: "error", code });
      }
    } finally {
      o.log?.({
        event: "privacy_operation",
        code,
        duration: Date.now() - start,
      });
    }
    return true;
  };
}
