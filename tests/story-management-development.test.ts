import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,statSync} from 'node:fs';
import {realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {openLocalStories,localStoriesDirectory} from '../server/stories/development.ts';
import {randomToken,digest} from '../server/admin/sessions.ts';
import {PasswordHasher} from '../server/admin/password.ts';
import {emptyDraft} from '../src/lib/story-management-contract.ts';

test('local007 persists drafts privately without publishing or provisioning accounts',async()=>{
 const directory=mkdtempSync(join(realpathSync(tmpdir()),'priva-stories-dev-test-'));
 let runtime=openLocalStories(directory,resolve('.'),'http://127.0.0.1:4321');
 try {
  assert.deepEqual(runtime.service.catalog(),{schemaVersion:1,stories:[]});
  assert.equal(runtime.repository.admin.db.prepare('SELECT count(*) AS n FROM admin_accounts').get()!.n,0);
  // Test-only actor: the development runtime never provisions an account itself.
  const account=runtime.repository.admin.createAccount('local@example.test');
  const record=await new PasswordHasher().hash('synthetic private phrase 2026');
  runtime.repository.admin.db.prepare('UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=? WHERE id=?').run(JSON.stringify(record),Date.now(),account.id);
  const token=randomToken();
  runtime.repository.admin.createSession(account.id,account.credentialVersion,digest(token));
  const receipt=runtime.service.change(token,'create',null,{operationId:randomUUID(),working:emptyDraft()});
  assert.deepEqual(runtime.service.catalog().stories,[]);
  runtime.close();
  runtime=openLocalStories(directory,resolve('.'),'http://127.0.0.1:4321');
  assert.equal(runtime.repository.all()[0].id,receipt.storyId);
  assert.deepEqual(runtime.service.catalog().stories,[]);
  assert.equal(statSync(join(directory,'admin.sqlite')).mode&0o077,0);
 }finally{runtime.close();rmSync(directory,{recursive:true,force:true});}
});

test('local007 rejects storage in checkout and separates roots',()=>{
 assert.throws(()=>openLocalStories(resolve('.test-output/private-stories'),resolve('.'),'http://127.0.0.1:4321'),/Private directory/);
 assert.notEqual(localStoriesDirectory('/tmp/one'),localStoriesDirectory('/tmp/two'));
});
