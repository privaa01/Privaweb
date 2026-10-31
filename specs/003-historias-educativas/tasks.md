# Tasks: Historias, audio y reflexión educativa

**Fecha**: 2026-10-17 | **Feature**: `003-historias-educativas` | **Rama real**: `main`.
**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md),
[data-model.md](data-model.md), [contrato](contracts/historias.md), [quickstart.md](quickstart.md)
y constitución 1.0.0. H01–H12 y SC-001–007 permanecen vigentes.
**Estado**: 35/35 tareas completas para la demo; producción diferida. Ver [evidence/summary.md](evidence/summary.md).
La generación inicial no implementó código; los resultados posteriores están registrados por tarea.
**Pruebas**: incluidas para los escenarios y verificaciones exigidos por spec/contrato.
Escribir primero las pruebas de comportamiento y comprobar fallo significativo antes de implementar.
No exigir pruebas que solo reproduzcan el código ni cobertura numérica arbitraria.

`[P]` señala archivos distintos ejecutables en paralelo una vez cumplidas sus dependencias.
Las casillas solo se cierran con resultado y evidencia; un bloqueo no se marca completado.
Los IDs Txxx son locales, no reconstruyen el catálogo histórico HU/CA/TSK no aportado.

## Fase 1 — Setup

**Objetivo**: banco contractual aislado, usando tooling existente sin reinstalar frameworks.

- [x] T001 Crear banco `tests/fixtures/stories/astro.config.mjs`, `tests/fixtures/stories/tsconfig.json`, `tests/fixtures/stories/src/pages/historias.astro` y `tests/fixtures/stories/serve.py`, importando componentes reales; salida `.test-output/stories`, caché `.test-output/stories-cache`, puerto4324 y soporte Range para medios, sin modificar bancos001/002.
- [x] T002 Configurar `playwright.stories.config.ts` y scripts `check:stories:contract`, `build:stories:contract`, `test:e2e:stories:contract` y `test:e2e:stories:integration` en `package.json`; artefactos `.test-output/stories-artifacts`, reportes separados por modo y bloqueo explícito si integración carece de PRIVA_INTEGRATION_BASE_URL; conservar lock y scripts anteriores salvo necesidad demostrada.
- [x] T003 [P] Crear datos y recursos inequívocos de prueba en `tests/fixtures/stories/src/content.ts` y `tests/fixtures/stories/public/`, con tres casos iniciales, nueva elegible, registros privados separados para pruebas negativas, tres audios sintéticos reproducibles/transcripciones y nueve explicaciones de fixture; marcar testOnly, sin atribuir aprobación oficial.

**Checkpoint**: T001→T002; T003 puede avanzar junto con ellos en sus archivos. No usar fixtures como entrega.

## Fase 2 — Fundamentos comunes

**Objetivo**: contratos y contenido tipados antes de conectar recorridos. Depende de fase1.

- [x] T004 Escribir pruebas negativas/positivas en `tests/stories-contract.test.ts` para esquema versión1, campos obligatorios, IDs/URLs inválidos, duplicados, tres opciones, campos privados y catálogo vacío válido; distinguir validación estructural de revisión editorial y filtrado real007.
- [x] T005 Implementar tipos y validador en `src/lib/stories-contract.ts`: id «Identificador estable único, no índice ni título; patrón seguro para IDs DOM»; title/category/description «Texto no vacío, coherente con relato validado; sin HTML ejecutable»; image «src autorizada, alt con propósito, width/height positivos»; audio «src de recurso publicado válido y type de formato admitido; sin duración del wireframe»; transcript «Texto completo equivalente validado; no depende de descarga del audio»; question «Texto aprobado ¿QUÉ ERROR SE COMETIÓ?»; options «Exactamente 3 objetos id/label/explanation; IDs únicos dentro del caso»; explanation «Específica de riesgo y prevención, no vacía, validada contra relato». Prohibir javascript:, data:, credenciales y traversal, admitir solo rutas públicas autorizadas/HTTPS de origen configurado; rechazar datos privados/duplicados y no inferir validación editorial a partir de tipos (T004).
- [x] T006 [P] Definir contenido/inventario pendiente en `src/content/stories.ts` y enlace social único en `src/config/social.ts`: shell, imágenes con dimensiones/alternativa/sourceRef, revisión asociada al texto exacto, respaldo de historias reales y Juan/P03, URL Instagram HTTPS oficial y reviewRef; testOnly identificado, sin inventar activos ni nueve explicaciones finales. Documentar consumo futuro compartido005.

