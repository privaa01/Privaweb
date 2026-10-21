import {defineConfig} from 'astro/config';
export default defineConfig({output:'static',build:{format:'file'},trailingSlash:'never',outDir:'../../../.test-output/documents',cacheDir:'../../../.test-output/documents-cache',vite:{server:{fs:{allow:['../../..']}}}});
