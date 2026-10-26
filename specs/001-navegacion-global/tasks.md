# Tasks: Navegación y estructura común — 001

**Input**: [spec](spec.md), [plan](plan.md), [research](research.md), [modelo](data-model.md),
[contrato](contracts/navigation.md), [guía](quickstart.md) y constitución 1.0.0.
**Fecha**: 2026-10-16. **Actualización**:2026-10-23. **Estado**:23/28 tareas completas;5 parciales por integración de destinos y revisión final de las cuatro páginas; WebKit y controles manuales de Inicio ya verificados. Ver evidence/closure-status.md.
**Tests**: incluidos porque el spec exige recorridos observables y accesibilidad verificable.
Escribir pruebas antes del comportamiento y comprobar el fallo pertinente; no confundir fallo
por entorno roto con fallo funcional. No se impone cobertura numérica arbitraria.
**Formato**: `- [ ] Tnnn [P opcional] [USn en historias] descripción y ruta`.
IDs T001–T028 locales a esta feature; no son los TSK-R históricos ausentes.
`[P]` indica archivos separados tras completar prerrequisitos, no autorización para abrir agentes.

## Phase 1: Setup — tooling reproducible

Preparar el proyecto sin implementar contenido de otras features.

- [X] T001 Crear `package.json` y `package-lock.json` con Astro 7.4.0, @astrojs/check 0.9.10, TypeScript 5.9.3, @playwright/test 1.64.1 y @axe-core/playwright 4.14.0; scripts dev/check:contract/build:contract/check/build/preview/test:e2e:contract/test:e2e:integration según quickstart; usar caché npm escribible y verificar compatibilidad real sin relajar firmas/TLS.
- [X] T002 Configurar `astro.config.mjs` con output static, build.format file y trailingSlash never; `tsconfig.json` con modo estricto; `.gitignore` para node_modules, dist, .astro, .test-output y resultados locales; conservar archivos existentes. Depende de T001.
- [X] T003 Configurar `playwright.config.ts` con suites contractuales/integradas separadas, Chromium/Firefox/WebKit y servidor contractual de fixtures aislado; faltar PRIVA_INTEGRATION_BASE_URL debe producir bloqueo explícito en la suite integrada, sin fallo de configuración de la contractual. Depende de T001–T002.

## Phase 2: Foundational — contrato y banco de pruebas

Completar antes de implementar historias. No introduce base de datos, secretos ni servicios privados.

- [X] T004 Definir `src/config/navigation.ts` con PageDefinition: id “unión cerrada inicio/historias/app/contacto; único”, label “Inicio/Historias/Priva App/Contáctanos, respectivamente”, href “/index.html, /historias.html, /app.html, /contacto.html”, order “posiciones 1–4, sin duplicados”; CTA y footer según contracts/navigation.md; hrefs “no vacíos ni # aislado”. Depende de T002.
- [X] T005 [P] Preparar `tests/fixtures/navigation/` con un proyecto Astro de pruebas que importe los componentes reales desde src, títulos y destinos explícitamente de prueba; configurar `tests/fixtures/navigation/astro.config.mjs` y tsconfig de prueba; generar cuatro .html en `.test-output/navigation/`, fuera de dist de entrega. No duplicar implementaciones de header/footer ni simular autorización. Depende de T003–T004; usar layout neutro de prueba mientras falten componentes.
- [X] T006 [P] Crear `src/layouts/PublicLayout.astro` con pageId válido, título, idioma español, landmarks y slots de header/main/footer; importar `src/styles/global.css` con base accesible y foco visible; mantener menú/header/footer como slots hasta integrar cada historia. Depende de T004.
- [X] T007 Ejecutar `npm ci`, `npm run check:contract`, `npm run build:contract` y arranque de Playwright sobre `.test-output/navigation/`; no exigir build de aplicación ni páginas reales antes de T023; documentar versiones y resultado en `specs/001-navegacion-global/evidence/setup.md`. Distinguir scaffold válido de historias aún no implementadas. Depende de T005–T006.

## Phase 3: User Story 1 — Ubicarse y recorrer las páginas (P1, MVP)

G01; prueba independiente: cuatro páginas de prueba, 16 recorridos, logo, activo, teclado y menú compacto. Los fixtures no acreditan fidelidad ni contenidos finales.

