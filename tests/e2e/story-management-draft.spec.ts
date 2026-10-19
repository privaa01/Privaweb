import { test, expect } from "@playwright/test";
async function login(page: any) {
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
}
test("real draft create/reopen, field errors and no public leakage", async ({
  page,
}) => {
  await login(page);
  const title = "Borrador sintético " + Date.now();
  await page
    .getByRole("button", { name: "Agregar historia", exact: true })
    .click();
  await page.getByLabel("Título", { exact: true }).fill(title);
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Borrador guardado",
  );
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(title);
  await page.getByRole("button", { name: "Publicar", exact: true }).click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Revisa los campos",
  );
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(title);
  await page.reload();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Historias comprobadas",
  );
  await page
    .getByRole("button", { name: "Editar " + title, exact: true })
    .click();
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(title);
  const catalog = await page.request.get("/api/public/historias");
  expect(catalog.status()).toBe(200);
  expect(
    (await catalog.json()).stories.some((s: any) => s.title === title),
  ).toBe(false);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({});
});
test("search and inactive filter use real records, global counters unchanged", async ({
  page,
}) => {
  await login(page);
  await page
    .getByRole("button", { name: "Agregar historia", exact: true })
    .click();
  await page
    .getByLabel("Título", { exact: true })
    .fill("Filtro sintético " + Date.now());
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Borrador guardado",
  );
  const count = await page.locator("[data-count=drafts]").textContent();
  await page.locator("[data-story-search]").fill("no-existe-ninguna");
  await expect(page.locator("[data-story-rows]")).toContainText(
    "No hay historias que coincidan",
  );
  expect(await page.locator("[data-count=drafts]").textContent()).toBe(count);
  await expect(page.locator("[data-count=contact]")).toHaveText(
    "No disponible",
  );
  await expect(
    page.getByRole("link", { name: "Ver historias en la web" }),
  ).toHaveAttribute("href", "/historias.html#casos");
});
test("unsaved edits and expired access do not send automatic mutations", async ({
  page,
}) => {
  await login(page);
  await page
    .getByRole("button", { name: "Agregar historia", exact: true })
    .click();
  await page
    .getByLabel("Título", { exact: true })
    .fill("Texto privado sin guardar");
  await page.context().clearCookies();
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator("[data-private]")).toBeHidden();
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue("");
  expect((await page.request.get("/api/public/historias")).status()).toBe(200);
});

test("lost response after commit recovers the same durable operation without duplicate", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill("two@example.com");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL("**/admin");
  await page.goto("/admin/historias");
  await expect(page.locator("[data-management-status]")).toContainText(
    "Historias comprobadas",
  );
  await page.route("**/api/admin/historias", async (route) => {
    if (route.request().method() === "POST") {
      await route.fetch();
      await route.abort("failed");
    } else await route.continue();
  });
  await page
    .getByRole("button", { name: "Agregar historia", exact: true })
    .click();
  const title = "Respuesta perdida " + Date.now();
  await page.getByLabel("Título", { exact: true }).fill(title);
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Resultado desconocido",
  );
  await page
    .getByRole("button", { name: "Comprobar operación pendiente" })
    .click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Borrador guardado",
  );
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(title);
  await expect(
    page.getByRole("button", { name: "Editar " + title, exact: true }),
  ).toHaveCount(1);
});

test("concurrent server edit returns conflict while preserving local text", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill("two@example.com");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL("**/admin");
  await page.goto("/admin/historias");
  await expect(page.locator("[data-management-status]")).toContainText(
    "Historias comprobadas",
  );
  await page
    .getByRole("button", { name: "Agregar historia", exact: true })
    .click();
  const title = "Conflicto " + Date.now();
  await page.getByLabel("Título", { exact: true }).fill(title);
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "Borrador guardado",
  );
  const headers = { "X-Priva-Request": "1" };
  const context = await (
    await page.request.get("/api/admin/sesion", { headers })
  ).json();
  const list = await (
    await page.request.get("/api/admin/historias", { headers })
  ).json();
  const id = list.stories.find((s: any) => s.title === title).id;
  const story = await (
    await page.request.get("/api/admin/historias/" + id, { headers })
  ).json();
  const remote = await page.request.put("/api/admin/historias/" + id, {
    headers: {
      ...headers,
      Origin: "http://localhost:4331",
      "X-CSRF-Token": context.csrfToken,
    },
    data: {
      operationId: crypto.randomUUID(),
      expectedRevision: story.revision,
      working: { ...story.working, title: "Cambio remoto " + title },
    },
  });
  expect(remote.ok()).toBe(true);
  await page
    .getByLabel("Título", { exact: true })
    .fill("Cambio local " + title);
  await page
    .getByRole("button", { name: "Guardar borrador", exact: true })
    .click();
  await expect(page.locator("[data-management-status]")).toContainText(
    "conflicto",
  );
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
    "Cambio local " + title,
  );
  const confirmed = await (
    await page.request.get("/api/admin/historias/" + id, { headers })
  ).json();
  expect(confirmed.working.title).toBe("Cambio remoto " + title);
});

