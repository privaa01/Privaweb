import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,realpathSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {openSyntheticContact,assertSyntheticOrigin,isLocalContactRequest} from '../server/contact/development.ts';

test('MVP refuses non-loopback origins and forged Host/remote connections',()=>{
 for(const origin of ['https://priva.example','http://0.0.0.0:4321','http://127.0.0.1:4321/path','http://user@127.0.0.1:4321'])assert.throws(()=>assertSyntheticOrigin(origin));
 assert.doesNotThrow(()=>assertSyntheticOrigin('http://127.0.0.1:4321'));
 assert.equal(isLocalContactRequest('127.0.0.1:4321','127.0.0.1','http://127.0.0.1:4321'),true);
 assert.equal(isLocalContactRequest('evil.example','127.0.0.1','http://127.0.0.1:4321'),false);
 assert.equal(isLocalContactRequest('127.0.0.1:4321','192.168.1.2','http://127.0.0.1:4321'),false);
});
test('MVP rejects non-test email durably; valid local data survives restart and replay never duplicates',()=>{
 const dir=mkdtempSync(join(realpathSync(tmpdir()),'priva005-dev-'));
 let runtime=openSyntheticContact(dir,resolve('.'));
 try{
  const a=runtime.service.issue();
  assert.deepEqual(runtime.service.submit({...a,nameOrAlias:'Alias ficticio',email:'persona@example.com',message:'Mensaje ficticio'}),{result:'not_stored',attemptId:a.attemptId,errors:{email:'format'}});
  assert.equal(runtime.repository.db.prepare('SELECT count(*) n FROM consultations').get()!.n,0);
  assert.equal(runtime.service.submit({...a,nameOrAlias:'Alias ficticio',email:'prueba@example.test',message:'Mensaje ficticio'}).result,'retired');
  const b=runtime.service.issue();const payload={...b,nameOrAlias:'Alias ficticio',email:'prueba@example.test',message:'Mensaje ficticio'};
  assert.equal(runtime.service.submit(payload).result,'stored');runtime.repository.close();
  runtime=openSyntheticContact(dir,resolve('.'));
  assert.equal(runtime.service.submit(payload).result,'stored');
  assert.equal(runtime.repository.db.prepare('SELECT count(*) n FROM consultations').get()!.n,1);
 }finally{runtime.repository.close();rmSync(dir,{recursive:true,force:true});}
});
test('MVP refuses private storage inside the project/static roots',()=>{
 const root=mkdtempSync(join(realpathSync(tmpdir()),'priva005-root-'));
 try{assert.throws(()=>openSyntheticContact(join(root,'private'),root),/static root/);}finally{rmSync(root,{recursive:true,force:true});}
});
test('synthetic development flag never qualifies the production publication gate',()=>{
 const result=spawnSync(process.execPath,['scripts/require-contact-publication.mjs'],{env:{...process.env,PRIVA_CONTACT_TEST_MODE:'synthetic'},encoding:'utf8'});
 assert.equal(result.status,1);
 assert.match(result.stderr,/BLOQUEADO 005/);
});
