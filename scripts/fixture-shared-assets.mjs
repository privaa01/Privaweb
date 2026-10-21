import {cpSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
/** Build-only shared official assets; keeps each fixture's own synthetic assets separate. */
export function fixtureSharedAssets(){return {name:'priva-fixture-shared-assets',hooks:{'astro:build:done':({dir})=>{
 const output=fileURLToPath(dir);for(const name of ['brand','fonts']){mkdirSync(join(output,name),{recursive:true});cpSync(fileURLToPath(new URL('../public/'+name,import.meta.url)),join(output,name),{recursive:true});}
}}};}
