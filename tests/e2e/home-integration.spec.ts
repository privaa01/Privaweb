import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { continueFromHomeAnchor, expectHomeAnchor, followHomeLearn, followHomeStories, type InputMethod } from '../helpers/home-journeys';

async function openRealHome(page: Page) {
 const response = await page.goto('/index.html');
 expect(response?.ok()).toBeTruthy();
 await expect(page.getByRole('heading', { level: 1 })).toHaveText('La privacidad también es una forma de libertad.');
 await expect(page.getByText(/banco de pruebas|recurso ficticio|destino.*de prueba/i)).toHaveCount(0);
 await expect(page.locator('img[src*="test-"], img[src*="placehold.co"]')).toHaveCount(0);
 await expect(page.getByRole('navigation', { name: 'Principal', includeHidden: true }).locator('[aria-current="page"]')).toHaveText('Inicio');
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
  const destination = page.waitForResponse(response => new URL(response.url()).pathname === '/historias.html' && response.request().isNavigationRequest());
  await followHomeStories(page, method);
  expect((await destination).status(), 'Historias real debe responder HTTP 200; revisar guard editorial de 003').toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText(/destino.*de prueba|banco de pruebas/i)).toHaveCount(0);
  await expect(page.locator('#casos')).toBeVisible();
 });
}

for (const width of [360,390,430,768,1024,1280,1440]) {
 for (const scale of [100,200]) {
  test(`Inicio real: ${width}px texto ${scale}%`, async ({page,context,baseURL},info) => {
   test.setTimeout(60000);
   const external: string[] = [];
   page.on('request',request=>{if(new URL(request.url()).origin!==new URL(baseURL!).origin)external.push(new URL(request.url()).origin);});
   await page.setViewportSize({width,height:1000});
   await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=`${16*scale/100}px`),scale);
   await page.emulateMedia({reducedMotion:'reduce'});
   await openRealHome(page);
   expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize)).toBe(`${16*scale/100}px`);
   expect(await page.locator('.home > section').evaluateAll(nodes=>nodes.map(node=>node.id))).toEqual(['hero','somos-priva','que-hacemos','cierre']);
   await expect(page.locator('#que-hacemos h3')).toHaveText(['Educación Digital','Historias educativas','Herramientas Seguras','Acompañamiento']);
   for(const anchor of ['somos-priva','que-hacemos'] as const){
    await page.goto(`/index.html#${anchor}`);await expectHomeAnchor(page,anchor);
    await page.reload();await expectHomeAnchor(page,anchor);await continueFromHomeAnchor(page);
   }
   for(const method of ['puntero','teclado'] as InputMethod[]){
    await openRealHome(page);await followHomeLearn(page,method);await followHomeStories(page,method);
    await expect(page.getByRole('heading',{level:1})).toHaveText('Aprende con recreaciones educativas sobre riesgos digitales.');
   }
   await openRealHome(page);
   await expect.poll(async()=>page.locator('#hero img').evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth>0)).toBe(true);
   expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   if(info.project.name==='chromium'&&((width===1440&&scale===100)||(width===390&&scale===200)))await page.screenshot({path:`.test-output/home-published-${width}-${scale}.png`});
   for(const link of await page.locator('.home a').all()){
    await link.focus();await expect(link).toBeFocused();expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    expect(await link.evaluate(node=>getComputedStyle(node).outlineStyle)).not.toBe('none');
   }
   expect(await context.cookies()).toEqual([]);
   expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
   expect(external).toEqual([]);
  });
 }
}
