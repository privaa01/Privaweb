import test from 'node:test';
import assert from 'node:assert/strict';
import { inboxFixture, receive } from './fixtures/inbox-service/helpers.ts';
import { composeLocalInbox } from '../server/inbox/local.ts';
import { RETENTION } from '../server/privacy/policy.ts';
import { contactSummary } from '../server/stories/contact-summary.ts';

test('local inbox sweeps expiry before admission and on maintenance without extending activity or mail',async()=>{
 const f=await inboxFixture(Date.now());const previous=process.env.PRIVA_ADMIN_MODE;
 let local:ReturnType<typeof composeLocalInbox>|undefined;
 try {
  process.env.PRIVA_ADMIN_MODE='local';
  const now=f.time(),expired=receive(f,'Consulta ficticia vencida'),boundary=receive(f,'Consulta ficticia a un milisegundo de vencer'),fresh=receive(f,'Consulta ficticia vigente');
  f.repo.db.prepare('UPDATE consultations SET receivedAt=?,lastActivityAt=? WHERE id=?').run(new Date(now-RETENTION).toISOString(),new Date(now-RETENTION).toISOString(),expired.id);
  f.repo.db.prepare('UPDATE consultations SET receivedAt=?,lastActivityAt=? WHERE id=?').run(new Date(now-RETENTION+1).toISOString(),new Date(now-RETENTION+1).toISOString(),boundary.id);
  local=composeLocalInbox({repository:f.repository,directory:f.dir,csrfKey:f.csrfKey,origin:'https://localhost:4354'});
  assert.equal(local.repository.db.prepare('SELECT id FROM consultations WHERE id=?').get(expired.id),undefined);
  assert.equal(f.contact.submit(expired.attempt,expired.data).result,'retired');
  assert.deepEqual(local.service.summary(f.token).summary,{total:2,pending:2,responded:0});
  const original=local.service.detail(f.token,fresh.id).consultation.lastActivityAt;
  for(let n=0;n<3;n++) {
   local.service.list(f.token,{status:'Pendiente',cursor:null,limit:25});
   local.service.list(f.token,{status:'Respondido',cursor:null,limit:25});
   local.service.detail(f.token,fresh.id);
  }
  assert.equal(local.service.detail(f.token,fresh.id).consultation.lastActivityAt,original);
  f.setTime(now+1);
  assert.throws(()=>local!.service.detail(f.token,boundary.id));
  assert.equal(local!.service.summary(f.token).summary.total,1);
  assert.deepEqual(contactSummary(local.contactDatabase,f.time()),{state:'available',total:1});
  assert.equal(local.repository.purgeExpired(),1);
  assert.equal(f.contact.submit(boundary.attempt,boundary.data).result,'retired');
  assert.equal(local.repository.db.prepare('SELECT count(*) n FROM consultations').get()!.n,1);
  assert.equal(local.repository.db.prepare('PRAGMA foreign_key_check').all().length,0);
  assert.equal(local.repository.db.prepare('PRAGMA integrity_check').get()!.integrity_check,'ok');
  assert.equal('worker' in local,false);assert.equal(f.mail.calls,0);
 } finally {
  local?.repository.close();
  if(previous===undefined)delete process.env.PRIVA_ADMIN_MODE;else process.env.PRIVA_ADMIN_MODE=previous;
  f.cleanup();
 }
});
