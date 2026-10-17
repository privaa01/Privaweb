# Ejecución contractual — 003

2026-10-17, Node24.19.0, npm11.9.0, Astro7.4.0, TypeScript5.9.3,
Playwright1.64.1, Chromium del sistema. Banco servido en 127.0.0.1:4324.

Comandos ejecutados con resultado aprobado:

```bash
node --experimental-strip-types --test tests/stories-contract.test.ts tests/stories-publication.test.ts
npm run check
npm run check:stories:contract
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:stories:contract -- --project=chromium
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contract -- --project=chromium
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:home:contract -- --project=chromium
```

40 unitarias,29UI de 003,44 regresión de 001 y23 regresión de 002 aprobadas. BancoAstro compilado por
webServer de Playwright; no output/caché/trazas compartidos. Sin dependencias nuevas.
Resultados resumidos versionados; reportes completos locales bajo .test-output.
Fuentes y checklists de requisitos no se alteraron para convertir pendientes en aprobaciones.
La fidelidad/revisión editorial/servicios remotos requieren las evidencias adicionales indicadas.
