import { test, expect } from '@playwright/test';
test('base: layout de Inicio permite ancho completo', async ({ page }) => {
 await page.setViewportSize({ width: 1440, height: 900 });
 await page.goto('/index.html');
 const main = await page.getByRole('main').boundingBox();
 expect(main?.x).toBe(0); expect(main?.width).toBe(1440);
});

import AxeBuilder from '@axe-core/playwright';
for (const width of [360,390,430,768,1024,1280,1440]) {
 for (const text of [100,200]) {
  test(`matriz Inicio ${width}px texto ${text}%`, async ({ page, context }) => {
   const remote: string[] = [];
   page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:4323/')) remote.push(r.url()); });
   await page.setViewportSize({width,height:900});
   await page.addInitScript(scale => { document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.fontSize = `${16*scale/100}px`; }); }, text);
   await page.emulateMedia({ reducedMotion: 'reduce' });
   for (const keyboard of [false,true]) {
    await page.goto('/index.html');
    expect(await page.locator('.home > section').evaluateAll(nodes => nodes.map(node=>node.id))).toEqual(['hero','somos-priva','que-hacemos','cierre']);
    await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
    await expect(page.locator('#que-hacemos h3')).toHaveText(['Educación Digital','Historias educativas','Herramientas Seguras','Acompañamiento']);
    const learn = page.getByRole('link',{name:'Conocer más'});
    if(keyboard) { await learn.focus(); await page.keyboard.press('Enter'); } else await learn.click();
    await expect(page.locator('#somos-priva h2')).toBeInViewport();
    await expect(page.locator('#somos-priva h2')).toBeFocused();
    for(const anchor of ['somos-priva','que-hacemos']) {
     await page.goto('about:blank');
     await page.goto(`/index.html#${anchor}`);
     await expect(page.locator(`#${anchor} h2`)).toBeInViewport();
     await expect(page.locator(`#${anchor} h2`)).toBeFocused();
     await page.reload();
     await expect(page.locator(`#${anchor} h2`)).toBeFocused();
     await expect(page.locator(`#${anchor} h2`)).toBeInViewport();
     expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBeTruthy();
    }
    const closing = page.getByRole('link',{name:'Explora nuestras historias'});
    if(keyboard) { await closing.focus(); await page.keyboard.press('Enter'); } else await closing.click();
    await expect(page).toHaveURL(/\/historias\.html$/);
   }
   await page.goto('/index.html');
   expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize)).toBe(`${16*text/100}px`);
   for (const link of await page.locator('.home a').all()) {
    await link.focus();
    expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    expect(await link.evaluate(node=>getComputedStyle(node).outlineStyle)).not.toBe('none');
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBeTruthy();
   const violations=(await new AxeBuilder({page}).analyze()).violations;
   expect(violations).toEqual([]);
   expect(await context.cookies()).toEqual([]);
   expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
   expect(remote).toEqual([]);
  });
 }
}
for (const block of ['hero','identidad','cierre']) {
 test(`imagen ${block} fallida conserva texto y controles`, async ({page})=>{
  await page.route(`**/test-${block}.svg`,route=>route.abort());
  await page.goto('/index.html');
  const id=block==='identidad'?'somos-priva':block;
  const image=page.locator(`#${id} img`);
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('alt',`Recurso ficticio de prueba: ${block}`);
  await expect.poll(()=>image.evaluate((node:HTMLImageElement)=>node.complete && node.naturalWidth===0)).toBeTruthy();
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('link',{name:'Conocer más'}).click();
  await expect(page.locator('#somos-priva h2')).toBeInViewport();
  await page.getByRole('link',{name:'Explora nuestras historias'}).click();
  await expect(page).toHaveURL(/\/historias\.html$/);
 });
}
test('contenido y enlaces funcionan sin JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL,viewport:{width:390,height:844}});
 const page=await context.newPage(); await page.goto('/index.html');
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await expect(page.locator('#que-hacemos h3')).toHaveCount(4);
 await page.getByRole('link',{name:'Conocer más'}).click();
 await expect(page.locator('#somos-priva h2')).toBeInViewport();
 await page.getByRole('link',{name:'Explora nuestras historias'}).click();
 await expect(page).toHaveURL(/historias\.html$/); await context.close();
});
