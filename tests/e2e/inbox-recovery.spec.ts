import { test, expect } from "@playwright/test";
import { loginInbox, newContact, openContact } from "./inbox-helpers";
test("lost HTTP registration confirmation checks durable attempt instead of sending again", async ({
  page,
}) => {
  await loginInbox(page);
  await newContact(page, "Confirmación perdida");
  await openContact(page, "Confirmación perdida");
  let registrations = 0;
  await page.route(
    "**/api/admin/contacto/consultas/*/respuestas",
    async (route) => {
      registrations++;
      await route.fetch();
      await route.abort("failed");
    },
  );
  await page.getByLabel("He revisado").check();
  await page
    .getByLabel("Tu respuesta", { exact: false })
    .fill("Una sola intención");
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await expect(page.locator("[data-inbox-feedback]")).toContainText(
    "Respuesta aceptada",
    { timeout: 15000 },
  );
  expect(registrations).toBe(1);
  await expect(page.locator("[data-history] article")).toHaveCount(1);
});
test("lost before registration retries the same operation identity explicitly", async ({
  page,
}) => {
  await loginInbox(page);
  await newContact(page, "Registro perdido");
  await openContact(page, "Registro perdido");
  const attempts: string[] = [];
  await page.route(
    "**/api/admin/contacto/consultas/*/respuestas",
    async (route) => {
      attempts.push(route.request().postDataJSON().operationId);
      if (attempts.length === 1) await route.abort("failed");
      else await route.continue();
    },
  );
  await page.getByLabel("He revisado").check();
  await page
    .getByLabel("Tu respuesta", { exact: false })
    .fill("Intención conservada");
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await expect(page.locator("[data-inbox-feedback]")).toContainText(
    "No pudimos confirmar",
  );
  await page.getByRole("button", { name: "Comprobar resultado" }).click();
  await expect(page.locator("[data-inbox-feedback]")).toContainText(
    "Respuesta aceptada",
    { timeout: 15000 },
  );
  expect(attempts).toHaveLength(2);
  expect(new Set(attempts).size).toBe(1);
  await expect(page.locator("[data-history] article")).toHaveCount(1);
});
