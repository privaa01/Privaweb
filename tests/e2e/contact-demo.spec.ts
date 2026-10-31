import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [360,390,430,768,1024,1280,1440])for(const scale of [100,200]){
 test(`Contacto demo ${width}px texto ${scale}%`,async({page,context,baseURL})=>{
  const requests:{url:string;method:string}[]=[];page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
  await page.setViewportSize({width,height:1000});await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=`${16*scale/100}px`),scale);
  expect((await page.goto('/contacto.html'))?.status()).toBe(200);
  const form=page.locator('[data-demo-contact]');await expect(form.getByRole('button',{name:'Enviar prueba',exact:true})).toBeEnabled();
  await expect(page.getByRole('heading',{level:1})).toHaveText('Contáctanos');
  await expect(page.getByLabel('Correo ficticio')).toHaveValue('prueba@example.test');await expect(page.getByLabel('Correo ficticio')).toHaveAttribute('readonly','');
  await expect(page.locator('.contact-hero img')).toHaveAttribute('src','/images/contact/contacto.png');await expect(page.locator('.contact-instagram')).toBeVisible();await expect(page.locator('.contact-instagram li')).toHaveCount(4);await expect(page.locator('.contact-instagram a')).toHaveAttribute('href','https://www.instagram.com/priva_inc/');
  const layout=await page.locator('.contact-columns').evaluate(el=>{const a=el.children[0].getBoundingClientRect(),b=el.children[1].getBoundingClientRect();return {a:{x:a.x,y:a.y,bottom:a.bottom},b:{x:b.x,y:b.y}};});if(width<768)expect(layout.a.bottom).toBeLessThanOrEqual(layout.b.y);else expect(layout.a.x).toBeLessThan(layout.b.x);
  await expect(page.locator('.contact-closing')).toContainText('Esta demo no envía correos');await expect(form.locator('textarea')).toHaveCount(0);await expect(form.getByRole('checkbox')).not.toBeChecked();
  for(const field of await form.locator('select,input,button:not([hidden])').all()){
   await field.focus();await expect(field).toBeFocused();expect(await field.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
   const box=await field.boundingBox();if(await field.getAttribute('type')!=='checkbox')expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await form.getByRole('button',{name:'Enviar prueba',exact:true}).click();expect(requests.filter(r=>r.method!=='GET')).toEqual([]);
  await expect(form.getByRole('checkbox')).toBeFocused();await page.keyboard.press('Escape');
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize)).toBe(`${16*scale/100}px`);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  expect(requests.every(r=>new URL(r.url).origin===new URL(baseURL!).origin)).toBe(true);
  expect(await context.cookies()).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
  const privacy=form.getByRole('link',{name:'Privacidad de la demo'});await privacy.focus();await privacy.press('Enter');await expect(page).toHaveURL(/manifiesto-datos.html$/);
 });
}
test('Contacto demo sin JavaScript informa dependencia y no envía',async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,javaScriptEnabled:false});try{
  const page=await context.newPage();const writes:string[]=[];page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url());});await page.goto('/contacto.html');
  await expect(page.getByText('Activa JavaScript para enviar la prueba.')).toBeVisible();await expect(page.getByRole('button',{name:'Enviar prueba',exact:true})).toBeDisabled();
  await page.getByRole('link',{name:'Privacidad de la demo',exact:true}).first().click();await expect(page).toHaveURL(/manifiesto-datos.html$/);expect(writes).toEqual([]);
 }finally{await context.close();}
});
