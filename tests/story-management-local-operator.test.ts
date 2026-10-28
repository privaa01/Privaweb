import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,realpathSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {openLocalStories} from '../server/stories/development.ts';
import {localStoryOperator} from '../server/stories/local-operator.ts';
import {emptyDraft} from '../src/lib/story-management-contract.ts';

test('private local operator creates disabled audit actor without weakening web session authorization',()=>{
 const directory=mkdtempSync(join(realpathSync(tmpdir()),'priva-local-operator-'));
 const runtime=openLocalStories(directory,resolve('.'),'http://127.0.0.1:4321');
 const previous=process.env.PRIVA_STORIES_MODE;
 try{
  delete process.env.PRIVA_STORIES_MODE;
  assert.throws(()=>localStoryOperator(runtime.repository.admin,runtime.media.directory),/explicit local mode/);
  process.env.PRIVA_STORIES_MODE='local';
  const operator=localStoryOperator(runtime.repository.admin,runtime.media.directory);
  const account=runtime.repository.admin.accountById(operator.actorId)!;
  assert.equal(account.authorized,false);assert.equal(account.passwordRecord,null);assert.equal(account.mailboxVerifiedAt,null);
  assert.throws(()=>operator.service.authorize('other'));
  assert.throws(()=>runtime.service.authorize(operator.token));
  const receipt=operator.service.change(operator.token,'create',null,{operationId:randomUUID(),working:emptyDraft()});
  assert.equal(operator.service.get(operator.token,receipt.storyId).id,receipt.storyId);
  assert.deepEqual(runtime.service.catalog().stories,[]);
 }finally{
  if(previous===undefined)delete process.env.PRIVA_STORIES_MODE;else process.env.PRIVA_STORIES_MODE=previous;
  runtime.close();rmSync(directory,{recursive:true,force:true});
 }
});