- [X] T008 [P] [US1] Escribir `tests/e2e/navigation.spec.ts` para US1.1–US1.3/US1.5: 16 pares origen-destino, logo desde cuatro páginas, entrada directa, recarga y exactamente un aria-current; expectativas basadas en contrato, no importadas de la misma configuración probada. Confirmar fallo por comportamiento ausente antes de implementar. Depende de T007.
- [X] T009 [P] [US1] Escribir `tests/e2e/navigation-accessibility.spec.ts` para US1.4: abrir/cerrar, Escape/foco, Tab/Shift+Tab, resize abierto/cerrado y navegación sin JS; no roles menu/menuitem ni enlaces ocultos enfocables; registrar fallo inicial. Depende de T007.
- [X] T010 [US1] Implementar `src/components/SiteHeader.astro` con navegación nativa, logo solo si existe recurso oficial, pageId explícito, un único aria-current y botón disclosure accesible; no inventar marca gráfica. Si falta logo, dejar fidelidad bloqueada y validar logo solo con recurso de prueba identificado en fixtures. Depende de T008–T009.
- [X] T011 [US1] Implementar `src/scripts/navigation.ts`: mode compact/expanded por espacio disponible, “open: booleano efímero solo relevante en compact”, sin persistencia; aria-expanded/aria-controls coherentes; Escape devuelve foco; antes de ocultar foco en resize devolverlo al trigger; sin JS enlaces visibles y operables; no interceptar clic modificado. Depende de T010.
- [X] T012 [US1] Integrar header en `src/layouts/PublicLayout.astro` y estilos de menú en `src/styles/global.css`; declarar pageId en cada fixture bajo `tests/fixtures/navigation/`; no crear páginas públicas de relleno para aparentar otras features completas. Depende de T011.
- [X] T013 [US1] Ejecutar pruebas US1 contractuales sobre build servido y registrar conteos, navegadores, comandos y evidencias en `specs/001-navegacion-global/evidence/us1.md`; corregir defectos y repetir afectados, sin dar G01 integrado por completo con fixtures. Depende de T012.

## Phase 4: User Story 2 — Llegar a casos y descarga (P2)

G02/G03; prueba independiente: cuatro CTA desde páginas de prueba con títulos destino; no requiere footer ni disponibilidad de tiendas.

- [X] T014 [US2] Añadir `tests/e2e/navigation.spec.ts` para US2.1–US2.4: cuatro CTA por origen, teclado/puntero, URL/ancla exacta, título visible y ausencia de descarga automática; comprobar casos sin historias y descarga Próximamente en fixtures identificados; registrar fallo previo. Depende de T013 por archivo compartido.
- [X] T015 [US2] Integrar CTA en `src/components/SiteHeader.astro` desde CtaDefinition: “label: PROTÉGETE HOY o DESCARGAR APP”, “targetSection: casos o descarga”; hrefs por contrato, sin URLs de tiendas; comportamiento independiente de disponibilidad. Depende de T014.
- [X] T016 [US2] Completar anclas y navegación por teclado en `src/scripts/navigation.ts` y `src/styles/global.css`: título destino visible con scroll-margin-top si hay header fijo; foco mejorado sin controles extra ni interferir navegación nativa; respetar prefers-reduced-motion. Depende de T015.
- [X] T017 [US2] Ejecutar US2 y regresión afectada US1 sobre build contractual; registrar resultados y bloqueos de anclas reales 003/004 en `specs/001-navegacion-global/evidence/us2.md`. Depende de T016.

## Phase 5: User Story 3 — Footer y acceso complementario (P2)

G04–G06; prueba independiente: identidad/footer en cuatro fixtures y contratos de enlace. La seguridad y textos definitivos requieren integración real.

