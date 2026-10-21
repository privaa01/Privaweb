import {test,expect} from '@playwright/test';
test('V04 two direct and eight footer routes, accessible auxiliary navigation',async({page})=>{
 for(const path of ['/terminos.html','/manifiesto-datos.html']){
 const response=await page.goto(path);expect(response?.status()).toBe(200);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('nav[aria-label="Principal"] [aria-current]')).toHaveCount(0);await expect(page.locator('.header-cta')).toHaveCount(0);await expect(page.getByRole('link',{name:'Volver a Inicio',exact:true})).toHaveAttribute('href','/index.html');
 }
 for(const home of ['/index.html','/historias.html','/app.html','/contacto.html'])for(const label of ['Términos de Servicio','Manifiesto de Datos']){
 await page.goto(home);await page.locator('footer').getByRole('link',{name:label,exact:true}).click();await expect(page.locator('h1')).toHaveText(label);await page.getByRole('link',{name:'Volver a Inicio',exact:true}).click();await expect(page).toHaveURL(/\/index.html$/);
 }
 await page.setViewportSize({width:390,height:844});await page.goto('/terminos.html');const toggle=page.getByRole('button',{name:'Menú principal'});await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(toggle).toBeFocused();
});
