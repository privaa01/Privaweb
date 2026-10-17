import { defineConfig } from 'astro/config';
export default defineConfig({ output:'static',build:{format:'file'},trailingSlash:'never',outDir:'../../../.test-output/stories',cacheDir:'../../../.test-output/stories-cache',vite:{server:{fs:{allow:['../../..']}}}});
