import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route("**/api/admin/contexto", (r) =>
    r.fulfill({
      json: {
        csrfToken: "synthetic-csrf",
        contextExpiresAt: Date.now() + 300000,
      },
    }),
  );
});
test("login labels, toggle, validation, and fixed internal destination ignore supplied redirects", async ({
  page,
}) => {
  let calls = 0;
  await page.route("**/api/admin/acceso", async (r) => {
    calls++;
    await r.fulfill({
      json: { result: "authenticated", redirect: "https://evil.invalid/" },
    });
  });
  await page.route("**/api/admin/sesion", (r) =>
    r.fulfill({
      json: {
        result: "authenticated",
        account: { id: "synthetic", email: "one@example.com" },
        idleExpiresAt: Date.now() + 1800000,
        absoluteExpiresAt: Date.now() + 28800000,
      },
    }),
  );
  await page.goto(
    "/admin/login?next=https://evil.invalid&returnTo=%2f%2fevil.invalid",
  );
  await expect(
    page.getByRole("heading", { name: "Bienvenido de nuevo" }),
  ).toBeVisible();
  await page.getByLabel("Correo", { exact: true }).fill("one@example.com");
  const password = page.getByLabel("Contraseña", { exact: true });
  await password.fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Mostrar contraseña" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  expect(calls).toBe(1);
});
test("invalid fields focus first error; generic failure does not claim identity", async ({
  page,
}) => {
  await page.route("**/api/admin/acceso", (r) =>
    r.fulfill({ status: 401, json: { result: "invalid_credentials" } }),
  );
  await page.goto("/admin/login");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByLabel("Correo", { exact: true })).toBeFocused();
  await page.getByLabel("Correo", { exact: true }).fill("unknown@example.com");
  await page.getByLabel("Contraseña", { exact: true }).fill("wrong");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "No pudimos iniciar sesión",
  );
  await expect(page).toHaveURL(/login/);
});
test("lost login response checks actual account and never accepts another prior account", async ({
  page,
}) => {
  await page.route("**/api/admin/acceso", (r) => r.abort());
  await page.route("**/api/admin/sesion", (r) =>
    r.fulfill({
      json: {
        result: "authenticated",
        account: { id: "other", email: "other@example.com" },
      },
    }),
  );
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill("one@example.com");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("No pudimos confirmar");
  await expect(page).toHaveURL(/login/);
});
test("keyboard operates visibility and submits once while pending", async ({
  page,
  browserName,
}) => {
  const nextControl = browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab";
  let posts = 0;
  await page.route("**/api/admin/acceso", async (r) => {
    posts++;
    await new Promise((resolve) => setTimeout(resolve, 300));
    await r.fulfill({ status: 401, json: { result: "invalid_credentials" } });
  });
  await page.goto("/admin/login");
  const email = page.getByLabel("Correo", { exact: true });
  await email.focus();
  await page.keyboard.type("one@example.com");
  await page.keyboard.press(nextControl);
  await page.keyboard.type("synthetic private phrase 2026");
  await page.keyboard.press(nextControl);
  await expect(
    page.getByRole("button", { name: "Mostrar contraseña" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Contraseña", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.keyboard.press(nextControl);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText(
    "No pudimos iniciar sesión",
  );
  expect(posts).toBe(1);
});
test("late successful login from an older attempt cannot override a newer rejection", async ({
  page,
}) => {
  let held: import("@playwright/test").Route | undefined;
  let calls = 0;
  await page.route("**/api/admin/acceso", async (route) => {
    if (++calls === 1) {
      held = route;
      return;
    }
    await route.fulfill({
      status: 401,
      json: { result: "invalid_credentials" },
    });
  });
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).fill("one@example.com");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect.poll(() => Boolean(held)).toBe(true);
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent("pagehide")),
  );
  await page.getByLabel("Correo", { exact: true }).fill("two@example.com");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "No pudimos iniciar sesión",
  );
  await held!.fulfill({
    json: { result: "authenticated", redirect: "https://evil.invalid" },
  });
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("status")).toContainText(
    "No pudimos iniciar sesión",
  );
});
test("email codepoint boundary is validated without browser maxlength truncation", async ({
  page,
}) => {
  let sent = "",
    calls = 0;
  await page.route("**/api/admin/acceso", (route) => {
    calls++;
    sent = route.request().postDataJSON().email;
    return route.fulfill({
      status: 401,
      json: { result: "invalid_credentials" },
    });
  });
  await page.goto("/admin/login");
  const email = page.getByLabel("Correo", { exact: true });
  const valid = "😀".repeat(248) + "@a.com";
  await email.fill(valid);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill("synthetic private phrase 2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "No pudimos iniciar sesión",
  );
  expect(sent === valid).toBe(true);
  expect(calls).toBe(1);
  await email.fill("😀".repeat(249) + "@a.com");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  expect(calls).toBe(1);
});
