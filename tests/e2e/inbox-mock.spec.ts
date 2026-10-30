// UI-only controlled responses. These tests do not certify storage or email.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const ids = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
];
function detail(id: string) {
  return {
    schemaVersion: 1,
    result: "detail",
    consultation: {
      id,
      nameOrAlias: id === ids[0] ? "Primera" : "Segunda",
      email: "synthetic@example.com",
      message: "Contenido " + id,
      status: "Pendiente",
      revision: 1,
    },
    replies: [],
    nextRepliesCursor: null,
    currentOperation: null,
  };
}
test.beforeEach(async ({ page }) => {
  await page.route("**/api/admin/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    let value: any;
    if (path.endsWith("/sesion") || path.endsWith("/contexto"))
      value = {
        result: "authenticated",
        account: { id: "synthetic", email: "synthetic@example.com" },
        csrfToken: "synthetic",
        idleExpiresAt: Date.now() + 1800000,
        absoluteExpiresAt: Date.now() + 28800000,
      };
    else if (path.endsWith("/listado"))
      value = {
        result: "list",
        items: ids.map((id, n) => ({
          id,
          nameOrAlias: n ? "Segunda" : "Primera",
          email: "synthetic@example.com",
          status: "Pendiente",
          messagePreview: "Prueba",
        })),
        summary: { total: 2, pending: 2, responded: 0 },
        nextCursor: null,
      };
    else if (path.includes("/consultas/"))
      value = detail(path.split("/").at(-1)!);
    else
      value = {
        result: "summary",
        summary: { total: 2, pending: 2, responded: 0 },
      };
    await route.fulfill({ json: value });
  });
});
test("load failure is distinct from empty and can be retried", async ({
  page,
}) => {
  let failed = true;
  await page.route("**/api/admin/contacto/listado", async (route) => {
    if (failed)
      await route.fulfill({
        status: 503,
        json: { result: "error", code: "unavailable" },
      });
    else
      await route.fulfill({
        json: {
          result: "list",
          items: [],
          nextCursor: null,
          summary: { total: 0, pending: 0, responded: 0 },
        },
      });
  });
  await page.goto("/contacto");
  await expect(page.locator("[data-inbox-feedback]")).toContainText(
    "No pudimos cargar",
  );
  await expect(page.locator("[data-inbox-summary]")).toHaveText(
    "Resumen no disponible.",
  );
  failed = false;
  await page.getByRole("button", { name: "Actualizar bandeja" }).click();
  await expect(page.locator("[data-inbox-feedback]")).toHaveText(
    "No hay consultas en este filtro.",
  );
  await expect(page.locator("[data-inbox-summary]")).toContainText(
    "Consultas: 0",
  );
});
test("older detail response cannot replace the newly selected consultation", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route(
    "**/api/admin/contacto/consultas/" + ids[0],
    async (route) => {
      await gate;
      await route.fulfill({ json: detail(ids[0]) });
    },
  );
  await page.goto("/contacto");
  await page
    .locator("[data-inbox-list] button")
    .filter({ hasText: "Primera" })
    .click();
  await page
    .locator("[data-inbox-list] button")
    .filter({ hasText: "Segunda" })
    .click();
  await expect(page.locator("[data-detail-title]")).toHaveText(
    "Consulta de Segunda",
  );
  release();
  await expect(page.locator("[data-detail-data]")).toContainText(ids[1]);
});
test("unknown operation preserves text and prevents another send", async ({
  page,
}) => {
  let posts = 0;
  await page.route(
    "**/api/admin/contacto/consultas/*/respuestas",
    async (route) => {
      posts++;
      await route.fulfill({
        status: 202,
        json: {
          result: "registered",
          operationId: "synthetic-op",
          state: "queued",
          revision: 2,
        },
      });
    },
  );
  await page.route("**/api/admin/contacto/operaciones/*", async (route) =>
    route.fulfill({
      json: {
        result: "operation",
        operationId: "synthetic-op",
        state: "unknown",
        revision: 2,
        text: "Texto conservado",
      },
    }),
  );
  await page.goto("/contacto");
  await page.locator("[data-inbox-list] button").first().click();
  await page.getByLabel("He revisado").check();
  await page
    .getByLabel("Tu respuesta", { exact: false })
    .fill("Texto conservado");
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await page.getByRole("button", { name: "Comprobar resultado" }).click();
  await expect(
    page.getByRole("button", { name: "Enviar respuesta" }),
  ).toBeDisabled();
  await expect(page.locator("textarea")).toHaveValue("Texto conservado");
  expect(posts).toBe(1);
});
test("concurrent operation does not replace the administrators unsent text", async ({
  page,
}) => {
  let conflict = false;
  await page.route("**/api/admin/contacto/consultas/" + ids[0], async (route) =>
    route.fulfill({
      json: {
        ...detail(ids[0]),
        currentOperation: conflict
          ? {
              operationId: "other-operation",
              state: "unknown",
              text: "Texto de otra intención",
            }
          : null,
      },
    }),
  );
  await page.route(
    "**/api/admin/contacto/consultas/*/respuestas",
    async (route) => {
      conflict = true;
      await route.fulfill({
        status: 409,
        json: { result: "error", code: "unresolved_operation" },
      });
    },
  );
  await page.goto("/contacto");
  await page.locator("[data-inbox-list] button").first().click();
  await page.getByLabel("He revisado").check();
  await page
    .getByLabel("Tu respuesta", { exact: false })
    .fill("Mi borrador conservado");
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await expect(page.locator("[data-inbox-feedback]")).toContainText(
    "La consulta cambió",
  );
  await expect(page.locator("textarea")).toHaveValue("Mi borrador conservado");
  await expect(
    page.getByRole("button", { name: "Enviar respuesta" }),
  ).toBeDisabled();
});
test("confirmed rejection keeps text and explicit retry links the prior operation", async ({
  page,
}) => {
  const inputs: any[] = [];
  await page.route(
    "**/api/admin/contacto/consultas/*/respuestas",
    async (route) => {
      const input = route.request().postDataJSON();
      inputs.push(input);
      await route.fulfill({
        status: 202,
        json: {
          result: "registered",
          operationId: input.operationId,
          state: "queued",
          revision: inputs.length + 1,
        },
      });
    },
  );
  await page.route("**/api/admin/contacto/operaciones/*", async (route) =>
    route.fulfill({
      json: {
        result: "operation",
        operationId: inputs.at(-1).operationId,
        state: "rejected",
        revision: inputs.length + 1,
        text: "Respuesta conservada",
      },
    }),
  );
  await page.goto("/contacto");
  await page.locator("[data-inbox-list] button").first().click();
  await page.getByLabel("He revisado").check();
  await page
    .getByLabel("Tu respuesta", { exact: false })
    .fill("Respuesta conservada");
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await page.getByRole("button", { name: "Comprobar resultado" }).click();
  await expect(page.locator("[data-inbox-feedback]")).toContainText("rechazó");
  await expect(page.locator("textarea")).toHaveValue("Respuesta conservada");
  await page.getByLabel("He revisado").check();
  await page.getByRole("button", { name: "Enviar respuesta" }).click();
  await expect.poll(() => inputs.length).toBe(2);
  expect(inputs[1].operationId).not.toBe(inputs[0].operationId);
  expect(inputs[1].retryOf).toBe(inputs[0].operationId);
});