- [X] T018 [US3] Añadir pruebas US3.1–US3.4 a `tests/e2e/navigation.spec.ts` para lema/copyright idénticos y 16 enlaces de footer; contratos de destino sin afirmar que un fixture prueba login o texto legal aprobado; registrar fallo previo. Depende de T017 por archivo compartido.
- [X] T019 [US3] Implementar `src/components/SiteFooter.astro` desde FooterDefinition común: lema “Defendiendo la soberanía digital individual.”, copyright “© 2026 Priva. Todos los derechos reservados. Navega con dignidad.”, año fijo y cuatro enlaces exactos; logo sujeto a recurso oficial pendiente. Depende de T018.
- [X] T020 [US3] Integrar footer en `src/layouts/PublicLayout.astro` y diseño adaptable/foco en `src/styles/global.css`; comprobar orden y nombres de enlaces sin publicar documentos o formularios ficticios. Depende de T019.
- [X] T021 [US3] Preparar `tests/e2e/navigation-integration.spec.ts` para login006, documentos010 y formulario005; consumir el contrato006 C1/C2/C3 recibido mediante `tests/helpers/navigation-private-contract.ts`. Definidos GET/HEAD de páginas privadas y GET de sesión con401/403 exactos, sin aceptar404 o login ficticio como autorización. `tests/navigation-service.test.ts` verifica el guard real006/SQLite local con cookies ausentes/inválidas; no acredita templates oficiales ni alojamiento. Ejecución integrada pendiente en T027, sin mocks ni baseURL inventada. Depende de T020 y contrato006 disponible.
- [X] T022 [US3] Ejecutar US3 contractual y registrar resultados en `specs/001-navegacion-global/evidence/us3.md`; distinguir enlace correcto de G05/G06 integrados pendientes. Depende de la parte independiente de T021; el contrato privado pendiente no bloquea la suite contractual.

## Phase 6: Polish — integración, accesibilidad y evidencia

Concluir trabajo independiente y mantener abiertas las tareas que requieran recursos o servicios ausentes.

