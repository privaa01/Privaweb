# Tasks: Inicio e identidad de Priva — 002

**Input**: [spec](spec.md), [plan](plan.md), [investigación](research.md),
[modelo](data-model.md), [contrato](contracts/home.md), [guía](quickstart.md) y constitución 1.0.0.
**Fecha**: 2026-10-16 (America/Bogota). **Estado**: 23 completadas; T023/T025–T028 permanecen parciales o bloqueadas.
**Tests**: incluidos por los escenarios verificables del spec. Escribir y comprobar el fallo
funcional antes del comportamiento correspondiente; imports ausentes o entorno roto no
prueban la ausencia de funcionalidad. No imponer cobertura numérica arbitraria.
**Formato**: `- [ ] Tnnn [P opcional] [USn en historias] descripción con ruta`.
Los IDs son locales a 002, independientes de los Tnnn de 001 y del catálogo histórico ausente.
No crear worktree ni otra rama por defecto. [P] describe oportunidades de trabajo, no inicia agentes.

## Phase 1: Setup — ampliar tooling sin cambiar dependencias

Reutilizar el lockfile y conservar las suites de 001.

- [X] T001 Añadir en `package.json` los cuatro scripts check:home:contract/build:home:contract/test:e2e:home:contract/test:e2e:home:integration definidos en quickstart.md; mantener versiones y scripts de 001, telemetría Astro desactivada y caché npm escribible. Sin dependencias nuevas de runtime; corrección justificada al implementar: @types/node 24.19.2 de desarrollo, fijado en lockfile para fs/path.
- [X] T002 Configurar `tests/fixtures/home/astro.config.mjs` y `tests/fixtures/home/tsconfig.json` con salida file .html, root propio, `.test-output/home` y caché `.test-output/home-cache`; crear página neutral `tests/fixtures/home/src/pages/index.astro` y destino Historias inequívocamente ficticio, sin copiar componentes ni usar dist. Depende de T001.
- [X] T003 Crear `playwright.home.config.ts` con testMatch de home.spec.ts/home-accessibility.spec.ts o home-integration.spec.ts según modo, reportes home separados, Python http.server sobre build real en 127.0.0.1:4323, Chromium/Firefox/WebKit y PRIVA_CHROMIUM_EXECUTABLE opcional. La suite integrada exige PRIVA_INTEGRATION_BASE_URL sin fallback ni afectar arranque contractual. Depende de T002.

## Phase 2: Foundational — contenido, publicación y layout

Prerrequisitos compartidos de las tres historias; ningún contenido se aprueba por completar esta fase.

- [X] T004 Definir tipos/datos en `src/content/home.ts`: ids “hero, somos-priva, que-hacemos o cierre; único por página”; orden hero → identidad → áreas → cierre; un h1, h2 de sección y h3 de tarjeta. AreaCard contiene title/description/review, sin href/onClick/control enfocable. EditorialReview: status “pendiente o revisado”, decisionReference requerida al revisar y reviewedText exacto; valores reales pendientes por defecto. Depende de T001.
- [X] T005 Escribir `tests/home-publication.test.ts` para rechazo de imagen ausente, cada review pendiente, revisado sin decisionReference, archivo inexistente aunque verificado, copy distinto del aprobado y C16 incorrecto; escribir regresión de full-width/default en `tests/e2e/home-accessibility.spec.ts`. Registrar fallo funcional antes del validador/layout; no usar fallo de importación como evidencia. Añadir casos conforme exista interfaz mínima, sin lógica de publicación todavía. Depende de T003–T004.
- [X] T006 Completar datos de ImageResource y crear `src/lib/home-publication.ts` y `scripts/require-home-publication.mjs`: block “hero, identidad o cierre”, status “pendiente o verificado”, src oficial local “requerida y existente para verificado”, width/height “dimensiones reales positivas”, purpose “informativo o decorativo”, alt “significativo si informativo; vacío si decorativo”, sourceReference oficial. Validar también reviews, orden, anclas e inventario de marca/fuente/colores; error no cero sin omitir bloques. Tests T005 deben escribirse y fallar antes de esta implementación; ejecutar `node --test tests/home-publication.test.ts` con soporte TypeScript del runtime Node fijado y conservar resultado en `specs/002-inicio-institucional/evidence/publication.md`. Depende de T005; ejecutar después, sin paralelismo con T005.
- [X] T007 Añadir opción full-width a `src/layouts/PublicLayout.astro` manteniendo default de 001 y un único main/header/footer; ajustar `src/styles/home.css` sin márgenes negativos ni cambio global del contenido existente. Verificar `npm ci`, check/build:home:contract y servidor del banco; guardar resultados en `specs/002-inicio-institucional/evidence/setup.md`. No ejecutar suite sin casos; el banco neutral no valida aún las historias. Depende de T002–T006.

