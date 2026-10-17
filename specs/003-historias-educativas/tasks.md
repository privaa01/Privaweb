# Tasks: Historias, audio y reflexión educativa

**Fecha**: 2026-10-17 | **Feature**: `003-historias-educativas` | **Rama real**: `main`.
**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md),
[data-model.md](data-model.md), [contrato](contracts/historias.md), [quickstart.md](quickstart.md)
y constitución 1.0.0. H01–H12 y SC-001–007 permanecen vigentes.
**Estado**: 30/35 tareas completas; 5 parciales/bloqueadas. Ver [evidence/summary.md](evidence/summary.md).
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

## Fase 7 — Publicación, calidad y cierre transversal

**Objetivo**: verificar comportamiento y bloquear entrega incompleta sin ocultar faltantes.

- [x] T024 Escribir pruebas de gate en `tests/stories-publication.test.ts`: testOnly, recurso/marca/copy/revisión/URL/configuración faltantes, texto cambiado tras revisión y C16 alterado rechazan; datos completos de prueba verifican lógica sin aprobar materiales reales ni consultar red.
- [x] T025 Implementar `src/lib/stories-publication.ts` y `scripts/require-stories-publication.mjs` según T024: validar shell/marca/recursos/revisión exacta, Instagram oficial compartido y contrato configurado; pendiente no equivale a aprobado, sin bypass público; ejecución local no certifica catálogo remoto, audios decodificables ni equivalencia de textos.
- [x] T026 Crear `src/pages/historias.astro` con gate defensivo y añadir guard003 a `package.json` previo a astro build, manteniendo require-pages y gateInicio; importar StoriesContent real sin snapshots del catálogo, no fabricar páginas004/005 ni eliminar bloqueos para obtener dist (T023/T025).
- [x] T027 [P] Crear `tests/e2e/stories-accessibility.spec.ts` con matriz360/390/430/768/1024/1280/1440×texto100/200%, axe, contraste4.5:1 normal/3:1 grande/componentes, controles objetivo44px, teclado/foco/anclas y ausencia de overflow/recortes, fallos de imagen y fallback sin JS (SC-006).
- [ ] T028 [P] Crear `tests/e2e/stories-integration.spec.ts` para catálogo007 real: tres iniciales+nueva elegible+borrador+inactiva, publicar/desactivar/reactivar/editar conservandoIDs, nueva lectura sin caché obsoleta, ausencia de datos privados y acceso a recursos excluidos; enlacesInicio/Instagram compartido005 y medios finales. Sin entorno/servicio/material no saltar silenciosamente: registrar bloqueo (SC-001–007).
- [x] T029 Ejecutar check/build del banco, unitarias y suitesChromium, más regresión001/002 afectada conforme `specs/003-historias-educativas/quickstart.md`; almacenar JSON/evidencias en `.test-output/stories-results.json` y `specs/003-historias-educativas/evidence/contract.md`, verificar bloqueos del build real y gate de entrada sin presentarlos como éxito integrado.
- [ ] T030 Ejecutar recorridos principales Firefox/WebKit y documentar en `specs/003-historias-educativas/evidence/accessibility.md`; resolver o registrar fallo de perfil/bibliotecas con evidencia actual, sin contar Chromium como validación de otros motores (depende T029).
- [ ] T031 Incorporar solo materiales oficiales recibidos en `public/images/stories/` y referencias de `src/content/stories.ts`, coordinar recursos/catálogos007 y `src/config/social.ts`; validar tres relatos/audio/transcripciones, nueve explicaciones/riesgo-prevención, correspondencia de imágenes y textos, Juan/P03, respaldo historias reales y URLInstagram con referencias de aprobación en `specs/003-historias-educativas/evidence/materials.md`. Bloqueada hasta P01/P03/P04/005/007; estado vacío no exime entregar los tres iniciales.
- [ ] T032 Realizar comparación renderizada PDF2 y pruebas manuales de teclado/controles nativos/anuncios con lector de pantalla y activos finales; medir contraste/dimensiones y documentar navegador/tecnología/fallos en `specs/003-historias-educativas/evidence/accessibility.md` y `specs/003-historias-educativas/evidence/visual.md` (depende T027/T031).
- [ ] T033 Ejecutar aceptación integrada T028 con servicio007/destinos002/005 reales, revisar Cache-Control/origen/CDN/Range y tratamiento de URLs privadas/desactivadas, medir carga de colección representativa sin truncamiento y verificar build completo si existen todas las páginas; registrar en `specs/003-historias-educativas/evidence/integration.md`. Bloqueada por entorno, recursos y servicios; no construir backend007 dentro de003 (depende T026/T028/T031).
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

Calidad transversal: T024–T035. Resultados contractuales y bloqueos en [evidence/summary.md](evidence/summary.md); no hay cierre integrado.

## Registro de ejecución

2026-10-17 — T001–T027/T029/T034/T035 completas con evidencia contractual.
T028 parcial (harness007), T030 parcial (arranque de navegadores), T031/T032/T033
bloqueadas por recursos/revisión/servicios. Las casillas abiertas no significan trabajo omitido
sin explicación; ver evidence/integration.md, accessibility.md y materials.md.
