import {test,expect} from '@playwright/test';
test('V06 notice before sending, manifesto and return without new persistence',async({page})=>{
 await page.goto('/contacto.html');const notice=page.getByRole('complementary',{name:'Uso de tus datos'});await expect(notice).toContainText('documentos');await expect(notice).toContainText('90 días');await expect(page.getByRole('checkbox')).toHaveCount(0);
 const link=notice.getByRole('link',{name:'Manifiesto de Datos',exact:true});await link.focus();await page.keyboard.press('Enter');await expect(page.locator('h1')).toHaveText('Manifiesto de Datos');await page.getByRole('link',{name:'Volver a Contacto',exact:true}).click();await expect(page).toHaveURL(/contacto.html#escribir$/);
 expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}))).toEqual({local:0,session:0,cookie:''});
});
