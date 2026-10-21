import {test,expect} from '@playwright/test';
// Integration mode only: existing real deployment; never starts fixture or sends private data.
test('real public documents, notice, anchors and404 delivery',async({page,request})=>{
 for(const start of ['/index.html','/historias.html','/app.html','/contacto.html'])for(const name of ['Términos de Servicio','Manifiesto de Datos']){await page.goto(start);await page.locator('footer').getByRole('link',{name,exact:true}).click();await expect(page.locator('h1')).toHaveText(name);expect(await page.locator('body').textContent()).not.toMatch(/sintético|fixture|borrador|pendiente de revisión|\[COMPLETAR/i);}
 for(const path of ['/terminos.html','/manifiesto-datos.html']){expect((await request.get(path)).status()).toBe(200);expect((await request.head(path)).status()).toBe(200);}
 for(const path of ['/missing-public-check','/nested/missing-check.html']){const response=await page.goto(path);expect(response?.status()).toBe(404);await expect(page.locator('h1')).toHaveText('Página no encontrada');expect((await page.reload())?.status()).toBe(404);expect((await request.head(path)).status()).toBe(404);await page.getByRole('link',{name:'Volver a Inicio',exact:true}).click();await expect(page).toHaveURL(/\/index.html$/);}
 await page.goto('/contacto.html');await page.getByRole('complementary',{name:'Uso de tus datos'}).getByRole('link',{name:'Manifiesto de Datos',exact:true}).click();await page.getByRole('link',{name:'Volver a Contacto',exact:true}).click();await expect(page).toHaveURL(/contacto.html#escribir$/);
 for(const p of ['/historias.html#casos','/app.html#como-funciona','/app.html#descarga','/contacto.html#escribir']){await page.goto(p);await expect(page.locator('#'+p.split('#')[1])).toBeVisible();}
});

test('real404 privacy and anonymous private service preserve HTTP contract',async({page,request})=>{
 const r=await page.goto('/nested/missing-public-verification?sentinel=synthetic-private-url');expect(r?.status()).toBe(404);expect(r?.headers()['referrer-policy']).toBe('no-referrer');expect(await page.locator('body').textContent()).not.toContain('synthetic-private-url');
 const head=await request.head('/nested/missing-public-verification');expect(head.status()).toBe(404);expect((await head.body()).length).toBe(0);
 const link=page.getByRole('link',{name:'Volver a Inicio',exact:true});await link.focus();await page.keyboard.press('Enter');expect(await page.evaluate(()=>document.referrer)).toBe('');
 // Read-only anonymous check, no account, recovery email or state-changing request.
 const privateResponse=await request.get('/api/admin/sesion',{headers:{'x-priva-request':'1'}});expect(privateResponse.status()).toBe(401);expect(privateResponse.headers()['content-type']).toContain('application/json');expect(await privateResponse.text()).not.toContain('Página no encontrada');
});

test('real reading and recovery accessible at seven widths and200% text',async({page})=>{
 for(const route of ['/terminos.html','/manifiesto-datos.html','/404.html','/contacto.html'])for(const width of [360,390,430,768,1024,1280,1440]){
 await page.setViewportSize({width,height:1000});await page.goto(route);await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);const link=page.locator('main a').first();await link.focus();await expect(link).toBeFocused();await expect(link).toBeVisible();
 }
});
