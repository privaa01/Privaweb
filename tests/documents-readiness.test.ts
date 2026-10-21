import test from 'node:test';import assert from 'node:assert/strict';import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {createHash} from 'node:crypto';
import {privacyScopes} from '../src/config/privacy.ts';import {evidenceIssues} from '../server/privacy/readiness.ts';
function fixture(){const dir=mkdtempSync(join(tmpdir(),'priva010-evidence-'));const now=Date.now(),revision='synthetic',expected='a'.repeat(64);const verifiedAt=new Date(now-1000).toISOString(),expiresAt=new Date(now+60000).toISOString();const refs:any={};const payloads:any={};
 for(const scope of privacyScopes){const path=join(dir,scope+'.json');const payload={kind:'production',scope,revision,verifiedAt,expiresAt,result:'pass',synthetic:false,...(scope==='notices'?{bundleHash:expected}:{})};payloads[scope]=payload;const bytes=JSON.stringify(payload);writeFileSync(path,bytes);refs[scope]={path,sha256:createHash('sha256').update(bytes).digest('hex'),kind:'production',scope,revision,verifiedAt,expiresAt};}
 return{dir,now,revision,expected,refs,payloads,update:()=>{const bytes=JSON.stringify(payloads.notices);writeFileSync(refs.notices.path,bytes);refs.notices.sha256=createHash('sha256').update(bytes).digest('hex');},close:()=>rmSync(dir,{recursive:true,force:true})};}
// Positive examples use synthetic unit data; these objects are never installed as real configuration.
test('V11 notices binds exact bundle as well as revision, hash, expiry and all scopes',()=>{const f=fixture();try{
 // @ts-ignore optional expected bundle parameter introduced by010
 assert.deepEqual(evidenceIssues(f.refs,f.revision,f.now,f.expected),[]);
 f.payloads.notices.bundleHash='b'.repeat(64);f.update();
 // @ts-ignore same interface
 assert(evidenceIssues(f.refs,f.revision,f.now,f.expected).includes('privacy:notices'));
 }finally{f.close();}});
for(const mutation of ['missing','synthetic','future','expired','revision','bytes','other-scope'])test('V11 reject '+mutation,()=>{const f=fixture();try{
 if(mutation==='missing')delete f.payloads.notices.bundleHash;
 if(mutation==='synthetic')f.payloads.notices.synthetic=true;
 if(mutation==='future')f.payloads.notices.verifiedAt=new Date(f.now+10000).toISOString();
 if(mutation==='expired')f.payloads.notices.expiresAt=new Date(f.now-1).toISOString();
 if(mutation==='revision')f.payloads.notices.revision='other';
 if(mutation==='other-scope')f.refs.policy=null;
 f.update();if(mutation==='bytes')writeFileSync(f.refs.notices.path,'altered');
 // @ts-ignore expected bundle introduced by010
 assert(evidenceIssues(f.refs,f.revision,f.now,f.expected).length>0);
 }finally{f.close();}});
