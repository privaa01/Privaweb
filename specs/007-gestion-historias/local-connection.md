# Conexión local003–007 — 2026-10-28 (America/Bogota)

Solicitud de la responsable: «conecta con el007». T061 implementada sin publicación automática ni cuentas nuevas.

## Implementación

`server/stories/dev-integration.ts` activa el router público del servicio007 solo durante Astro dev con `PRIVA_STORIES_MODE=local`. Reutiliza `composeStories`, `StoriesRepository`, `StoryMedia`, `StoriesService` y el handlerHTTP existentes: no hay catálogo JSON simulado ni fixture en el servidor de la aplicación. Host exacto y peer loopback; origen HTTP loopback y puerto verificados. Solo se montan `/api/public/historias` y `/media/public/`; no se montan rutas administrativas ni de importación. No se cambian permisos ni se provisionan credenciales.

`server/stories/development.ts` conserva SQLite/claves/medios fuera del proyecto, con controles existentes0700/0600 y rechazo de rutas privadas bajo checkout. Directorio temporal canónico estable por checkout, configurable con PRIVA_STORIES_DATA_DIR. Cierre de repositorio al apagar servidor. No habilita build/preview/productivo ni evita guards. `npm run dev:local` combina esta conexión con Contacto sintético existente.

## Resultados

- Dos pruebas nuevas Node aprobadas: runtime vacío sin cuentas; borrador creado por actor exclusivamente de prueba persiste al reabrir SQLite sin aparecer en catálogo; permisos y ubicación privada; rechazo de almacenamiento en checkout.
- Regresión007 HTTP/repositorio/autorización/DTO:17 aprobadas y2 bloqueadas/fallidas por dependencia `/usr/bin/ffmpeg` ausente (ENOENT). Las dos pruebas de subida/inspección real no se declaran aprobadas ni se omite el sandbox Linux. La conexión de lectura no depende de ejecutar FFmpeg.
- Seis pruebas nuevas de navegador aprobadas:2 por motor Chromium/Firefox/WebKit. API200 JSON/schemaVersion1/no-store; página200, consumo real y recarga; vacío confirmado sin Reintentar; API pública rechaza POST405, query404, Host ajeno403, recurso no publicado404; ruta administrativa no disponible. Primera ejecución tuvo tres fallos por expectativa incorrecta de aria-busy=false; el código existente elimina el atributo al terminar. Se corrigió la prueba, no el producto; campaña final6/6.
- TypeScript007 sin errores; Astro check95archivos,0errores/advertencias,1hint previo.

Comandos: `TMPDIR=/private/tmp node --test tests/story-management-development.test.ts`; `TMPDIR=/private/tmp node --test tests/story-management-http.test.ts tests/story-management-security.test.ts tests/story-management-repository.test.ts tests/story-management-catalog.test.ts`; `node node_modules/typescript/bin/tsc -p server/stories/tsconfig.json`; `ASTRO_TELEMETRY_DISABLED=1 node node_modules/astro/bin/astro.mjs check`; `PRIVA_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node node_modules/@playwright/test/cli.js test --config playwright.stories.local.config.ts`.

Servidor iniciado con `PRIVA_STORIES_MODE=local PRIVA_CONTACT_TEST_MODE=synthetic ASTRO_TELEMETRY_DISABLED=1 node node_modules/astro/bin/astro.mjs dev --host 127.0.0.1 --port 4321 --force`. Node24.22.1 y macOS ARM64; PATH usa runtime empaquetado por Codex.

Logs ignorados en .test-output: stories-local-unit.log, stories-local-regression.log, stories-local-tsc.log, stories-local-check.log, stories-local-browser-final.log y stories-local-results.json. Captura: stories-local-connected.png.

## Límites vigentes

Catálogo real conectado y vacío: no hay historias publicadas activas en esta base local. Las fichas/ejercicios siguen sin aprobación; no se importaron, publicaron o activaron para llenar la pantalla. El siguiente paso editorial es revisar los ejercicios preparados y después importar/publicar mediante el flujo autorizado007. T056–T059 continúan pendientes; conexión local no acredita inspección de subidas en este host, autenticación administrativa, publicación inicial, operaciónFirebase o cierre productivo.

## Estado vigente del inspector macOS

2026-10-28: adaptación implementada;42/42 pruebas007 aprobadas, incluidas subidas/importación y aislamiento nativo. Las limitaciones anteriores de FFmpeg ausente son históricas. `npm run build:media:macos` construye el supervisor y `npm run test:story-management:macos` verifica la suite. Memoria física supervisada cada5ms en Mac, sin afirmar equivalencia al límite virtual duro Linux. [Evidencia final y límites](macos-media-validation.md). No se publicaron fichas pendientes ni se cerró operación productiva.
