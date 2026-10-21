import {fixtureSharedAssets} from '../../../scripts/fixture-shared-assets.mjs';
import { defineConfig } from 'astro/config';
export default defineConfig({integrations:[fixtureSharedAssets()], output:'static',build:{format:'file'},trailingSlash:'never',outDir:'../../../.test-output/stories',cacheDir:'../../../.test-output/stories-cache',vite:{server:{fs:{allow:['../../..']}}}});
