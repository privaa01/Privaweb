import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCatalog } from '../src/lib/stories-contract.ts';
import { fixtureCatalog } from './fixtures/stories/src/content.ts';
const options = { baseURL:'https://priva.test', mediaOrigins:[] };
test('valid full catalog and confirmed empty',()=>{
 assert.equal(parseCatalog(fixtureCatalog,options).stories.length,4);
 assert.deepEqual(parseCatalog({schemaVersion:1,stories:[]},options).stories,[]);
});
for (const [name, mutate] of [
 ['version',(c:any)=>c.schemaVersion=2], ['duplicate id',(c:any)=>c.stories[1].id=c.stories[0].id],
 ['private field',(c:any)=>c.stories[0].email='private@example.test'],
 ['three options',(c:any)=>c.stories[0].options.pop()], ['duplicate option',(c:any)=>c.stories[0].options[1].id=c.stories[0].options[0].id],
 ['empty transcript',(c:any)=>c.stories[0].transcript=' '], ['empty explanation',(c:any)=>c.stories[0].options[0].explanation=''],
 ['dimensions',(c:any)=>c.stories[0].image.width=0], ['unsafe id',(c:any)=>c.stories[0].id='x\" onclick=x'],
 ['private envelope',(c:any)=>c.admins=[]],['missing audio',(c:any)=>delete c.stories[0].audio],
] as const) test(`reject ${name}`,()=>{ const c=structuredClone(fixtureCatalog);mutate(c);assert.throws(()=>parseCatalog(c,options)); });
for (const url of ['javascript:alert(1)','data:audio/wav;base64,AA','//other.test/audio.wav','/private/audio.wav','/media/../private.wav','/media/%2e%2e/private.wav','https://user:pass@priva.test/media/a.wav','https://unknown.test/a.wav']) test(`reject URL ${url}`,()=>{const c=structuredClone(fixtureCatalog);c.stories[0].audio.src=url;assert.throws(()=>parseCatalog(c,options));});
test('allow explicitly configured HTTPS media origin',()=>{const c=structuredClone(fixtureCatalog);c.stories[0].audio.src='https://media.example.test/published/a.wav';assert.equal(parseCatalog(c,{...options,mediaOrigins:['https://media.example.test']}).stories.length,4);});
