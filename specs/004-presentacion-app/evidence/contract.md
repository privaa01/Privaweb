# Ejecución contractual — 004

2026-10-17, Linux, Node24.19.0/npm11.9.0, Astro7.4.0, TypeScript5.9.3, Playwright1.64.1.
Ninguna dependencia añadida; banco4325 y namespacesapp separados de001–003.

Comandos aprobados:

```bash
node --experimental-strip-types --test tests/app-downloads.test.ts tests/app-publication.test.ts
npm run check
npm run check:app:contract
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:app:contract -- --project=chromium
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contract -- --project=chromium
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:home:contract -- --project=chromium
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:stories:contract -- --project=chromium
```

52 unitarias,31 UI004 y97 regresión(45/23/29) aprobadas;180 pruebas en total.
Regresión ampliada justificada por corrección de navegación compartida tras fallo demostrado;
no se repitieron suites ajenas por rutina. Check raíz/banco sin errores/advertencias/hints.
Build del banco se ejecutó por webServer; no equivale a build del sitio ni despliegue.
Resultados resumidos versionados; completos locales bajo .test-output.
