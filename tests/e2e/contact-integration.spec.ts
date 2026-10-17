import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
// The operator supplies a local executable using existing authorized private access.
// It receives only a synthetic per-test marker, returns JSON count/status and never runs as public HTTP.
test('recepción real y lectura autorizada independiente',async({page,request})=>{
 const verifier=process.env.PRIVA_CONTACT_VERIFY_EXECUTABLE;
 if(!verifier)throw new Error('BLOQUEADO 005: falta PRIVA_CONTACT_VERIFY_EXECUTABLE para lectura privada autorizada.');
 const marker='priva-contact-integration-'+Date.now();await page.goto('/contacto.html');await expect(page.getByRole('heading',{name:'Contáctanos',exact:true})).toBeVisible();await page.getByLabel('Nombre o alias',{exact:true}).fill('Alias de integración');await page.getByLabel('Correo electrónico',{exact:true}).fill('integration@example.test');await page.getByLabel('Mensaje',{exact:true}).fill(marker);await page.getByRole('button',{name:'Enviar mensaje',exact:true}).click();await expect(page.locator('[data-contact-status]')).toContainText('quedó guardada');
 const verified=JSON.parse(execFileSync(verifier,[marker],{encoding:'utf8',timeout:30000}));expect(verified).toMatchObject({count:1,status:'Pendiente'});
 for(const p of ['/api/contacto/consultas','/api/contacto/list','/contact.sqlite','/contact.key']){const r=await request.get(p);expect([404,405]).toContain(r.status());expect(await r.text()).not.toContain(marker);}
});
