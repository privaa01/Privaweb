import { test, expect } from "@playwright/test";
test("Q1 in real browser: save keeps prior public version, publish swaps whole version; activation independent", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill("one@example.com");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL("**/admin");
  await page.goto("/admin/historias");
  await expect(page.locator("[data-management-status]")).toContainText(
    "Historias comprobadas",
  );
  const catalog = await (
      await page.request.get("/api/public/historias")
    ).json(),
    original = catalog.stories.find((s: any) => s.category === "Prueba"),
    prior = original.title;
  await page
    .getByRole("button", { name: "Editar " + prior, exact: true })
    .click();
  const next = "Caso sintético editado " + Date.now();
  await page.getByLabel("Título", { exact: true }).fill(next);
  await page.getByLabel("Transcripción", { exact: true }).fill("");
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator('[data-management-status]')).toContainText('Cambios guardados en borrador');
  const saved = await (await page.request.get("/api/public/historias")).json();
  expect(saved.stories.find((s: any) => s.id === original.id).title).toBe(
    prior,
  );
  await page.getByRole("button", { name: "Publicar", exact: true }).click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Revisa los campos",
  );
  await page
    .getByLabel("Transcripción", { exact: true })
    .fill("Transcripción sintética B");
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator('[data-management-status]')).toContainText('Cambios guardados en borrador');
  await page.getByRole("button", { name: "Publicar", exact: true }).click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Publicación comprobada",
  );
  await expect
    .poll(async () => {
      const data = await (
        await page.request.get("/api/public/historias")
      ).json();
      return data.stories.find((s: any) => s.id === original.id)?.title;
    })
    .toBe(next);
  await page
    .getByRole("button", { name: "Desactivar " + next, exact: true })
    .click();
  await expect
    .poll(async () => {
      const d = await (await page.request.get("/api/public/historias")).json();
      return d.stories.some((s: any) => s.id === original.id);
    })
    .toBe(false);
  await expect(
    page.getByRole("button", { name: "Activar " + next, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Activar " + next, exact: true })
    .click();
  await expect
    .poll(async () => {
      const d = await (await page.request.get("/api/public/historias")).json();
      return d.stories.find((s: any) => s.id === original.id)?.title;
    })
    .toBe(next);
  await page.getByRole("link", { name: "Ver historias en la web" }).click();
  await expect(page.locator("[data-catalog]")).toContainText(next);
});
