import {defineConfig} from 'astro/config';
export default defineConfig({output:'static',base:'/admin',build:{format:'file',inlineStylesheets:'never'},trailingSlash:'never',outDir:'../../../.test-output/story-management',cacheDir:'../../../.test-output/story-management-cache',vite:{server:{fs:{allow:['../../..']}},build:{assetsInlineLimit:0}}});
