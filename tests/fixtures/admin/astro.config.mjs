import {defineConfig} from 'astro/config';
export default defineConfig({output:'static',base:'/admin',build:{format:'file',inlineStylesheets:'never'},trailingSlash:'never',outDir:'../../../.test-output/admin',cacheDir:'../../../.test-output/admin-cache',vite:{server:{fs:{allow:['../../..']}},build:{assetsInlineLimit:0}}});