## Phase 3: User Story 1 — Conocer la identidad (P1, MVP)

I01/I02. Prueba independiente: hero/identidad, Conocer más y entrada/recarga #somos-priva; no requiere áreas, formulario ni Historias real.

- [X] T008 [P] [US1] Escribir en `tests/e2e/home.spec.ts` los escenarios US1.1–US1.4: etiqueta/título/descripcion, orden imagen-texto, Conocer más con teclado/puntero, entrada directa/recarga y encabezado visible; ausencia de #maria/historia adicional. Usar componentes reales cuando se implementen y registrar fallo funcional previo en `specs/002-inicio-institucional/evidence/us1.md`. Depende de T007.
- [X] T009 [P] [US1] Preparar recursos y contenido identificados como ficticios bajo `tests/fixtures/home/public/` y `tests/fixtures/home/src/`; dimensiones y alternativas conocidas solo para estas pruebas. No moverlos a public de aplicación ni marcarlos oficiales en `src/content/home.ts`. Depende de T007; independiente de T008.
- [X] T010 [US1] Implementar `src/components/home/HomeHero.astro` y `src/components/home/HomeIdentity.astro` con textos de referencia del spec, ancla #somos-priva única y enlace nativo Conocer más; imagen reservada con dimensiones reales y alt apropiado, hero sin lazy loading. Importar CSS local y reutilizar foco/anclas de 001, sin JS nuevo si no hace falta. Depende de T008–T009.
- [X] T011 [US1] Conectar hero/identidad reales al banco `tests/fixtures/home/src/pages/index.astro` mediante PublicLayout con pageId inicio/full-width; conservar header/footer y contenido disponible sin JS, sin insertar contenido de otras historias para aparentar entrega. Depende de T010.
- [X] T012 [US1] Ejecutar US1 sobre build home servido y la regresión pertinente de navegación 001; registrar comandos, conteos, resultados y evidencia en `specs/002-inicio-institucional/evidence/us1.md`. Corregir fallos y repetir afectados; declarar solo aceptación contractual, no fidelidad final sin recursos. Depende de T011.

## Phase 4: User Story 2 — Comprender las áreas (P2)

I03. Prueba independiente: sección Qué hacemos con cuatro tarjetas y revisión editorial; no requiere CTA final.

- [X] T013 [US2] Añadir en `tests/e2e/home.spec.ts` US2.1–US2.4: introducción/título, #que-hacemos directa/recargada, cuatro tarjetas en orden exacto y ninguna acción/foco artificial. Probar rechazo de publicación de cada capacidad pendiente con `tests/home-publication.test.ts`; registrar fallo previo. Depende de T012 por archivo compartido.
- [X] T014 [US2] Preparar áreas en `src/content/home.ts`: exactamente Educación Digital, Historias reales, Herramientas Seguras, Acompañamiento, en ese orden; descripción no vacía y review también para introducción. Preservar P03 pendiente sin inventar servicios, testimonios o copy aprobado. Un cambio material invalida review anterior. Depende de T013.
- [X] T015 [US2] Implementar `src/components/home/HomeAreas.astro` y estilos en `src/styles/home.css`, integrar en el banco después de identidad y usar ancla #que-hacemos estable; cuadrícula informativa adaptable sin tarjetas clicables. No publicar copy pendiente fuera del banco. Depende de T014.
- [X] T016 [US2] Ejecutar casos US2 y regresión afectada US1; guardar resultados en `specs/002-inicio-institucional/evidence/us2.md`, con P03 aún bloqueante para publicación. No eliminar tarjetas ni cambiar silenciosamente su contenido para superar gate. Depende de T015.

