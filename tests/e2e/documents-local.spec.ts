import {test,expect} from '@playwright/test';
for(const method of ['pointer','keyboard'])test(`R07 real four destinations via ${method}, direct entry and reload`,async({page})=>{
 for(const [start,name,path,anchor] of [
  ['/historias.html','Explorar episodios','/historias.html','casos'],
  ['/app.html','Ver cómo funciona','/app.html','como-funciona'],
  ['/app.html','Descargar app','/app.html','descarga'],
  ['/manifiesto-datos.html','Volver a Contacto','/contacto.html','escribir'],
 ]){
  expect((await page.goto(start))?.status()).toBe(200);
  const link=page.getByRole('main').getByRole('link',{name,exact:true});
  if(method==='keyboard'){await link.focus();await link.press('Enter');}else await link.click();
  await expect(page).toHaveURL(new RegExp(`${path.replace('.','\\.')}#${anchor}$`));
  const heading=anchor==='casos'?page.locator('#casos'):page.locator(`#${anchor} h2`);
  await expect(heading).toBeFocused();await expect(heading).toBeInViewport();
  await page.goto('about:blank');expect((await page.goto(`${path}#${anchor}`))?.status()).toBe(200);
  await expect(heading).toBeFocused();await expect(heading).toBeInViewport();
  await page.reload();await expect(heading).toBeFocused();await expect(heading).toBeInViewport();
  await expect(page.locator('[href="#maria"],a[href="#"],a[href=""]')).toHaveCount(0);
 }
});

test('local draft documents, notice and explicit404 do not add tracking or storage',async({page,context,baseURL})=>{
 const external:string[]=[];page.on('request',request=>{if(new URL(request.url()).origin!==new URL(baseURL!).origin)external.push(new URL(request.url()).origin);});
 for(const path of ['/terminos.html','/manifiesto-datos.html','/404.html','/contacto.html']){
  const response=await page.goto(path);
  if(path==='/404.html')expect([200,404]).toContain(response?.status());else expect(response?.status()).toBe(200);
  await expect(page.getByRole('main').getByRole('heading',{level:1})).toHaveCount(1);
  expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
 }
 expect(await context.cookies()).toEqual([]);expect(external).toEqual([]);
});
