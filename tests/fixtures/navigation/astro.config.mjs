import { defineConfig } from 'astro/config';
export default defineConfig({ output: 'static', publicDir: '../../../public', build: { format: 'file' }, trailingSlash: 'never', outDir: '../../../.test-output/navigation', cacheDir: '../../../.test-output/astro', vite: { server: { fs: { allow: ['../../..'] } } } });
