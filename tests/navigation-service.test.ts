import test from 'node:test';
import assert from 'node:assert/strict';
import {bank} from './fixtures/admin-service/http-bank.ts';
import {navigationPrivateContract as contract} from './helpers/navigation-private-contract.ts';
test('G05 real006 handler protects private documents GET/HEAD, no session or forged cookie',async()=>{
 const f=await bank();try{
 for(const path of contract.deniedDocuments)for(const method of ['GET','HEAD'])for(const cookie of ['', '__Host-priva_session=invalid-session']){
 const r=await fetch(f.base+path,{method,headers:cookie?{cookie}:{},redirect:'manual'});
 assert.equal(r.status,contract.unauthenticated.status);assert.equal(r.headers.get('location'),null);assert.equal(r.headers.get('cache-control'),'no-store');assert.match(r.headers.get('content-type')??'',/application\/json/);
 const body=await r.text();if(method==='HEAD')assert.equal(body,'');else assert.deepEqual(JSON.parse(body),{result:contract.unauthenticated.result});
 }
 }finally{await f.close();}
});
test('G05 session API: actual401 JSON with required header;403 without, no static fallback',async()=>{
 const f=await bank();try{
 for(const withHeader of [false,true]){
 const r=await fetch(f.base+contract.session,{headers:withHeader?{'x-priva-request':'1'}:{},redirect:'manual'});
 const expected=withHeader?contract.unauthenticated:contract.missingRequestHeader;
 assert.equal(r.status,expected.status);assert.deepEqual(await r.json(),{result:expected.result});assert.equal(r.headers.get('referrer-policy'),'no-referrer');
 }
 }finally{await f.close();}
});