// UI accessibility only: controlled synthetic DTOs never send email or certify storage.
for (const width of [360,390,430,768,1024,1280,1440]) for (const scale of [100,200]) {
 test(`inbox accessibility ${width}px text ${scale}%`,async({page})=>{
  await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=scale+'%'),scale);
  await page.setViewportSize({width,height:1000});
  await page.route('**/api/admin/contacto/consultas/'+ids[0],route=>{
   const dto=detail(ids[0]);dto.consultation.message=('Consulta ficticia para comprobar lectura y ajuste del contenido. ').repeat(8)+'X'.repeat(120);
   return route.fulfill({json:dto});
  });
  let mutations=0;page.on('request',r=>{if(r.method()==='POST'&&new URL(r.url()).pathname.endsWith('/respuestas'))mutations++;});
  await page.goto('/contacto');
  await expect(page.locator('[data-inbox-list] button')).toHaveCount(2);
  expect(await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize))).toBeGreaterThanOrEqual(scale===200?32:16);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  const first=page.locator('[data-inbox-list] button').first();await first.focus();await first.press('Enter');
  await expect(page.locator('[data-detail-title]')).toBeFocused();
  const review=page.getByLabel('He revisado');await review.focus();await review.press('Space');await expect(review).toBeChecked();
  const send=page.getByRole('button',{name:'Enviar respuesta',exact:true});await send.focus();await send.press('Enter');
  const editor=page.getByLabel('Tu respuesta',{exact:false});await expect(editor).toBeFocused();await expect(editor).toHaveAttribute('aria-invalid','true');
  await expect(page.locator('[data-reply-error]')).toContainText('Escribe entre 1 y 5000');
  await expect(editor).toHaveAttribute('aria-describedby',/inbox-reply-error/);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  for(const control of await page.locator('[data-inbox] button:visible,[data-inbox] textarea:visible,[data-inbox] label:has([data-reviewed]):visible').all()){
   expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(43);
   const dimensions=await control.evaluate(el=>({tag:el.tagName,width:el.clientWidth,scroll:el.scrollWidth}));
   expect(dimensions.scroll,JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.width+1);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect(mutations).toBe(0);
 });
}