test("anonymous 003 consumer expands four real 007 publications in the same page without duplicates", async ({
  page,
}) => {
  const r = await page.request.get("/api/public/historias");
  expect(r.status()).toBe(200);
  const catalog = await r.json();
  expect(catalog.stories.length).toBeGreaterThanOrEqual(4);
  await page.goto("/historias.html");
  await expect(page.locator("[data-catalog] [data-story]")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Ver todas las historias", exact: true })
    .click();
  await expect(page.locator("[data-catalog] [data-story]")).toHaveCount(
    catalog.stories.length,
  );
  const ids = await page
    .locator("[data-catalog] [data-story]")
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-story")));
  expect(new Set(ids).size).toBe(catalog.stories.length);
  expect(await page.locator("[data-catalog]").textContent()).not.toContain(
    "private-contact@example.test",
  );
});

test("late response from another history never replaces the currently open editor", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill("two@example.com");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL("**/admin");
  await page.goto("/admin/historias");
  await expect(page.locator("[data-management-status]")).toContainText(
    "Historias comprobadas",
  );
  const list = await (
    await page.request.get("/api/admin/historias", {
      headers: { "X-Priva-Request": "1" },
    })
  ).json();
  const [first, second] = list.stories.filter(
    (s: any) => s.publicationState === "Publicada",
  );
  let release!: () => void, seen!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve)),
    fetched = new Promise<void>((resolve) => (seen = resolve));
  await page.route("**/api/admin/historias/" + first.id, async (route) => {
    const response = await route.fetch();
    seen();
    await gate;
    await route.fulfill({ response });
  });
  await page
    .getByRole("button", { name: "Editar " + first.title, exact: true })
    .click();
  await fetched;
  await page
    .getByRole("button", { name: "Editar " + second.title, exact: true })
    .click();
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
    second.title,
  );
  const replied = page.waitForResponse((r) =>
    r.url().endsWith("/api/admin/historias/" + first.id),
  );
  release();
  await replied;
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
    second.title,
  );
});

test("list load/error/confirmed empty stay distinct (explicit UI response simulation)", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill("two@example.com");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL("**/admin");
  let mode = "error";
  let release!: () => void, seen!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve)),
    requested = new Promise<void>((resolve) => (seen = resolve));
  await page.route("**/api/admin/historias", async (route) => {
    if (mode === "error") {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: '{"result":"unavailable"}',
      });
      return;
    }
    seen();
    await gate;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        stories: [],
        summary: {
          active: 0,
          drafts: 0,
          contact: { state: "available", total: 0 },
        },
      }),
    });
  });
  await page.goto("/admin/historias");
  await expect(page.locator("[data-management-status]")).toContainText(
    "No pudimos cargar",
  );
  await expect(page.locator("[data-count=drafts]")).toHaveText("No disponible");
  await expect(page.locator("[data-story-rows]")).toBeEmpty();
  mode = "empty";
  await page
    .getByRole("button", { name: "Actualizar historias", exact: true })
    .click();
  await requested;
  await expect(page.locator("[data-management-status]")).toContainText(
    "Cargando",
  );
  await expect(page.locator("[data-count=drafts]")).toHaveText("No disponible");
  release();
  await expect(page.locator("[data-story-rows]")).toContainText(
    "Todavía no hay historias guardadas",
  );
  await expect(page.locator("[data-count=drafts]")).toHaveText("0");
});
