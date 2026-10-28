# Implementation Plan: Historias, audio y reflexión educativa

**Branch real**: `main` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)
**Feature activa de los scripts**: `003-historias-educativas` (no crea rama Git).
**Estado**: textos públicos aprobados; guard editorial y render HTTP200. Cuatro historias publicadas/activas localmente con mandato de la responsable; revisión final y cierre productivo pendientes.

## Summary

Construir /historias.html sobre PublicLayout de 001, con hero, catálogo, audio/transcripción,
reflexión local, metodología, identidad y cierre en orden PDF 2. Reutilizar Astro y TypeScript;
no añadir framework, reproductor externo, servicio analítico ni backend en esta feature.
El shell estático obtiene una proyección pública actual desde un contrato de lectura de 007;
no incrustar registros de administración ni un catálogo de producción congelado al compilar.
Componentes y pruebas independientes usan fixtures identificados; no sustituyen integración
ni materiales oficiales. H01–H12 y SC-001–007 se conservan.

## Technical Context

**Language/Version**: TypeScript 5.9.3 estricto, HTML/CSS; Node 24.19.0 y npm 11.9.0 existentes.
**Primary Dependencies**: Astro 7.4.0, @astrojs/check 0.9.10, Playwright 1.64.1,
axe 4.14.0 y @types/node 24.19.2. Sin dependencias nuevas previstas.
**Storage**: configuración editorial versionada; catálogo persistido y recursos a cargo de 007.
Selecciones únicamente en memoria DOM/JS, sin localStorage, sessionStorage, cookies ni envíos.
**Testing**: validadores con node:test; Astro check/build de banco separado; Playwright/axe;
regresión 001/002; aceptación integrada contra 007 real, medios y destinos aprobados.
**Target Platform**: shell Astro estático, navegadores de escritorio/móvil; lectura JSON same-origin
mediante fetch, controles HTMLMediaElement. API y distribución de recursos pendientes de 007.
**Project Type**: página pública y consumidor de catálogo, no editor ni API implementada aquí.
**Performance Goals**: hero/enlaces/metodología en HTML; preload=metadata, sin autoplay,
imágenes con dimensiones reservadas y lazy fuera de hero. Feedback sin red ni espera asíncrona.
No introducir SLA, volumen máximo, analítica o paginación arbitrarios. Medir catálogo completo
con volumen representativo acordado con 007 antes de cerrar integración.
**Constraints**: 7 anchos × texto 100%/200%, contraste 4.5:1 normal/3:1 grande y controles,
controles objetivo 44px; recursos/copy/revisiones oficiales pendientes. Sin proveedor elegido.
**Scale/Scope**: una página, tres casos iniciales elegibles, nuevas historias activas sin límite
artificial de tres, tres opciones por caso, nueve explicaciones iniciales; cero respuestas almacenadas.

## Constitution Check

| Principios | Antes de investigación | Tras diseño |
|---|---|---|
| CONST-01–03 | H01–H12 y composición PDF 2 delimitan trabajo | Sin caso María adicional, comentarios, puntuación, editor o catálogo separado |
| CONST-04 | IDs y escenarios locales preservados | Contratos/modelo/guía enlazados; no inventar IDs históricos ausentes |
| CONST-05–06 | No recopilar selecciones ni secretos | Lectura pública sin credenciales; feedback local; render de texto sin HTML arbitrario |
| CONST-07 | Solo publicada y activa pública | 007 filtra en servidor y controla recursos; sin fallback estático obsoleto |
| CONST-08–09 | Materiales y hechos requieren validación | Gate editorial, audio real, transcripción, feedback anunciado, destinos verificados |
| CONST-10–12 | Diseño no significa aceptación | Fixtures separados; recursos, integración y revisión visual bloquean cierre afectado |

Gates previos y posteriores: pasa para diseño independiente, sin excepciones constitucionales.
No hay incógnitas técnicas propias de 003 sin tratamiento; servicio, hosting y revocación de
recursos siguen dependencias de 007, no hechos operativos confirmados. No autoriza publicar
la página como completa sin esos servicios y materiales.

## Project Structure

### Documentation (this feature)

```text
specs/003-historias-educativas/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/historias.md
├── quickstart.md
├── checklists/requirements.md
├── tasks.md
└── evidence/
```

