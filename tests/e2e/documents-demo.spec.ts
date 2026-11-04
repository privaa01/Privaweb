import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('published demo documents, footer access and recovery preserve real HTTP and links',async({page,request})=>{
  for(const [path,title] of [['/terminos.html','Términos de la demo'],['/manifiesto-datos.html','Privacidad de la demo']]) {
    const response=await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading',{level:1,name:title,exact:true})).toBeVisible();
    expect(response?.headers()['referrer-policy']).toBe('no-referrer');
    expect(response?.headers()['cache-control']).toContain('no-store');
  }
  await expect(page.locator('main')).toContainText('No introduzcas datos personales reales');
  await expect(page.locator('main')).toContainText('nam5');
  await page.getByRole('link',{name:'Volver a Contacto',exact:true}).click();
  await expect(page).toHaveURL(/\/contacto.html#escribir$/);
  for(const source of ['/index.html','/historias.html','/app.html','/contacto.html']) {
    for(const [name,path] of [['Términos de la demo','/terminos.html'],['Privacidad de la demo','/manifiesto-datos.html']]) {
      await page.goto(source);
      await page.locator('footer').getByRole('link',{name,exact:true}).click();
      await expect(page).toHaveURL(new RegExp(path.replace('.','\\.')+'$'));
    }
  }
  for(const path of ['/revision010-inexistente','/revision010/anidada?prueba=marcador-ficticio-010']) {
    const response=await page.goto(path);
    expect(response?.status()).toBe(404);
    expect(response?.headers()['referrer-policy']).toBe('no-referrer');
    await expect(page.getByRole('heading',{level:1,name:'Página no encontrada',exact:true})).toBeVisible();
    expect(await page.locator('body').textContent()).not.toContain('marcador-ficticio-010');
    const head=await request.head(path);expect(head.status()).toBe(404);expect((await head.body()).length).toBe(0);
    await page.getByRole('link',{name:'Volver a Inicio',exact:true}).click();
    await expect(page).toHaveURL(/\/index.html$/);
    expect(await page.evaluate(()=>document.referrer)).toBe('');
  }
});

test('published demo reading at seven widths and 200 percent has no new tracking or overflow',async({page,context,baseURL})=>{
  const expectedOrigin=new URL(baseURL!).origin;
  const external=new Set<string>();
  page.on('request',request=>{const url=new URL(request.url());if(url.origin!==expectedOrigin)external.add(url.origin);});
  for(const route of ['/terminos.html','/manifiesto-datos.html','/revision010/error-lectura']) {
    await page.goto(route,{waitUntil:'domcontentloaded'});
    await expect(page.getByRole('heading',{level:1})).toBeVisible();
    await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
    for(const width of [360,390,430,768,1024,1280,1440]) {
      await page.setViewportSize({width,height:1000});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
      const link=page.locator('main a').first();await link.focus();await expect(link).toBeFocused();await expect(link).toBeVisible();
    }
    const result=await new AxeBuilder({page}).analyze();expect(result.violations).toEqual([]);
  }
  expect([...external]).toEqual([]);expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
});
