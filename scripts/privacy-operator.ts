import { stdin, stdout } from "node:process";
import { PrivacyError } from "../server/privacy/policy.ts";
async function secret(label: string) {
  if (!stdin.isTTY || !stdin.setRawMode)
    throw Error("Private TTY required for secrets");
  stdout.write(label);
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise<string>((resolve, reject) => {
    let value = "";
    const done = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.off("data", read);
      stdout.write("\n");
    };
    const read = (buf: Buffer) => {
      for (const ch of buf.toString()) {
        if (ch === "\u0003") {
          done();
          reject(Error("Canceled"));
          return;
        }
        if (ch === "\r" || ch === "\n") {
          done();
          resolve(value);
          return;
        }
        if (ch === "\u007f") value = value.slice(0, -1);
        else if (ch >= " " && value.length < 8192) value += ch;
      }
    };
    stdin.on("data", read);
  });
}
const [action, requestId] = process.argv.slice(2),
  origin = process.env.PRIVA_ADMIN_PUBLIC_ORIGIN;
if (
  !origin ||
  new URL(origin).protocol !== "https:" ||
  new URL(origin).origin !== origin ||
  !["create", "status", "confirm"].includes(action)
)
  throw Error(
    "Usage: privacy-operator.ts create|status|confirm [REQUEST_ID]; qualified HTTPS origin required",
  );
try {
  const token = await secret("Sesión administrativa (oculta): ");
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw Error();
  const headers: Record<string, string> = {
    "x-priva-request": "1",
    origin,
    cookie: "__Host-priva_session=" + token,
  };
  const context = await fetch(origin + "/api/admin/sesion", {
    headers,
    redirect: "error",
  });
  if (!context.ok) throw Error();
  const session = (await context.json()) as any;
  headers["x-csrf-token"] = session.csrfToken;
  headers["content-type"] = "application/json";
  let path = "/api/admin/privacidad/solicitudes",
    method = "POST",
    body: string | undefined;
  if (action === "create") {
    const targets = JSON.parse(
      await secret("JSON requestId/targets (oculto): "),
    );
    body = JSON.stringify(targets);
  } else {
    if (!/^[a-f0-9-]{36}$/i.test(requestId ?? "")) throw Error();
    path += "/" + requestId;
    if (action === "status") method = "GET";
    else {
      path += "/confirmar";
      body = JSON.stringify({ code: await secret("Código (oculto): ") });
    }
  }
  const response = await fetch(origin + path, {
    method,
    headers,
    body,
    redirect: "error",
  });
  const value = (await response.json()) as any;
  // Never print arbitrary server data; errors are deliberately generic.
  if (!response.ok) throw Error();
  stdout.write(
    JSON.stringify({
      requestId: value.requestId,
      state: value.state,
      deadlineAt: value.deadlineAt,
    }) + "\n",
  );
} catch {
  process.stderr.write(
    "No se pudo confirmar la operación. Comprueba el estado sin repetir un envío a ciegas.\n",
  );
  process.exitCode = 1;
}
