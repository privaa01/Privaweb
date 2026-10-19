import { test, expect } from "@playwright/test";
const identity = {
  result: "authenticated",
  account: { id: "synthetic", email: "one@example.com" },
  csrfToken: "synthetic",
  idleExpiresAt: Date.now() + 1800000,
  absoluteExpiresAt: Date.now() + 28800000,
};
test("private shell starts hidden, shows server identity, invalidation clears and rejects old callbacks", async ({
  page,
}) => {
  let reject = false;
  await page.route("**/api/admin/sesion", (r) =>
    r.fulfill({
      status: reject ? 401 : 200,
      json: reject ? { result: "unauthenticated" } : identity,
    }),
  );
  await page.goto("/admin");
  await expect(page.locator("[data-identity]")).toHaveText("one@example.com");
  await expect(
    page.getByRole("link", { name: "Historias", exact: true }),
  ).toBeVisible();
  reject = true;
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent("pagehide")),
  );
  await expect(page.locator("[data-private]")).toBeHidden();
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent("pageshow")),
  );
  await expect(page.getByRole("status")).toContainText("Inicia sesión");
  await expect(page.locator("[data-identity]")).toBeEmpty();
});
test("logout unknown hides before request and offers retry without restoring private data", async ({
  page,
}) => {
  await page.route("**/api/admin/sesion", (r) => r.fulfill({ json: identity }));
  await page.route("**/api/admin/salir", (r) => r.abort());
  await page.goto("/admin");
  await page
    .getByRole("button", { name: "Cerrar sesión", exact: true })
    .click();
  await expect(page.locator("[data-private]")).toBeHidden();
  await expect(page.getByRole("status")).toContainText(
    "No pudimos confirmar el cierre",
  );
  await expect(
    page.getByRole("button", { name: "Reintentar cierre" }),
  ).toBeVisible();
});
test("idle deadline hides identity without state polling or renewing activity", async ({
  page,
}) => {
  const now = Date.now();
  await page.clock.install({ time: now });
  let reads = 0;
  await page.route("**/api/admin/sesion", (r) => {
    reads++;
    return r.fulfill({
      json: {
        result: "authenticated",
        account: { id: "synthetic", email: "synthetic@example.com" },
        csrfToken: "synthetic",
        idleExpiresAt: now + 1000,
        absoluteExpiresAt: now + 28800000,
      },
    });
  });
  await page.goto("/admin");
  await expect(page.locator("[data-private]")).toBeVisible();
  const before = reads;
  await page.clock.fastForward(2000);
  await expect(page.locator("[data-private]")).toBeHidden();
  await expect(page.locator("[data-identity]")).toBeEmpty();
  await expect(page.getByRole("status")).toContainText("Inicia sesión");
  expect(reads).toBe(before);
});
test("late private identity cannot repopulate a view rejected by a newer verification", async ({
  page,
}) => {
  let held: import("@playwright/test").Route | undefined;
  let calls = 0;
  await page.route("**/api/admin/sesion", (route) => {
    if (++calls === 1) {
      held = route;
      return;
    }
    return route.fulfill({ status: 401, json: { result: "unauthenticated" } });
  });
  await page.goto("/admin");
  await expect.poll(() => Boolean(held)).toBe(true);
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent("pagehide"));
    window.dispatchEvent(new PageTransitionEvent("pageshow"));
  });
  await expect(page.getByRole("status")).toContainText("Inicia sesión");
  await held!.fulfill({
    json: {
      result: "authenticated",
      account: { id: "old", email: "old@example.com" },
      csrfToken: "old",
      idleExpiresAt: Date.now() + 1800000,
      absoluteExpiresAt: Date.now() + 28800000,
    },
  });
  await page.waitForLoadState("networkidle");
  await expect(page.locator("[data-private]")).toBeHidden();
  await expect(page.locator("[data-identity]")).toBeEmpty();
});