**Checkpoint**: T004→T005; T006 es independiente del código del validador. Fases3–6 requieren T005/T006.

## Fase 3 — US1: Encontrar historias disponibles (P1 / MVP contractual)

**Objetivo**: hero y catálogo actualizado completo en la misma página (H01–H05).
**Prueba independiente**: respuesta fixture de cuatro elegibles muestra tres y expande cuatro sin
repetir; respuestas vacía/errónea se distinguen; ninguna tarjeta de registro privado.

- [x] T007 [US1] Escribir escenarios de catálogo/anclas en `tests/e2e/stories.spec.ts`: #casos directo/recarga, 3→4, <=3 sin duplicar, vacío, carga, fallo/red/tipo/esquema, reintento, respuesta tardía, revalidación visible/pageshow y ausencia de datos privados en HTML/DOM; usar mock público separado de fuente privada, sin atribuir filtrado real007 (H01–H05, SC-001).
- [x] T008 [P] [US1] Crear `src/components/stories/StoriesHero.astro` con etiqueta/título/imagen/descripcion aprobados y Explorar episodios→#casos; sin caso principal María ni #maria y sin lógica duplicada de navegación001 (H01).
- [x] T009 [US1] Crear `src/components/stories/StoriesCatalog.astro` y `src/components/stories/StoryCard.astro`: encabezado#casos, carga/error/reintento/vacío, plantilla segura, categoría/título/imagen/descripcion, Ver todas y puntos de composición audio/actividad; renderizar texto sin HTML arbitrario (H02–H05).
- [x] T010 [US1] Implementar consumidor `src/scripts/stories-catalog.ts` sobre validador T005 y plantilla T009: GET same-origin `/api/public/historias`, credentials=omit/cache=no-store, cancelación/control de respuestas tardías, colección completa ordenada, visibleCount=min(3,n)→n sin reconstruir tarjetas existentes; cargar/visible/pageshow retira datos previos y pausa medios, reinicia estado y muestra loading; fallo cerrado sin fallback de build, polling ni envíos de selección (H02, C1/C2).
- [x] T011 [US1] Componer shell inicial `src/components/stories/StoriesContent.astro`, estilos acotados `src/styles/stories.css` y entrada del banco `tests/fixtures/stories/src/pages/historias.astro`, usando PublicLayout pageId=historias/contentLayout=full; conectar hero/catálogo y fallback sin JS honesto, preservar anclas/menú001; ejecutar T007 y registrar resultado en `specs/003-historias-educativas/evidence/catalog.md`.

**Checkpoint**: T007 primero; T008 puede avanzar junto con T009→T010. T011 integra ambos.
MVP demostrable solo en banco; el contrato no acredita servicio007 ni entrega final.

## Fase 4 — US2: Escuchar y leer un caso (P1)

**Objetivo**: reproducción real y texto equivalente independiente (H03–H06).
**Prueba independiente**: montar un caso fixture con audio real, reproducir/pausar/avanzar y
consultar transcripción incluso con fallos; no requiere ejercicio ni backend.

- [x] T012 [US2] Añadir pruebas de medios reales en `tests/e2e/stories.spec.ts`: gesto play(), currentTime avanza, pause/seek, metadatos válidos y ausencia de autoplay/duración fija, HTTP/decodificación fallidos y transcripción disponible; no usar eventos sintéticos como evidencia de reproducción (SC-002).
- [x] T013 [US2] Implementar `src/components/stories/StoryAudio.astro` y `src/scripts/stories-audio.ts`: audio controls/preload=metadata, nombre por caso, transcript completo en details, estado idle/loading/ready/playing/paused/ended/error, tiempos solo HTMLMediaElement finitos positivos, waiting/stalled no error terminal y sin anuncio de cada timeupdate; cleanup pausa/libera listeners (T012).
- [x] T014 [US2] Integrar audio con `src/components/stories/StoryCard.astro` y ciclo de retirada/revalidación en `src/scripts/stories-catalog.ts`, conservar texto/ejercicio/transcript ante imagen/audio fallido; ejecutar T012 y documentar medios/Range/seeking y límites en `specs/003-historias-educativas/evidence/audio.md` (H03–H06).

