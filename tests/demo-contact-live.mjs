import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('.test-output',{recursive:true});import {randomUUID} from 'node:crypto';
import {chromium,firefox,webkit} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';
import {demoWrite,demoEndpoint,demoContact} from '../demo/src/contact-model.ts';
const base=process.env.PRIVA_DEMO_URL;if(!base)throw Error('PRIVA_DEMO_URL real is required; no fixture fallback.');
if(!process.env.FIREBASE_TOOLS_LIB)throw Error('Set FIREBASE_TOOLS_LIB to the firebase-tools/lib directory for the authenticated operator.');
const req=createRequire(process.env.FIREBASE_TOOLS_LIB+'/index.js');const auth=req('./auth');const {requireAuth}=req('./requireAuth');const {Client}=req('./apiv2');const options={project:'priva-785cb',nonInteractive:true};auth.setActiveAccount(options,auth.getGlobalDefaultAccount());await requireAuth(options);const admin=new Client({urlPrefix:'https://firestore.googleapis.com',apiVersion:'v1'});
const docBase='/projects/priva-785cb/databases/(default)/documents/';
const ids=[];const outcomes=[];const browsers=[];
const valid=()=>demoWrite(randomUUID(),demoContact.aliases[0],demoContact.messages[0],true);
const commit=async payload=>{const r=await fetch(demoEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});return r;};
const getDoc=async id=>(await admin.get(docBase+'demo_contact/'+id)).body;
try{
 const sample=valid();const name=sample.writes[0].update.name;const id=name.split('/').at(-1);ids.push(id);
 let response=await commit(sample);assert.equal(response.status,200);const saved=await getDoc(id);assert.equal(saved.fields.email.stringValue,demoContact.email);assert.ok(saved.fields.createdAt.timestampValue);outcomes.push('valid-create-and-admin-verification');
 for(const [label,mutate] of [
 ['real-email',p=>p.writes[0].update.fields.email.stringValue='person@example.org'],
 ['free-message',p=>p.writes[0].update.fields.message.stringValue='Texto no predefinido'],
 ['free-alias',p=>p.writes[0].update.fields.nameOrAlias.stringValue='Nombre no predefinido'],
 ['extra-field',p=>p.writes[0].update.fields.extra={stringValue:'invalido'}],
 ['missing-confirmation',p=>p.writes[0].update.fields.consent.booleanValue=false],
 ['wrong-mode',p=>p.writes[0].update.fields.mode.stringValue='production'],
 ['wrong-revision',p=>p.writes[0].update.fields.revision.stringValue='unknown'],
 ['fake-time',p=>{p.writes[0].updateTransforms=[];p.writes[0].update.fields.createdAt={timestampValue:'2000-01-01T00:00:00Z'};}],
 ['other-collection',p=>p.writes[0].update.name=p.writes[0].update.name.replace('/demo_contact/','/other_collection/')],
 ['invalid-id',p=>p.writes[0].update.name=p.writes[0].update.name.replace(/[^/]+$/,'invalid-id')],
 ]){const p=valid();mutate(p);const target=p.writes[0].update.name;if(target.includes('/demo_contact/')&&!target.endsWith('/invalid-id'))ids.push(target.split('/').at(-1));const r=await commit(p);assert.equal(r.status,403,label);outcomes.push(label+'-denied');}
 for(const [label,url,method] of [['read','demo_contact/'+id,'GET'],['list','demo_contact','GET'],['delete','demo_contact/'+id,'DELETE']]){const r=await fetch('https://firestore.googleapis.com/v1'+docBase+url,{method});assert.equal(r.status,403,label);outcomes.push(label+'-denied');}
 const update=JSON.parse(JSON.stringify(sample));delete update.writes[0].currentDocument;assert.equal((await commit(update)).status,403);outcomes.push('update-denied');
 for(const [name,type] of Object.entries({chromium,firefox,webkit})){
  const browser=await type.launch(name==='chromium'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{});
  try{const context=await browser.newContext();const page=await context.newPage();const requests=[];page.on('request',r=>{if(r.url()===demoEndpoint)requests.push(r);});await page.goto(base+'/contacto.html');
   await page.locator('[data-demo-contact] button[type=submit]:enabled').waitFor();assert.equal(await page.locator('textarea').count(),0);assert.equal(await page.locator('[name=consent]').isChecked(),false);
   await page.getByRole('button',{name:'Enviar prueba'}).click();assert.equal(requests.length,0);
   await page.locator('[name=consent]').check();const responsePromise=page.waitForResponse(r=>r.url()===demoEndpoint);await page.getByRole('button',{name:'Enviar prueba'}).click();await page.locator('form').evaluate(form=>form.requestSubmit());const result=await responsePromise;assert.equal(result.status(),200);
   await page.getByRole('status').filter({hasText:'Prueba guardada en Firestore.'}).waitFor();assert.equal(requests.length,1);
   const payload=requests[0].postDataJSON();const id=payload.writes[0].update.name.split('/').at(-1);ids.push(id);const doc=await getDoc(id);assert.equal(doc.fields.mode.stringValue,'demo');assert.equal(doc.fields.consent.booleanValue,true);
   assert.equal(await page.getByRole('button',{name:'Enviar prueba'}).isDisabled(),true);
   assert.equal((await new AxeBuilder({page}).analyze()).violations.length,0);
   await page.getByRole('button',{name:'Nueva prueba'}).click();assert.equal(await page.locator('[name=consent]').isChecked(),false);
   await page.setViewportSize({width:390,height:900});await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.deepEqual(await context.cookies(),[]);assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
   browsers.push({name,submit:200,persisted:true,consentRequired:true,noDoubleSubmit:true,noPublicRead:true,axeViolations:0,mobile200NoOverflow:true});
  }finally{await browser.close();}
 }
 console.log(JSON.stringify({rulesChecks:outcomes.length,browsers},null,2));writeFileSync('.test-output/demo-contact-results.json',JSON.stringify({date:new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),rulesChecks:outcomes,browsers},null,2));
}finally{for(const id of ids){try{await admin.delete(docBase+'demo_contact/'+id);}catch(error){if(error.status!==404)throw error;}}console.log('Synthetic test document targets cleaned:',ids.length);}
