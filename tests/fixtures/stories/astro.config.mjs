import {fixtureSharedAssets} from '../../../scripts/fixture-shared-assets.mjs';
import { defineConfig } from 'astro/config';
import {cpSync} from 'node:fs';
const officialCovers={name:'official-story-covers',hooks:{'astro:build:done':({dir})=>{cpSync(new URL('../../../public/images/stories/',import.meta.url),new URL('images/stories/',dir),{recursive:true});}}};
export default defineConfig({integrations:[fixtureSharedAssets(),officialCovers], output:'static',build:{format:'file'},trailingSlash:'never',outDir:'../../../.test-output/stories',cacheDir:'../../../.test-output/stories-cache',vite:{server:{fs:{allow:['../../..']}}}});
