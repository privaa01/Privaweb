import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,mkdirSync,writeFileSync,rmSync,symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { appContent } from '../src/content/app.ts';
import { appPublicationIssues,contentSnapshot,imageSnapshot } from '../src/lib/app-publication.ts';
import { fixtureDownloads } from './fixtures/app/src/content.ts';
const today='2026-10-17',root=mkdtempSync(join(tmpdir(),'priva-app004-'));
mkdirSync(join(root,'images/app'),{recursive:true});writeFileSync(join(root,'images/app/official.svg'),'<svg/>');process.on('exit',()=>rmSync(root,{recursive:true,force:true}));
function approved(){const c=structuredClone(appContent);for(const img of[c.hero.image,c.overview.image,c.downloads.image,c.brand]){Object.assign(img,{src:'/images/app/official.svg',width:640,height:480,status:'verificado',alt:'Representación del prototipo de prueba',sourceReference:'TEST ONLY image',compatibleStates:['00','10','01','11']});img.review={status:'revisado',decisionReference:'TEST ONLY review',reviewedValue:imageSnapshot(img)};}for(const v of Object.values(c.visual))Object.assign(v,{status:'verificado',sourceReference:'TEST ONLY visual'});c.review={status:'revisado',decisionReference:'TEST ONLY copy',reviewedValue:contentSnapshot(c)};return c;}
for(const mask of['00','10','01','11'])test(`complete synthetic metadata passes validator with ${mask}, never approves actual materials`,()=>assert.deepEqual(appPublicationIssues(approved(),fixtureDownloads(mask),root,today),[]));
test('pending production fails for materials, not for missing official download URL',()=>{const issues=appPublicationIssues(appContent,[{platform:'android',status:'pendiente',candidateURL:null,verification:null},{platform:'iphone',status:'pendiente',candidateURL:null,verification:null}],root,today);assert.ok(issues.length>0);assert.ok(issues.every(i=>!i.startsWith('descargas:')));});
for(const [name,change] of[
 ['testOnly',(c:any)=>c.testOnly=true],['missing resource',(c:any)=>c.hero.image.src=''],['missing file',(c:any)=>c.hero.image.src='/images/app/missing.svg'],
 ['dimensions',(c:any)=>c.overview.image.width=0],['alternative',(c:any)=>c.overview.image.alt=''],['source',(c:any)=>c.brand.sourceReference=''],
 ['pending review',(c:any)=>c.review.status='pendiente'],['changed copy',(c:any)=>c.hero.description+=' changed'],['A07',(c:any)=>c.downloads.note='Gratis'],
 ['changed option title',(c:any)=>c.overview.benefits[0].title='changed'],['missing step',(c:any)=>c.steps.items.pop()],['operation notice',(c:any)=>c.hero.notice=''],
 ['incompatible mockup',(c:any)=>c.downloads.image.compatibleStates=['11']],['changed image review',(c:any)=>c.downloads.image.alt+=' changed'],
 ['visual',(c:any)=>c.visual.palette.status='pendiente'],['traversal',(c:any)=>c.hero.image.src='/images/app/../x.svg'],['prototype alt',(c:any)=>c.overview.image.alt='Chat operativo'],
] as const)test(`publication rejects ${name}`,()=>{const c=approved();change(c);if(name!=='changed copy'&&name!=='pending review')c.review.reviewedValue=contentSnapshot(c);if(name!=='changed image review')for(const img of[c.hero.image,c.overview.image,c.downloads.image,c.brand])img.review.reviewedValue=imageSnapshot(img);assert.ok(appPublicationIssues(c,fixtureDownloads('00'),root,today).length>0);});
test('pending candidates valid but unproven verified declaration rejected',()=>{const c=approved(),pending=fixtureDownloads('00');pending[0].candidateURL='javascript:bad';assert.deepEqual(appPublicationIssues(c,pending,root,today),[]);pending[0].status='verificado';assert.ok(appPublicationIssues(c,pending,root,today).some(s=>s.startsWith('descargas:')));});
test('missing and duplicate platforms rejected by authoring guard',()=>{assert.ok(appPublicationIssues(approved(),[],root,today).length);const pair=fixtureDownloads('00');assert.ok(appPublicationIssues(approved(),[...pair,pair[0]],root,today).length);});
test('symlink outside public and empty resource rejected',()=>{const outside=join(root,'../outside-app004.svg');writeFileSync(outside,'<svg/>');symlinkSync(outside,join(root,'images/app/link.svg'));try{const c=approved();c.hero.image.src='/images/app/link.svg';c.hero.image.review.reviewedValue=imageSnapshot(c.hero.image);assert.ok(appPublicationIssues(c,fixtureDownloads('00'),root,today).length);}finally{rmSync(outside);}writeFileSync(join(root,'images/app/empty.svg'),'');const c=approved();c.hero.image.src='/images/app/empty.svg';c.hero.image.review.reviewedValue=imageSnapshot(c.hero.image);assert.ok(appPublicationIssues(c,fixtureDownloads('00'),root,today).length);});
