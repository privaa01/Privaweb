import {test}from'node:test';import assert from'node:assert/strict';import {mkdtempSync,rmSync}from'node:fs';import {tmpdir}from'node:os';import {join}from'node:path';import {createHash,randomBytes}from'node:crypto';import {openAdminRuntime}from'../server/admin/runtime.ts';import {localBootstrap}from'../server/admin/local-bootstrap.ts';import {AdminService}from'../server/admin/service.ts';
test('restricted local bootstrap verifies capability, validates passwords, persists real login and cannot overwrite an account',async()=>{
 const previous=process.env.PRIVA_ADMIN_MODE;process.env.PRIVA_ADMIN_MODE='local';const directory=mkdtempSync(join(tmpdir(),'priva-local-bootstrap-'));let runtime=openAdminRuntime(directory,[]);
 const token=randomBytes(32).toString('base64url'),owner={email:'owner@example.test',verifiedAt:Date.now(),verifiedBy:'google-userinfo' as const,tokenDigest:createHash('sha256').update(token).digest('hex'),expiresAt:Date.now()+60000};
 try{
  const setup=localBootstrap(runtime,owner,'https://localhost:4354');
  await assert.rejects(setup.apply('invalid',{action:'context'}));assert.equal(runtime.repository.findAccount(owner.email),null);
  assert.equal((await setup.apply(token,{action:'context'}) as {email:string}).email,owner.email);
  await assert.rejects(setup.apply(token,{action:'create',password:'short',confirmation:'short'}));assert.equal(runtime.repository.findAccount(owner.email),null);
  await assert.rejects(setup.apply(token,{action:'create',password:'synthetic local testing phrase',confirmation:'synthetic local testing phrase',email:'different@example.test'}));
  await assert.rejects(localBootstrap(runtime,{...owner,expiresAt:Date.now()-1},'https://localhost:4354').apply(token,{action:'context'}));
  const password='Synthetic local '+randomBytes(12).toString('hex');await setup.apply(token,{action:'create',password,confirmation:password});assert.equal(setup.ready(),true);
  await assert.rejects(setup.apply(token,{action:'create',password,confirmation:password}));
  assert.equal(runtime.repository.db.prepare('SELECT count(*) AS n FROM admin_accounts').get()?.n,1);
  runtime.repository.close();runtime=openAdminRuntime(directory,[]);
  const service=new AdminService(runtime.repository,runtime.hasher,runtime.abuseKey);const result=await service.login(owner.email,password,'test-local');assert.equal(result.account.email,owner.email);assert.equal(Boolean(result.token),true);
  await assert.rejects(service.login(owner.email,'incorrect synthetic phrase','test-local'));
  process.env.PRIVA_ADMIN_MODE='production';assert.throws(()=>localBootstrap(runtime,owner,'https://localhost:4354'));
 }finally{runtime.repository.close();rmSync(directory,{recursive:true,force:true});if(previous===undefined)delete process.env.PRIVA_ADMIN_MODE;else process.env.PRIVA_ADMIN_MODE=previous;}
});
