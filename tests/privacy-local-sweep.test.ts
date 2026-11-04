import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {join,resolve} from 'node:path';
import {writeFileSync,readFileSync,readdirSync,existsSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {inboxFixture,receive} from './fixtures/inbox-service/helpers.ts';
import {sharedLock} from '../server/privacy/maintenance.ts';
import {RETENTION} from '../server/privacy/policy.ts';

test('approved no-backup local sweep requires drained writers, removes expired bytes and preserves live data',async()=>{
 const f=await inboxFixture(Date.now());
 try {
  const expired=receive(f,'UNIQUE_LOCAL_SWEEP_PRIVATE_MARKER'),live=receive(f,'Consulta ficticia vigente');
  const date=new Date(Date.now()-RETENTION-10000).toISOString();
  f.repo.db.prepare('UPDATE consultations SET receivedAt=?,lastActivityAt=? WHERE id=?').run(date,date,expired.id);
  writeFileSync(join(f.dir,'privacy-local-settings.json'),JSON.stringify({backups:false,mail:false,retentionDays:90,execution:'computer'}),{mode:0o600});
  const path=join(f.dir,'contact.sqlite'),lock=path+'.maintenance.lock';
  const run=()=>spawnSync(process.execPath,[resolve('scripts/privacy-local-sweep.ts'),f.dir],{env:{...process.env,PRIVA_ADMIN_MODE:'local'},encoding:'utf8',timeout:10000});
  const release=await sharedLock(lock);
  try{assert.notEqual(run().status,0);}finally{await release();}
  f.repo.close();f.contact.close();
  const result=run();assert.equal(result.status,0,result.stderr);
  const db=new DatabaseSync(path);
  try {
   assert.equal(db.prepare('SELECT id FROM consultations WHERE id=?').get(expired.id),undefined);
   assert.ok(db.prepare('SELECT id FROM consultations WHERE id=?').get(live.id));
   assert.equal(db.prepare('SELECT state FROM attempts WHERE attemptId=?').get(expired.attempt.attemptId)!.state,'REVOKED');
   assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
  }finally{db.close();}
  for(const file of [path,path+'-wal'])if(existsSync(file))assert.ok(!readFileSync(file).includes(Buffer.from(expired.data.message)));
  assert.ok(!readdirSync(f.dir).some(name=>/backup|\.manifest$/.test(name)));
  assert.equal(run().status,0);
 }finally{f.cleanup();}
});
