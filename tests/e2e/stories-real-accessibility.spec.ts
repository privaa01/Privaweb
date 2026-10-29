import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [360,390,430,768,1024,1280,1440])for(const scale of [100,200])test(`official stories ${width}px text ${scale}%`,async({page},info)=>{
 await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=`${scale}%`),scale);
 await page.setViewportSize({width,height:1000});
 expect((await page.goto('/historias.html#casos'))?.status()).toBe(200);
 await expect(page.locator('[data-story]')).toHaveCount(3);
 await expect(page.locator('#casos')).toBeFocused();
 expect(await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize))).toBeGreaterThanOrEqual(scale===200?32:16);
 const more=page.getByRole('button',{name:'Ver más historias'});
 await more.focus();await more.press('Enter');
 await expect(page.locator('[data-story]')).toHaveCount(4);
 await expect(page.locator('[data-story]').nth(3).getByRole('heading')).toBeFocused();
 for(const card of await page.locator('[data-story]').all()){
  const audio=card.locator('audio');await expect(audio).toHaveAttribute('controls','');
  expect(await audio.evaluate((a:HTMLAudioElement)=>a.autoplay)).toBe(false);
  const radio=card.getByRole('radio').first();await radio.focus();await radio.press('Space');
  await expect(radio).toBeChecked();await expect(radio).toBeFocused();
  await expect(card.locator('[data-feedback]')).not.toBeEmpty();
  const summary=card.locator('summary');await summary.focus();await summary.press('Enter');
  await expect(card.locator('[data-story-transcript]')).toBeVisible();
  expect(await summary.evaluate(element=>element.scrollWidth<=element.clientWidth+1)).toBe(true);
 }
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 for(const control of await page.locator('.stories button:visible,.stories label,.stories summary,.stories-button').all())expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(43);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 if(info.project.name==='chromium'&&((width===1440&&scale===100)||(width===390&&scale===200)))await page.screenshot({path:`.test-output/stories-real-${width}-${scale}.png`,fullPage:width===1440});
});
