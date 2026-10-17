import {defineConfig} from 'astro/config';
export default defineConfig({output:'static',build:{format:'file'},trailingSlash:'never',outDir:'../../../.test-output/contact',cacheDir:'../../../.test-output/contact-cache',vite:{server:{fs:{allow:['../../..']}}}});
