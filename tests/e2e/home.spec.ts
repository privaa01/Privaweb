import { test, expect } from '@playwright/test';
test('US1: hero, identidad y Conocer más', async ({ page }) => {
 await page.goto('/index.html');
 await expect(page.getByRole('heading', { level: 1 })).toHaveText('La privacidad también es una forma de libertad.');
 await expect(page.getByText('TUS DATOS, TU DERECHO', { exact: true })).toBeVisible();
 const link = page.getByRole('main').getByRole('link', { name: 'Conocer más', exact: true });
 for (const keyboard of [false, true]) {
  await page.goto('/index.html');
  if (keyboard) { await link.focus(); await page.keyboard.press('Enter'); } else await link.click();
  await expect(page).toHaveURL(/index\.html#somos-priva$/);
  await expect(page.locator('#somos-priva h2')).toBeInViewport();
 }
 await expect(page.locator('#maria, [href="#maria"]')).toHaveCount(0);
 await expect(page.locator('#hero img')).toHaveAttribute('loading','eager');
});
test('US1: identidad accesible por URL y recarga', async ({ page }) => {
 await page.goto('/index.html#somos-priva'); await page.reload();
 await expect(page.locator('#somos-priva h2')).toHaveText('Somos Priva');
 await expect(page.locator('#somos-priva h2')).toBeInViewport();
 await expect(page.getByRole('navigation', { name: 'Principal' }).locator('[aria-current="page"]')).toHaveText('Inicio');
});
test('US2: cuatro áreas informativas y entrada por ancla', async ({ page }) => {
 await page.goto('/index.html#que-hacemos'); await page.reload();
 await expect(page.locator('#que-hacemos h2')).toHaveText('Informamos para que estés en control.');
 await expect(page.locator('#que-hacemos h2')).toBeInViewport();
 await expect(page.locator('#que-hacemos h3')).toHaveText(['Educación Digital', 'Historias reales', 'Herramientas Seguras', 'Acompañamiento']);
 await expect(page.locator('#que-hacemos a, #que-hacemos button, #que-hacemos [tabindex="0"]')).toHaveCount(0);
});
test('US3: cierre y CTA hacia Historias', async ({ page }) => {
 const text = 'Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.';
 for (const keyboard of [false, true]) {
  await page.goto('/index.html');
  await expect(page.locator('#cierre h2')).toHaveText('Infórmate, protégete, conéctate con seguridad.');
  await expect(page.locator('#cierre').getByText(text, { exact: true })).toBeVisible();
  await expect(page.getByText(/Únete a miles de personas/)).toHaveCount(0);
  const link = page.getByRole('main').getByRole('link', { name: 'Explora nuestras historias' });
  await expect(link).toHaveAttribute('href', '/historias.html');
  if (keyboard) { await link.focus(); await page.keyboard.press('Enter'); } else await link.click();
  await expect(page).toHaveURL(/\/historias\.html$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Destino Historias de prueba');
 }
});
