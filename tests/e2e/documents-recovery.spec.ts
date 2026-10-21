import {test,expect} from '@playwright/test';
test('V07/V09 recovery preserves404 and returns home by keyboard without leaking URL',async({page})=>{
 for(const path of ['/missing-sentinel?private=sentinel','/nested/missing.html?private=sentinel']){const r=await page.goto(path);expect(r?.status()).toBe(404);expect(r?.headers()['referrer-policy']).toBe('no-referrer');await expect(page.locator('h1')).toHaveText('Página no encontrada');expect(await page.locator('body').textContent()).not.toContain('sentinel');expect((await page.reload())?.status()).toBe(404);const link=page.getByRole('link',{name:'Volver a Inicio',exact:true});await link.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/index.html$/);expect(await page.evaluate(()=>document.referrer)).toBe('');}
 await page.goto('/404.html');await expect(page.locator('h1')).toHaveText('Página no encontrada');
});
test('V10 four canonical anchors and headings',async({page})=>{
 for(const path of ['/historias.html#casos','/app.html#como-funciona','/app.html#descarga','/contacto.html#escribir']){await page.goto(path);const id=path.split('#')[1];const section=page.locator('#'+id);await expect(section).toBeVisible();const heading=await section.evaluate(e=>/^H[1-6]$/.test(e.tagName))?section:section.getByRole('heading').first();const box=await heading.boundingBox();expect(box!.y).toBeGreaterThanOrEqual(0);expect(box!.y).toBeLessThan(800);await expect(page.locator('a[href="#"],a[href*="#maria"]')).toHaveCount(0);}
});
