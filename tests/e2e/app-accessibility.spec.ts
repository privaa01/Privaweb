import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {interceptAppDownloads} from './app-fixture';
const cases:[string,number,number][]=[];
for(const width of[360,390,430,768,1024,1280,1440])for(const scale of[100,200])cases.push(['app',width,scale]);
for(const name of['app-android','app-iphone','app-both'])for(const width of[360,1440])cases.push([name,width,200]);
for(const [name,width,scale] of cases)test(`${name} ${width}px text ${scale}%`,async({page})=>{
 await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=`${scale}%`),scale);await page.setViewportSize({width,height:1000});await interceptAppDownloads(page);
 await page.goto(`/${name}.html#como-funciona`);await expect(page.locator('#como-funciona h2')).toBeFocused();await expect(page.locator('#como-funciona h2')).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.getByRole('link',{name:'Descargar app',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('#descarga h2')).toBeFocused();await expect(page.locator('#descarga h2')).toBeInViewport();
 const axe=await new AxeBuilder({page}).analyze();expect(axe.violations).toEqual([]);
 for(const control of await page.locator('[data-app] a').all()){const box=await control.boundingBox();expect(box?.height).toBeGreaterThanOrEqual(43);}
 const order=await page.locator('[data-app-block]').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().top));expect(order).toEqual([...order].sort((a,b)=>a-b));
});
for(const [name,count] of[['app',0],['app-android',1],['app-iphone',1],['app-both',2]] as const)test(`no JavaScript preserves ${name} native states and links`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});await interceptAppDownloads(context);const page=await context.newPage();await page.goto(`http://127.0.0.1:4325/${name}.html`);
 await expect(page.locator('[data-platform] a')).toHaveCount(count);await expect(page.locator('[data-platform] .app-pending')).toHaveCount(2-count);await page.getByRole('link',{name:'Ver cómo funciona'}).click();await expect(page).toHaveURL(/#como-funciona$/);await expect(page.locator('#como-funciona h2')).toBeInViewport();
 if(count){const link=page.locator('[data-platform] a').first(),href=await link.getAttribute('href');await link.click();await expect(page).toHaveURL(href!);await expect(page.getByRole('heading')).toContainText('Destino de prueba');}
 await context.close();
});
