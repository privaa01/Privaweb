import { test,expect } from '@playwright/test';
import { interceptAppDownloads } from './app-fixture';
test.beforeEach(async({page})=>interceptAppDownloads(page));
test('presentation has planned structure and no operating services or fake Conversar control',async({page})=>{
 await page.goto('/app.html');
 await expect(page.locator('[data-app-block]')).toHaveCount(5);expect(await page.locator('[data-app-block]').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-app-block')))).toEqual(['hero','overview','steps','features','downloads']);
 await expect(page.locator('[data-prototype-notice]')).toContainText('Prototipo');await expect(page.locator('[data-benefit]')).toHaveCount(3);await expect(page.locator('[data-step]')).toHaveCount(4);await expect(page.locator('[data-feature]')).toHaveCount(3);
 await expect(page.locator('[data-app] form,[data-app] input,[data-app] textarea,[data-app] button')).toHaveCount(0);await expect(page.getByRole('button',{name:'Conversar'})).toHaveCount(0);await expect(page.getByRole('link',{name:'Conversar',exact:true})).toHaveCount(0);
 const phone=page.locator('[data-phone]');await expect(phone).toHaveAttribute('alt',/prototipo/);expect(await phone.getAttribute('tabindex')).toBeNull();expect(await phone.locator('xpath=ancestor::a').count()).toBe(0);await phone.click();await expect(page).toHaveURL(/app.html$/);
 await expect(page.locator('[data-download-note]')).toHaveText('Orientación para cuidar tus datos personales');expect(await page.locator('[data-app]').innerText()).not.toMatch(/Gratis|Android 10\+|iOS 15\+|100%/);
});
test('both hero and header anchors, direct entry and reload focus actual headings',async({page})=>{
 await page.goto('/app.html');await page.getByRole('link',{name:'Descargar app',exact:true}).click();await expect(page.locator('#descarga h2')).toBeFocused();await expect(page.locator('#descarga h2')).toBeInViewport();
 await page.getByRole('link',{name:'Ver cómo funciona'}).click();await expect(page.locator('#como-funciona h2')).toBeFocused();await expect(page.locator('#como-funciona h2')).toBeInViewport();
 for(const id of ['como-funciona','descarga']){await page.goto(`/app.html#${id}`);await page.reload();await expect(page.locator(`#${id} h2`)).toBeFocused();await expect(page.locator(`#${id} h2`)).toBeInViewport();}
 await page.locator('.header-cta').click();await expect(page.locator('#descarga h2')).toBeFocused();await page.goto('/contacto.html');await page.locator('.header-cta').click();await expect(page).toHaveURL(/app.html#descarga$/);await expect(page.locator('#descarga h2')).toBeFocused();
});
for(const [path,mask] of [['app','00'],['app-android','10'],['app-iphone','01'],['app-both','11']])test(`independent platform links ${mask}`,async({page})=>{
 await page.goto(`/${path}.html`);const html=await page.content();
 for(let i=0;i<2;i++){const platform=['android','iphone'][i];const box=page.locator(`[data-platform="${platform}"]`);
  if(mask[i]==='1'){await expect(box.getByRole('link')).toHaveAttribute('href',`https://downloads.priva.test/${platform}`);expect(await box.getByRole('link').getAttribute('download')).toBeNull();await box.getByRole('link').click();await expect(page.getByRole('heading')).toHaveText(`Destino de prueba /${platform}`);await page.goBack();}
  else {await expect(box).toContainText('Próximamente');await expect(box.locator('a,button,[tabindex]')).toHaveCount(0);expect(html).not.toContain(`https://downloads.priva.test/${platform}`);}
 }
 expect(html).not.toContain('TEST ONLY verification');await expect(page.locator('[data-download-note]')).toHaveText('Orientación para cuidar tus datos personales');
});
test('failed images retain content and initial page has no tracking requests or state',async({page})=>{
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));await page.route('**/*.svg',r=>r.abort());await page.goto('/app.html');await expect(page.locator('#descarga')).toBeVisible();await page.getByRole('link',{name:'Descargar app',exact:true}).click();
 expect(requests.filter(url=>!url.startsWith('http://127.0.0.1:4325/'))).toEqual([]);expect(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage},cookie:document.cookie}))).toEqual({local:{},session:{},cookie:''});
});
