import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('V12 seven widths and text200%, no loss of content or focus',async({page})=>{
 for(const path of ['/terminos.html','/manifiesto-datos.html','/404.html','/contacto.html']){
 for(const width of [360,390,430,768,1024,1280,1440]){
 await page.setViewportSize({width,height:1000});await page.goto(path);await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 expect(await page.locator('body').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(32);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 const link=page.locator('main a').first();await link.focus();await expect(link).toBeFocused();await expect(link).toBeVisible();const box=await link.boundingBox();expect(box!.width).toBeGreaterThan(0);
 }
 await page.evaluate(()=>document.documentElement.style.fontSize='');const results=await new AxeBuilder({page}).analyze();expect(results.violations).toEqual([]);
 }
});
test('local documents and error introduce no external traffic, storage or private URL reflection',async({page,baseURL})=>{
 const external:string[]=[];page.on('request',req=>{if(new URL(req.url()).origin!==new URL(baseURL!).origin)external.push(new URL(req.url()).origin);});
 for(const path of ['/terminos.html','/manifiesto-datos.html','/nested/sentinel?token=sentinel']){
 await page.goto(path);expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}))).toEqual({local:0,session:0,cookie:''});expect(await page.locator('body').textContent()).not.toContain('sentinel');
 }
 expect(external).toEqual([]);
});
