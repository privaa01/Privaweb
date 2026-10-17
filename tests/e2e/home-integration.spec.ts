import { test, expect } from '@playwright/test';
test('Inicio real, sin contenido de prueba, con las dos anclas', async ({ page }) => {
 const response=await page.goto('/index.html');
 expect(response?.ok()).toBeTruthy();
 await expect(page.getByRole('heading',{level:1})).toHaveText('La privacidad también es una forma de libertad.');
 await expect(page.getByText(/banco de pruebas|recurso ficticio/i)).toHaveCount(0);
 await expect(page.locator('img[src*="test-"]')).toHaveCount(0);
 for(const anchor of ['somos-priva','que-hacemos']) {
  await page.goto(`/index.html#${anchor}`); await page.reload();
  await expect(page.locator(`#${anchor} h2`)).toBeInViewport();
 }
});
test('CTA de Inicio llega a Historias real',async({page})=>{
 await page.goto('/index.html');
 await page.getByRole('main').getByRole('link',{name:'Explora nuestras historias'}).click();
 await expect(page).toHaveURL(/\/historias\.html$/);
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await expect(page.getByText(/destino.*de prueba|banco de pruebas/i)).toHaveCount(0);
 await expect(page.locator('#casos')).toBeVisible();
});
