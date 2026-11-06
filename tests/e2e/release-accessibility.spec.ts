import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const pages=['/index.html','/historias.html','/app.html','/contacto.html','/terminos.html','/manifiesto-datos.html','/revision011/pagina-inexistente'];
for(const path of pages)test(`011 public accessibility ${path}`,async({page},info)=>{
 const response=await page.goto(path,{waitUntil:'domcontentloaded'});
 expect(response?.status()).toBe(path.includes('inexistente')?404:200);
 await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
 await expect(page.locator('[data-navigation]')).toHaveAttribute('data-initialized','true');
 if(path==='/historias.html') {
  await expect(page.locator('[data-story]')).toHaveCount(3);
  await page.getByRole('button',{name:'Ver más historias',exact:true}).press('Enter');
  await expect(page.locator('[data-story]')).toHaveCount(4);
  for(const card of await page.locator('[data-story]').all()) {
   await expect(card.locator('audio')).toHaveAttribute('controls','');
   expect(await card.locator('audio').evaluate((a:HTMLAudioElement)=>a.autoplay)).toBe(false);
   await card.locator('summary').press('Enter');
   await expect(card.locator('[data-story-transcript]')).toBeVisible();
   const radio=card.getByRole('radio').first();await radio.press('Space');
   await expect(radio).toBeChecked();await expect(card.locator('[data-feedback]')).not.toBeEmpty();
  }
 }
 for(const width of [360,390,430,768,1024,1280,1440])for(const scale of [100,200]) {
  await page.setViewportSize({width,height:1000});
  await page.evaluate(scale=>{document.documentElement.style.fontSize=scale+'%';},scale);
  expect(await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize))).toBeGreaterThanOrEqual(scale===200?32:16);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${path} ${width} ${scale}`).toBe(true);
  const menu=page.getByRole('button',{name:'Menú principal',exact:true});
  if(width<=1024) {
   await expect(menu).toBeVisible();
   await menu.focus();await menu.press('Enter');await expect(menu).toHaveAttribute('aria-expanded','true');
   const nav=page.getByRole('navigation',{name:'Principal',exact:true});await expect(nav).toBeVisible();
   await nav.getByRole('link').first().focus();await page.keyboard.press('Escape');
   await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();
   const box=await menu.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(43);expect(box!.width).toBeGreaterThanOrEqual(43);
  }else {
   await expect(menu).toBeHidden();
   await expect(page.getByRole('navigation',{name:'Principal',exact:true})).toBeVisible();
  }
  if(path==='/contacto.html'&&width<=767) {
   const instagram=await page.locator('.contact-instagram').boundingBox();
   const form=await page.locator('[data-demo-contact]').boundingBox();
   expect(instagram!.y+instagram!.height).toBeLessThanOrEqual(form!.y+1);
  }
  const result=await new AxeBuilder({page}).analyze();
  expect(result.violations,`${path} ${width}px ${scale}%`).toEqual([]);
  if((width===390&&scale===200)||(width===1440&&scale===100)) {
   await page.evaluate(()=>window.scrollTo(0,0));
   const name=path.replace(/[^a-z0-9]/gi,'-');
   await page.screenshot({path:`.test-output/release-accessibility/${name}-${width}-${scale}.png`,fullPage:scale===100});
  }
 }
 for(const image of await page.locator('img').all())expect(await image.getAttribute('alt')).not.toBeNull();
 for(const link of await page.locator('a[href]').all())expect(await link.getAttribute('href')).not.toMatch(/^\s*(?:#|javascript:)?\s*$/i);
});
