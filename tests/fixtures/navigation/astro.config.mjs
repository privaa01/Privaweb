import { defineConfig } from 'astro/config';
export default defineConfig({ output: 'static', build: { format: 'file' }, trailingSlash: 'never', outDir: '../../../.test-output/navigation', cacheDir: '../../../.test-output/astro', vite: { server: { fs: { allow: ['../../..'] } } } });
