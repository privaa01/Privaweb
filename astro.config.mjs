import { defineConfig } from 'astro/config';
import { contactDevelopment } from './server/contact/dev-integration.ts';
import { storiesDevelopment } from './server/stories/dev-integration.ts';
export default defineConfig({ output: 'static', build: { format: 'file' }, trailingSlash: 'never', integrations:[contactDevelopment(),storiesDevelopment()] });
