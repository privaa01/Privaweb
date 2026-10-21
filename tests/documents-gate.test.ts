import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
test('normal delivery keeps010 gate before Astro and exits nonzero without official facts',()=>{
 const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 assert(pkg.scripts.build.indexOf('require-documents-publication.mjs')<pkg.scripts.build.indexOf('astro build'));
 const result=spawnSync(process.execPath,['scripts/require-documents-publication.mjs'],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
 assert.equal(result.status,1);assert.match(result.stderr,/BLOQUEADO010/);assert.match(result.stderr,/privacy:/);
});
test('real target sections exist in their owning features',()=>{
 const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 assert.match(read('src/components/stories/StoriesCatalog.astro'),/id="casos"/);
 assert.match(read('src/content/app.ts'),/id:'como-funciona'/);assert.match(read('src/content/app.ts'),/id:'descarga'/);
 assert.match(read('src/components/app/AppSteps.astro'),/id=\{content.id\}/);assert.match(read('src/components/app/AppDownloads.astro'),/id=\{content.id\}/);
 assert.match(read('src/components/contact/ContactForm.astro'),/id="escribir"/);
});
