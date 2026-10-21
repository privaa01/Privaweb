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

test('US1 Conocer más repeated activation keeps heading focus and history',async({page})=>{
 await page.goto('/index.html#somos-priva');const heading=page.locator('#somos-priva h2');await expect(heading).toBeFocused();const before=await page.evaluate(()=>history.length);const link=page.getByRole('main').getByRole('link',{name:'Conocer más',exact:true});
 await link.click();await expect(heading).toBeFocused();expect(await page.evaluate(()=>history.length)).toBe(before);await link.focus();await link.press('Enter');await expect(heading).toBeFocused();expect(await page.evaluate(()=>history.length)).toBe(before);
});
test('received brand, font and palette are actually loaded without approving institutional fixtures',async({page})=>{
 await page.goto('/index.html');await page.evaluate(()=>document.fonts.ready);
 const logo=page.getByRole('banner').getByRole('img',{name:'Priva',exact:true});await expect(logo).toHaveAttribute('src','/brand/priva-logo.png');expect(await logo.evaluate(i=>({w:(i as HTMLImageElement).naturalWidth,h:(i as HTMLImageElement).naturalHeight}))).toEqual({w:104,h:40});
 expect(await page.evaluate(()=>[...document.fonts].some(f=>f.family.includes('Jakarta')&&f.status==='loaded'))).toBe(true);expect(await page.locator('.home-closing').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(13, 34, 25)');await expect(page.locator('#hero img')).toHaveAttribute('src','/test-hero.svg');
});

// Exercise the shared journey assertions contractually; this does not execute integration.
import { continueFromHomeAnchor, expectHomeAnchor, followHomeLearn, followHomeStories, type InputMethod } from '../helpers/home-journeys';
for (const method of ['puntero', 'teclado'] as InputMethod[]) {
 test(`recorridos compartidos de aceptación: ${method} (solo contrato)`, async ({ page }) => {
  await page.goto('/index.html');
  await followHomeLearn(page, method);
  await followHomeStories(page, method);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Destino Historias de prueba');
 });
}
for (const anchor of ['somos-priva', 'que-hacemos'] as const) {
 test(`ancla y continuidad compartidas: #${anchor} (solo contrato)`, async ({ page }) => {
  await page.goto(`/index.html#${anchor}`);
  await expectHomeAnchor(page, anchor);
  await page.reload();
  await expectHomeAnchor(page, anchor);
  await continueFromHomeAnchor(page);
 });
}