## Phase 5: User Story 3 — Continuar hacia Historias (P2)

I04. Prueba independiente: cierre/copy C16/enlace; el destino del banco no acredita 003 real.

- [X] T017 [US3] Añadir a `tests/e2e/home.spec.ts` US3.1–US3.3: título/etiqueta/imagen, párrafo C16 exacto, ausencia de “Únete a miles de personas”, CTA teclado/puntero a /historias.html sin Instagram/descarga/#maria; registrar fallo previo. Depende de T016.
- [X] T018 [US3] Completar cierre en `src/content/home.ts` e implementar `src/components/home/HomeClosing.astro`: párrafo “Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.”, título “Infórmate, protégete, conéctate con seguridad.” y enlace Explora nuestras historias. Conservar imagen/jerarquía y fondo oscuro, sin afirmar disponibilidad de servicios. Depende de T017.
- [X] T019 [US3] Crear `src/components/home/HomeContent.astro` como composición única hero/identidad/áreas/cierre y conectarla en `tests/fixtures/home/src/pages/index.astro`; conservar un h1 y orden de lectura, fondo oscuro a ancho completo sin overflow. Probar destino contractual ficticio `tests/fixtures/home/src/pages/historias.astro`. Depende de T018.
- [X] T020 [US3] Ejecutar US3 y regresión contractual de historias previas; registrar resultados en `specs/002-inicio-institucional/evidence/us3.md`. La navegación al fixture valida href/interacción pero no cierra aceptación integrada I04. Depende de T019.

## Phase 6: Polish — entrada real, matriz y cierre

Terminar trabajo independiente; no marcar cerradas tareas con materiales, aprobación o destinos reales ausentes.

