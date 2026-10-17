import { test, expect } from '@playwright/test';
const routes = ['/index.html', '/historias.html', '/app.html', '/contacto.html'];
const labels = ['Inicio', 'Historias', 'Priva App', 'Contáctanos'];
for (const [origin, path] of routes.entries()) {
  test(`US1: entrada directa, activo y logo ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.reload();
    const nav = page.getByRole('navigation', { name: 'Principal' });
    await expect(nav.getByRole('link')).toHaveText(labels);
    await expect(nav.locator('[aria-current="page"]')).toHaveText(labels[origin]);
    await page.getByRole('banner').getByRole('link', { name: 'Priva — Inicio' }).click();
    await expect(page).toHaveURL(/\/index\.html$/);
  });
  for (const [target, dest] of routes.entries()) {
    test(`US1: ${path} → ${dest}`, async ({ page }) => {
      await page.goto(path);
      await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: labels[target], exact: true }).click();
      await expect(page).toHaveURL(new RegExp(dest.replace('.', '\\.') + '$'));
      await expect(page.getByRole('navigation', { name: 'Principal' }).locator('[aria-current="page"]')).toHaveText(labels[target]);
    });
  }
}
for (const [index, path] of routes.entries()) {
  test(`US2: CTA ${path}`, async ({ page }) => {
    await page.goto(path);
    const expectedLabel = index < 2 ? 'PROTÉGETE HOY' : 'DESCARGAR APP';
    const expectedPath = index < 2 ? '/historias.html#casos' : '/app.html#descarga';
    const downloads: string[] = []; page.on('download', event => downloads.push(event.suggestedFilename()));
    const link = page.getByRole('banner').getByRole('link', { name: expectedLabel });
    await link.focus(); await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(expectedPath.replace('.', '\\.') + '$'));
    await expect(page.locator(expectedPath.split('.html')[1]).getByRole('heading')).toBeInViewport();
    expect(downloads).toEqual([]);
  });
}
for (const path of routes) {
  test(`US3: footer ${path}`, async ({ page }) => {
    await page.goto(path);
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByText('Defendiendo la soberanía digital individual.', { exact: true })).toBeVisible();
    await expect(footer.getByText('© 2026 Priva. Todos los derechos reservados. Navega con dignidad.', { exact: true })).toBeVisible();
    for (const [label, href] of [['panel administrador', '/admin/login'], ['Términos de Servicio', '/terminos.html'], ['Manifiesto de Datos', '/manifiesto-datos.html'], ['Contacto Seguro', '/contacto.html#escribir']]) {
      await expect(footer.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
    }
  });
}
