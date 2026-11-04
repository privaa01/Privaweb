import test from 'node:test';
import assert from 'node:assert/strict';
import { inboxFixture, receive } from './fixtures/inbox-service/helpers.ts';
import { seedLocalInboxExamples, removeLocalInboxExamples } from '../server/inbox/local-demo.ts';

test('explicit local examples show both filters and history without mail, sessions or duplicates',async()=>{
 const f=await inboxFixture();const previous=process.env.PRIVA_ADMIN_MODE;
 try {
  delete process.env.PRIVA_ADMIN_MODE;
  assert.throws(()=>seedLocalInboxExamples(f.repo),/local mode/);
  process.env.PRIVA_ADMIN_MODE='local';
  const existing=receive(f,'Otra consulta sintética que debe conservarse');
  const sessions=f.repository.db.prepare('SELECT count(*) n FROM admin_sessions').get()!.n;
  const result=seedLocalInboxExamples(f.repo);assert.equal(result.inserted,2);
  assert.equal(seedLocalInboxExamples(f.repo).inserted,0);
  const pending=f.service.list(f.token,{status:'Pendiente',cursor:null,limit:25});
  const answered=f.service.list(f.token,{status:'Respondido',cursor:null,limit:25});
  assert.equal(pending.items.length,2);assert.equal(answered.items.length,1);
  assert.equal(f.service.detail(f.token,result.examples[1]).replies.length,1);
  assert.match(f.service.detail(f.token,result.examples[1]).replies[0].text,/FICTICIA, NO ENVIADA/);
  assert.equal(f.service.detail(f.token,existing.id).consultation.message,'Otra consulta sintética que debe conservarse');
  assert.equal(f.repo.db.prepare("SELECT count(*) n FROM reply_operations WHERE state IN('queued','dispatching','unknown')").get()!.n,0);
  assert.equal(f.repository.db.prepare('SELECT count(*) n FROM admin_sessions').get()!.n,sessions);
  assert.equal(await f.worker.tick(),false);assert.equal(f.mail.calls,0);
  assert.equal(removeLocalInboxExamples(f.repo).removed,2);
  assert.equal(removeLocalInboxExamples(f.repo).removed,0);
  assert.equal(f.service.summary(f.token).summary.total,1);
  assert.equal(f.service.detail(f.token,existing.id).consultation.message,'Otra consulta sintética que debe conservarse');
  assert.equal(f.repo.db.prepare('SELECT count(*) n FROM reply_responses').get()!.n,0);
  assert.equal(f.repo.db.prepare('SELECT count(*) n FROM reply_operations').get()!.n,0);
 } finally {
  if(previous===undefined)delete process.env.PRIVA_ADMIN_MODE;else process.env.PRIVA_ADMIN_MODE=previous;
  f.cleanup();
 }
});
