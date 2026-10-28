import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {DatabaseSync} from 'node:sqlite';
import {join,resolve} from 'node:path';
import {syntheticContactDirectory} from '../../server/contact/development.ts';

const directory=process.env.PRIVA_CONTACT_TEST_DATA_DIR??syntheticContactDirectory(resolve('.'));
function saved(message:string){const db=new DatabaseSync(join(directory,'contact.sqlite'),{readOnly:true});try{return db.prepare('SELECT nameOrAlias,email,message,status FROM consultations WHERE message=?').all(message);}finally{db.close();}}
async function fill(page:Page,message:string){await page.getByLabel('Nombre o alias',{exact:true}).fill('Alias ficticio');await page.getByLabel('Correo electrónico',{exact:true}).fill('prueba@example.test');await page.getByLabel('Mensaje',{exact:true}).fill(message);}
test('MVP página real, recursos oficiales, modo explícito y ancla accesible',async({page})=>{
 const r=await page.goto('/contacto.html#escribir');expect(r?.status()).toBe(200);
 await expect(page.getByText('Modo de prueba del MVP.',{exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Contáctanos');
 await expect(page.locator('#escribir h2')).toBeFocused();
 await expect(page.locator('.contact-hero img')).toHaveAttribute('src','/images/contact/contacto.png');
 await expect(page.getByRole('link',{name:'Ir a Instagram'})).toHaveAttribute('href','https://www.instagram.com/priva_inc/');
 await expect(page.getByRole('link',{name:'Solicitar eliminación',exact:true})).toHaveCount(0);
 await page.reload();await expect(page.locator('#escribir h2')).toBeFocused();
 await page.getByRole('link',{name:'Contacto Seguro',exact:true}).click();await expect(page).toHaveURL(/contacto\.html$/);await expect(page.getByRole('heading',{level:1})).toBeInViewport();
});
test('MVP validación y guardado real una sola vez sin correo',async({page})=>{
 const marker='MVP ficticio '+Date.now()+Math.random();await page.goto('/contacto.html');
 await page.getByRole('button',{name:'Enviar mensaje',exact:true}).click();await expect(page.getByLabel('Nombre o alias',{exact:true})).toBeFocused();
 await fill(page,marker);await page.getByLabel('Correo electrónico',{exact:true}).fill('ficticio@example.com');
 await page.getByRole('button',{name:'Enviar mensaje',exact:true}).click();await expect(page.locator('#error-email')).toContainText('example.test');expect(saved(marker)).toEqual([]);
 await page.getByLabel('Correo electrónico',{exact:true}).fill('prueba@example.test');
 await page.locator('form[data-contact]').evaluate(f=>{(f as HTMLFormElement).requestSubmit();(f as HTMLFormElement).requestSubmit();});
 await expect(page.locator('[data-contact-status]')).toContainText('No se enviaron correos.');
 expect(saved(marker)).toEqual([{nameOrAlias:'Alias ficticio',email:'prueba@example.test',message:marker,status:'Pendiente'}]);
 await page.locator('[data-contact-status]').scrollIntoViewIfNeeded();
 await page.screenshot({path:'.test-output/contact-development-artifacts/confirmed.png'});
 await page.getByRole('button',{name:'Otra consulta',exact:true}).click();await expect(page.getByLabel('Nombre o alias',{exact:true})).toBeFocused();await expect(page.getByLabel('Mensaje',{exact:true})).toHaveValue('');
});
test('MVP servidor valida dominio, replay y acceso privado sin endpoints de lectura',async({request,baseURL})=>{
 const headers={Origin:baseURL!};const attempt=await(await request.post('/api/contacto/intentos',{data:{},headers})).json();
 const marker='MVP directo ficticio '+Date.now()+Math.random();const payload={attemptId:attempt.attemptId,token:attempt.token,nameOrAlias:'Alias ficticio',email:'prueba@example.test',message:marker};
 const first=await request.post('/api/contacto/consultas',{data:payload,headers});expect(first.status()).toBe(201);
 const replay=await request.post('/api/contacto/consultas',{data:payload,headers});expect(replay.status()).toBe(200);expect(saved(marker)).toHaveLength(1);
 const other=await(await request.post('/api/contacto/intentos',{data:{},headers})).json();
 const invalid=await request.post('/api/contacto/consultas',{data:{...payload,attemptId:other.attemptId,token:other.token,email:'ficticio@example.com'},headers});expect(invalid.status()).toBe(422);expect((await invalid.json()).result).toBe('not_stored');expect(saved(marker)).toHaveLength(1);
 expect((await request.post('/api/contacto/intentos',{data:{},headers:{Origin:'https://evil.example'}})).status()).toBe(403);
 expect((await request.post('/api/contacto/intentos',{data:{},headers:{...headers,Host:'evil.example'}})).status()).toBe(403);
 for(const path of ['/api/contacto/consultas','/api/contacto/list','/contact.sqlite','/contact.key','/@fs'+join(directory,'contact.sqlite')]){
  const r=await request.get(path);expect([403,404,405]).toContain(r.status());expect(await r.text()).not.toContain(marker);
 }
});
test('MVP sin JavaScript conserva avisos y nunca envía datos por GET',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false});try{const page=await context.newPage();await page.goto(baseURL+'/contacto.html');await expect(page.getByRole('button',{name:'Enviar mensaje',exact:true})).toBeDisabled();await expect(page.locator('[data-js-required]')).toBeVisible();await expect(page.locator('.contact-test-notice')).toBeVisible();}finally{await context.close();}
});
for(const width of [360,390,430,768,1024,1280,1440])for(const scale of [100,200])test(`MVP matriz ${width} texto ${scale}%`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>{document.documentElement.style.fontSize=scale+'%';}),scale);
 await page.goto('/contacto.html#escribir');await expect(page.locator('#escribir h2')).toBeFocused();await expect(page.locator('#escribir h2')).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 if(width<768){const insta=await page.locator('.contact-instagram').boundingBox(),form=await page.locator('#escribir').boundingBox();expect(insta!.y+insta!.height).toBeLessThanOrEqual(form!.y+1);}
 await page.getByRole('button',{name:'Enviar mensaje',exact:true}).click();await expect(page.getByLabel('Nombre o alias',{exact:true})).toBeFocused();
 // The development toolbar is Astro tooling, outside the shipped document.
 expect((await new AxeBuilder({page}).exclude('astro-dev-toolbar').analyze()).violations).toEqual([]);
 for(const field of ['#contact-name','#contact-email','#contact-message','[data-send]'])expect((await page.locator(field).boundingBox())!.height).toBeGreaterThanOrEqual(44);
});
