# Privaweb

Proyecto organizado con Spec Kit. 001 implementa navegación compartida y 002 los bloques de Inicio, con publicación
bloqueada por materiales/revisión pendientes. Las demás páginas, Contacto y administración siguen pendientes.

## Desarrollo de navegación

Node >=22.22.0 y Python 3 para el servidor del banco de pruebas:

```bash
npm ci
npm run check:contract
npm run build:contract
```

Para ejecutar los navegadores oficiales de Playwright:

```bash
npm exec playwright install chromium firefox webkit
npm run test:e2e:contract
```

Si el entorno dispone de Chromium del sistema:

```bash
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contract -- --project=chromium
```

Los fixtures son ficticios, se generan en `.test-output/navigation/` y nunca en `dist/`.
`npm run build` se bloquea hasta integrar las cuatro páginas reales. La suite integrada
requiere `PRIVA_INTEGRATION_BASE_URL` real y el contrato privado de la feature 006.

Consultar [specs](specs/README.md), [guía 001](specs/001-navegacion-global/quickstart.md)
y [resultados/bloqueos](specs/001-navegacion-global/evidence/summary.md).

## Inicio (002)

```bash
npm run check:home:contract
node --test tests/home-publication.test.ts
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:home:contract -- --project=chromium
```

Los SVG y textos de revisión del banco no son recursos o capacidades aprobadas.
Ver [evidencia 002](specs/002-inicio-institucional/evidence/summary.md).
