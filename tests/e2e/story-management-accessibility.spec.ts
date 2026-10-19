import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [360, 390, 430, 768, 1024, 1280, 1440])
  for (const zoom of [100, 200])
    test(`management accessibility ${width}px text ${zoom}%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/admin/login");
      await page
        .getByLabel("Correo", { exact: true })
        .fill(`matrix-${width}-${zoom}@example.com`);
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
      if (zoom === 200)
        await page.evaluate(() => {
          document.documentElement.style.fontSize = "200%";
        });
      await page.getByLabel("Título", { exact: true }).focus();
      await page.keyboard.type("Prueba accesible");
      await page.keyboard.press("Tab");
      await expect(page.getByLabel("Categoría", { exact: true })).toBeFocused();
      const measured = await page.evaluate(() => {
        const style = getComputedStyle(
          document.querySelector("#story-category")!,
        );
        const rgb = (v: string) => {
          const n = v
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number);
          const c = n.map((v) => {
            v /= 255;
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
        };
        const ratio = (a: string, b: string) => {
          const x = rgb(a),
            y = rgb(b);
          return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
        };
        return {
          text: ratio(style.color, style.backgroundColor),
          border: ratio(style.borderTopColor, style.backgroundColor),
          focus: ratio(style.outlineColor, style.backgroundColor),
        };
      });
      expect(measured.text).toBeGreaterThanOrEqual(4.5);
      expect(measured.border).toBeGreaterThanOrEqual(3);
      expect(measured.focus).toBeGreaterThanOrEqual(3);
      const result = await new AxeBuilder({ page }).analyze();
      expect(result.violations).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const button = await page
        .getByRole("button", { name: "Guardar borrador", exact: true })
        .boundingBox();
      expect(button!.height).toBeGreaterThanOrEqual(44);
    });
