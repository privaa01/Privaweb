import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { isAbsolute } from "node:path";
// Operator-owned adapter runs privately in the runner, never as a web/debug endpoint.
interface IntegrationAdapter {
  prepare(): Promise<{ accounts: { email: string; password: string }[] }>;
  readMailbox(email: string): Promise<{ resetURL: string } | null>;
  verifySessionRevoked(email: string): Promise<boolean>;
  cleanup(): Promise<void>;
}
const path = process.env.PRIVA_ADMIN_INTEGRATION_ADAPTER;
if (!path || !isAbsolute(path))
  throw Error(
    "BLOQUEADO 006: falta adaptador privado de provisión, buzón y verificación",
  );
const operator = (await import(pathToFileURL(path).href))
  .integrationAdapter as IntegrationAdapter;
if (
  !operator?.prepare ||
  !operator.readMailbox ||
  !operator.verifySessionRevoked ||
  !operator.cleanup
)
  throw Error("BLOQUEADO 006: adaptador privado incompleto");
test("AD01/AD02 real provision, actual controlled mailbox receipt, reset and durable logout", async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(180000);
  if (!baseURL || new URL(baseURL).protocol !== "https:")
    throw Error("BLOQUEADO 006: origen HTTPS real requerido");
  const prepared = await operator.prepare();
  if (prepared.accounts.length !== 2)
    throw Error("Adapter must prepare two controlled synthetic accounts");
  const contexts = await Promise.all([
    browser.newContext(),
    browser.newContext(),
  ]);
  try {
    for (let i = 0; i < 2; i++) {
      const page = await contexts[i].newPage(),
        account = prepared.accounts[i];
      await page.goto(baseURL + "/admin/login");
      await page.getByLabel("Correo", { exact: true }).fill(account.email);
      await page
        .getByLabel("Contraseña", { exact: true })
        .fill(account.password);
      await page.getByRole("button", { name: "Entrar", exact: true }).click();
      await expect(page.locator("[data-private]")).toBeVisible();
      for (const name of ["Historias", "Contacto privado"])
        await expect(
          page.getByRole("link", { name, exact: true }),
        ).toBeVisible();
    }
    const page = contexts[0].pages()[0],
      first = prepared.accounts[0];
    await page.goto(baseURL + "/admin/recuperar");
    await page.getByLabel("Correo", { exact: true }).fill(first.email);
    await page.getByRole("button", { name: "Solicitar recuperación" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Esta respuesta no confirma envío ni entrega",
    );
    let resetURL = "";
    await expect
      .poll(
        async () => {
          resetURL = (await operator.readMailbox(first.email))?.resetURL ?? "";
          return Boolean(resetURL);
        },
        { timeout: 120000 },
      )
      .toBe(true);
    if (new URL(resetURL).origin !== new URL(baseURL).origin)
      throw Error("Unexpected reset origin");
    await page.goto(resetURL);
    const next = "Priva synthetic integration " + crypto.randomUUID();
    await page.getByLabel("Contraseña nueva", { exact: true }).fill(next);
    await page.getByRole("button", { name: "Cambiar contraseña" }).click();
    await expect(page.getByRole("status")).toContainText("Contraseña cambiada");
    expect(await operator.verifySessionRevoked(first.email)).toBe(true);
    await page.goto(resetURL);
    await page
      .getByLabel("Contraseña nueva", { exact: true })
      .fill("Another synthetic integration " + crypto.randomUUID());
    await page
      .getByRole("button", { name: "Cambiar contraseña", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "El enlace no es válido",
    );
    await page.goto(baseURL + "/admin/login");
    await page.getByLabel("Correo", { exact: true }).fill(first.email);
    await page.getByLabel("Contraseña", { exact: true }).fill(first.password);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.getByRole("status")).toContainText(
      "No pudimos iniciar sesión",
    );
    await page.getByLabel("Contraseña", { exact: true }).fill(next);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.locator("[data-private]")).toBeVisible();
    await page
      .getByRole("button", { name: "Cerrar sesión", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Este acceso se ha cerrado",
    );
    expect(await operator.verifySessionRevoked(first.email)).toBe(true);
  } finally {
    for (const context of contexts) await context.close();
    await operator.cleanup();
  }
});