- [X] T021 Crear `src/pages/index.astro` usando PublicLayout/ HomeContent y validación previa de home-publication, sin opción de bypass pública. Actualizar build de `package.json` a require-pages existente → require-home-publication → astro build; ejecutar validador por separado para diagnosticar P01/P03/P04 si el guard de páginas detiene antes el build. Conservar bloqueo de páginas 003–005, sin crearlas como relleno. Depende de T020.
- [X] T022 Completar `tests/home-publication.test.ts` y ejecutar pruebas de pre-build/render: recurso pendiente/faltante, review pendiente, evidencia ausente, texto cambiado y C16 incorrecto deben bloquear con salida no cero antes de generar entrega; fixtures no pueden pasar como oficiales ni llegar a dist. Datos válidos sintéticos son solo casos de prueba sin aprobación real. Guardar en `specs/002-inicio-institucional/evidence/publication.md`. Depende de T021.
- [ ] T023 Completar matriz en `tests/e2e/home-accessibility.spec.ts`: a cada ancho 360/390/430/768/1024/1280/1440 y texto real 100%/200% repetir lectura/orden, Conocer más y CTA final teclado/puntero, entrada directa/recarga de ambas anclas; encabezados visibles, foco, sin recortes/overflow. Añadir axe, movimiento reducido, fallo de cada imagen, ausencia de cookies/storage/tráfico externo y regresión principal Firefox/WebKit cuando disponibles. Reportar bloqueos por navegador sin falsear pase. Depende de T020; no depende de recursos oficiales para evidencia contractual.
- [X] T024 Ejecutar check/build/suite home contractual, pruebas de publicación y regresión de 001 tras modificación de PublicLayout; verificar salidas/reportes separados en `.test-output/home`/`.test-output/navigation`. Documentar comandos, casos ejecutados, conteos y resultados en `specs/002-inicio-institucional/evidence/contract.md`. Dependencias T022–T023; no incluir suites integradas ni cero tests como éxito.
- [ ] T025 Incorporar recursos oficiales recibidos en `public/images/home/` y sus referencias/dimensiones/alt/origen en `src/content/home.ts`; registrar fuente/colores/logo y evidencia de revisión real de introducción/tarjetas antes de marcar verificado/revisado. Inventario pendiente en `specs/002-inicio-institucional/evidence/resources.md`; si faltan, continuar bloqueada sin inventarlos ni retirarlos. Depende de T021 y P01/P03/P04.
- [ ] T026 Revisar contra PDF 1 el render con recursos finales: disposición, orden al apilar, contraste 4.5:1 normal/3:1 grande-componentes, controles aproximadamente 44px, texto 200%, teclado y lector de pantalla. Registrar método/entorno/capturas/resultados en `specs/002-inicio-institucional/evidence/accessibility.md`; capacidad o material ausente = no ejecutado/bloqueado. Depende de T024–T025 para cierre final; revisión contractual puede adelantarse.
- [ ] T027 Crear `tests/e2e/home-integration.spec.ts` y ejecutar sobre PRIVA_INTEGRATION_BASE_URL real: /index.html, ambas anclas y CTA hacia /historias.html real de 003, sin mocks. Preparar casos definidos tras T020; ejecución integrada depende de T025–T026 y 003. Comprobar check/build completo solo con páginas reales 003–005 disponibles; registrar bloqueo explícito ante ausencia en `specs/002-inicio-institucional/evidence/integration.md`, sin fallback contractual.
- [ ] T028 Sincronizar `specs/002-inicio-institucional/quickstart.md`, `specs/002-inicio-institucional/tasks.md`, `specs/TRACEABILITY.md` y evidencia I01–I04/SC-001–005; marcar solo tareas efectivamente completas, distinguir contrato/integración y mantener pendientes materiales/editorial/destinos. Depende de T027 para cierre total; documentar progreso independiente aunque quede bloqueado.

## Dependencies & Execution Order

```text
T001 → T002 → T003
T001 → T004
T003 + T004 → T005 → T006 → T007
T007 → (T008 || T009) → T010 → T011 → T012 [US1]
T012 → T013 → T014 → T015 → T016 [US2]
T016 → T017 → T018 → T019 → T020 [US3]
T020 → T021 → T022
T020 → T023
T022 + T023 → T024
T021 + materiales/revisión P01/P03/P04 → T025
T024 + T025 → T026
T020 → redactar casos T027
T025 + T026 + 003 real → ejecutar T027 → T028 [cierre total]
Build completo de T027 requiere además páginas reales 004/005.
```

T005 precede a T006: la prueba negativa debe existir antes del validador.
El paralelismo ejecutable principal marcado [P] es T008/T009.
Dentro de cada historia, pruebas → implementación → ejecución/evidencia.
No editar concurrentemente home.spec.ts, home.css o home.ts entre historias; su orden evita conflictos.

US1 se prueba aislada con hero/identidad; US2 puede montarse con layout y datos de prueba
sin CTA final; US3 puede montarse aisladamente con fixture de Historias. El orden operativo
secuencial comparte archivos, no exige servicios nuevos para probar cada componente.
La entrada de entrega exige los cuatro bloques completos y publicación verificada;
el MVP contractual no equivale a página publicable.

## Parallel Examples

- Setup: T004 (modelo) puede redactarse mientras T002/T003 preparan tooling; T005 espera ambos.
- US1: T008 (pruebas de comportamiento) y T009 (recursos ficticios identificados) usan archivos distintos.
- US2: tras T014, la revisión documental de P03 puede avanzar junto con T015; no editar home.ts
  mientras se desarrolla una tarea que dependa de su forma. La revisión no aprueba por sí sola copy.
