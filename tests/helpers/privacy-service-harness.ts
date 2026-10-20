import { createServer } from "node:http";
import { privacyFixture, receive } from "./privacy-fixtures.ts";
import { PrivacyService } from "../../server/privacy/service.ts";
import { PrivacyMailWorker } from "../../server/privacy/mail-worker.ts";
import { createPrivacyHandler } from "../../server/privacy/http.ts";
import { csrf, SESSION_COOKIE } from "../../server/admin/sessions.ts";
export async function privacyHarness() {
  const f = await privacyFixture(),
    service = new PrivacyService(
      f.p,
      f.key,
      f.mailKey,
      "synthetic-confirmation@example.com",
    ),
    mailWorker = new PrivacyMailWorker(service, f.confirmationMail);
  let handler: ReturnType<typeof createPrivacyHandler>;
  const events: unknown[] = [];
  const server = createServer((req, res) => {
    if (req.url === "/") {
      res.setHeader("Content-Type", "text/html");
      res.end(
        '<!doctype html><html lang="es"><title>Banco sintético009</title><body>Banco local de pruebas</body></html>',
      );
      return;
    }
    void handler(req, res).then((handled) => {
      if (!handled) {
        res.statusCode = 404;
        res.end();
      }
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as any).port,
    origin = "http://localhost:" + port;
  handler = createPrivacyHandler({
    service,
    origin,
    csrfKey: f.csrfKey,
    log: (e) => events.push(e),
  });
  const headers = {
    "x-priva-request": "1",
    "content-type": "application/json",
    origin,
    cookie: SESSION_COOKIE + "=" + f.token,
    "x-csrf-token": csrf(f.csrfKey, "session", f.token),
  };
  return {
    ...f,
    origin,
    server,
    headers,
    service,
    mailWorker,
    events,
    stop: async () => {
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
      f.cleanup();
    },
  };
}
