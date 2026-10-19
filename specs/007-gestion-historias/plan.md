# Implementation Plan: Gestión y publicación de historias

**Rama real**: `main` | **Fecha**: 2026-10-19 | **Spec**: [spec.md](spec.md)
**Feature activa**: `007-gestion-historias`; selección SDD independiente de rama Git.
**Estado**: diseño implementado y verificado localmente; 56/60 tareas cerradas. Ver [evidence.md](evidence.md); T056–T059 abiertas.

## Summary

Implementar AD03/AD04/AD05/AD06/AD10 sobre el acceso individual de 006 y el consumidor público
existente de 003. Guardar modifica trabajo privado; Publicar reemplaza una publicación completa
con la misma identidad y sin alterar activación. No hay eliminación definitiva, comentarios públicos,
estadísticas educativas, nuevos roles ni interfaz de historial.

Astro continúa estático: 003 ya obtiene el catálogo mediante `/api/public/historias`. Implementar
su productor en el proceso Node de administración, con router público separado de los guards
privados. No reconstruir ni desplegar el sitio por cada cambio editorial. Los archivos se conservan
fuera de roots estáticos y se sirven por autorización o por pertenencia a publicación activa.

## Technical Context

**Language/Version**: TypeScript 5.9.3 estricto, Node 24.19.0, Astro 7.4.0; reutilizar lock actual.
**Primary Dependencies**: node:http/crypto/fs/sqlite, Astro, node:test, Playwright 1.64.1 y axe 4.14.0.
Añadir dependencia operativa FFmpeg/ffprobe 7.1.5 para inspección/decodificación acotada de medios;
bwrap + prlimit como launcher Linux (namespaces sin red, entrada/bibliotecas de solo lectura,
512MiB RLIMIT_AS por proceso, CPU20s soft/21s hard, NOFILE32, CORE0, threads1, salida1MiB
y plazo total30s para ffprobe+ffmpeg). Fallar cerrado si no se aplica; ver R5 en [investigación](research.md).
No SDK de hosting ni proveedor productivo seleccionado.
**Storage**: tablas stories_* en la misma conexión SQLite privada que admin_*; WAL, FK,
synchronous=FULL, busy_timeout=5000 y transacciones cortas de 006. Blobs inmutables en directorio
privado 0700/archivos0600, fuera de Git/public/dist/.private-build. No copiar uploads a public.
**Testing**: node:test con SQLite y archivos reales, UI sintética aislada, navegador + servicio
local + consumidor003, y calificación productiva independiente. No equivalencia mock/entrega.
**Target Platform**: Linux Node tras proxy HTTPS same-origin; Astro público y vistas privadas006.
**Project Type**: extensión del servicio y panel existentes; catálogo público de solo lectura.
**Performance Goals**: objetivos locales derivados: listar 1000 historias sintéticas con metadatos
<=1s p95 en 30 lecturas calientes, sin leer blobs; publicar metadatos <=1s p95 sin incluir transferencia/
revisión de medios. Registrar máquina y medición; no SLA productivo. JSON <=256KiB, subida <=50MiB,
2 inspecciones simultáneas sin cola ilimitada, timeout transferencia120s/inspección30s/JSON30s;
cliente15s para JSON y120s para archivo; abortar no demuestra rollback.
**Constraints**: autorización transaccional, CSRF/origen, revisión CAS y recibos idempotentes; nunca
éxito optimista. 7anchos×100/200%, teclado, contraste4.5:1/3:1, controles~44px. Sin selecciones
educativas en solicitudes/almacenamiento. No heredar retención90d de Contacto.
**Scale/Scope**: cinco requisitos, cinco historias/31 escenarios, ocho SC. Dos administradores de
prueba para conflictos; entrega inicial conserva los tres IDs003. Escala1000 es banco local,
no límite de negocio ni estimación de demanda. Capacidad/disco/backup/SLA reales requieren P02.

## Constitution Check

| Reglas | Antes de investigación | Después del diseño |
|---|---|---|
| CONST-01–03 | Fuente y Q1 gobiernan; cinco requisitos inalterados | Mismos campos, permiso único, sin borrado/roles/historial/catálogo separado |
| CONST-04 | IDs y 31 escenarios deben tener evidencia | Matriz de validación en quickstart; tareas se generan después |
| CONST-05–06 | Borradores, archivos y Contacto son privados | Guard006 en misma transacción; DTO público permitido; recursos no estáticos; sin respuestas educativas |
| CONST-07 | Guardar != Publicar; publicada AND activa | Dos snapshots, CAS/recibos, activación independiente y proyección atómica |
| CONST-08–09 | Recursos reales y accesibilidad medible | Inspección técnica separada de revisión editorial/manual; no cifras o materiales inventados |
| CONST-10–12 | Diseño no acredita ejecución | Evidencias por capa; bloqueos P01/P02/P03/009/010/011 explícitos; ninguna excepción |

