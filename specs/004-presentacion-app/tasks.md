# Tasks: Presentación y disponibilidad de Priva App

**Fecha**: 2026-10-17 | **Feature**: `004-presentacion-app` | **Rama real**: `main`.
**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md),
[data-model.md](data-model.md), [contrato](contracts/app.md), [quickstart.md](quickstart.md)
y constitución 1.0.0. Se conservan A01–A07 y SC-001–006.
**Estado**: 30/32 tareas completas; 2 parciales/bloqueadas. Ver [evidence/summary.md](evidence/summary.md).
La generación inicial fue documental; los resultados siguientes corresponden a implementación.
**Pruebas**: corresponden a los escenarios y verificaciones exigidos por spec/contrato.
Escribir primero pruebas de comportamiento nuevo y comprobar un fallo significativo antes de
implementarlo; para comportamiento compartido ya existente, registrar su comprobación sin
provocar fallos artificiales ni reimplementar lo que ya funciona.

`[P]` indica archivos distintos que pueden trabajarse en paralelo tras sus prerrequisitos.
Casilla cerrada significa resultado con evidencia, nunca mera existencia de archivos ni dependencia
sin resolver. IDs Txxx locales; no reconstruyen el catálogo histórico HU/CA/TSK no aportado.

## Fase 1 — Setup

**Objetivo**: banco aislado, sin nuevas dependencias o proveedores. No modificar bancos001–003.

- [x] T001 Crear `tests/fixtures/app/astro.config.mjs`, `tests/fixtures/app/tsconfig.json` y scaffold `tests/fixtures/app/src/pages/app.astro`; salida `.test-output/app`, caché `.test-output/app-cache` y servidor Python estático en 4325, importando después los componentes reales sin duplicar UI.
- [x] T002 Configurar `playwright.app.config.ts` y scripts `check:app:contract`, `build:app:contract`, `test:e2e:app:contract` y `test:e2e:app:integration` en `package.json`; artefactos `.test-output/app-artifacts`, reportes `app-results.json`/`app-integration-results.json` por modo, reuseExistingServer=false y bloqueo explícito si integración carece de PRIVA_INTEGRATION_BASE_URL. Conservar versiones/lock y scripts existentes (depende T001).
- [x] T003 [P] Crear imágenes/telefonía sintética identificada en `tests/fixtures/app/public/`, incluida representación Conversar no interactiva y mockup neutral de prueba; nunca marcar recursos como oficiales ni colocarlos en `public/images/app/` de entrega.

**Checkpoint**: T001→T002; T003 independiente en sus recursos. No ejecutar procesos del banco app
simultáneos en 4325 ni usar fixtures como páginas finales.

## Fase 2 — Fundamentos compartidos

**Objetivo**: contratos tipados, contenido pendiente y datos de prueba. Depende de fase1.

- [x] T004 Definir modelos en `src/content/app.ts` y tipos en `src/lib/app-downloads.ts`, sin implementar todavía resolver: cinco grupos editoriales con revisión del texto exacto; DownloadConfig con platform «android o iphone; exactamente una entrada de cada una», status «pendiente o verificado», candidateURL «string o null; pendiente puede no tener URL y no emite candidata al cliente», verification «null o evidencia vinculada a URL exacta y plataforma». Verification incluye reviewedURL/platform/decisionReference/checkedAt no futura/appIdentity/accessibleAtReview=true. EffectiveDownload es pending sin URL o available con href exacto, independiente por plataforma. OfficialImage incluye block/src/dimensiones/purpose/alt/status/sourceReference/revisión; mockup compatible con máscaras00/10/01/11 según estado efectivo, no un booleano global.
- [x] T005 Poblar `src/content/app.ts` y `src/config/app-downloads.ts` con recursos/copy pendientes y ambas plataformas pendientes, sin URLs inventadas; mantener A07 exacto y referencias PDF3/R35. Revisiones ligadas al texto visible completo y al recurso/alternativa/compatibilidad, sin atribuir aprobación a los textos presentes del PDF ni escoger tiendas (depende T004).
- [x] T006 Crear `tests/fixtures/app/src/content.ts` tipado con testOnly=true y variantes00/10/01/11, metadatos/revisiones explícitos de prueba y URLs HTTPS distintas `https://downloads.priva.test/android`/`https://downloads.priva.test/iphone`; preparar interceptación sin salida real en `tests/e2e/app-fixture.ts`, también utilizable sin JS. Ninguna excepción del resolver permite HTTP/rutas relativas por ser fixture (depende T003/T004).