**Checkpoint**: T012→T013→T014. Componente aislado usa T003/T005; integración requiere T009/T010.
Los tres archivos finales y equivalencia editorial se verifican en T031, no con archivos sintéticos.

## Fase 5 — US3: Reflexionar sin calificación ni seguimiento (P2)

**Objetivo**: nueve explicaciones inmediatas, locales e independientes (H07–H09).
**Prueba independiente**: montar tres casos fixture, seleccionar/cambiar sus nueve opciones y
recargar/restaurar; vigilar red/almacenamiento sin depender de escuchar el audio.

- [x] T015 [US3] Añadir pruebas en `tests/e2e/stories.spec.ts` para nueve opciones con teclado/puntero, feedback específico, cambio sin foco inesperado, independencia, expansión sin reset y recarga/pageshow sin selección; registrar requests, cookies/localStorage/sessionStorage antes/después para distinguir medios/catálogo de envío educativo (SC-003/004).
- [x] T016 [US3] Crear `src/components/stories/StoryExercise.astro` y `src/scripts/stories-exercise.ts`: fieldset/legend, tres radios con name/ID únicos storyId+optionId, estado «selectedOptionId: null | optionId» solo en memoria, región de status/polite/atomic existente antes del cambio; textContent reemplaza explicación sin submit, calificación, puntuación, URL/storage ni red; reset explícito al inicializar/pageshow (T015).
- [x] T017 [US3] Conectar actividad en `src/components/stories/StoryCard.astro` y `src/scripts/stories-catalog.ts`, preservando casos al expandir y liberando listeners/estado al reemplazar; no afectar otro caso al cambiar una opción (H07–H09).
- [x] T018 [US3] Ejecutar T015, revisar asociación exacta de las nueve opciones del spec con explicaciones del fixture y documentar privacidad/recarga/anuncio en `specs/003-historias-educativas/evidence/reflection.md`; distinguir revisión de contenido final pendiente de prueba mecánica aprobada.

**Checkpoint**: T015→T016→T017→T018. T016 no depende de T013; cambios compartidos de tarjeta/catálogo
T014/T017 deben serializarse. Validación de las nueve explicaciones oficiales queda en T031.

## Fase 6 — US4: Entender el método y seguir aprendiendo (P2)

**Objetivo**: metodología y destinos correctos (H10–H12).
**Prueba independiente**: shell con método, dos destinos institucionales fixture identificados y
URL de prueba; verificar tres pasos, copyC16 y enlaces sin necesitar catálogo/audio/ejercicio.

- [x] T019 [US4] Añadir escenarios de método, orden y destinos en `tests/e2e/stories.spec.ts`: Escucha/Reflexiona/Aplica, Saber más a ambas anclasInicio, cierreC16 exacto, CTA Instagram desde configuración compartida, fallo de imagen conservando textos; no confundir destino fixture con integración002/005 (SC-005).
- [x] T020 [P] [US4] Construir `src/components/stories/StoriesMethod.astro` con imagen, título y tres pasos en orden PDF2; preservar orden móvil sin elementos interactivos inventados (H10).
- [x] T021 [P] [US4] Construir `src/components/stories/StoriesIdentity.astro` con dos bloques Somos Priva/Qué hacemos y Saber más→`/index.html#somos-priva`/`/index.html#que-hacemos`, sin copiar contenido o modificar destinos002 (H11).
- [x] T022 [P] [US4] Construir `src/components/stories/StoriesClosing.astro` con título/imagen previstos y párrafo C16 exacto, EXPLORAR MÁS CONTENIDOS desde `src/config/social.ts`; no usar href vacío/# ni inventar Instagram cuando falte (H12).
- [x] T023 [US4] Integrar T020–T022 en `src/components/stories/StoriesContent.astro` y `src/styles/stories.css` después del catálogo en ordenPDF2, reutilizar layout/header/footer; ejecutar T019 y registrar resultado en `specs/003-historias-educativas/evidence/continuation.md`.

