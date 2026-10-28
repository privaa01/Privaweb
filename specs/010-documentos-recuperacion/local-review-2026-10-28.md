# Destinos y accesibilidad local010 — 2026-10-28

Se continúa tras aceptación general visual de PrivaApp («esta bien, continuemos»), que no aprueba documentos legales ni acredita lector de pantalla. Checklist01016/16 intacto. Contacto sigue con datos ficticios y sin correo real. No se cambiaron textos públicos ni calificación009 para aprobar estas comprobaciones.

## T028 — Destinos reales

Se verifican /historias.html#casos, /app.html#como-funciona, /app.html#descarga y /contacto.html#escribir por enlaces reales desde Historias/App/Manifiesto, con teclado y puntero, entrada directa y recarga, encabezados enfocados y visibles.6pruebas aprobadas entre Chromium/Firefox/WebKit. No enlaces vacíos/#maria. QR no integrado ni identificado en el inventario de material aprobado incorporado a esta entrega local; no se crea uno, no se asignaURL y no se aprueba ningúnQR futuro. CondiciónQR no aplicable al material local actual. La comprobación de estas anclas no exige aprobar los borradores de documentos ni recibir consultas reales.

## T033 — Lectura al200%

Matriz contractual completa para /terminos.html,/manifiesto-datos.html,/404.html,/contacto.html en360/390/430/768/1024/1280/1440px y texto200% real.28celdas por motor,84celdas recorridas dentro de3pruebas, no84casos independientes. Verificación de tamaño computado de fuente≥32px, ausencia de overflow, skip-link desdeTab (Option+Tab en WebKit/macOS), foco en h1, apertura/cierre conEnter/Escape y retorno de foco del menú, tamaño≥44×44px del control de menú, enlace de lectura enfocado con contorno visible y axe en cada celda incluido contraste.

Campaña final3/3aprobadas, sin fallos/omisiones; no acredita revisión manual ni todo el estado productivo. Primera campaña3/3previa sin medida explícita44px; se añadió esa comprobación y se ejecutó nuevamente, sin sumar repeticiones. `PRIVA_DOCUMENTS_PORT=4330 PRIVA_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node node_modules/@playwright/test/cli.js test --config .test-output/documents-review.config.ts --grep V12 --workers 1`. Config temporal deriva de playwright.documents.config.ts; cambia solo cwd/testDir y arranque npm por `ASTRO_TELEMETRY_DISABLED=1 node node_modules/astro/bin/astro.mjs build --root tests/fixtures/documents && node scripts/serve-documents.mjs .test-output/documents 4330`. Banco real de componentes, contenido sintético identificado y servidor010 representativo, no datos finales aprobados.

## T035 — Auditoría local parcial

Otras3pruebas aprobadas (una por motor) de documentos reales/borradores, aviso y404 explícita: sin nuevas cookies/storage ni peticiones externas. Total del archivo documents-local.spec.ts:9/9aprobadas. Primera campaña6aprobadas/3fallidas por exigir erróneamente200para /404.html; el contrato admite200o404 para esa ruta explícita y el servidor devuelve404. Se corrigió la prueba, no el producto; campaña final9/9. No se usó ese ajuste para aceptar200en rutas inexistentes.

Auditoría separada de ruta pública anidada inexistente en Astro dev: GET404,HEAD404sin cuerpo,meta no-referrer presente y consulta sintética no reflejada. Cabecera HTTP Referrer-Policy ausente; API administrativa anónima responde404porque no está montada. Estas limitaciones no satisfacen contrato productivo de cabecera ni401de administración y se mantienen abiertas enT035/T040/T041. No se modificó el servidor productivo ni se debilitaron guards. Reporte sinURLs/cookies/tokens/datos privados en .test-output/documents-dev-delivery-audit.json.

## Verificación adicional y estado

27/27Node010aprobadas: `TMPDIR=/private/tmp node --test tests/documents-*.test.ts`. Astrocheck95archivos,0errores/advertencias,1hint previo. Node24.22.1/macOSARM64, Playwright1.64.1; sin nuevas dependencias. `git diff --check` conforme.

T028/T033 completas:35/44tareas. T034manual/lector, T035auditoría/calificaciónintegrada, T037datos operativos, T038revisión humana, T039evidencia009, T040hosting, T041integraciónfinal, T042build y T043guía de cierre siguen pendientes. No se usa evidencia local para rellenar privacidad productiva, aprobar documentos ni habilitar datos reales.

Logs .test-output/documents-local-final.log, documents-accessibility-final.log, documents-review-unit.log y documents-review-check.log. Reproducir sitios reales con `PRIVA_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node node_modules/@playwright/test/cli.js test --config playwright.documents.local.config.ts --workers 1`; no arranca fixture ni envía formularios.