**Checkpoint**: modelos antes de datos; T005 y T006 pueden prepararse tras T004 en archivos
separados, evitando editar a la vez content/app.ts. Ningún gate requiere URLs reales para el
estado pendiente. Los recursos oficiales y P03 solo bloquean el cierre afectado.

## Fase 3 — US1: Comprender qué propone el prototipo (P1 / MVP contractual)

**Objetivo**: presentación comprensible y sin simulación operativa (A01–A05).
**Prueba independiente**: shell con datos de prueba y plataformas pendientes; comprobar los cuatro
grupos editoriales iniciales, beneficios/pasos/funciones y ausencia de chat, diagnóstico o registro.

- [x] T007 [US1] Escribir pruebas de contenido/no interacción en `tests/e2e/app.spec.ts`: prototipo y funciones previstas visibles, orden de los cuatro bloques iniciales, tres beneficios/cuatro pasos/tres funciones, Conversar sin rol/foco/clic/overlay, ausencia de campos, formularios, cuestionario y promesas retiradas; imagen fallida conserva texto (SC-001/004).
- [x] T008 [P] [US1] Construir `src/components/app/AppHero.astro` con MANEJA TU PRIVACIDAD, título/descripcion revisables, indicación visible de prototipo, imagen con dimensiones y los dos enlaces a #descarga/#como-funciona; no prometer funcionamiento actual (A01).
- [x] T009 [P] [US1] Construir `src/components/app/AppOverview.astro`: explicación y teléfono como imagen informativa, alternativa que comunique representación sin acción web y beneficios «Guía paso a paso, Privacidad digital, Ayuda clara y rápida» en ese orden; ninguna capa/button/a/tabindex o handler para Conversar (A02/A03).
- [x] T010 [P] [US1] Construir `src/components/app/AppSteps.astro` con sección#como-funciona y cuatro pasos «Escribe tu duda, Recibe instrucciones, Aplica los cambios, Mantente seguro» en orden1–4, encabezado identificable y flujo previsto; no formulario para escribir dudas ni promesa de respuesta actual (A04).
- [x] T011 [P] [US1] Construir `src/components/app/AppFeatures.astro` con «Tips, Asistente IA, Diagnóstico de Seguridad» y descripciones exclusivamente previstas/revisables; sin chat, evaluación, eliminación de datos ni acción de tarjetas (A05).
- [x] T012 [US1] Componer shell inicial en `src/components/app/AppContent.astro`, estilos acotados `src/styles/app.css` y página del banco `tests/fixtures/app/src/pages/app.astro`, usando PublicLayout pageId=app/contentLayout=full; conservar orden móvil sin alterar header/footer y ejecutar T007, registrando `specs/004-presentacion-app/evidence/presentation.md` (depende T008–T011).

**Checkpoint**: T007 primero; T008/T009/T010/T011 independientes por archivo. T012 integra.
MVP de comprensión solo en banco; no certifica copy/activos finales ni reemplaza los requisitos
restantes de navegación/descarga. La sección final se completa en US2/US3, sin declararla cerrada aquí.

## Fase 4 — US2: Llegar a la explicación o las descargas (P1)

**Objetivo**: ambos CTA y accesos compartidos llegan a secciones reales con título visible.
**Prueba independiente**: plataformas pendientes y header real con destinos en banco; click,
visita directa/recarga de #como-funciona/#descarga, sin requerir enlaces de tienda.

