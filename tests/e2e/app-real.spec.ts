import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for(const width of [360,390,430,768,1024,1280,1440])for(const scale of [100,200]){
 test(`real matrix ${width}px text ${scale}%`,async({page,context,browserName})=>{
  const remote:string[]=[];
  page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4321/'))remote.push(request.url());});
  await page.setViewportSize({width,height:1000});
  await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=`${16*scale/100}px`),scale);
  await page.emulateMedia({reducedMotion:'reduce'});
  expect((await page.goto('/app.html'))?.status()).toBe(200);
  const main=page.getByRole('main');
  await expect(main.getByRole('heading',{level:1})).toHaveCount(1);
  await expect(main.locator('[data-prototype-notice]')).toContainText('Prototipo');
  await expect(main.locator('[data-platform] .app-pending')).toHaveCount(2);
  await expect(main.locator('[data-platform] a,form,input,textarea')).toHaveCount(0);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize)).toBe(`${16*scale/100}px`);
  for(const image of await main.locator('.app-presentation img').all()){
   await image.scrollIntoViewIfNeeded();
   await expect.poll(()=>image.evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth===1024&&image.naturalHeight===1536)).toBe(true);
  }
  for(const [name,anchor] of [['Ver cómo funciona','como-funciona'],['Descargar app','descarga']]){
   const link=main.getByRole('link',{name,exact:true});
   await link.focus();await link.press('Enter');
   await expect(main.locator(`#${anchor} h2`)).toBeFocused();
   await expect(main.locator(`#${anchor} h2`)).toBeInViewport();
   await page.goto('about:blank');await page.goto(`/app.html#${anchor}`);await page.reload();
   await expect(main.locator(`#${anchor} h2`)).toBeFocused();
   await expect(main.locator(`#${anchor} h2`)).toBeInViewport();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  for(const link of await main.locator('[data-app] a').all()){
   await link.focus();expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
   expect(await link.evaluate(link=>getComputedStyle(link).outlineStyle)).not.toBe('none');
  }
  expect((await new AxeBuilder({page}).exclude('astro-dev-toolbar').analyze()).violations).toEqual([]);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);expect(remote).toEqual([]);
  if(browserName==='chromium'&&width===1440&&scale===100){await page.goto('/app.html');await page.screenshot({path:'.test-output/app-approved.png'});}
 });
}

test('real official mockup failure preserves prototype and pending states',async({page})=>{
 await page.route('**/images/app/asistente-zyro.png',route=>route.abort());
 await page.goto('/app.html');
 const main=page.getByRole('main');
 await expect(main.locator('[data-prototype-notice]')).toContainText('Prototipo');
 await main.getByRole('link',{name:'Descargar app',exact:true}).click();
 await expect(main.locator('#descarga h2')).toBeInViewport();
 await expect(main.locator('[data-platform] .app-pending')).toHaveCount(2);
});
test('real presentation and pending platforms remain usable without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL,viewport:{width:390,height:844}});
 try{
  const page=await context.newPage();expect((await page.goto('/app.html'))?.status()).toBe(200);
  await expect(page.getByRole('main').locator('[data-platform] .app-pending')).toHaveCount(2);
  await page.getByRole('main').getByRole('link',{name:'Descargar app',exact:true}).click();
  await expect(page.locator('#descarga h2')).toBeInViewport();
 }finally{await context.close();}
});
