import { test, expect } from '@playwright/test';
// Native WebKit on macOS uses Option+Tab to include links in keyboard traversal.
const nextLinkKey = (browserName: string) => browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
test('US1: disclosure, Escape, resize y foco', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html');
  const button = page.getByRole('button', { name: 'Menú principal' });
  const nav = page.getByRole('navigation', { name: 'Principal' });
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.focus(); await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press(nextLinkKey(browserName));
  await expect(nav.getByRole('link').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused(); await expect(nav).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 900 });
  await nav.getByRole('link').first().focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(button).toBeFocused(); await expect(nav).toBeHidden();
});
test('US1: al ampliar el menú compacto no se pierde el foco del control oculto', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/historias.html');
  const button = page.getByRole('button', { name: 'Menú principal' });
  const nav = page.getByRole('navigation', { name: 'Principal' });
  const current = nav.getByRole('link', { name: 'Historias', exact: true });
  for (const opened of [false, true]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await button.focus();
    if (opened) await page.keyboard.press('Enter');
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(button).toBeHidden();
    await expect(nav).toBeVisible();
    await expect(current).toBeFocused();
    await page.keyboard.press(nextLinkKey(browserName));
    await expect(nav.getByRole('link', { name: 'Priva App', exact: true })).toBeFocused();
  }
});
test('US1: navegación sin JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4322/index.html');
  const link = page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Historias', exact: true });
  await expect(link).toBeVisible(); await link.click(); await expect(page).toHaveURL(/historias\.html$/);
  await context.close();
});

import AxeBuilder from '@axe-core/playwright';
import type { Page, Locator } from '@playwright/test';
const paths = ['/index.html', '/historias.html', '/app.html', '/contacto.html'];
const names = ['Inicio', 'Historias', 'Priva App', 'Contáctanos'];
const footers = [
  ['panel administrador', '/admin/login'], ['Términos de Servicio', '/terminos.html'],
  ['Manifiesto de Datos', '/manifiesto-datos.html'], ['Contacto Seguro', '/contacto.html'],
];
async function activate(page: Page, link: Locator, keyboard: boolean) {
  if (keyboard) { await link.focus(); await page.keyboard.press('Enter'); }
  else await link.click();
}
async function menu(page: Page) {
  const toggle = page.getByRole('button', { name: 'Menú principal' });
  if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
  return page.getByRole('navigation', { name: 'Principal' });
}
async function fits(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
}
for (const width of [360, 390, 430, 768, 1024, 1280, 1440]) {
  for (const textScale of [100, 200]) {
    test(`Matriz: ${width}px, texto ${textScale}%`, async ({ page, browserName, context }) => {
      test.skip(browserName !== 'chromium', 'Matriz exhaustiva en Chromium; las otras suites cubren regresión Firefox/WebKit.');
      test.setTimeout(180000);
      await page.setViewportSize({ width, height: 900 });
      // Change actual CSS text sizes, not device pixels or screenshot scale.
      await page.addInitScript(scale => {
        document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.fontSize = `${16 * scale / 100}px`; });
      }, textScale);
      const unexpectedRequests: string[] = [];
      page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4322/')) unexpectedRequests.push(request.url()); });
      for (const keyboard of [false, true]) {
        for (const [origin, path] of paths.entries()) {
          for (const [target, dest] of paths.entries()) {
            await page.goto(path);
            const nav = await menu(page);
            await expect(nav.locator('[aria-current="page"]')).toHaveText(names[origin]);
            await activate(page, nav.getByRole('link', { name: names[target], exact: true }), keyboard);
            await expect(page).toHaveURL(new RegExp(dest.replace('.', '\\.') + '$'));
            await fits(page);
          }
          await page.goto(path);
          await activate(page, page.getByRole('banner').getByRole('link', { name: 'Priva — Inicio' }), keyboard);
          await expect(page).toHaveURL(/index\.html$/);
          await page.goto(path);
          const label = origin < 2 ? 'PROTÉGETE HOY' : 'DESCARGAR APP';
          await activate(page, page.getByRole('banner').getByRole('link', { name: label }), keyboard);
          const section = origin < 2 ? '#casos' : '#descarga';
          await expect(page.locator(section).getByRole('heading')).toBeInViewport();
          await expect(page.locator(section).getByRole('heading')).toBeFocused();
          await fits(page);
          for (const [label, href] of footers) {
            await page.goto(path);
            await activate(page, page.getByRole('contentinfo').getByRole('link', { name: label, exact: true }), keyboard);
            await expect(page).toHaveURL(new RegExp(href.replace('.', '\\.') + '$'));
            await expect(page.getByRole('main')).toBeVisible();
            if (label === 'Contacto Seguro') await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
            await fits(page);
          }
        }
      }
      await page.goto('/index.html'); await menu(page);
      const accessibility = await new AxeBuilder({ page }).analyze();
      expect(accessibility.violations).toEqual([]);
      expect(await context.cookies()).toEqual([]);
      expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
      expect(unexpectedRequests).toEqual([]);
      await fits(page);
    });
  }
}
