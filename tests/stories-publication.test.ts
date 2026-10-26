import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { storiesContent } from '../src/content/stories.ts';
import { storiesPublicationIssues, reviewText } from '../src/lib/stories-publication.ts';
function approved(){
 const content=structuredClone(storiesContent);
 for(const block of [content.hero,content.method,content.closing,...content.identity])block.review={status:'revisado',decisionReference:'TEST ONLY review',reviewedText:reviewText(block)};
 for(const image of [content.hero.image,content.method.image,content.closing.image,content.brand])Object.assign(image,{src:'/images/stories/approved.svg',width:640,height:400,status:'verificado',sourceReference:'TEST ONLY asset',purpose:'decorativo',alt:''});
 for(const visual of Object.values(content.visual))Object.assign(visual,{status:'verificado',sourceReference:'TEST ONLY visual'});
 content.social={url:'https://www.instagram.com/test_only/',status:'verificado',reviewRef:'TEST ONLY social'};
 return content;
}
const root=mkdtempSync(join(tmpdir(),'priva-stories-'));mkdirSync(join(root,'images/stories'),{recursive:true});writeFileSync(join(root,'images/stories/approved.svg'),'<svg/>');
process.on('exit',()=>rmSync(root,{recursive:true,force:true}));
test('production pending fails; complete synthetic metadata verifies validator only',()=>{assert.ok(storiesPublicationIssues(storiesContent,root).length>5);assert.deepEqual(storiesPublicationIssues(approved(),root),[]);});
for(const [name,change] of [
 ['fixture',(c:any)=>c.testOnly=true],['missing src',(c:any)=>c.hero.image.src=''],['missing file',(c:any)=>c.hero.image.src='/images/stories/absent.svg'],
 ['review pending',(c:any)=>c.hero.review.status='pendiente'],['changed copy',(c:any)=>c.hero.description+=' change'],['C16',(c:any)=>c.closing.description='replacement'],
 ['missing brand',(c:any)=>c.brand.status='pendiente'],['dimensions',(c:any)=>c.hero.image.width=0],['source',(c:any)=>c.hero.image.sourceReference=''],
 ['social pending',(c:any)=>c.social.status='pendiente'],['social missing',(c:any)=>c.social.url=''],['social unsafe',(c:any)=>c.social.url='javascript:x'],
 ['fake endpoint',(c:any)=>c.endpoint='https://other.example/api'],['media unsafe',(c:any)=>c.mediaOrigins=['http://other.test']],
 ['visual',(c:any)=>c.visual.palette.status='pendiente'],['identity route',(c:any)=>c.identity[0].href='#'],['traversal',(c:any)=>c.hero.image.src='/images/stories/../private.svg'],
] as const)test(`gate rejects ${name}`,()=>{const c=approved();change(c);assert.ok(storiesPublicationIssues(c,root).length>0);});
test('gate rejects symlink escaping public and empty asset',()=>{
 const outside=join(root,'../outside-priva-stories.svg');writeFileSync(outside,'<svg/>');symlinkSync(outside,join(root,'images/stories/link.svg'));
 try{const c=approved();c.hero.image.src='/images/stories/link.svg';assert.ok(storiesPublicationIssues(c,root).length>0);}finally{rmSync(outside);}
 writeFileSync(join(root,'images/stories/empty.svg'),'');const c=approved();c.hero.image.src='/images/stories/empty.svg';assert.ok(storiesPublicationIssues(c,root).length>0);
});

test('received official section images match local PNG dimensions while editorial still blocks',()=>{
 for(const image of [storiesContent.hero.image,storiesContent.method.image,storiesContent.closing.image]){
  const png=readFileSync(join('public',image.src.slice(1)));
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(image.width,png.readUInt32BE(16));assert.equal(image.height,png.readUInt32BE(20));assert.equal(image.status,'verificado');
 }
 const issues=storiesPublicationIssues(storiesContent,'public');assert(issues.some(i=>i.includes('revisión editorial')));assert(!issues.some(i=>/recurso oficial|dimensiones|archivo oficial|ruta oficial/.test(i)));
});
