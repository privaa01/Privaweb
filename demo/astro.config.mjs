import {defineConfig} from 'astro/config';
export default defineConfig({output:'static',build:{format:'file'},trailingSlash:'never',outDir:'../.demo-dist',cacheDir:'../.test-output/demo-cache'});