[tasks.md](tasks.md) generado con `$speckit-tasks 003`; resultados y bloqueos en [evidence/summary.md](evidence/summary.md).

### Source Code (implementado; integración externa pendiente)

```text
src/pages/historias.astro
src/components/stories/{StoriesContent,StoriesHero,StoriesCatalog,StoryCard,StoryAudio,StoryExercise,StoriesMethod,StoriesIdentity,StoriesClosing}.astro
src/content/stories.ts
src/config/social.ts
src/lib/{stories-contract,stories-publication}.ts
src/scripts/{stories-catalog,stories-audio,stories-exercise}.ts
src/styles/stories.css
scripts/require-stories-publication.mjs
public/images/stories/
playwright.stories.config.ts
tests/stories-publication.test.ts
tests/stories-contract.test.ts
tests/fixtures/stories/{astro.config.mjs,tsconfig.json,public/,src/pages/}
tests/e2e/{stories,stories-accessibility,stories-integration}.spec.ts
```

**Structure Decision**: PublicLayout pageId=historias y contentLayout=full ya disponibles;
no copiar header/footer, lógica de menú o anclas de 001. CSS acotado a stories.
Los componentes Astro definen shell y plantilla segura de tarjeta; el script instancia
contenido desde DTO validado con textContent/atributos seguros, sin innerHTML de respuesta.
Un solo camino de render/interacción se usa en producción y banco; fixtures no duplican UI.
Contrato público en stories-contract sin importar modelos privados de 007.

## Phase 0 — Investigación

[research.md](research.md): reutilización, catálogo vigente frente a build estático,
medios nativos, interacción local, gates y aislamiento. Investigación delegada según skill;
consolidación basada en archivos del repo, sin servicios externos ni instalaciones.

## Phase 1 — Diseño

[data-model.md](data-model.md) define DTO/estados y validación;
[contracts/historias.md](contracts/historias.md) fija interfaz de lectura propuesta a 007,
DOM, errores, privacidad y pruebas; [quickstart.md](quickstart.md) separa comandos actuales
de futuros y aceptación contractual de integrada. Cambios en el contrato durante planificación
007 deben sincronizar consumidor y pruebas, sin ampliar requisitos por decisión técnica.

## Estrategia de ejecución posterior

1. Banco stories con salidas/cache/trazas/puerto propios; pruebas negativas de validación y publicación.
2. Shell y hero/método/identidad/cierre; catálogo con carga/error/vacío/listado y expansión sin duplicar.
3. Audio real nativo, metadatos, errores y transcripción; radios locales y feedback accesible.
4. Gate de recursos/editorial/Instagram/marca y contrato configurado, previo a build y en entrada real.
   Mantener guards de páginas y de Inicio. No añadir páginas ficticias ni bypass público.
5. Matriz, privacidad, fallos y regresión; registrar resultados reales y bloqueos.
6. Integrar 007, recursos y estado vigente incluyendo desactivar/reactivar/editar, URLs de recursos,
   navegación a Inicio y cuenta Instagram compartida con 005. Solo entonces cierre integral.

No se implementa endpoint, subida, autenticación, hosting ni publicación administrativa en 003.
El guard local no prueba vigencia remota: cierre requiere evidencia de integración real.

## Complexity Tracking

Sin infracciones. fetch/DTO y banco separado se justifican por estado persistido vigente y
pruebas independientes; no introducir una segunda app, almacén de respuestas o framework UI.

## Registro

2026-10-16 — `$speckit-plan 003`: diseño de fases 0/1 y contratos de consumidor.
Sin código, instalación, pruebas de aplicación, commit o publicación.

2026-10-17 — Implementación: consumidor/DTO, audio nativo, reflexión local, shell completo,
gate y banco aislado. Contrato007 no desplegado; medios y revisiones oficiales pendientes.
Sin nuevo proveedor ni dependencia. Resultados y límites en evidence/summary.md.

## Reanudación — 2026-10-26

Marca, fuente y paleta compartidas recibidas desde001 e incorporadas a003. Las seis imágenes aportadas se identifican por nombre/destino en [evidence/materials.md](evidence/materials.md); sus archivos originales todavía no están disponibles en el entorno/GitHub. No se marcan verificadas ni se inventan dimensiones. Se conserva el bloqueo de imágenes propias/editorial/Instagram y aceptación integrada. Carpeta GitHub `public/images/stories/` preparada para recibir los PNG.

