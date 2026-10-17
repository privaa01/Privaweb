import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDownloads, type DownloadConfig } from '../src/lib/app-downloads.ts';
const today='2026-10-17';
function verified(platform:'android'|'iphone'):DownloadConfig{const url=`https://downloads.priva.test/${platform}?id=priva#details`;return{platform,status:'verificado',candidateURL:url,verification:{reviewedURL:url,platform,decisionReference:'TEST review',checkedAt:'2026-10-16',appIdentity:'Priva App',accessibleAtReview:true}};}
function pair(){return[verified('android'),verified('iphone')];}
for(const mask of ['00','10','01','11'])test(`independent availability ${mask}`,()=>{const c=pair();c.forEach((v,i)=>{if(mask[i]==='0')v.status='pendiente';});const out=resolveDownloads(c,today);assert.equal(out.length,2);out.forEach((v,i)=>{assert.equal(v.state,mask[i]==='1'?'available':'pending');if(v.state==='available')assert.equal(v.href,c[i].candidateURL);else assert.deepEqual(Object.keys(v).sort(),['label','platform','state']);});});
for(const url of [null,'','/download','#','javascript:x','data:x','http://downloads.priva.test/a','https://u:p@downloads.priva.test/a','https://downloads.priva.test/a b','https://downloads.priva.test/\na','https:downloads.priva.test/a','https://'])test(`invalid URL ${JSON.stringify(url)} stays pending, other unaffected`,()=>{const c=pair();c[0].candidateURL=url;c[0].verification!.reviewedURL=url||'';assert.equal(resolveDownloads(c,today)[0].state,'pending');assert.equal(resolveDownloads(c,today)[1].state,'available');});
for(const [name,change] of [
 ['different URL',(v:DownloadConfig)=>v.verification!.reviewedURL+='other'],['different platform',(v:DownloadConfig)=>v.verification!.platform='iphone'],
 ['missing review',(v:DownloadConfig)=>v.verification=null],['empty reference',(v:DownloadConfig)=>v.verification!.decisionReference=' '],
 ['future date',(v:DownloadConfig)=>v.verification!.checkedAt='2026-10-18'],['invalid date',(v:DownloadConfig)=>v.verification!.checkedAt='2026-02-30'],
 ['missing date',(v:DownloadConfig)=>v.verification!.checkedAt=''],['other app',(v:DownloadConfig)=>v.verification!.appIdentity='Another app'],['inaccessible',(v:DownloadConfig)=>v.verification!.accessibleAtReview=false],
] as const)test(`reject verification: ${name}`,()=>{const c=pair();change(c[0]);assert.equal(resolveDownloads(c,today)[0].state,'pending');assert.equal(resolveDownloads(c,today)[1].state,'available');});
test('changing URL or withdrawing approval independently revokes',()=>{const c=pair();c[0].candidateURL='https://downloads.priva.test/changed';assert.equal(resolveDownloads(c,today)[0].state,'pending');c[1].status='pendiente';assert.equal(resolveDownloads(c,today)[1].state,'pending');});
test('missing, duplicate and malformed records fail safely per platform',()=>{const c=pair();assert.equal(resolveDownloads([c[0],c[0],c[1]],today)[0].state,'pending');assert.equal(resolveDownloads([c[0],c[0],c[1]],today)[1].state,'available');assert.equal(resolveDownloads([c[1]],today)[0].state,'pending');assert.equal(resolveDownloads(null,today).length,2);assert.equal(resolveDownloads([{platform:'android'},null],today)[0].state,'pending');});
