import { existsSync } from 'node:fs';
const missing = ['index', 'historias', 'app', 'contacto'].filter(name => !existsSync(`src/pages/${name}.astro`));
if (missing.length) { console.error(`BLOQUEADO T023: faltan páginas reales de features 002–005: ${missing.join(', ')}. Use npm run build:contract para validar navegación.`); process.exit(1); }
