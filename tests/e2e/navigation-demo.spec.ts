import {test,expect,type Page,type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const paths=['/index.html','/historias.html','/app.html','/contacto.html'];
const labels=['Inicio','Historias','Priva App','Contáctanos'];
const footers=[['Términos de la demo','/terminos.html','Términos de la demo'],['Privacidad de la demo','/manifiesto-datos.html','Privacidad de la demo'],['Contacto','/contacto.html','Contacto de prueba']];
const nextKey=(browser:string)=>browser==='webkit'&&process.platform==='darwin'?'Alt+Tab':'Tab';
async function fits(page:Page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
async function active(page:Page,index:number){
 const current=page.getByRole('navigation',{name:'Principal',includeHidden:true}).locator('[aria-current="page"]');
 await expect(current).toHaveCount(1);await expect(current).toHaveText(labels[index]);
}
async function focusContrast(link:Locator){
 return link.evaluate(el=>{
  const rgb=(value:string)=>value.match(/[\d.]+/g)!.map(Number);
  const luminance=(c:number[])=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  let parent=el.parentElement;let background=[255,255,255];
  while(parent){const c=rgb(getComputedStyle(parent).backgroundColor);if(c.length===3||c[3]>0){background=c;break;}parent=parent.parentElement;}
  const values=[luminance(rgb(getComputedStyle(el).outlineColor)),luminance(background)].sort((a,b)=>a-b);
  return (values[1]+.05)/(values[0]+.05);
 });
}
async function activate(page:Page,link:Locator,keyboard:boolean){
 if(keyboard){await page.keyboard.press('Tab');await link.focus();await expect(link).toBeFocused();expect(await link.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');expect(await focusContrast(link)).toBeGreaterThanOrEqual(3);await link.press('Enter');}
 else await link.click();
}
async function menu(page:Page,keyboard:boolean){
 const toggle=page.getByRole('button',{name:'Menú principal'});
 if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')==='false'){
  if(keyboard){await toggle.focus();await toggle.press('Enter');}else await toggle.click();
 }
 return page.getByRole('navigation',{name:'Principal'});
}
async function journey(page:Page,keyboard:boolean,audit:boolean){
 for(const [i,path]of paths.entries()){
  for(const [j,dest]of paths.entries()){
   expect((await page.goto(path))?.status()).toBe(200);await active(page,i);
   const nav=await menu(page,keyboard);await expect(nav.getByRole('link')).toHaveText(labels);
   await activate(page,nav.getByRole('link',{name:labels[j],exact:true}),keyboard);
   await expect(page).toHaveURL(new RegExp(dest.replace('.','\\.')+'$'));await active(page,j);
   await page.getByRole('heading',{level:1}).scrollIntoViewIfNeeded();await expect(page.getByRole('heading',{level:1})).toBeInViewport();await fits(page);
  }
  await page.goto(path);await activate(page,page.getByRole('banner').getByRole('link',{name:'Priva — Inicio',exact:true}),keyboard);await expect(page).toHaveURL(/\/index\.html$/);await active(page,0);
  await page.goto(path);await activate(page,page.getByRole('banner').getByRole('link',{name:i<2?'PROTÉGETE HOY':'DESCARGAR APP',exact:true}),keyboard);
  const section=page.locator(i<2?'#casos':'#descarga');const heading=await section.evaluate(el=>/^H[1-6]$/.test(el.tagName))?section:section.getByRole('heading').first();
  await expect(heading).toBeFocused();await expect(heading).toBeInViewport();await fits(page);
  for(const [name,dest,title]of footers){
   await page.goto(path);const footer=page.getByRole('contentinfo');await expect(footer.getByText('Priva · Demostración educativa',{exact:true})).toBeVisible();
   await expect(footer.getByRole('link')).toHaveText(footers.map(f=>f[0]));await expect(footer.locator('a[href^="/admin"]')).toHaveCount(0);
   await activate(page,footer.getByRole('link',{name,exact:true}),keyboard);await expect(page).toHaveURL(new RegExp(dest.replace('.','\\.')+'$'));
   await expect(page.getByRole('heading',{level:1})).toHaveText(title);await fits(page);
  }
  if(audit){
   await page.goto(path);await menu(page,keyboard);
   expect((await new AxeBuilder({page}).include('header').include('footer').analyze()).violations).toEqual([]);
   for(const control of await page.locator('header a:visible,header button:visible,footer a:visible').all())expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(43);
  }
 }
}
for(const width of [360,390,430,768,1024,1280,1440])for(const scale of [100,200]){
 test(`Demo matriz ${width}px texto ${scale}%`,async({page,context,baseURL})=>{
  const external:string[]=[];page.on('request',r=>{if(new URL(r.url()).origin!==new URL(baseURL!).origin)external.push(new URL(r.url()).origin);});
  await page.setViewportSize({width,height:1000});await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=`${16*scale/100}px`),scale);
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const keyboard of [false,true])await journey(page,keyboard,true);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize)).toBe(`${16*scale/100}px`);
  expect(await context.cookies()).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);expect(external).toEqual([]);
 });
}
for(const keyboard of [false,true])test(`Demo publicada recorridos ${keyboard?'teclado':'puntero'}`,async({page,context,baseURL})=>{
 const external:string[]=[];page.on('request',r=>{if(new URL(r.url()).origin!==new URL(baseURL!).origin)external.push(new URL(r.url()).origin);});
 await journey(page,keyboard,true);expect(await context.cookies()).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);expect(external).toEqual([]);
});
test('Demo publicada menú: Escape, resize y foco en cuatro páginas',async({page,browserName})=>{
 for(const [i,path]of paths.entries()){
  await page.setViewportSize({width:390,height:900});await page.goto(path);const toggle=page.getByRole('button',{name:'Menú principal'});const nav=page.getByRole('navigation',{name:'Principal'});
  await toggle.focus();await toggle.press('Enter');await expect(toggle).toHaveAttribute('aria-expanded','true');await page.keyboard.press(nextKey(browserName));await expect(nav.getByRole('link').first()).toBeFocused();
  await page.keyboard.press('Escape');await expect(toggle).toBeFocused();await expect(nav).toBeHidden();
  await page.setViewportSize({width:1440,height:900});await expect(nav.getByRole('link',{name:labels[i],exact:true})).toBeFocused();
  await page.setViewportSize({width:390,height:900});await expect(toggle).toBeFocused();await expect(nav).toBeHidden();
 }
});
test('Demo publicada navegación sin JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:390,height:900}});
 try{const page=await context.newPage();for(const [i,path]of paths.entries()){
  await page.goto(path);await active(page,i);const nav=page.getByRole('navigation',{name:'Principal'});await expect(nav).toBeVisible();await nav.getByRole('link',{name:'Historias',exact:true}).click();await expect(page).toHaveURL(/historias\.html$/);
 }}finally{await context.close();}
});
test('Demo publicada fronteras: administración ausente, no autenticación simulada',async({request})=>{
 for(const path of ['/admin/login','/admin/contacto','/api/admin/sesion','/.git/config']){
  const response=await request.get(path);expect(response.status()).toBe(404);expect(response.headers()['referrer-policy']).toBe('no-referrer');
 }
});