- [x] T013 [US2] Añadir escenarios de anclas a `tests/e2e/app.spec.ts`: Descargar app hero→#descarga, Ver cómo funciona→#como-funciona, CTAheaderApp y CTAheaderContacto, entrada directa y recarga de ambos fragmentos con foco/título visible; hero nunca inicia descarga externa (SC-002).
- [x] T014 [US2] Crear estructura de `src/components/app/AppDownloads.astro` con sección#descarga y título, mockup y representación pendiente de Android/iPhone; componerla en `src/components/app/AppContent.astro`, ajustar `src/styles/app.css` y títulos/IDs de `src/components/app/AppSteps.astro` solo si lo exige T013. Reutilizar navegación/foco001, sin JS nuevo; nota «Orientación para cuidar tus datos personales» y Próximamente sin href/handler/tabindex/rol de botón (A01/A04/A06/A07; T019 completa enlaces disponibles).
- [x] T015 [US2] Crear origen de prueba `tests/fixtures/app/src/pages/contacto.astro` con header real y aviso de fixture, ejecutar T013 y documentar destinos/foco en `specs/004-presentacion-app/evidence/navigation.md`; distinguir este contrato de recorrido005 real. SinJS comprobar navegación nativa, sin exigir el foco mejorado que depende de JS.

**Checkpoint**: T013→T014→T015. T014 espera T012 para editar composición/CSS sin colisión.
El header001 ya contiene contratos correctos; no modificar navegación global sin fallo demostrado.

## Fase 5 — US3: Consultar disponibilidad por plataforma (P2)

**Objetivo**: cuatro combinaciones honestas, URLs exactas e independencia (A06/A07).
**Prueba independiente**: resolver puro y cuatro páginas del banco con destinos HTTPS interceptados;
no construir tienda, instalador ni móvil, ni acreditar oficialidad con una URL sintácticamente válida.

- [x] T016 [US3] Escribir `tests/app-downloads.test.ts` para ambas pendientes, Android/iPhone/ambas disponibles, URL ausente/vacía/relativa/#/javascript/data/HTTP/con credenciales/espacios/controles, plataforma duplicada/ausente, evidencia ajena/sin referencia/fecha futura/inaccesibilidad revisada, cambio de URL y retiro de verificación independientes. Probar preservación exacta de URL HTTPS revisada con query/fragment legítimos; parser no certifica oficialidad.
- [x] T017 [US3] Añadir pruebas UI a `tests/e2e/app.spec.ts` y variantes `tests/fixtures/app/src/pages/app-android.astro`, `tests/fixtures/app/src/pages/app-iphone.astro`, `tests/fixtures/app/src/pages/app-both.astro` (renderizando AppContent real): orden final de los cinco grupos de contenido, cuatro estados, destinos por plataforma, candidata/rechazada nunca en HTML/atributos/script, pendiente sin acción/foco y notaA07 exacta; navegar solo a rutasHTTPS.test interceptadas de T006, sin éxito ficticio de instalación (SC-001/003/004).
- [x] T018 [US3] Implementar resolver puro en `src/lib/app-downloads.ts` según T016: estado efectivo disponible solo con URL absoluta HTTPS/host válido/sin espacios-controles-credenciales y verificación ligada exactamente a URL/plataforma/Priva App/fecha/accesibilidad; mantener query/fragment revisados, sin dominios supuestos ni normalización silenciosa. Cualquier incumplimiento→pending sin href/candidata/evidencia; no monitorizar tiendas, caducidad arbitraria ni estado global (tipos T004; SC-003).
- [x] T019 [US3] Completar `src/components/app/AppDownloads.astro` y composición en `src/components/app/AppContent.astro` para recibir solo EffectiveDownload de T018: pending como texto legible de plataforma/Próximamente; available como enlace nativo independiente con nombre Android/iPhone y href exacto, misma pestaña, sin download/prefetch/confirmación. Conectar config en banco por variante y aplicar coherencia de mockup con máscara efectiva; sin serializar config cruda, campos de revisión ni candidatas (depende T014/T018).
- [x] T020 [US3] Ejecutar T016/T017 y documentar cuatro estados, retiro/cambio, navegación exacta y ausencia de red de consultas/analítica/almacenamiento en `specs/004-presentacion-app/evidence/downloads.md`; usar observación de requests/cookies/storage del banco, distinguiendo click de navegación legítimo de consultas de seguimiento (SC-003/004).