**Checkpoint**: pruebas T019 primero; T020/T021/T022 en paralelo por archivos separados;
T023 espera esos tres y T011 para no colisionar con composición compartida.

## Alcance vigente de cierre de la demo

Continuación solicitada tras001/002, documentada en demo-scope-2026-10-30.md. T031/T032conservan materiales y revisión humana; T033evalúa snapshot público y build:demo, manteniendo diferidas las obligaciones deAPI/administración/retirada007 y build productivo009/010.

## Fase 7 — Publicación, calidad y cierre transversal

**Objetivo**: verificar comportamiento y bloquear entrega incompleta sin ocultar faltantes.

- [x] T024 Escribir pruebas de gate en `tests/stories-publication.test.ts`: testOnly, recurso/marca/copy/revisión/URL/configuración faltantes, texto cambiado tras revisión y C16 alterado rechazan; datos completos de prueba verifican lógica sin aprobar materiales reales ni consultar red.
- [x] T025 Implementar `src/lib/stories-publication.ts` y `scripts/require-stories-publication.mjs` según T024: validar shell/marca/recursos/revisión exacta, Instagram oficial compartido y contrato configurado; pendiente no equivale a aprobado, sin bypass público; ejecución local no certifica catálogo remoto, audios decodificables ni equivalencia de textos.
- [x] T026 Crear `src/pages/historias.astro` con gate defensivo y añadir guard003 a `package.json` previo a astro build, manteniendo require-pages y gateInicio; importar StoriesContent real sin snapshots del catálogo, no fabricar páginas004/005 ni eliminar bloqueos para obtener dist (T023/T025).
- [x] T027 [P] Crear `tests/e2e/stories-accessibility.spec.ts` con matriz360/390/430/768/1024/1280/1440×texto100/200%, axe, contraste4.5:1 normal/3:1 grande/componentes, controles objetivo44px, teclado/foco/anclas y ausencia de overflow/recortes, fallos de imagen y fallback sin JS (SC-006).
- [x] T028 [P] Crear `tests/e2e/stories-integration.spec.ts` para catálogo007 real: tres iniciales+nueva elegible+borrador+inactiva, publicar/desactivar/reactivar/editar conservandoIDs, nueva lectura sin caché obsoleta, ausencia de datos privados y acceso a recursos excluidos; enlacesInicio/Instagram compartido005 y medios finales. Sin entorno/servicio/material no saltar silenciosamente: registrar bloqueo (SC-001–007).
- [x] T029 Ejecutar check/build del banco, unitarias y suitesChromium, más regresión001/002 afectada conforme `specs/003-historias-educativas/quickstart.md`; almacenar JSON/evidencias en `.test-output/stories-results.json` y `specs/003-historias-educativas/evidence/contract.md`, verificar bloqueos del build real y gate de entrada sin presentarlos como éxito integrado.
- [x] T030 Ejecutar recorridos principales Firefox/WebKit y documentar en `specs/003-historias-educativas/evidence/accessibility.md`; resolver o registrar fallo de perfil/bibliotecas con evidencia actual, sin contar Chromium como validación de otros motores (depende T029).
- [x] T031 Incorporar solo materiales oficiales recibidos en `public/images/stories/` y referencias de `src/content/stories.ts`, coordinar recursos/catálogos007 y `src/config/social.ts`; validar tres relatos/audio/transcripciones, nueve explicaciones/riesgo-prevención, correspondencia de imágenes y textos, coherencia con las recreaciones aportadas y sus protagonistas/P03 y URLInstagram con referencias de aprobación en `specs/003-historias-educativas/evidence/materials.md`. Bloqueada hasta P01/P03/P04/005/007; estado vacío no exime entregar los tres iniciales.
- [x] T032 Validar la composición de la demo previamente aceptada y realizar pruebas manuales de teclado/controles nativos/anuncios con lector de pantalla y activos finales; medir contraste/dimensiones y documentar navegador/tecnología/fallos en `specs/003-historias-educativas/evidence/accessibility.md` y `specs/003-historias-educativas/evidence/visual.md` (depende T027/T031). Cotejo nuevo contra PDF2 original diferido a producción; evidencia demo-closure-2026-10-30.md.
- [x] T033 Verificar la demo publicada con cuatro historias aprobadas y destinos002/005: esquema completo, origen/CDN/caché/Range, audios y ejercicios sin envío ni persistencia, paridad de materiales y build:demo. API/gestión007, retirada de URLs privadas/desactivadas, volumen futuro y build productivo009/010 se conservan diferidos según demo-scope-2026-10-30.md. Registrar resultados sin calificarlos como operación productiva.
- [x] T034 Corregir fallos observados en `src/components/stories/`, `src/scripts/stories-catalog.ts`, `src/scripts/stories-audio.ts`, `src/scripts/stories-exercise.ts` y `src/styles/stories.css` según evidencia; repetir solo pruebas afectadas y regresión justificada, registrar correcciones/resultados en `specs/003-historias-educativas/evidence/summary.md`; si no hay fallos, documentar revisión sin refactor innecesario.
- [x] T035 Sincronizar estado por H01–H12/SC-001–007 y tareas en `specs/003-historias-educativas/spec.md`, `specs/003-historias-educativas/plan.md`, `specs/003-historias-educativas/tasks.md`, `specs/TRACEABILITY.md` y `specs/003-historias-educativas/evidence/summary.md`; fecha/entorno/navegador/criterio/resultado/evidencia, separar aprobado contractual de cierre integrado y mantener casillas bloqueadas abiertas (depende resultados T029–T034).

