import { test, expect } from '@playwright/test';
// This file runs only in integration mode, against a supplied real environment.
for (const path of ['/admin/login', '/terminos.html', '/manifiesto-datos.html', '/contacto.html#escribir']) {
  test(`Destino integrado real ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok(), `Destino real ausente: ${path}`).toBeTruthy();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByText(/contenido ficticio|destino exclusivamente de prueba/i)).toHaveCount(0);
    if (path === '/admin/login') {
      await expect(page.getByRole('textbox', { name: /correo/i })).toBeVisible();
      await expect(page.getByLabel(/contraseña/i).first()).toBeVisible();
    } else if (path.includes('#')) {
      await expect(page.locator('#escribir').getByRole('textbox').first()).toBeVisible();
    }
  });
}
test('Contrato privado 006 disponible antes de probar autorización', async () => {
  throw new Error('BLOQUEADO G05/T021: 006 debe aportar inventario versionado de URL/método/respuesta sin sesión; no hay endpoints privados verificables todavía.');
});
