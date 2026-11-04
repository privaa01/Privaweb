import {test}from'node:test';import assert from'node:assert/strict';import {spawn,execFileSync,type ChildProcess}from'node:child_process';import {createServer as netServer}from'node:net';import {mkdtempSync,writeFileSync,readFileSync,rmSync,chmodSync}from'node:fs';import {tmpdir}from'node:os';import {resolve,join}from'node:path';import {randomBytes,createHash,randomUUID}from'node:crypto';import {request}from'node:https';import {emptyDraft}from'../src/lib/story-management-contract.ts';
import {SqliteContactRepository} from '../server/contact/sqlite-repository.ts';
import {AttemptTokens} from '../server/contact/attempt-token.ts';
test('local HTTPS setup, real login, media inspection, publication, persistence and logout without Firebase changes',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'priva-local-e2e-')),token=randomBytes(32).toString('base64url'),password='Synthetic local '+randomBytes(12).toString('hex'),email='local-test@example.test';
 const probe=netServer();await new Promise<void>(r=>probe.listen(0,'127.0.0.1',r));const address=probe.address();assert.ok(address&&typeof address!=='string');const port=address.port;await new Promise<void>(r=>probe.close(()=>r()));const origin='https://localhost:'+port;
 const cert=join(dir,'localhost.pem'),key=join(dir,'localhost-key.pem');execFileSync('/usr/bin/openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost','-keyout',key,'-out',cert],{stdio:'ignore'});chmodSync(key,0o600);
 const config=join(dir,'local.json');writeFileSync(config,JSON.stringify({directory:dir,origin,certificate:cert,key,owner:{email,verifiedAt:Date.now(),verifiedBy:'google-userinfo',expiresAt:Date.now()+60000,tokenDigest:createHash('sha256').update(token).digest('hex')}}),{mode:0o600});
 let startupError='';let child:ChildProcess|undefined;const cookies=new Map<string,string>();
 async function call(path:string,method='GET',body?:unknown,extra:Record<string,string>={}){return await new Promise<{status:number;body:any;headers:Record<string,unknown>}>((resolveRequest,reject)=>{
  const req=request({hostname:'localhost',family:4,port,path,method,ca:readFileSync(cert),headers:{Origin:origin,'X-Priva-Request':'1',...(body?{'Content-Type':Buffer.isBuffer(body)?'application/octet-stream':'application/json'}:{}),Cookie:[...cookies].map(([k,v])=>k+'='+v).join('; '),...extra}},res=>{for(const row of res.headers['set-cookie']??[]){const [key,...value]=row.split(';')[0].split('=');if(value.join('='))cookies.set(key,value.join('='));else cookies.delete(key);}let text='';res.on('data',chunk=>text+=chunk);res.on('end',()=>{let value;try{value=JSON.parse(text);}catch{value=text;}resolveRequest({status:res.statusCode!,body:value,headers:res.headers});});});req.setTimeout(30000,()=>req.destroy(Error('Local request timed out')));req.on('error',reject);if(body)req.write(Buffer.isBuffer(body)?body:JSON.stringify(body));req.end();
 });}
 async function start(){child=spawn(process.execPath,['server/admin/local.ts'],{env:{...process.env,PRIVA_ADMIN_MODE:'local',PRIVA_ADMIN_LOCAL_CONFIG:config},stdio:['ignore','ignore','pipe']});child.stderr?.on('data',chunk=>startupError+=String(chunk));for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error('Local server failed to start: '+startupError.split('\n').filter(line=>line.includes('Error:')).join(' ').slice(0,200));try{if((await call('/api/local/estado')).status===200)return;}catch{}await new Promise(r=>setTimeout(r,50));}throw Error('Local server did not become ready');}
 async function stop(){if(child&&child.exitCode===null){const done=new Promise<void>(r=>child!.once('exit',()=>r()));child.kill('SIGTERM');await done;}child=undefined;}
 try{
  await start();assert.equal((await call('/admin')).status,401);assert.equal((await call('/admin/contacto')).status,401);assert.equal((await call('/api/admin/contacto/resumen')).status,401);assert.equal((await call('/api/local/configuracion','POST',{action:'context'})).status,403);
  const auth={'X-Priva-Setup':token};assert.equal((await call('/api/local/configuracion','POST',{action:'context'},auth)).status,200);
  assert.equal((await call('/api/local/configuracion','POST',{action:'create',password,confirmation:password},{...auth,Origin:'https://wrong.invalid'})).status,403);
  assert.equal((await call('/api/local/configuracion','POST',{action:'create',password,confirmation:password},auth)).status,200);
  assert.equal((await call('/api/local/configuracion','POST',{action:'create',password,confirmation:password},auth)).status,410);
  const context=await call('/api/admin/contexto');assert.equal(context.status,200);assert.equal((await call('/api/admin/acceso','POST',{email,password},{'X-CSRF-Token':context.body.csrfToken})).status,200);
  assert.equal((await call('/admin')).status,200);const session=await call('/api/admin/sesion');assert.equal(session.status,200);const csrf={'X-CSRF-Token':session.body.csrfToken};
  assert.equal((await call('/admin/contacto')).status,200);
  assert.deepEqual((await call('/api/admin/contacto/resumen')).body.summary,{total:0,pending:0,responded:0});
  const contact=new SqliteContactRepository(join(dir,'contact.sqlite'),new AttemptTokens(readFileSync(join(dir,'contact.key'))));
  let consultationId='';
  try {
   assert.equal(contact.submit(contact.tokens.issue(),{nameOrAlias:'Persona de prueba',email:'consulta@example.test',message:'Consulta ficticia para verificar la bandeja local.'}).result,'stored');
   consultationId=String(contact.db.prepare('SELECT id FROM consultations').get()!.id);
  } finally {contact.close();}
  const pending={status:'Pendiente',cursor:null,limit:25};
  assert.equal((await call('/api/admin/contacto/listado','POST',pending)).status,403);
  assert.equal((await call('/api/admin/contacto/listado','POST',pending,{...csrf,Origin:'https://wrong.invalid'})).status,403);
  const inboxList=await call('/api/admin/contacto/listado','POST',pending,csrf);
  assert.equal(inboxList.status,200);assert.equal(inboxList.headers['cache-control'],'no-store');assert.equal(inboxList.body.items.length,1);
  assert.equal(inboxList.body.items[0].email,'consulta@example.test');
  assert.deepEqual(inboxList.body.summary,{total:1,pending:1,responded:0});
  assert.equal((await call('/api/admin/contacto/listado','POST',{...pending,status:'Respondido'},csrf)).body.items.length,0);
  const consultation=(await call('/api/admin/contacto/consultas/'+consultationId)).body.consultation;
  const blockedReply=await call('/api/admin/contacto/consultas/'+consultationId+'/respuestas','POST',{operationId:randomUUID(),expectedRevision:consultation.revision,reviewedRevision:consultation.revision,text:'Respuesta que nunca debe enviarse.',retryOf:null},csrf);
  assert.equal(blockedReply.status,503);assert.equal(blockedReply.body.code,'mail_unavailable');
  assert.equal((await call('/api/admin/contacto/consultas/'+consultationId+'/historial','POST',{cursor:null,limit:25},csrf)).body.replies.length,0);
  assert.equal((await call('/api/admin/contacto/consultas/'+consultationId)).body.consultation.revision,consultation.revision);
  assert.equal((await call('/contact.sqlite')).status,404);assert.equal((await call('/api/contacto/intento')).status,404);
  const created=await call('/api/admin/historias','POST',{operationId:randomUUID(),working:{...emptyDraft(),title:'Historia local de prueba'}},csrf);assert.ok([200,201].includes(created.status));
  const list=await call('/api/admin/historias');assert.equal(list.body.stories.length,1);const row=list.body.stories[0];assert.equal(row.title,'Historia local de prueba');assert.equal((await call('/api/public/historias')).body.stories.length,0);
  assert.deepEqual(list.body.summary.contact,{state:'available',total:1});
  const updated=await call('/api/admin/historias/'+row.id,'PUT',{operationId:randomUUID(),expectedRevision:row.revision,working:{...emptyDraft(),title:'Historia editada local',category:'Educativa'}},csrf);assert.equal(updated.status,200);
  await stop();await start();const persisted=await call('/api/admin/historias');assert.equal(persisted.status,200);assert.equal(persisted.body.stories[0].title,'Historia editada local');
  assert.equal((await call('/api/admin/contacto/consultas/'+consultationId)).body.consultation.message,'Consulta ficticia para verificar la bandeja local.');
  assert.deepEqual((await call('/api/admin/contacto/resumen')).body.summary,{total:1,pending:1,responded:0});
  const imageId=randomUUID(),audioId=randomUUID();
  assert.equal((await call('/api/admin/historias/'+row.id+'/recursos/'+imageId,'PUT',readFileSync('public/images/stories/llamada.png'),{...csrf,'Content-Type':'image/png','X-Resource-Kind':'image'})).status,201);
  assert.equal((await call('/api/admin/historias/'+row.id+'/recursos/'+audioId,'PUT',readFileSync('content/stories/audio/hidtoria_cuatro_editada.mp3.mpeg'),{...csrf,'Content-Type':'audio/mpeg','X-Resource-Kind':'audio'})).status,201);
  const official=JSON.parse(readFileSync('content/stories/drafts/numero-desconocido.json','utf8'));let detail=(await call('/api/admin/historias/'+row.id)).body;
  assert.equal((await call('/api/admin/historias/'+row.id,'PUT',{operationId:randomUUID(),expectedRevision:detail.revision,working:{...official,imageResourceId:imageId,imageAlt:'Teléfono recibiendo una llamada de un número desconocido.',audioResourceId:audioId}},csrf)).status,200);
  detail=(await call('/api/admin/historias/'+row.id)).body;assert.equal((await call('/api/admin/historias/'+row.id+'/publicar','POST',{operationId:randomUUID(),expectedRevision:detail.revision},csrf)).status,200);
  detail=(await call('/api/admin/historias/'+row.id)).body;assert.equal((await call('/api/admin/historias/'+row.id+'/activacion','POST',{operationId:randomUUID(),expectedRevision:detail.revision,active:true},csrf)).status,200);
  const published=(await call('/api/public/historias')).body;
  assert.equal(published.stories.length,1);
  assert.deepEqual((await call('/demo/catalog.json')).body,published);
  const audioPath=published.stories[0].audio.src;
  const range=await call(audioPath,'GET',undefined,{Range:'bytes=0-15'});
  assert.equal(range.status,206);assert.equal(range.headers['content-length'],'16');
  // Saving private changes must not replace the active public snapshot, even after restart.
  detail=(await call('/api/admin/historias/'+row.id)).body;
  assert.equal((await call('/api/admin/historias/'+row.id,'PUT',{operationId:randomUUID(),expectedRevision:detail.revision,working:{...detail.working,title:'Cambios privados pendientes'}},csrf)).status,200);
  assert.deepEqual((await call('/api/public/historias')).body,published);
  await stop();await start();
  detail=(await call('/api/admin/historias/'+row.id)).body;
  assert.equal(detail.working.title,'Cambios privados pendientes');assert.equal(detail.pendingChanges,true);
  assert.deepEqual((await call('/api/public/historias')).body,published);
  detail=(await call('/api/admin/historias/'+row.id)).body;assert.equal((await call('/api/admin/historias/'+row.id+'/activacion','POST',{operationId:randomUUID(),expectedRevision:detail.revision,active:false},csrf)).status,200);assert.equal((await call('/api/public/historias')).body.stories.length,0);
  assert.equal((await call(audioPath)).status,404);
  detail=(await call('/api/admin/historias/'+row.id)).body;
  assert.equal((await call('/api/admin/historias/'+row.id+'/activacion','POST',{operationId:randomUUID(),expectedRevision:detail.revision,active:true},csrf)).status,200);
  assert.deepEqual((await call('/api/public/historias')).body,published);
  const renewed=await call('/api/admin/sesion');assert.equal((await call('/api/admin/salir','POST',{}, {'X-CSRF-Token':renewed.body.csrfToken})).status,200);assert.equal((await call('/admin')).status,401);
  const privateAfterLogout=await call('/api/admin/contacto/consultas/'+consultationId);assert.equal(privateAfterLogout.status,401);assert.ok(!JSON.stringify(privateAfterLogout.body).includes('consulta@example.test'));
 }finally{await stop();rmSync(dir,{recursive:true,force:true});}
});
