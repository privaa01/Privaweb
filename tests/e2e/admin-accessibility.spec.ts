import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [360, 390, 430, 768, 1024, 1280, 1440])
  for (const scale of [1, 2])
    test(`admin accessibility ${width}px text ${scale * 100}%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript((s) => {
        const observer = new MutationObserver(apply);
        function apply() {
          if (document.documentElement) {
            document.documentElement.style.fontSize = 16 * s + "px";
            observer.disconnect();
          }
        }
        observer.observe(document, { childList: true, subtree: true });
        apply();
      }, scale);
      await page.route("**/api/admin/contexto", (r) =>
        r.fulfill({ json: { csrfToken: "synthetic" } }),
      );
      await page.route("**/api/admin/sesion", (r) =>
        r.fulfill({
          json: {
            result: "authenticated",
            account: { id: "synthetic", email: "synthetic@example.com" },
            csrfToken: "synthetic",
            idleExpiresAt: Date.now() + 1800000,
            absoluteExpiresAt: Date.now() + 28800000,
          },
        }),
      );
      await page.route("**/api/admin/salir", (r) => r.abort());
      await page.route("**/api/admin/restablecer", (r) => r.abort());
      for (const scene of [
        "login",
        "recuperar",
        "restablecer#token=synthetic",
        "",
      ]) {
        await page.goto("/admin" + (scene ? "/" + scene : ""));
        if (!scene) await expect(page.locator("[data-private]")).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(result.violations.map((v) => v.id)).toEqual([]);
        const targets = await page
          .locator("button:visible,input:visible,a:visible")
          .evaluateAll((nodes) =>
            nodes.map((n) => ({
              tag: n.tagName,
              height: n.getBoundingClientRect().height,
            })),
          );
        expect(targets.every((n) => n.height >= 43)).toBe(true);
        if (scene === "login") {
          await page
            .getByRole("button", { name: "Entrar", exact: true })
            .click();
          await expect(
            page.getByLabel("Correo", { exact: true }),
          ).toBeFocused();
          expect(
            (
              await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze()
            ).violations.map((v) => v.id),
          ).toEqual([]);
        }
        if (!scene) {
          await page
            .getByRole("button", { name: "Cerrar sesión", exact: true })
            .click();
          await expect(page.getByRole("status")).toContainText(
            "No pudimos confirmar el cierre",
          );
          expect(
            (await new AxeBuilder({ page }).analyze()).violations.map(
              (v) => v.id,
            ),
          ).toEqual([]);
        }
      }
    });
test("without JavaScript no credential GET fallback; private shell remains hidden", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto(baseURL + "/admin/login");
    await expect(
      page.getByRole("button", { name: "Entrar", exact: true }),
    ).toBeDisabled();
    await expect(page.locator("form")).toHaveAttribute("method", "post");
    await page.goto(baseURL + "/admin");
    await expect(page.locator("[data-private]")).toBeHidden();
  } finally {
    await context.close();
  }
});
test("compiled client bundle contains no server modules, private keys or credential persistence", async () => {
  const { readdirSync, readFileSync } = await import("node:fs");
  const dir = ".test-output/admin/_astro";
  const scripts = readdirSync(dir)
    .filter((n) => n.endsWith(".js"))
    .map((n) => readFileSync(dir + "/" + n, "utf8"))
    .join("\n");
  for (const secret of [
    "node:fs",
    "node:sqlite",
    "node:crypto",
    "admin-csrf.key",
    "admin-mail-v1.key",
    "localStorage",
    "sessionStorage",
  ])
    expect(scripts.includes(secret)).toBe(false);
});
test("measured non-text contrast for input borders, filled controls and keyboard focus", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Correo", { exact: true }).focus();
  const ratios = await page.evaluate(() => {
    function luminance(color: string) {
      const v = color
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number)
        .map((c) => {
          c /= 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    }
    function contrast(a: string, b: string) {
      const x = luminance(a),
        y = luminance(b);
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    }
    const input = getComputedStyle(document.querySelector("input")!),
      button = getComputedStyle(document.querySelector("button[type=submit]")!),
      outer = getComputedStyle(document.documentElement).backgroundColor;
    return {
      inputBorder: contrast(input.borderColor, input.backgroundColor),
      buttonFill: contrast(button.backgroundColor, outer),
      focus: Math.min(
        contrast(input.outlineColor, input.backgroundColor),
        contrast(input.outlineColor, outer),
      ),
    };
  });
  for (const ratio of Object.values(ratios))
    expect(ratio).toBeGreaterThanOrEqual(3);
});
