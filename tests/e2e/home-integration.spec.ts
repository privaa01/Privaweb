import { test, expect, type Page } from '@playwright/test';
import { continueFromHomeAnchor, expectHomeAnchor, followHomeLearn, followHomeStories, type InputMethod } from '../helpers/home-journeys';

async function openRealHome(page: Page) {
 const response = await page.goto('/index.html');
 expect(response?.ok()).toBeTruthy();
 await expect(page.getByRole('heading', { level: 1 })).toHaveText('La privacidad también es una forma de libertad.');
 await expect(page.getByText(/banco de pruebas|recurso ficticio|destino.*de prueba/i)).toHaveCount(0);
 await expect(page.locator('img[src*="test-"], img[src*="placehold.co"]')).toHaveCount(0);
 await expect(page.getByRole('navigation', { name: 'Principal' }).locator('[aria-current="page"]')).toHaveText('Inicio');
}

for (const anchor of ['somos-priva', 'que-hacemos'] as const) {
 test(`Inicio real: entrada directa y recarga #${anchor}`, async ({ page }) => {
  await openRealHome(page);
  await page.goto(`/index.html#${anchor}`);
  await expectHomeAnchor(page, anchor);
  await page.reload();
  await expectHomeAnchor(page, anchor);
  await continueFromHomeAnchor(page);
 });
}

for (const method of ['puntero', 'teclado'] as InputMethod[]) {
 test(`Inicio real: Conocer más con ${method} conserva foco y recorrido`, async ({ page }) => {
  await openRealHome(page);
  await followHomeLearn(page, method);
 });
 test(`Inicio real: CTA con ${method} llega a Historias real`, async ({ page }) => {
  await openRealHome(page);
  await followHomeStories(page, method);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText(/destino.*de prueba|banco de pruebas/i)).toHaveCount(0);
  await expect(page.locator('#casos')).toBeVisible();
 });
}
