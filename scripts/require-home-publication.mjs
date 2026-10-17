import { resolve } from 'node:path';
import { homeContent } from '../src/content/home.ts';
import { assertHomePublication } from '../src/lib/home-publication.ts';
try { assertHomePublication(homeContent, resolve('public')); }
catch (error) { console.error(error.message); process.exit(1); }