Gates previos y posteriores conformes para trabajo local independiente. Producción no autorizada
por este diseño: proveedor, políticas operativas, materiales/revisión y pruebas reales siguen abiertos.

## Project Structure

### Documentación

```text
specs/007-gestion-historias/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/story-management.md
└── checklists/requirements.md
```

[tasks.md](tasks.md) contiene el desglose generado en la fase posterior speckit-tasks; todas sus tareas siguen pendientes.

### Código implementado para verificación local

```text
server/stories/{repository,sqlite-repository,service,http,media,validation}.ts
server/admin/{http,start}.ts                         # composición; conserva006
server/admin/views/src/pages/historias.astro         # listado/editor privado en misma ruta
src/components/admin/{StoriesManager,StoryEditor}.astro
src/lib/{story-management-contract,story-management-validation}.ts
src/scripts/{admin-stories,admin-session}.ts
src/styles/admin.css
src/lib/stories-contract.ts                         # compatibilidad pregunta editorial
scripts/require-story-management-publication.mjs
playwright.story-management.config.ts
playwright.story-management.service.config.ts
tests/story-management-*.test.ts
tests/fixtures/story-management/
tests/fixtures/story-management-service/
tests/e2e/story-management-*.spec.ts
```

**Structure Decision**: reutilizar vistas privadas fuera de dist y conexión006; router007
compuesto antes de fallback404006, con rutas exactas. No ampliar el límite8KiB de acceso006:
router007 tiene lectorJSON256KiB y uploads binarios separados. Catálogo no llama al guard de
sesión ni genera cookie; rutas privadas siempre pasan por006. Cambiar CSP privada solo para
img-src/media-src self y blob de previsualización local; revocar objectURLs al salir/cambiar.

## Phase 0 — Investigación

[research.md](research.md) documenta decisiones, alternativas y evidencia del checkout. Se
resuelven formato, límites, concurrencia, idempotencia, entrega de medios, catálogo y contador.
No quedan incertidumbres técnicas bloqueantes para generar tareas locales. Operación productiva
sigue condicionada a dependencias explícitas; no se inventa proveedor ni política009.

## Phase 1 — Diseño

[data-model.md](data-model.md) define validación y transiciones. El [contrato](contracts/story-management.md)
fija transporte, recursos, autorización, errores y compatibilidad003. [quickstart.md](quickstart.md)
distingue comandos existentes de los futuros y organiza pruebas por requisito/escenario.

## Secuencia posterior

1. Contratos/validadores y pruebas negativas; migraciones no destructivas y recursos privados.
2. Guard transaccional006, CAS/recibos e inyección de fallo antes/después de commit.
3. Guardado y reapertura de borradores, carga/inspección de archivos con autorización renovada.
4. Publicación/activación y catálogo real003; importación controlada de los tres casos sin inventarlos.
5. Tabla/resumen/editor y adaptador agregado de Contacto; estados de fallo sin cero ficticio.
6. Integración y regresión003/005/006; matriz accesible y gates de entrega separados de fixtures.

## Complexity Tracking

Sin infracciones constitucionales. Dos snapshots implementan Q1; recibos y CAS evitan duplicados y
sobrescrituras; blobs privados y comprobación de elegibilidad evitan filtraciones. No hay sistema
editorial adicional, cola distribuida, SSR ni publicación de archivos por reconstrucción.

## Registro

2026-10-19 — speckit-plan007: fases0/1 documentadas; revisión constitucional previa/posterior.
Sin código, tareas, pruebas de aplicación, provisión, correo, commit/push ni despliegue.

2026-10-19 — Implementación local de fases posteriores: rutas compuestas con006, SQLite privado,
snapshots/CAS/recibos, decoder aislado, editor y catálogo003. El bancoUI reutiliza servicio real
para evitar dobles divergentes; simulaciones de error están identificadas. Pruebas por comportamiento
consolidadas en archivos reales de tests; ver tareas/evidencia. El linker del sandbox solo añade
`/etc/ld.so.cache` y `/etc/alternatives` en lectura para resolver bibliotecas del sistema, sin montar
configuración privada. La importación de los tres iniciales se ejecuta en orden canónico003 y
se valida con materiales sintéticos; materiales oficiales y operación siguen pendientes.