## Dependencias y orden de ejecución

```text
T001 → T002 ─┐
T003 ───────┴→ T004 → T005 ─┐
                T006 ──────┴→ fundamentos completos
fundamentos → US1 (T007–T011) → composición e integración de tarjetas
fundamentos → US2 aislada (T012–T013) → T014 tras US1
fundamentos → US3 aislada (T015–T016) → T017 tras US1/T014 → T018
fundamentos → US4 (T019–T022) → T023 tras T011
historias integradas + T024→T025 → T026
T027/T028 → T029→T030; materiales T031 → T032/T033
resultados → T034 → T035
```

T024/T025 pueden prepararse después de fundamentos sin esperar medios oficiales; no cierran
revisión de contenidos. T027/T028 pueden escribirse en paralelo con ellas por archivos distintos,
pero ejecutarse requiere UI integrada. Pruebas del mismo `tests/e2e/stories.spec.ts` se editan
secuencialmente (T007/T012/T015/T019). CSS/composición/tarjeta/catálogo compartidos también.
007 produce catálogo/estados/recursos;002 ofrece destinos;005 verificaInstagram compartido;
009/011 gobiernan privacidad/accesibilidad. Dependencias externas bloquean solo su trabajo.

## Ejemplos de paralelismo por historia

- US1: tras T007, T008 en paralelo con T009→T010; unir en T011.
- US2: tras T012, implementar T013 en su componente/script mientras US4 desarrolla T020–T022;
  T014 espera tarjeta/catálogo estables y no se ejecuta junto a T017.
- US3: después de escribir T015, T016 puede avanzar junto con T013, en archivos distintos;
  T017 espera serialización de los cambios compartidos.
- US4: después de T019, T020/T021/T022 son independientes; T023 compone al finalizar.

Son oportunidades de organización, no instrucciones para lanzar agentes automáticamente.

## Estrategia de implementación

1. Fundamentos y US1: MVP contractual verificable, sin publicar catálogo ficticio.
2. US2 y US3 como componentes comprobables aisladamente; integrar respetando IDs/ciclo de vida.
3. US4 completa shell y destinos; gate protege página real y build.
4. Validar contrato/matriz/regresión; continuar trabajo independiente cuando materiales estén pendientes.
5. Resolver materiales/servicios, revisión visual y aceptación integrada antes del cierre total.

## Trazabilidad local

| Requisito | Historia / tareas principales | Criterios |
|---|---|---|
| H01 | US1 T007/T008/T011 | SC-005/006/007 |
| H02 | US1 T007/T009/T010/T011; T028/T033 | SC-001/006 |
| H03/H04/H05 | US1 T009; US2 T012–T014; T031 | SC-001/002/007 |
| H06 | US2 T012–T014; T031/T033 | SC-002/006/007 |
| H07/H08/H09 | US3 T015–T018; T031/T032 | SC-003/004/006/007 |
| H10 | US4 T019/T020/T023 | SC-005/006/007 |
| H11 | US4 T019/T021/T023; T028/T033 | SC-005/006 |
| H12 | US4 T019/T022/T023; T024–T026/T031/T033 | SC-005/007 |

