import { test, expect, type Page } from "@playwright/test";
async function login(page: Page, email = "one@example.com") {
  await page.goto("/admin/login?returnTo=%2F%2Fevil.invalid");
  await page.getByLabel("Correo", { exact: true }).fill(email);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.locator("[data-identity]")).toHaveText(email);
}
test("real SQLite auth, Secure cookies, same permission across accounts, current logout invalidates replay", async ({
  browser,
  baseURL,
}) => {
  const first = await browser.newContext();
  const other = await browser.newContext();
  const p = await first.newPage(),
    q = await other.newPage();
  try {
    await login(p);
    await login(q, "two@example.com");
    for (const page of [p, q]) {
      await expect(
        page.getByRole("link", { name: "Historias", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Contacto privado", exact: true }),
      ).toBeVisible();
    }
    const before = await first.cookies();
    const session = before.find((c) => c.name === "__Host-priva_session")!;
    expect(
      Boolean(
        session &&
        session.secure &&
        session.httpOnly &&
        session.sameSite === "Strict" &&
        session.path === "/",
      ),
    ).toBe(true);
    await p.getByRole("button", { name: "Cerrar sesión", exact: true }).click();
    await expect(p.getByRole("status")).toContainText(
      "Este acceso se ha cerrado",
    );
    const denied = await first.request.get(baseURL + "/admin");
    expect(denied.status()).toBe(401);
    await first.addCookies([session]);
    const replay = await first.request.get(baseURL + "/api/admin/sesion", {
      headers: { "X-Priva-Request": "1" },
    });
    expect(replay.status()).toBe(401);
    await q.reload();
    await expect(q.locator("[data-identity]")).toHaveText("two@example.com");
  } finally {
    await first.close();
    await other.close();
  }
});
test("real multi-tab logout hides other tab and history does not restore authorization", async ({
  page,
  context,
}) => {
  await login(page);
  const tab = await context.newPage();
  await tab.goto("/admin/historias");
  await expect(tab.locator("[data-private]")).toBeVisible();
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await expect(tab.locator("[data-private]")).toBeHidden();
  await page.goto("/admin/login");
  await page.goBack();
  await expect(page.locator("[data-private]")).toBeHidden();
  await tab.close();
});
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
function control(input: Record<string, unknown>) {
  const result = spawnSync(
    process.execPath,
    ["--experimental-strip-types", "tests/fixtures/admin-service/writer.ts"],
    {
      input: JSON.stringify({
        directory: resolve(".test-output/admin-service-data"),
        ...input,
      }),
      encoding: "utf8",
    },
  );
  if (result.status !== 0) throw Error("Private fixture control failed");
  return JSON.parse(result.stdout);
}
test.beforeEach(() => {
  control({ action: "clear-abuse" });
});
test("real recovery via private local inbox activates pending account and resets once without auto-login", async ({
  page,
  browserName,
}) => {
  const email = `activation-${browserName}@example.com`;
  control({ action: "create", email });
  await page.goto("/admin/recuperar");
  await page
    .getByLabel("Correo", { exact: true })
    .fill(email);
  await page.getByRole("button", { name: "Solicitar recuperación" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Esta respuesta no confirma envío ni entrega",
  );
  let link = "";
  await expect
    .poll(() => {
      const mail = control({
        action: "inbox",
        email,
      });
      link = mail?.resetURL ?? "";
      return Boolean(link);
    })
    .toBe(true);
  await page.goto(link);
  await expect(page).toHaveURL(/\/admin\/restablecer$/);
  await page
    .getByLabel("Contraseña nueva", { exact: true })
    .fill("activated synthetic phrase 2026");
  await page.getByRole("button", { name: "Cambiar contraseña" }).click();
  await expect(page.getByRole("status")).toContainText("Contraseña cambiada");
  await expect(page).toHaveURL(/\/restablecer$/);
  await page.goto("/admin/login");
  await page
    .getByLabel("Correo", { exact: true })
    .fill(email);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("activated synthetic phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.locator("[data-identity]")).toHaveText(
    email,
  );
  await page.goto(link);
  await page
    .getByLabel("Contraseña nueva", { exact: true })
    .fill("another synthetic phrase 2026");
  await page.getByRole("button", { name: "Cambiar contraseña" }).click();
  await expect(page.getByRole("status")).toContainText(
    "El enlace no es válido",
  );
});
test("real lost response after committed login verifies identity; lost logout response remains hidden and retries durably", async ({
  page,
}) => {
  await page.route("**/api/admin/acceso", async (route) => {
    await route.fetch();
    await route.abort();
  });
  await login(page);
  await page.unroute("**/api/admin/acceso");
  await page.route("**/api/admin/salir", async (route) => {
    await route.fetch();
    await route.abort();
  });
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "No pudimos confirmar el cierre",
  );
  await expect(page.locator("[data-private]")).toBeHidden();
  await page.unroute("**/api/admin/salir");
  await page.getByRole("button", { name: "Reintentar cierre" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Este acceso se ha cerrado",
  );
});
test("real logout request lost before commit keeps remote session but UI hidden until explicit retry", async ({
  page,
}) => {
  await login(page);
  await page.route("**/api/admin/salir", (route) => route.abort());
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "No pudimos confirmar el cierre",
  );
  await expect(page.locator("[data-private]")).toBeHidden();
  await page.unroute("**/api/admin/salir");
  await page.getByRole("button", { name: "Reintentar cierre" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Este acceso se ha cerrado",
  );
});
test("real idle expiry controlled by private process clears visible identity on revalidation", async ({
  page,
}) => {
  await login(page);
  control({ action: "expire", email: "one@example.com" });
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent("pageshow")),
  );
  await expect(page.locator("[data-private]")).toBeHidden();
  await expect(page.locator("[data-identity]")).toBeEmpty();
  await expect(page.getByRole("status")).toContainText("Inicia sesión");
});
test("real Node process restart preserves authenticated access and private keys without re-seeding", async ({
  page,
  context,
  baseURL,
}) => {
  await login(page, "two@example.com");
  control({ action: "restart" });
  await expect
    .poll(
      async () => {
        try {
          const response = await context.request.get(
            baseURL + "/api/admin/sesion",
            { headers: { "X-Priva-Request": "1" } },
          );
          return response.status();
        } catch {
          return 0;
        }
      },
      { timeout: 15000 },
    )
    .toBe(200);
  await page.reload();
  await expect(page.locator("[data-identity]")).toHaveText("two@example.com");
});
test("reset response lost after real commit never replays password, new credential works", async ({
  page,
  browserName,
}) => {
  const email = `lost-reset-${browserName}@example.com`;
  control({ action: "create", email });
  await page.goto("/admin/recuperar");
  await page
    .getByLabel("Correo", { exact: true })
    .fill(email);
  await page.getByRole("button", { name: "Solicitar recuperación" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Esta respuesta no confirma envío ni entrega",
  );
  let link = "";
  await expect
    .poll(() => {
      link =
        control({ action: "inbox", email })
          ?.resetURL ?? "";
      return Boolean(link);
    })
    .toBe(true);
  await page.goto(link);
  await page.route("**/api/admin/restablecer", async (route) => {
    await route.fetch();
    await route.abort();
  });
  await page
    .getByLabel("Contraseña nueva", { exact: true })
    .fill("new unknown synthetic phrase 2026");
  await page.getByRole("button", { name: "Cambiar contraseña" }).click();
  await expect(page.getByRole("status")).toContainText(
    "No pudimos confirmar el cambio",
  );
  await expect(
    page.getByRole("button", { name: "Cambiar contraseña" }),
  ).toBeDisabled();
  const proof = new URLSearchParams(new URL(link).hash.slice(1)).get("token");
  expect(control({ action: "proof", token: proof }).valid).toBe(false);
  await page.goto("/admin/login");
  await page
    .getByLabel("Correo", { exact: true })
    .fill(email);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("new unknown synthetic phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.locator("[data-identity]")).toHaveText(
    email,
  );
});
