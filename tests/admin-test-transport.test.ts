import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,chmodSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {get} from 'node:https';
import {testTransport} from './fixtures/admin-service/transport.ts';
test('HTTP compatibility and incomplete TLS configuration fail closed',()=>{
 assert.equal(testTransport({}).origin,'http://localhost:4329');
 assert.throws(()=>testTransport({PRIVA_ADMIN_TEST_TLS_CERT:'/missing'}),/both/);
});
test('TLS enforces private key permissions and validates trust without a bypass',async()=>{
 const directory=mkdtempSync(join(tmpdir(),'priva-admin-tls-'));chmodSync(directory,0o700);
 const cert=join(directory,'cert.pem'),key=join(directory,'key.pem');
 try{
  execFileSync('/usr/bin/openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost','-keyout',key,'-out',cert],{stdio:'ignore'});chmodSync(key,0o600);
  const env={PRIVA_ADMIN_TEST_TLS_CERT:cert,PRIVA_ADMIN_TEST_TLS_KEY:key};
  chmodSync(key,0o644);assert.throws(()=>testTransport(env),/permissions/);chmodSync(key,0o600);
  assert.throws(()=>testTransport({...env,PRIVA_ADMIN_TEST_TLS_KEY:cert}),/permissions|PEM|unsupported|decoder/i);
  const transport=testTransport(env);assert.equal(transport.origin,'https://localhost:4329');
  const server=transport.listen((_req,res)=>{res.end('ok');});await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
   const address=server.address();assert.ok(address&&typeof address!=='string');
   const request=(ca?:Buffer)=>new Promise<string>((resolve,reject)=>get({hostname:'localhost',family:4,port:address.port,ca},res=>{let data='';res.on('data',chunk=>data+=chunk);res.on('end',()=>resolve(data));}).on('error',reject));
   await assert.rejects(request(),/self.signed/i);
   assert.equal(await request(readFileSync(cert)),'ok');
  }finally{await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));}
 }finally{rmSync(directory,{recursive:true,force:true});}
});