Calidad transversal: T024–T035. Cierre demo en [evidence/demo-closure-2026-10-30.md](evidence/demo-closure-2026-10-30.md); producción diferida.

## Registro de ejecución

2026-10-17 — T001–T027/T029/T034/T035 completas con evidencia contractual.
T028 parcial (harness007), T030 parcial (arranque de navegadores), T031/T032/T033
bloqueadas por recursos/revisión/servicios. Las casillas abiertas no significan trabajo omitido
sin explicación; ver evidence/integration.md, accessibility.md y materials.md.

## Avance de materiales — 2026-10-26 (America/Bogota)

30/35 tareas completas. T031 parcial: logo/fuente/paleta compartidos configurados y CSS alineado; seis imágenes recibidas como previsualizaciones, identificadas en evidence/materials.md pero pendientes de archivos originales para subir/conectar. Carpeta GitHub public/images/stories disponible. Se solicitó Instagram oficial. No se aprueban textos, audios, transcripciones ni explicaciones por recibir imágenes.40unitarias y29Chromium aprobadas, check contractual conforme; resultados en evidence/resume-2026-10-26-*.txt.

2026-10-26 — Seis imágenes oficiales recibidas e integradas: tres bloques de página y tres portadas iniciales para el importador007. T031 parcial por audios/transcripciones/explicaciones y revisión editorial.41unitarias003,38Node007 y29Chromium003 aprobadas; tipado y Astro check conformes. Se preparó carpeta GitHub content/stories/audio/ para recibir originales. Detalle en evidence/connected-images.md;30/35 tareas sin cierres adicionales.

2026-10-26 — Cuatro audios sincronizados desde325fc49 y aprobados por la responsable; inspección real aislada aceptada como MP3. T031 avanza en recepción de audio; asignación de cuatro archivos a tres casos solicitada y pendiente, además de transcripciones/explicaciones/revisión restantes. Manifiesto content/stories/audio/manifest.json y evidencia audio-approval.md. No se adivina la correspondencia ni se publica el cuarto caso sin definirlo.

2026-10-26 — Correspondencia de audios confirmada y configurada:1Contraseña/2Llamada/3Enlace;4Número desconocido en el catálogo ampliado. Importador007 con valores por defecto aprobados/hash vinculados; conserva auth/inspección/estados. T031 parcial: faltan transcripciones, explicaciones y revisión; cuarto requiere ficha completa. Ver evidence/audio-assignment.md.

## Ajuste editorial — 2026-10-28

La responsable confirmó que los audios son recreaciones educativas y autorizó ajustar las capacidades al alcance educativo de Inicio. Se retiraron promesas de auditorías y afirmaciones de relatos reales; tarjeta de Inicio renombrada Historias educativas. Los textos completos derivados están en [public-copy-review.md](evidence/public-copy-review.md), pendientes de aprobación final; no se cambian estados de revisión, publicación de catálogo ni aprobación de ejercicios. Verificación: 45/45 pruebas Node Inicio/Historias, guard de Inicio salida 0, Astro check 95 archivos sin errores ni advertencias (1 hint previo).

## Aprobación editorial aplicada — 2026-10-28

La responsable respondió «Sí, apruebo los textos públicos corregidos» para hero, metodología, cierre, identidad, catálogo y pasos Escucha/Reflexiona/Aplica. Se registraron cinco snapshots inmutables en src/content/stories-review.json, con referencia a evidence/public-copy-review.md; el guard sigue invalidando modificaciones materiales. No se aprobaron ejercicios ni se importaron/publicaron historias.

Verificación: 45/45 pruebas Node Inicio/Historias, guard003 salida 0 y Astro check (95 archivos, 0 errores/advertencias, 1 hint previo). Integración real002: 18/18 aprobadas, seis recorridos por motor Chromium/Firefox/WebKit. Historias HTTP200; /api/public/historias HTTP404: el catálogo007 aún no está conectado al servidor local. Captura .test-output/stories-approved.png. Build completo conserva salida1 en guard010/009.

