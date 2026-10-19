import type { IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, lstatSync, realpathSync } from "node:fs";
import { join, resolve } from "node:path";
import type { SqliteAdminRepository } from "./sqlite-repository.ts";
import type { AdminService } from "./service.ts";
import { AdminError, recoveryNotice } from "../../src/lib/admin-contract.ts";
import {
  ABSOLUTE,
  PREAUTH,
  SESSION_COOKIE,
  PREAUTH_COOKIE,
  canonicalToken,
  cookies,
  cookie,
  csrf,
  sameSecret,
  randomToken,
  digest,
} from "./sessions.ts";
export interface RecoveryAPI {
  request(email: unknown, connection: string): Promise<void>;
  reset(token: unknown, password: unknown, connection: string): Promise<void>;
}
export interface HandlerOptions {
  repository: SqliteAdminRepository;
  service: AdminService;
  csrfKey: Buffer;
  origin: string;
  viewsRoot: string;
  recovery?: RecoveryAPI;
  stories?: (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
}
const publicPaths: Record<string, string> = {
  "/admin/login": "login",
  "/admin/recuperar": "recuperar",
  "/admin/restablecer": "restablecer",
};
const privatePaths: Record<string, string> = {
  "/admin": "panel",
  "/admin/historias": "historias",
  "/admin/contacto": "contacto",
};
export const securityHeaders = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' blob:; media-src 'self' blob:; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
};
function json(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
async function body(req: IncomingMessage) {
  if (
    !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(
      req.headers["content-type"] ?? "",
    )
  )
    throw new AdminError(415, "invalid");
  const chunks: Buffer[] = [];
  let n = 0;
  const timer = setTimeout(() => req.destroy(), 30000);
  try {
    for await (const chunk of req) {
      n += chunk.length;
      if (n > 8192) throw new AdminError(413, "invalid");
      chunks.push(Buffer.from(chunk));
    }
  } finally {
    clearTimeout(timer);
  }
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(
      Buffer.concat(chunks),
    );
    const v = JSON.parse(text);
    if (!v || typeof v !== "object" || Array.isArray(v)) throw Error();
    return v as Record<string, unknown>;
  } catch {
    throw new AdminError(400, "invalid");
  }
}
export function createAdminHandler(o: HandlerOptions) {
  const r = o.repository;
  return async (req: IncomingMessage, res: ServerResponse) => {
    for (const [k, v] of Object.entries(securityHeaders)) res.setHeader(k, v);
    try {
      if (o.stories && (await o.stories(req, res))) return;
      const raw = (req.url ?? "").split("?")[0];
      const url = new URL(req.url ?? "/", o.origin);
      const path = url.pathname;
      const method = req.method ?? "GET";
      const ck = cookies(req.headers.cookie);
      const token = ck[SESSION_COOKIE];
      const connection = req.socket.remoteAddress ?? "unknown";
      if (raw !== path || /%|\\|\/\//.test(raw))
        throw new AdminError(404, "not_found");
      const active = () => r.session(token);
      const preauth = () => {
        const t = ck[PREAUTH_COOKIE];
        return canonicalToken(t) &&
          !!r.db
            .prepare(
              "SELECT 1 FROM admin_preauth WHERE tokenDigest=? AND expiresAt>?",
            )
            .get(digest(t), r.clock())
          ? t
          : null;
      };
      const checkCsrf = () => {
        const s = active(),
          pre = s ? null : preauth();
        const t = s ? token : pre;
        const type = s ? "session" : "preauth";
        if (
          !t ||
          !sameSecret(req.headers["x-csrf-token"], csrf(o.csrfKey, type, t))
        )
          throw new AdminError(403, "forbidden");
      };
      if (path.startsWith("/api/admin/")) {
        if (
          req.headers["x-priva-request"] !== "1" ||
          req.headers["sec-fetch-site"] === "cross-site" ||
          (req.headers.origin !== undefined &&
            req.headers.origin !== o.origin) ||
          url.search
        )
          throw new AdminError(403, "forbidden");
        const reads = ["/api/admin/contexto", "/api/admin/sesion"];
        const writes = [
          "/api/admin/acceso",
          "/api/admin/salir",
          "/api/admin/recuperacion",
          "/api/admin/restablecer",
        ];
        if (!reads.includes(path) && !writes.includes(path))
          throw new AdminError(404, "not_found");
        if (reads.includes(path)) {
          if (method !== "GET") throw new AdminError(405, "method_not_allowed");
          if (path === "/api/admin/sesion") {
            const found = r.withAuthorizedTransaction(
              token,
              (_db, a) => {
                const s = active()!;
                return {
                  result: "authenticated",
                  account: { id: a.id, email: a.email },
                  idleExpiresAt: s.session.idleExpiresAt,
                  absoluteExpiresAt: s.session.absoluteExpiresAt,
                  csrfToken: csrf(o.csrfKey, "session", token!),
                };
              },
              false,
            );
            json(res, 200, found);
            return;
          }
          const s = active();
          if (s) {
            json(res, 200, {
              csrfToken: csrf(o.csrfKey, "session", token!),
              contextExpiresAt: Math.min(
                s.session.idleExpiresAt,
                s.session.absoluteExpiresAt,
              ),
            });
            return;
          }
          let t = preauth();
          let expiresAt: number;
          if (!t) {
            o.service.limit("context", connection, 300, 60);
            t = randomToken();
            expiresAt = r.clock() + PREAUTH;
            r.db
              .prepare("INSERT INTO admin_preauth VALUES(?,?)")
              .run(digest(t), expiresAt);
            res.setHeader("Set-Cookie", cookie(PREAUTH_COOKIE, t, PREAUTH));
          } else
            expiresAt = r.db
              .prepare(
                "SELECT expiresAt FROM admin_preauth WHERE tokenDigest=?",
              )
              .get(digest(t))!.expiresAt as number;
          json(res, 200, {
            csrfToken: csrf(o.csrfKey, "preauth", t),
            contextExpiresAt: expiresAt,
          });
          return;
        }
        if (method !== "POST") throw new AdminError(405, "method_not_allowed");
        if (req.headers.origin !== o.origin)
          throw new AdminError(403, "forbidden");
        const data = await body(req);
        if (path !== "/api/admin/salir" || active()) checkCsrf();
        if (path === "/api/admin/acceso") {
          const result = await o.service.login(
            data.email,
            data.password,
            connection,
            token,
          );
          const pre = ck[PREAUTH_COOKIE];
          if (canonicalToken(pre))
            r.db
              .prepare("DELETE FROM admin_preauth WHERE tokenDigest=?")
              .run(digest(pre));
          res.setHeader("Set-Cookie", [
            cookie(SESSION_COOKIE, result.token, ABSOLUTE),
            cookie(PREAUTH_COOKIE, "", 0),
          ]);
          json(res, 200, {
            result: "authenticated",
            csrfToken: csrf(o.csrfKey, "session", result.token),
          });
          return;
        }
        if (path === "/api/admin/salir") {
          r.logout(token);
          const pre = ck[PREAUTH_COOKIE];
          if (canonicalToken(pre))
            r.db
              .prepare("DELETE FROM admin_preauth WHERE tokenDigest=?")
              .run(digest(pre));
          res.setHeader("Set-Cookie", [
            cookie(SESSION_COOKIE, "", 0),
            cookie(PREAUTH_COOKIE, "", 0),
          ]);
          json(res, 200, { result: "signed_out" });
          return;
        }
        if (!o.recovery) throw new AdminError(503, "unavailable");
        if (path === "/api/admin/recuperacion") {
          await o.recovery.request(data.email, connection);
          json(res, 202, { result: "received", message: recoveryNotice });
          return;
        }
        await o.recovery.reset(data.token, data.password, connection);
        json(res, 200, { result: "reset" });
        return;
      }
      if (method !== "GET" && method !== "HEAD")
        throw new AdminError(405, "method_not_allowed");
      let file: string | undefined;
      if (Object.hasOwn(publicPaths, path)) file = publicPaths[path] + ".html";
      else if (Object.hasOwn(privatePaths, path)) {
        r.withAuthorizedTransaction(token, () => null);
        file = privatePaths[path] + ".html";
      } else if (
        /^\/admin\/_astro\/[A-Za-z0-9_.-]+\.(?:js|css|svg|woff2)$/.test(path)
      )
        file = path.slice("/admin/".length);
      if (!file) throw new AdminError(404, "not_found");
      const target = join(resolve(o.viewsRoot), file);
      let st;
      try {
        st = lstatSync(target);
      } catch {
        throw new AdminError(503, "unavailable");
      }
      if (
        !st.isFile() ||
        st.isSymbolicLink() ||
        realpathSync(target) !== target
      )
        throw new AdminError(404, "not_found");
      const type = target.endsWith(".html")
        ? "text/html"
        : target.endsWith(".css")
          ? "text/css"
          : target.endsWith(".js")
            ? "text/javascript"
            : target.endsWith(".svg")
              ? "image/svg+xml"
              : "font/woff2";
      res.setHeader("Content-Type", type + "; charset=utf-8");
      res.statusCode = 200;
      res.end(method === "HEAD" ? undefined : readFileSync(target));
    } catch (e) {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      if (e instanceof AdminError) json(res, e.status, { result: e.result });
      else json(res, 503, { result: "unavailable" });
    }
  };
}
