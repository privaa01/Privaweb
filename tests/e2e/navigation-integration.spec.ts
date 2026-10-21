import {test,expect} from '@playwright/test';
import {navigationPrivateContract as contract} from '../helpers/navigation-private-contract';
// Only integration mode, against a supplied real environment; no fixture webServer.
const routes=['/index.html','/historias.html','/app.html','/contacto.html'];
const labels=['Inicio','Historias','Priva App','Contáctanos'];
for(const path of ['/admin/login','/terminos.html','/manifiesto-datos.html','/contacto.html#escribir']){
 test(`Destino integrado real ${path}`,async({page})=>{
 const response=await page.goto(path);expect(response?.status()).toBe(200);await expect(page.getByRole('main')).toBeVisible();
 expect(await page.locator('body').textContent()).not.toMatch(/contenido ficticio|destino exclusivamente de prueba|contenido sintético|fixture|borrador en revisión|pendiente de revisión/i);
 if(path==='/admin/login'){await expect(page.getByRole('textbox',{name:/correo/i})).toBeVisible();await expect(page.getByLabel(/contraseña/i).first()).toBeVisible();}
 else if(path.includes('#'))await expect(page.locator('#escribir').getByRole('textbox').first()).toBeVisible();
 else await expect(page.getByRole('heading',{level:1,name:path.includes('terminos')?'Términos de Servicio':'Manifiesto de Datos',exact:true})).toBeVisible();
 });
}
for(const path of contract.deniedDocuments)for(const method of ['GET','HEAD'] as const){
 test(`G05 ${method} ${path} sin sesión conserva guard006`,async({request})=>{
 const r=await request.fetch(path,{method,maxRedirects:0});expect(r.status()).toBe(contract.unauthenticated.status);expect(r.headers()['cache-control']).toBe('no-store');expect(r.headers()['content-type']).toContain('application/json');expect(r.headers().location).toBeUndefined();
 if(method==='HEAD')expect((await r.body()).length).toBe(0);else expect(await r.json()).toEqual({result:contract.unauthenticated.result});
 });
}
test('G05 API de sesión real devuelve401/403, nunca404 de un sitio estático',async({request})=>{
 for(const withHeader of [false,true]){const r=await request.get(contract.session,{headers:withHeader?{'x-priva-request':'1'}:{},maxRedirects:0});const expected=withHeader?contract.unauthenticated:contract.missingRequestHeader;expect(r.status()).toBe(expected.status);expect(await r.json()).toEqual({result:expected.result});}
});
test('G01/G02/G03 navegación y CTA sobre páginas reales',async({page})=>{
 for(const [i,path] of routes.entries()){
 await page.goto(path);await page.reload();const nav=page.getByRole('navigation',{name:'Principal'});const toggle=page.getByRole('button',{name:'Menú principal'});if(await toggle.isVisible())await toggle.click();await expect(nav.locator('[aria-current="page"]')).toHaveText(labels[i]);
 for(const [j,dest] of routes.entries()){await page.goto(path);if(await toggle.isVisible())await toggle.click();await nav.getByRole('link',{name:labels[j],exact:true}).click();await expect(page).toHaveURL(new RegExp(dest.replace('.','\\.')+'$'));}
 await page.goto(path);await page.getByRole('banner').getByRole('link',{name:i<2?'PROTÉGETE HOY':'DESCARGAR APP',exact:true}).click();const id=i<2?'casos':'descarga';const section=page.locator('#'+id);const heading=await section.evaluate(e=>/^H[1-6]$/.test(e.tagName))?section:section.getByRole('heading').first();await expect(heading).toBeInViewport();await expect(heading).toBeFocused();
 }
});

test('G04/G05/G06 cuatrofooters y16destinos complementarios reales',async({page})=>{
 const destinations=[['panel administrador','/admin/login'],['Términos de Servicio','/terminos.html'],['Manifiesto de Datos','/manifiesto-datos.html'],['Contacto Seguro','/contacto.html#escribir']];
 for(const origin of routes)for(const [name,path] of destinations){
 await page.goto(origin);const footer=page.getByRole('contentinfo');await expect(footer.getByText('Defendiendo la soberanía digital individual.',{exact:true})).toBeVisible();await expect(footer.getByText('© 2026 Priva. Todos los derechos reservados. Navega con dignidad.',{exact:true})).toBeVisible();
 const link=footer.getByRole('link',{name,exact:true});await link.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(new RegExp(path.replace('.','\\.')+'$'));await expect(page.getByRole('main')).toBeVisible();
 expect(await page.locator('body').textContent()).not.toMatch(/contenido ficticio|destino exclusivamente de prueba|contenido sintético|fixture|borrador en revisión|pendiente de revisión/i);
 if(name==='panel administrador')await expect(page.getByRole('button',{name:'Entrar',exact:true})).toBeVisible();
 if(name==='Contacto Seguro')await expect(page.locator('#escribir').getByRole('heading')).toBeInViewport();
 }
});