**Checkpoint**: T016→T018, T017→T019, después T020. Resolver puede desarrollarse tras fundamentos
sin esperar US2; T019 requiere su sección y serializa cambios compartidos. No editar simultáneamente
`tests/e2e/app.spec.ts` de distintas historias. Las URLs del banco no son destinos oficiales.

## Fase 6 — Publicación, calidad y cierre transversal

**Objetivo**: comportamiento verificable, recursos honestos y estados de cierre explícitos.

- [x] T021 Escribir pruebas negativas/positivas en `tests/app-publication.test.ts`: ambas pendientes válidas con materiales/copy revisados pasan sin exigir URLs; declarar verificado inconsistentemente falla, aunque renderer degrade a pendiente. Rechazar testOnly, texto cambiado tras revisión, notaA07 alterada, recursos/marca/fuente/paleta pendientes, archivo vacío/traversal/symlink fuera de public y mockup incompatible con00/10/01/11 o revisión ajena al recurso/alternativa/compatibilidad.
- [x] T022 Implementar `src/lib/app-publication.ts` y `scripts/require-app-publication.mjs` según T021: revisión del texto visible completo, recursos oficiales locales bajo public/images/app o public/brand con dimensiones positivas/alternativa según propósito/referencia, realpath dentro depublic/archivo no vacío y compatibilidad del mockup con estado efectivo. Declaraciónverificado contradictoria bloquea hasta corregir config a pendiente; URL ausente/candidata pendiente no bloquea. Sin red en gate ni aprobación inferida de archivo existente (depende T018/T021).
- [x] T023 Crear `src/pages/app.astro` con assert defensivo antes de render y añadir guard004 a cadena prebuild de `package.json`, conservando require-pages/gatesInicio/Historias; pasar contenido y estado efectivo sin config cruda/serialización. No crear Contacto ficticio en src ni quitar bloqueos para generar dist (depende T019/T022).
- [x] T024 [P] Crear `tests/e2e/app-accessibility.spec.ts`: matriz360/390/430/768/1024/1280/1440×texto 100%/200% para pendiente, más cuatro estados a 360/1440 con texto 200%; escala antes de load/fragmento, axe/contraste4.5:1 normal/3:1 grande/componentes, controles objetivo44px, orden/foco/teclado/alternativas/sin overflow, imágenes fallidas y sin JS. En contexto sin JS interceptar también URLs HTTPS.test, comprobando enlaces/anclas/estados estáticos (SC-005).
- [x] T025 [P] Crear `tests/e2e/app-integration.spec.ts` para /app.html real y CTA desde Contacto005, anclas directas/recarga, notaA07/prototipo/mockups coherentes y destino oficial de cada plataforma habilitada; ambas pendientes es resultado válido, no test omitido. Exigir baseURL real y registrar dependencias ausentes sin fallback a fixture. Verificación de cambios publicados y redirecciones cuando existan URLs reales; no asumir contrato administrativo o API nueva (SC-002/003/004/006).
- [x] T026 Ejecutar unitarias, check/build del banco, check raíz y suiteChromium de `specs/004-presentacion-app/quickstart.md`; comprobar gate prebuild/entrada real y bloqueos de build completo. Ejecutar regresión001 y ampliar002/003 si cambios compartidos/riesgo lo justifican; guardar resultados en `specs/004-presentacion-app/evidence/contract.md` y reportes propios `.test-output/app-results.json`. No repetir suites por rutina sin cambio/fallo que lo justifique.
- [x] T027 Intentar recorridos principales Firefox/WebKit y documentar evidencia actual en `specs/004-presentacion-app/evidence/accessibility.md`; resolver o registrar fallo de perfil/bibliotecas, sin contar arranque fallido o descarga de binarios como cobertura aprobada. Usar puerto/salidasapp secuencialmente para no colisionar con T026.
- [x] T028 Incorporar materiales oficiales recibidos en `public/images/app/` y referencias/revisión exacta en `src/content/app.ts`, registrar inventario por bloque en `specs/004-presentacion-app/evidence/materials.md`; verificar prototipo/funciones previstas, erratas y promesas, teléfonos/Conversar, compatibilidad de mockup, marca/fuente/paleta P01/P03/P04. Revisar URLs de `src/config/app-downloads.ts` solo cuando existan: referencia/fecha/plataforma/identidad/accesibilidad, sin bloquear el resto por ambas pendientes.
- [ ] T029 Realizar revisión visual PDF3 con diferencias aprobadas y activos finales, pruebas manuales de teclado/lector de pantalla, alternativas y coherencia del mockup en cada estado aplicable; registrar mediciones/entorno y comparaciones en `specs/004-presentacion-app/evidence/visual.md` y `specs/004-presentacion-app/evidence/accessibility.md` (depende T024 y materiales/revisión de T028, no de URLs futuras innecesarias).
- [ ] T030 Ejecutar T025 contra entorno/páginas reales, comprobar cambio/retirada en HTML recompilado/publicado de cada plataforma sin afectar la otra y destinos/redirecciones oficiales habilitados si existen; verificar build completo solo con todas las páginas/gates resueltos. Documentar resultados o bloqueos específicos de005/materiales/entorno en `specs/004-presentacion-app/evidence/integration.md`; no declarar instalación ni exigir URL futura para aceptar ambas pendientes (depende T023/T025 y partes aplicables de T028).
- [x] T031 Corregir fallos observados en `src/components/app/`, `src/lib/app-downloads.ts`, `src/lib/app-publication.ts` y `src/styles/app.css`; repetir pruebas afectadas/regresión justificada y registrar resolución en `specs/004-presentacion-app/evidence/summary.md`; sin fallos, documentar revisión sin refactor ajeno al alcance.
- [x] T032 Sincronizar A01–A07/SC-001–006, tareas y evidencia en `specs/004-presentacion-app/spec.md`, `specs/004-presentacion-app/plan.md`, `specs/004-presentacion-app/tasks.md`, `specs/TRACEABILITY.md` y `specs/004-presentacion-app/evidence/summary.md`; por criterio fecha/entorno/navegador/resultado/evidencia. Distinguir contrato aprobado, estado pendiente válido y bloqueos de publicación/integración; mantener abiertas las tareas sin cierre comprobado.

