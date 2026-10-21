import {fixtureSharedAssets} from '../../../scripts/fixture-shared-assets.mjs';
import { defineConfig } from 'astro/config';
export default defineConfig({integrations:[fixtureSharedAssets()],output:'static',build:{format:'file'},trailingSlash:'never',outDir:'../../../.test-output/app',cacheDir:'../../../.test-output/app-cache',vite:{server:{fs:{allow:['../../..']}}}});
