import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route("**/api/admin/contexto", (r) =>
    r.fulfill({
      json: { csrfToken: "synthetic", contextExpiresAt: Date.now() + 300000 },
    }),
  );
});
test("recovery conditional message, actual internal links and no enumeration claim", async ({
  page,
}) => {
  await page.route("**/api/admin/recuperacion", (r) =>
    r.fulfill({ status: 202, json: { result: "received" } }),
  );
  await page.goto("/admin/recuperar");
  await page.getByLabel("Correo", { exact: true }).fill("unknown@example.com");
  await page.getByRole("button", { name: "Solicitar recuperación" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Esta respuesta no confirma envío ni entrega",
  );
  await expect(
    page.getByRole("link", { name: "Volver al acceso" }),
  ).toHaveAttribute("href", "/admin/login");
});
test("reset strips fragment before API, validates policy and never retries unknown password", async ({
  page,
}) => {
  let sends = 0;
  await page.route("**/api/admin/restablecer", (r) => {
    sends++;
    return r.abort();
  });
  await page.goto("/admin/restablecer#token=synthetic-private-proof");
  await expect(page).toHaveURL(/\/restablecer$/);
  await page.getByLabel("Contraseña nueva", { exact: true }).fill("short");
  await page.getByRole("button", { name: "Cambiar contraseña" }).click();
  expect(sends).toBe(0);
  await page
    .getByLabel("Contraseña nueva", { exact: true })
    .fill("new synthetic private password");
  await page.getByRole("button", { name: "Cambiar contraseña" }).click();
  await expect(page.getByRole("status")).toContainText(
    "No pudimos confirmar el cambio",
  );
  expect(sends).toBe(1);
  expect(
    await page.evaluate(
      () =>
        Object.keys(localStorage).length + Object.keys(sessionStorage).length,
    ),
  ).toBe(0);
});
test("GET reset does not submit; missing token offers new recovery, no auto-login after confirmed reset", async ({
  page,
}) => {
  let sends = 0;
  await page.route("**/api/admin/restablecer", (r) => {
    sends++;
    return r.fulfill({ json: { result: "reset" } });
  });
  await page.goto("/admin/restablecer");
  expect(sends).toBe(0);
  await expect(page.getByRole("status")).toContainText(
    "Solicita un nuevo enlace",
  );
  await page.goto("/admin/restablecer#token=synthetic-private-proof");
  await page
    .getByLabel("Contraseña nueva", { exact: true })
    .fill("new synthetic private password");
  await page.getByRole("button", { name: "Cambiar contraseña" }).click();
  await expect(page.getByRole("status")).toContainText("Contraseña cambiada");
  await expect(page).toHaveURL(/\/restablecer$/);
  expect(sends).toBe(1);
});