## Dependencias y orden de ejecución

```text
T001→T002 + T003 → T004 → T005/T006 → fundamentos
fundamentos → T007 → T008/T009/T010/T011 → T012 (US1)
T012 → T013 → T014 → T015 (US2)
fundamentos → T016→T018; T017 + T014/T018 → T019→T020 (US3)
T018 + T021→T022; T019/T022→T023
T024/T025 (escritura independiente) → T026→T027 (ejecución secuencial del banco)
materiales/revisión T028 → T029; T023/T025 + partes aplicables T028 → T030
resultados → T031 → T032
```

Pruebas antes de comportamiento nuevo; tipos antes de datos; resolver antes de enlaces/gate;
entrada real después de gate. T021/T022 pueden prepararse sin materiales finales y con datos
sintéticos, pero no cierran P01/P03/P04. T024/T025 se escriben en archivos distintos; se ejecutan
con UI integrada y, para T025, entorno real. No bloquean la escritura de componentes independientes.

Dependencias externas:001 provee layout/navegación;005 provee origen real del CTA;009/011
aportan restricciones de privacidad/accesibilidad; P01/P03/P04 recursos/revisión. Descargar
una plataforma no depende de habilitar la otra. URLs pendientes no bloquean aceptar Próximamente.

## Ejemplos de paralelismo por historia

