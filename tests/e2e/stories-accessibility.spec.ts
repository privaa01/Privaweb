import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fixtureCatalog } from '../fixtures/stories/src/content';
for(const width of [360,390,430,768,1024,1280,1440])for(const scale of [100,200])test(`stories ${width}px text ${scale}%`,async({page})=>{
 await page.addInitScript((scale)=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=`${scale}%`),scale);
 await page.setViewportSize({width,height:1000});await page.route('**/api/public/historias',r=>r.fulfill({json:fixtureCatalog}));await page.goto('/historias.html#casos');await expect(page.locator('[data-story]')).toHaveCount(3);
 await expect(page.locator('#casos')).toBeFocused();await expect(page.locator('#casos')).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.getByRole('button',{name:'Ver todas las historias'}).click();await expect(page.locator('[data-story]')).toHaveCount(4);
 for(const card of await page.locator('[data-story]').all()){
  const radio=card.getByRole('radio').first();await radio.focus();await radio.press('Space');await expect(radio).toBeFocused();await expect(card.locator('[data-feedback]')).not.toBeEmpty();
  await card.getByText('Leer transcripción').click();await expect(card.locator('[data-story-transcript]')).toBeVisible();
 }
 const violations=(await new AxeBuilder({page}).analyze()).violations;expect(violations).toEqual([]);
 for(const control of await page.locator('.stories button:visible,.stories label,.stories summary,.stories-button').all()){const box=await control.boundingBox();expect(box?.height).toBeGreaterThanOrEqual(43);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('no JavaScript gives honest fallback and static destinations',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4324/historias.html');await expect(page.getByText(/Activa JavaScript para consultar/)).toBeVisible();await expect(page.getByRole('link',{name:'Explorar episodios'})).toBeVisible();await expect(page.locator('[data-story]')).toHaveCount(0);await expect(page.getByRole('button',{name:'Ver todas las historias'})).toBeHidden();await context.close();
});
