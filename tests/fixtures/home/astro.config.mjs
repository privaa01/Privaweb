import { defineConfig } from 'astro/config';
export default defineConfig({ output: 'static', build: { format: 'file' }, trailingSlash: 'never', outDir: '../../../.test-output/home', cacheDir: '../../../.test-output/home-cache', vite: { server: { fs: { allow: ['../../..'] } } } });