- US1: después de T007, T008/T009/T010/T011 se desarrollan en cuatro archivos separados; unir T012.
- US2: preparar origen de prueba `tests/fixtures/app/src/pages/contacto.astro` de T015 junto con
  T014, pero ejecutar/cerrar T015 solo al tener destino de T014. No editar CSS/composición a la vez.
- US3: T016 y preparación de T017 usan archivos distintos; tras T016, T018 puede avanzar mientras
  se completan fixtures/pruebasUI de T017. T019 espera ambos y serializa AppDownloads/AppContent.

Estos ejemplos organizan el trabajo; no ordenan lanzar agentes automáticamente.

## Estrategia de implementación

1. Preparación y US1: MVP contractual de comprensión, sin publicación de materiales ficticios.
2. US2: anclas y pendientes legibles; verificar reutilización001 antes de cambiar código compartido.
3. US3: resolver y cuatro estados, con destinos HTTPS interceptados y cero servicios nuevos.
4. Gate/entrada y calidad; completar pruebas independientes aun si recursos finales no llegaron.
5. Incorporar materiales/revisión, aceptación aplicable con ambas pendientes o URLs verificadas,
   y recorrido005 real antes de cerrar su integración. No reducir requisitos para marcar casillas.

## Trazabilidad local

| Requisito | Historia / tareas principales | Criterios |
|---|---|---|
| A01 | US1 T007/T008/T012; US2 T013–T015; T028 | SC-001/002/005/006 |
| A02 | US1 T007/T009/T012; T024/T028/T029 | SC-001/004/005/006 |
| A03 | US1 T007/T009/T012; T028 | SC-001/005/006 |
| A04 | US1 T007/T010/T012; US2 T013–T015 | SC-001/002/005/006 |
| A05 | US1 T007/T011/T012; T028 | SC-001/004/005/006 |
| A06 | US2 T013–T015; US3 T016–T020; T021–T030 | SC-002/003/004/005/006 |
| A07 | US2 T014; US3 T017/T019/T020; T021–T030 | SC-004/006 |

Calidad transversal: T021–T032. Resultados y bloqueos en [evidence/summary.md](evidence/summary.md); no hay cierre integrado.

| Criterio de éxito | Tareas de verificación |
|---|---|
| SC-001 | T007/T012/T017/T026/T028 |
| SC-002 | T013–T015/T024–T026/T030 |
| SC-003 | T016–T020/T021/T025/T026/T030 |
| SC-004 | T007/T014/T017–T022/T024/T028–T030 |
| SC-005 | T024/T026/T027/T029 |
| SC-006 | T021–T023/T025/T028–T032 |

## Registro de ejecución

2026-10-17 — T001–T026/T031/T032 completas con evidencia contractual; T027 parcial
por arranque de navegadores y T028–T030 bloqueadas por materiales/revisión/entorno.
52unitarias,31UI004 y97regresiones aprobadas. Corrección compartida de foco en fragmento
repetido trazada a T014/T031 y G03 de001. No se aprobaron recursos ni destinos oficiales.

## Reanudación vigente — 2026-10-28

T027 cerrada con22/22 recorridos principalesFirefox/WebKit y52/52Node;29/32tareas. Imágenes ya recibidas/revisadas. Solo copy bloquea el guardApp; revisión concreta preparada y solicitada, sin marcar aprobada. T028/T029/T030 continúan parciales. [Resultados y comandos](evidence/review-2026-10-28.md).

## Textos aprobados y página real habilitada — 2026-10-28

T028 cerrada: snapshot inmutable de copy aprobado, recursos oficiales revisados;30/32tareas. GuardApp pasa,53/53Node,9/9integración real y20/20render/adaptación/axe/sinJS. T029manual/fidelidad y T030build/calificaciónintegrada continúan pendientes. [Resultados y límites](evidence/approval-2026-10-28.md).
