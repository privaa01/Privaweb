# Integración — 001

Fecha: 2026-10-16 (America/Bogota). Estado: bloqueada; no hay entorno real.

- `npm run build`: exit 1 esperado por guard de T023; faltan páginas reales index/historias/app/contacto de 002–005.
- `npm run test:e2e:integration`: exit 1 por ausencia de PRIVA_INTEGRATION_BASE_URL; cero pruebas integradas ejecutadas.
- G05: falta servicio 006 e inventario versionado de rutas/métodos/resultados sin sesión.
- G06: faltan documentos revisados de 010 y formulario de 005.
- Casos de destinos conocidos escritos en navigation-integration.spec.ts; caso privado explícitamente bloqueado, no sustituido por mocks o 404.
- Descarga de navegadores Playwright: 403 Domain forbidden en cdn.playwright.dev. Chromium del sistema disponible; regresión Firefox/WebKit no ejecutada.

Estos resultados no son pruebas de aplicación aprobadas. Logs adjuntos en
application-build-blocked.txt e integration-blocked.txt. T021/T023/T024/T026/T027/T028
permanecen total o parcialmente pendientes; consultar tasks.md para estado preciso.