- US3: tras T020, escribir casos definidos de integración T027 puede avanzar junto con las pruebas
  de publicación T022 o matriz T023, en archivos distintos; la ejecución integrada espera dependencias.
- Final: T023 (matriz contractual) no espera recursos de T025; registrar resultados sin certificar fidelidad.

## Trazabilidad

| Requisito / resultado | Historia | Tareas principales | Evidencia prevista |
|---|---|---|---|
| I01 / FR-001 | US1.1–US1.2 | T008–T012, T021, T023–T027 | evidence/us1.md, evidence/contract.md |
| I02 / FR-002 | US1.2–US1.4 | T008–T012, T023–T027 | evidence/us1.md, evidence/accessibility.md |
| I03 / FR-003 | US2.1–US2.4 | T004–T006, T013–T016, T022–T027 | evidence/us2.md, evidence/publication.md |
| I04 / FR-004 | US3.1–US3.3 | T017–T020, T022–T027 | evidence/us3.md, evidence/integration.md |
| SC-001 | Orden y composición | T004, T010–T011, T015, T019, T023–T026 | evidence/contract.md |
| SC-002 | Controles y anclas | T008–T012, T013, T017–T020, T023–T027 | evidence/contract.md, evidence/integration.md |
| SC-003 | Copy y publicación | T005–T006, T014, T018, T021–T022, T025 | evidence/publication.md |
| SC-004 | Adaptación/texto | T007, T023–T026 | evidence/contract.md, evidence/accessibility.md |
| SC-005 | Recursos y fallos | T005–T006, T009–T010, T018, T022–T026 | evidence/resources.md, evidence/accessibility.md |

T001–T007 son soporte compartido; T028 sincroniza toda la trazabilidad. Las rutas de
evidencia son futuras: no se crean informes aprobados durante generación de tareas.

## Implementation Strategy

MVP de trabajo: T001–T012, identidad y Conocer más probados con recursos identificados del banco.
Luego completar áreas y cierre, siempre con validación independiente. La entrada real se conecta
en T021 con gate de publicación; las ausencias no se resuelven con placeholders de entrega.
No solicitar de nuevo decisiones ya aprobadas; pedir únicamente datos/decisiones materiales
que bloqueen la parte afectada y continuar el trabajo independiente.
Si faltan imágenes, copy revisado, navegador, lector de pantalla o destino real, registrar
bloqueado/no ejecutado; no marcar la tarea completa ni aprobar la feature por código existente.
No desplegar ni publicar como parte de este comando o de los fixtures.

## Registro documental

2026-10-16 — `$speckit-tasks 002`: generadas 28 tareas: Setup 3, Foundational 4,
US1 5, US2 4, US3 4, Polish 8. Sin implementación, instalación ni pruebas de aplicación ejecutadas.

## Estado tras implementación — actualización 2026-10-21

T001–T022 y T024 completas: 23/28. Componentes, contenido, validación y banco contractual implementados; resultados vigentes en evidence/summary.md y evidence/contract.md.
T023 parcial: matriz Chromium y recorridos principales Firefox; WebKit intentado y bloqueado por bibliotecas del host. No se marca completo por navegador ausente.
T025 parcial: marca, tipografía, paleta y cinco revisiones editoriales explícitas incorporadas; tres imágenes oficiales pendientes. El enlace provisional aportado devuelve HTTP 403.
T026 parcial: adaptación, texto y axe contractuales; lector de pantalla y fidelidad con imágenes finales pendientes.
T027 parcial: casos integrados preparados; falta URL real. Las páginas 003–005 ya existen en código.
T028 parcial: documentación sincronizada; cierre integral pendiente.
Checklist documental 16/16 sin cambios; no se aprueban recursos faltantes ni se publica con fixtures.
