# Privaweb

Proyecto Astro organizado con Spec Kit. Inicio y navegación compartida disponibles; Contacto incluye un MVP local con persistencia real y datos exclusivamente ficticios. La publicación del conjunto sigue bloqueada por revisiones y operación pendientes.

## Probar Contacto (MVP local)

Con Node24+ y dependencias instaladas:

```bash
npm run dev:contact:test -- --force
```

Abrir http://127.0.0.1:4321/contacto.html. Usar solo alias/mensajes ficticios y correos `@example.test`. La consulta se guarda en una base local privada fuera del checkout; no se envían correos. Este modo no habilita datos reales ni un despliegue Firebase. Sin la opción de pruebas, los guards de publicación siguen activos.

Ver [guía005](specs/005-contacto-publico/quickstart.md) y [resultados](specs/005-contacto-publico/evidence.md).

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

### Desarrollo local con catálogo007

`npm run dev:local` inicia Astro en http://127.0.0.1:4321 con Contacto sintético y el servicio público real007. `npm run test:e2e:stories:local` verifica la conexión en Chromium/Firefox/WebKit contra el servidor iniciado. No afecta build ni preview.

Historias consume `/api/public/historias`; sus medios elegibles se sirven por `/media/public/:id`, sin copiar archivos privados a public. SQLite y claves se guardan fuera del proyecto, en el directorio temporal canónico con nombre estable `priva-stories-local-<hash del checkout>`; sobreviven reinicios del proceso pero el sistema puede limpiar temporales. Para conservar otro directorio privado usar `PRIVA_STORIES_DATA_DIR` (fuera del checkout), y `PRIVA_STORIES_ORIGIN` si cambia el origen loopback. No es un respaldo productivo. No se crean cuentas ni se importan/publican historias automáticamente. Si no hay publicaciones activas, la página muestra catálogo vacío confirmado. La administración006 y el alojamiento productivo requieren su configuración separada.

### FFmpeg local en macOS ARM64

FFmpeg9.0 y ffprobe9.0 instalados en `.tools/ffmpeg/9.0/bin/` (ignorados por Git). Para usarlos sin cambiar el PATH global: `bash scripts/with-local-ffmpeg.sh ffmpeg -version` o `bash scripts/with-local-ffmpeg.sh ffprobe -version`. La instalación es local a este checkout; no modifica /usr/bin ni perfiles de shell. Procedencia/huellas/comprobaciones en `specs/007-gestion-historias/macos-media-alternative.md`. El inspector selecciona automáticamente el ejecutor nativo aislado en macOS; construir el supervisor con `npm run build:media:macos` y ejecutar `npm run test:story-management:macos`. Linux conserva bwrap/prlimit. El perfil macOS restringe lectura, red, escrituras y fork; el supervisor impone CPU/tiempo y controla huella física cada5ms (no equivale al límite de espacio virtual Linux). Adaptador destinado a desarrollo local; calificación productiva pendiente.