La navegación desde Inicio ya está verificada; T027/T031 de002 mantienen el requisito residual de build completo, y T028 el cierre integral: 30/33 tareas. No se confunde renderizado de Historias con disponibilidad del catálogo, aprobación de ejercicios ni publicación productiva. Logs: .test-output/stories-approved-unit.log, stories-approved-check.log, home-approved-integration.log y home-approved-build.log.

## Publicación local vigente — 2026-10-28

Cuatro historias autorizadas/publicadas/activas en catálogo007 real, incluido Número desconocido con portada oficial reutilizada expresamente aprobada. Tres recorridos navegador completos aprobados, audios/transcripciones/doce explicaciones y expansión verificados; no mocks. Publicación local no equivale a despliegueFirebase ni cierra revisión manual/build productivo. [Registro](evidence/local-publication.md). Los estados anteriores de catálogo vacío o fichas sin publicación son históricos.

## Botón de acceso a la cuarta historia — 2026-10-28

A petición de la responsable, el control se llama «Ver más historias» y aparece centrado debajo de las tres tarjetas iniciales, en vez de junto al encabezado. Al activarlo con teclado/puntero se añade Número desconocido sin duplicar ni reconstruir los casos previos, se lleva el foco/vista al nuevo título y se oculta el botón ya consumido. Se mantienen aria-controls/aria-expanded, recarga y estados de error/vacío. Con tres o menos se conserva no añadir tarjetas. Corrección de H02/T009–T010/T017; no cambia la publicación ni las fichas.

Verificación real:3/3 recorridos completos Chromium/Firefox/WebKit, incluidos botón por debajo del catálogo, Enter, foco visible en cuarta, reproducción/transcripciones/doce explicaciones;2comprobaciones adicionales con puntero a1440px/100% y390px/200%, sin overflow. Log .test-output/stories-more-browser.log y captura .test-output/stories-more-button.png. Pruebas/contratos actualizados al nombre vigente.

## Integración local y navegadores completados — 2026-10-28

T028/T030 cerradas:32/35tareas.30/30recorridos principalesFirefox/WebKit y9/9integración real, con transiciones007 en entorno aislado y recursos oficiales. Base de cuatro historias de la responsable intacta. T031cotejo/coherencia, T032manual y T033calificación/build siguen pendientes. [Pruebas y límites](evidence/transitions-review-2026-10-28.md).

2026-10-28 — T031: cotejo documental de cuatro transcripciones PDF/TXT/JSON conforme, huellas de cuatro audios conformes y coherencia editorial de doce explicaciones revisada. Evidencia en materials.md y materials-verification-2026-10-28.json. Pendiente cotejo mediante escucha audio/transcripción; se mantienen32/35 tareas completas.

2026-10-28 — T032 parcial: matriz real42/42 aprobada (7 anchos ×100/200% ×3 motores), cuatro historias oficiales sin mocks; tipado y captura escritorio conformes. Pendientes comparación renderizada PDF2 original y revisión manual/lector. Evidencia: accessibility-final-materials-2026-10-28.md. Se mantienen32/35.

T032: corrección adicional de desbordamiento interno del control Leer transcripción a200% mediante overflow-wrap:anywhere; aserción específica añadida a la matriz de materiales oficiales.

2026-10-28 — T033 parcial: auditoría real de cuatroMP3 conSHA256, GET/HEAD/Range/sufijo/rango inválido conformes; catálogo completo sin truncamiento, no-store/Host403/recurso404. Build completo intentado y bloqueado por guard010/009. Sin origen/CDN desplegado ni volumen futuro acordado. Evidencia:delivery-review-2026-10-28.md y delivery-audit-2026-10-28.json. Aceptación visual general de la responsable registrada;32/35.

2026-10-30 — T031/T032/T033 completas para la demo:35/35. Responsable confirma escucha de cuatro audios y teclado/VoiceOver de controles educativos.51/51 pruebas publicadas y paridad de materiales conformes. Véase evidence/demo-closure-2026-10-30.md; registros previos históricos.