2026-10-26 — Archivos de las seis imágenes recibidos en6e7f523 y conectados con dimensiones/procedencia verificadas. Tres ilustraciones de bloques y tres portadas por ID inicial, sin alterar publicación/estados007. Los avisos anteriores de falta de archivos son históricos. Audios: carpeta fuente content/stories/audio/ preparada en GitHub; revisar transcripciones/explicaciones antes de publicar. [Evidencia](evidence/connected-images.md).

Decisión vigente 2026-10-28: audios identificados por la responsable como recreaciones educativas. Ajustar títulos, descripciones y metodología para expresarlo; retirar auditorías y recursos continuos no acreditados, usando el alcance educativo aprobado en Inicio. No aprueba ejercicios ni publicación del catálogo.

## Aprobación editorial aplicada — 2026-10-28

La responsable respondió «Sí, apruebo los textos públicos corregidos» para hero, metodología, cierre, identidad, catálogo y pasos Escucha/Reflexiona/Aplica. Se registraron cinco snapshots inmutables en src/content/stories-review.json, con referencia a evidence/public-copy-review.md; el guard sigue invalidando modificaciones materiales. No se aprobaron ejercicios ni se importaron/publicaron historias.

Verificación: 45/45 pruebas Node Inicio/Historias, guard003 salida 0 y Astro check (95 archivos, 0 errores/advertencias, 1 hint previo). Integración real002: 18/18 aprobadas, seis recorridos por motor Chromium/Firefox/WebKit. Historias HTTP200; /api/public/historias HTTP404: el catálogo007 aún no está conectado al servidor local. Captura .test-output/stories-approved.png. Build completo conserva salida1 en guard010/009.

La navegación desde Inicio ya está verificada; T027/T031 de002 mantienen el requisito residual de build completo, y T028 el cierre integral: 30/33 tareas. No se confunde renderizado de Historias con disponibilidad del catálogo, aprobación de ejercicios ni publicación productiva. Logs: .test-output/stories-approved-unit.log, stories-approved-check.log, home-approved-integration.log y home-approved-build.log.

## Conexión local autorizada — 2026-10-28

La responsable solicita conectar Historias003 con007. En desarrollo local, servir /api/public/historias y /media/public/ mediante el servicio real007 y SQLite privado persistente, en el mismo origen de Astro. Activación explícita PRIVA_STORIES_MODE=local; solo loopback/Host exacto. No provisionar cuentas, exponer endpoints administrativos ni importar/publicar fichas sin revisión. Un catálogo vacío confirmado debe mostrarse como tal, sin sustituir datos ni simular episodios. Build/preview y configuración productiva siguen independientes. Datos fuera del checkout y roots estáticos; almacenamiento0700/0600 y cierre en shutdown.

Conexión007 vigente — 2026-10-28: /api/public/historias ya responde200 con SQLite real en el servidor local. No hay publicaciones activas; la UI muestra vacío confirmado.6/6 pruebas navegador aprobadas. [Detalles y límites](../007-gestion-historias/local-connection.md). Los registros anteriores de catálogo404 son históricos.

## Publicación local vigente — 2026-10-28

Cuatro historias autorizadas/publicadas/activas en catálogo007 real, incluido Número desconocido con portada oficial reutilizada expresamente aprobada. Tres recorridos navegador completos aprobados, audios/transcripciones/doce explicaciones y expansión verificados; no mocks. Publicación local no equivale a despliegueFirebase ni cierra revisión manual/build productivo. [Registro](evidence/local-publication.md). Los estados anteriores de catálogo vacío o fichas sin publicación son históricos.

## Acceso a la cuarta historia — 2026-10-28

La responsable solicita hacer visible el botón para la cuarta historia. Situar el control Ver más historias después de las tres tarjetas iniciales. Al expandir, conservar tarjetas y selecciones existentes, añadir pendientes sin duplicar y enfocar/mostrar el título de la primera historia añadida. Ocultar el control tras añadir todas las adicionales; exponer relación aria-controls/aria-expanded. Con tres o menos se conserva el comportamiento previo sin añadir tarjetas.
