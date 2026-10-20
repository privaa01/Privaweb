import { expect, test, type Page } from "@playwright/test";
let accountCounter = 0;
export const labelFor = (label: string) =>
  label + " " + test.info().project.name;
export async function loginInbox(page: Page) {
  const email = "synthetic-" + accountCounter++ + "@example.com";
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill(email);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page
    .getByRole("link", { name: "Contacto privado", exact: true })
    .click();
  await expect(page.locator("[data-inbox-feedback]")).toContainText(
    /Consultas actualizadas|No hay consultas/,
  );
}
export async function newContact(page: Page, label: string) {
  const r = await page.request.post("/api/contacto/intentos", {
    headers: { Origin: "http://localhost:4333" },
    data: {},
  });
  const token = await r.json();
  const stored = await page.request.post("/api/contacto/consultas", {
    headers: { Origin: "http://localhost:4333" },
    data: {
      attemptId: token.attemptId,
      token: token.token,
      nameOrAlias: labelFor(label),
      email: "synthetic-visitor@example.com",
      message: "Mensaje privado sintético " + label,
    },
  });
  expect(stored.status()).toBe(201);
}
export async function openContact(page: Page, label: string) {
  await page.getByRole("button", { name: "Pendiente", exact: true }).click();
  await page.getByRole("button", { name: "Actualizar bandeja" }).click();
  await page
    .locator("[data-inbox-list] button")
    .filter({ hasText: labelFor(label) })
    .click();
  await expect(page.locator("[data-inbox-detail]")).toBeVisible();
}