- [ ] T023 Conectar layout a `src/pages/index.astro`, `src/pages/historias.astro`, `src/pages/app.astro` y `src/pages/contacto.astro` cuando existan contenidos de 002–005; verificar archivos dist/*.html y anclas casos/descarga/escribir sobre build real. Si no existen, registrar bloqueo sin implementarlas fuera de alcance. Depende de T013/T017/T022 y 002–005.
- [X] T024 Integrar recursos oficiales recibidos en `public/brand/` y referencias de `src/components/SiteHeader.astro`/`src/components/SiteFooter.astro`; inventario y faltantes en `specs/001-navegacion-global/evidence/resources.md`. No inventar logo/tipografía/hex; fidelidad sigue bloqueada mientras falten. Depende de T020 y recursos oficiales.
- [ ] T025 Completar matriz automatizada en `tests/e2e/navigation-accessibility.spec.ts`: Chromium a cada ancho 360/390/430/768/1024/1280/1440 px con texto 100%, repitiendo 16 recorridos del menú, cuatro retornos por logo, cuatro CTA y 16 enlaces del footer con teclado/puntero; comprobar destinos/títulos visibles, sin overflow, foco/resize y axe; recorridos principales Firefox/WebKit; ausencia de cookies/storage/solicitudes externas de navegación. No declarar auditoría completa por axe. Depende de T023–T024 para la aceptación final; puede adelantarse en fixtures tras T022.
- [ ] T026 Repetir a texto realmente ampliado al 200% en cada uno de los siete anchos la matriz de T025 (16 recorridos de menú, cuatro logos, cuatro CTA y 16 enlaces de footer, teclado/puntero); revisar lector de pantalla, foco, contraste 4.5:1 normal y 3:1 grande/componentes, controles aproximadamente 44 px y fidelidad; guardar método, entorno, capturas y resultado en `specs/001-navegacion-global/evidence/accessibility.md`. Si no hay capacidad o recurso necesario, registrar no ejecutado/bloqueado, no aprobación. Depende de T025.
- [ ] T027 Ejecutar check/build de aplicación desde T023, check:contract/build:contract y suites contractuales y `tests/e2e/navigation-integration.spec.ts` con destinos reales 005/006/010; registrar comandos, conteos y resultados separados en `specs/001-navegacion-global/evidence/integration.md`; G05 exige autorización real, no 404 o login estático vacío. Depende de T023–T026 y servicios/contenidos reales.
- [ ] T028 Actualizar `specs/001-navegacion-global/quickstart.md`, `specs/TRACEABILITY.md` y `specs/001-navegacion-global/tasks.md` con evidencia por G01–G06/SC-001–005; marcar solo tareas efectivamente completadas y dejar aceptación integrada abierta ante bloqueos. No presentar edición del PDF o despliegue como realizados. Depende de T027 para cierre total; registrar progreso independiente antes si hay bloqueos.

## Dependencies & Execution Order

```text
T001 → T002 → T003 → T004 → (T005 || T006) → T007
T007 → (T008 || T009) → T010 → T011 → T012 → T013 [US1 MVP]
T013 → T014 → T015 → T016 → T017 [US2]
T017 → T018 → T019 → T020 → T021 (parte independiente) → T022 [US3 contractual]
Contrato privado de 006 → completar T021 (casos privados) → T027
T022 + 002–005 → T023
T020 + recursos oficiales → T024
T023 + T024 → T025 → T026
T026 + T023 + servicios 005/006/010 → T027 → T028 [cierre integrado]
```

El orden secuencial entre historias evita ediciones concurrentes en navigation.spec.ts,
SiteHeader, PublicLayout y global.css. Las historias conservan pruebas independientes:
US2 no necesita footer; US3 puede probarse con header neutral en el banco contractual.
La aceptación integrada depende de features externas; no reconstruirlas dentro de 001.
Los recursos pendientes no impiden el avance contractual, pero sí suplantar la marca o cerrar fidelidad.

## Parallel Examples

- Fundaciones: tras T004, T005 (fixtures) y T006 (layout base) usan archivos distintos.
- US1: tras T007, T008 (recorridos) y T009 (accesibilidad) pueden redactarse en paralelo.
- US2: después de T017, el análisis de evidencias us2.md puede revisarse mientras se redactan
  las pruebas US3 en T018; no editar el header simultáneamente ni marcar una tarea parcial completa.
- US3: después de T020, puede revisarse el contrato de integración para T021 mientras se revisa
  manualmente el footer; T022 espera solo la parte independiente de T021; no espera servicios privados ni su contrato pendiente.
- No hay más tareas de implementación marcadas [P] en US2/US3: comparten archivos y se ejecutan
  en secuencia. Estos ejemplos son oportunidades organizativas, no trabajo delegado iniciado.

## Trazabilidad

| Requisito | Historia/criterios | Tareas principales | Evidencia prevista |
|---|---|---|---|
| G01 / FR-001 | US1.1–US1.5; SC-001/004/005 | T004–T013, T023–T027 | evidence/us1.md; evidence/accessibility.md |
| G02 / FR-002 | US2.1/2/4; SC-002 | T014–T017, T023, T025–T027 | evidence/us2.md |
| G03 / FR-003 | US2.3/4; SC-002 | T014–T017, T023, T025–T027 | evidence/us2.md |
| G04 / FR-004 | US3.1; SC-003 | T018–T020, T022, T024–T027 | evidence/us3.md; evidence/resources.md |
| G05 / FR-005 | US3.2; SC-003 | T018–T022, T027 | evidence/us3.md; evidence/integration.md |
| G06 / FR-006 | US3.3/4; SC-003 | T018–T023, T027 | evidence/us3.md; evidence/integration.md |

Las rutas de evidencia son futuras; no se crean informes aprobados durante generación de tareas.
T028 sincroniza todos los requisitos. Los criterios del catálogo 07 siguen sin aportar/verificar.

## Implementation Strategy

MVP de trabajo: Setup + Foundational + US1 (T001–T013). Demuestra navegación en un banco
identificado; no equivale a sitio publicable ni aceptación integral G01 sin recursos/contenidos.
Añadir US2 y US3 en ese orden, validar cada incremento y repetir solo regresión afectada.
No desplegar ni publicar sin instrucción correspondiente. Trabajar en checkout existente;
no crear worktree por defecto ni cambiar a otra feature silenciosamente.

Al encontrar una dependencia externa faltante, completar trabajo independiente y registrar
su estado. No aprobar una tarea por código escrito o por un test con mocks. Las pruebas
integradas y recursos pendientes impiden cerrar completamente esta feature.

## Registro documental

2026-10-16 — `$speckit-tasks 001`: generadas 28 tareas; US1=6, US2=4, US3=5;
Setup=3, Foundational=4, Polish=6. Sin instalación, código de aplicación ni pruebas ejecutadas.

2026-10-16 — Corrección autorizada tras análisis: I1 separa builds/checks contractual y
aplicación (T001/T005/T007/T023/T027); U1 hace explícito contrato privado pendiente de
006 sin bloquear trabajo independiente (T021/T022); U2 detalla matriz por ancho y texto
100%/200% (T025/T026). Se conservan 28 tareas sin ejecutar y los IDs G01–G06.

## Estado tras implementación y reanudación2026-10-20

- T001–T022 completas: tooling/componentes y contratoG05 preparado; T021 se completa al recibir contrato006 y definir casos concretos. Dos casos de servicio006 real con SQLite aislado verifican guard401/403; no se apruebaG05 integrado por esa prueba local.
- T023 parcial: páginas002–005 ya existen y consumen layout común con pageId correcto; falta build/dist y comprobación integrada de anclas. La ausencia actual es aprobación/recursos/operación, no archivos inexistentes.
- T024 completa: logo oficial104×40 y referencia de paleta/PlusJakartaSans recibidos por instrucción de la usuaria; integrados y verificados localmente. Fuente local conOFL y hashes; sin llamadas externas del visitante. No equivale a fidelidad finalT026.
- T025 parcial: matrizChromium existente y nueva regresiónFirefox; WebKit y aceptación real pendientes. Ver resultados definitivos en evidence/summary.md.
- T026 parcial: texto200% contractual; lector de pantalla, materiales/fidelidad finales pendientes.
- T027 parcial: check/build contractual; integración preparada y bloqueada sin baseURL real; build de aplicación bloqueado por010/009 y gates de otras features sin relajar.
- T028 parcial: documentación actualizada; cierre total depende de aceptación integrada y recursos reales.

Corrección de foco de reactivación del mismo fragmento: Firefox completa la activación nativa después del click y puede devolver foco albody en keyupEnter. Se difiere mejora de foco tras activación ykeyup; sin preventDefault, cambios de URL/historial ni interferencia con clics modificados. El caso existente falló antes y pasó después. No se modificaron checklists ni se publicaron fixtures.23/28 completas no equivale a23 requisitos originales ni cierre productivo.

## Revisión de tareas abiertas — 2026-10-23

Revalidación solicitada para cerrar001:46Chromium,32Firefox y2Node de autorización aprobados;4 comprobaciones adicionales del menú/footer sobre Inicio real también conformes. Checks raíz y contractual sin errores/advertencias. Las cuatro páginas existen y usan el layout compartido. El guard de Inicio pasa; los de003/004/005/006/010 conservan pendientes y el build completo falla en010. WebKit falla antes de iniciar por libGLESv2.so.2. Suite integrada bloqueada sin baseURL real.

T023/T025/T026/T027/T028 permanecen parciales según sus criterios originales;23/28 completas, sin cerrar integración mediante fixtures. La aceptación manual de002 no se atribuye a menú/footer de001; se solicitó revisión específica en el Mac de la usuaria, aún pendiente. Estado detallado, evidencia por tarea y secuencia para desbloquear en [evidence/closure-status.md](evidence/closure-status.md).

2026-10-23 — Respuesta de revisión manual001 recibida: controles de menú/footer en Inicio confirmados por la usuaria en Mac/VoiceOver; ver evidence/manual-navigation-review.md. Cambio explícito de Contacto Seguro a `/contacto.html` sin ancla implementado y reflejado en contrato001/spec005 y pruebas. T026 avanza en su parte manual; sigue pendiente aceptación final de las cuatro páginas junto con T023/T025/T027/T028.23/28 tareas sin cierres ficticios.

## WebKit completado — 2026-10-26

32recorridos principales de WebKit27.2 aprobados,0fallos/omitidos, mediante nuevo script reproducible `npm run test:e2e:contract:webkit`. Se resolvió la detección de bibliotecas mediante caché privada y bwrap rootless, sin cambiar el sistema ni omitir controles. Evidencia en evidence/webkit-runtime.md. La parte navegador de T025/T026 ya está verificada en los tres motores; permanecen pendientes sus criterios de aceptación final dependientes de T023. T023 espera build/destinos completos; T027 espera integración real; T028 espera cierre integrado.23/28 tareas completas, sin nuevos cierres por una comprobación parcial.
