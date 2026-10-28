# Tasks: Gestión y publicación de historias (007)

**Fecha**: 2026-10-19 | **Rama real**: main | **Estado**: implementación local verificada; 59/63 tareas cerradas. T056–T059 pendientes de cierre externo.
**Input**: [spec](spec.md), [plan](plan.md), [investigación](research.md), [modelo](data-model.md),
[contrato](contracts/story-management.md), [guía](quickstart.md) y constitución1.0.0.

Las pruebas se incluyen porque el spec exige comprobación explícita de persistencia, publicación,
privacidad, fallos y accesibilidad (SC001–008). Escribir casos de riesgo antes de implementar y
comprobar que fallan por comportamiento ausente, sin imponer TDD para cambios cosméticos.
Cada casilla se completa solo con resultado/evidencia aplicable, nunca por crear un fichero.
[P] indica trabajo en archivos distintos, una vez satisfechas las dependencias de su fase; no
es una instrucción de delegación. Rutas de código/tests son objetivos futuros, no archivos creados.

## Fase 1 — Preparación

**Objetivo**: Preparar herramientas y bancos aislados sin cambiar proveedores ni gates vigentes.

- [X] T001 Añadir scripts check/test/build de story-management previstos en quickstart a `package.json` y compilación estricta Node24 a `server/stories/tsconfig.json`, reutilizando lock y sin ampliar el límite JSON8KiB de006.
- [X] T002 [P] Preparar fixture UI sintética no publicable en `tests/fixtures/story-management/astro.config.mjs` y `playwright.story-management.config.ts`, puerto4330 y salidas aisladas.
- [X] T003 [P] Preparar runner de servicio compuesto006/007 en `tests/fixtures/story-management-service/serve.ts` y `playwright.story-management.service.config.ts`, puerto4331, SQLite/directorio0700 temporales, dos cuentas sintéticas y teardown; sin bypass HTTP de sesión.
- [X] T004 [P] Documentar y comprobar FFmpeg/ffprobe7.1.5, binarios confiables y launcher bwrap+prlimit conforme a researchR5: namespaces sin red/PID/IPC/UTS/usuario, sin capacidades, no-new-privileges, entrada y bibliotecas solo lectura; AS512MiB/proceso, CPU20s soft/21s hard, NOFILE32, CORE0, threads1, salida1MiB y plazo total30s para ffprobe+ffmpeg secuenciales en `specs/007-gestion-historias/quickstart.md`; registrar resultado de comprobación y bloqueo de medios si falta sandbox, sin aceptar uploads ni bloquear el MVP textualUS1 por esa dependencia.

**Checkpoint**: prerrequisitos/evidencia de la fase comprobados o bloqueo explícito, sin aparentar cierre.

## Fase 2 — Fundamentos compartidos

**Objetivo**: Bloquea implementación de historias; cada guard debe proteger datos y efecto en la misma transacción.

- [X] T005 Definir DTOs exactos privados, errores y recibos en `src/lib/story-management-contract.ts`: operationId UUID, expectedRevision entero, result:"confirmed", publicationState, active y pendingChanges; prohibir campos de score/respuestas/correos en DTO público.
- [X] T006 Definir entidades en `server/stories/repository.ts` y migraciones no destructivas en `server/stories/sqlite-repository.ts`: id «slug estable», nuevas «historia-<UUID>» en minúsculas; revision «entero>=1»; workingJSON «snapshot privado actual»; publishedJSON «snapshot vigente nullable»; pendingChanges «booleano»; active «booleano independiente, false al crear»; fechas «UTC del servidor» y publishedAt «nullable»; createdBy/updatedBy «referencias de cuenta privada». Conservar tresIDs003 y orden createdAt/id, sin historial navegable.
- [X] T007 Crear schema de recursos/operaciones en `server/stories/sqlite-repository.ts`: recurso «id opaco, historiaId FK, kind(image/audio), storageKey interno único, sha256, bytes, mime validado», «width/height o durationSeconds reales», «state(staging/ready/rejected), createdAt, uploadedBy»; recibo «operationId UUID PK, accountId, storyId, kind, requestHash, expectedRevision nullable, resultRevision, resultSummary y committedAt». Mantener FK, restricciones y conexión admin_* de006.
- [X] T008 Implementar adaptador de autorización e idempotencia/CAS en `server/stories/service.ts` usando withAuthorizedTransaction de006 sin await: hash canónico, cuenta autora en recibos, mutación+recibo atómicos, clave/payload distinto409, misma clave devuelve original y revisión vieja no sobrescribe; no purgar recibos automáticamente.
- [X] T009 Componer router007 antes del404006 en `server/admin/http.ts` y `server/admin/start.ts` y lector en `server/stories/http.ts`: autorización antes de payload, rutas exactas/sin query, JSON UTF8 objeto exacto<=256KiB, CSRF/origen/X-Priva-Request,401/403/404/405/413/415/422/429/503 y no-store/nosniff; público independiente sin Set-Cookie.
- [X] T010 Refactorizar sesión compartida en `src/scripts/admin-session.ts` para CSRF en cierre privado/eventos de pérdida de acceso, limpieza [data-private-data] y generaciones cancelables; no token global/webstorage, segundo gestor ni replay tras login.
- [X] T011 [P] Crear pruebas de guard, SQL, migración no destructiva, recibo antes/después de commit y revocación en `tests/story-management-repository.test.ts` y `tests/story-management-security.test.ts`; ejecutar conSQLite real y verificar que callbacks async no entran en transacción (SC006).

**Checkpoint**: prerrequisitos/evidencia de la fase comprobados o bloqueo explícito, sin aparentar cierre.

## Fase 3 — US1: Crear y conservar borrador (P1, MVP)

**Objetivo**: Conservar contenido incompleto privado con identidad estable y recuperación honesta.

**Prueba independiente**: Crear sin título ni recursos, guardar, reiniciar y reabrir con misma identidad; doble envío no duplica y acceso inválido no revela ni modifica. Cubre US1.1–6 / SC001 y SC006.

- [X] T012 [P] [US1] Escribir casos de campos Unicode/espacios, límites y draft/publicación en `tests/story-management-validation.test.ts`, incluidos no HTML ejecutable, mínimos solo publicación,2/4opciones y payload ajeno; observar fallos significativos antes de validadores.
- [X] T013 [P] [US1] Escribir recorrido US1.1–6 en `tests/e2e/story-management-draft.spec.ts`: borrador incompleto, recarga, fallo, resultado perdido, dobleclick y limpieza al expirar sesión, sin datos en webstorage ni éxito optimista.
- [X] T014 [US1] Implementar validación común en `src/lib/story-management-validation.ts` y `server/stories/validation.ts`: «Texto plano, sin HTML/Markdown ejecutable», «Contar puntos de código Unicode, rechazar NUL/controles no textuales (permitir tab/salto en campos multilínea)», recortar extremos. Máximos title160, category80, description3000, imageAlt500, transcript20000, question300, options[].label500 y options[].explanation3000; mínimos «No vacío» solo publicación. imageResourceId/audioResourceId «ID opaco o null»; options «Exactamente tres posiciones de editor», options[].id «Estable único dentro de historia», «Preservar al editar»; permitir campos faltantes en borrador sin contenido inventado.
- [X] T015 [US1] Implementar creación/guardado incompleto y reapertura autorizada en `server/stories/service.ts` y `server/stories/sqlite-repository.ts`; una identidad, activefalse al crear, published intacto, sin cambios puede conservar revision, título vacío no se sustituye por valor editorial; persistencia real y recibo en mismo commit.
- [X] T016 [US1] Exponer POST colección, GET historia, PUT historia y GET operaciones/<UUID> en `server/stories/http.ts`; recibo solo cuenta autora autorizada,404 de recibo no demuestra rollback, clave desconocida exige comprobar/reintentar misma intención explícitamente.
- [X] T017 [US1] Construir editor con campos aprobados/tres posiciones, Guardar y Publicar separados en `src/components/admin/StoryEditor.astro` y montar superficie mínima en `server/admin/views/src/pages/historias.astro`; Publicar no operativo hasta US2, sin falsa funcionalidad.
- [X] T018 [US1] Implementar controlador de borrador en `src/scripts/admin-stories.ts`: operationId estable por intento, reapertura, timeout15s/JSON, respuesta desconocida y consulta recibo, retry explícito, serial por historia; conservar texto solo autorizado, avisar archivos a reseleccionar y cambios sin guardar al salir.
- [X] T019 [US1] Ejecutar y ampliar integración de persistencia/reinicio y fallos antes/después de commit en `tests/e2e/story-management-draft.spec.ts`; contrastarDB/recibos con navegador, publicación nula y ausencia de datos privados en raíces estáticas; la comprobación pública del catálogo se ejecuta en T031 tras T027, sin considerar un404 como prueba de filtrado, registrar evidencia US1 en `specs/007-gestion-historias/evidence.md`.

**Checkpoint**: historia verificable con datos sintéticos aislados; aceptación final requiere fases siguientes y evidencia externa.

## Fase 4 — US2: Publicar contenido completo (P1)

**Objetivo**: Validar campos y medios reales y publicar un snapshot completo sin exposición de staging.

**Prueba independiente**: Bloquear cada faltante/recurso inválido, publicar conjunto válido y verificar proyección pública íntegra; publicación inicial queda inactiva hasta acción explícitaUS3. Cubre US2.1–7 / SC002.

- [X] T020 [P] [US2] Escribir pruebas de publicación completa/incompleta, recursos cruzados,401/CSRF, duplicados y error poscommit en `tests/story-management-repository.test.ts`; exigir que cadena no vacía no sustituya revisión editorial/manual.
- [X] T021 [P] [US2] Escribir pruebas reales de archivos corruptos/truncados, MIME/firma, límites, rango y traversal en `tests/story-management-media.test.ts`, sin sustituir FFmpeg por mock para aceptar un archivo como válido.
- [X] T022 [US2] Implementar almacenamiento privado y uploads streaming en `server/stories/media.ts`: directorio0700/archivos0600 fuera de Git/public/dist/private-build, UUID sin rutas del cliente, hash/fsync/rename+fsyncdirectorio antes de commit; «No aceptar rutas/URL ni reusar un ID de otra historia en un snapshot». Recurso nuevo inmutable al reemplazar; no borrar referenciados.
- [X] T023 [US2] Implementar inspección/decodificación real en `server/stories/media.ts`: PNG/JPEG/WebP estáticos<=8MiB,<=20megapíxeles y dimensión<=8192; MP3/WAVPCM<=50MiB y<=30min; rechazar cero bytes, firma/MIME inconsistente, vídeo/SVG/animación/pistas extra y truncados. FFprobe/FFmpeg con launcher bwrap+prlimit de R5/C1, AS512MiB/proceso, CPU20s soft/21s hard, NOFILE32/CORE0, threads1, salida combinada1MiB, semáforo2 y plazo total30s para ambas etapas; verificar aislamiento real y fallar cerrado si falta. Añadir pruebas bajo el mismo launcher de red/lectura de centinela/escritura denegadas, exceso CPU/memoria/salida/plazo y terminación/recolección del grupo en `tests/story-management-sandbox.test.ts`; dimensiones/duración del archivo, nunca inventadas.
- [X] T024 [US2] Implementar PUT binario de recurso y GET/HEAD privados en `server/stories/http.ts`: auth antes de bytes y de registrarready, UUID ligado a cuenta/historia/hash,409si clave distinta/en curso, transferencia120s/max50MiB y8MiBimagen aun sin Content-Length;60mutaciones/min/cuenta y10uploads/min/cuenta,429+Retry-After, sin cola ilimitada.
- [X] T025 [US2] Completar validación para publicar en `server/stories/validation.ts`: todos los campos «No vacío», imagen «Ready; imagen válida», alternativa «No vacío para imagen informativa», audio «Ready; audio válido», transcripción «No vacío y revisión de equivalencia», opciones «Tres opciones completas» y explicaciones «No vacío; riesgo y prevención»; impedir staging y recursos de otra historia.
- [X] T026 [US2] Implementar Publicar en `server/stories/service.ts` y ruta /publicar en `server/stories/http.ts`: CAS, integridad de recursos preparados, published=working completo y pendingfalse en commit único, activación intacta; fallo conocido conserva versión previa y desconocido se verifica con recibo, sin I/O lento dentro de transacción.
- [X] T027 [US2] Implementar productor GET /api/public/historias en `server/stories/http.ts` y proyección explícita en `server/stories/sqlite-repository.ts`: schemaVersion1/DTO exacto003, solo publishedJSON no null AND active, orden createdAt/id consistente, sin working/revision/correos/duración; vacío real200 y fallo503 conno-store.
- [X] T028 [US2] Implementar GET/HEAD /media/public/<UUID> en `server/stories/http.ts` y `server/stories/media.ts`: pertenencia a snapshot vigente activo antes de bytes,404noelegible, nosniff/no-store, MIME/longitud reales, streaming,200/206/416 y únicoRange; HEAD sin cuerpo, symlinks/rutas arbitrarias denegados y rangos múltiples rechazados.
- [X] T029 [US2] Adaptar pregunta editorial no vacía en `src/lib/stories-contract.ts` y sincronizar `specs/003-historias-educativas/contracts/historias.md` y `specs/003-historias-educativas/data-model.md`; mantener forma/schema1/tres opciones y literal de los casos iniciales; probar compatibilidad en `tests/story-management-catalog.test.ts`.
- [X] T030 [US2] Conectar archivos/progreso, preview local y Publicar en `src/scripts/admin-stories.ts` y `src/components/admin/StoryEditor.astro`; guardar cambios locales primero, mostrar pendiente/inactiva y errores asociados, no afirmar disponibilidad antes de catálogo/recursos comprobados. Ampliar CSP mínima img/media self+blob en `server/admin/http.ts` y revocar objectURLs al cambiar/salir/perder acceso.
- [X] T031 [US2] Ejecutar flujoUS2 y revocación durante upload/inspección en `tests/e2e/story-management-upload.spec.ts`: inspección real, sinready tras timeout, publicar no duplica y no filtra nuevos archivos; completar comprobación públicaUS1 aplazada desdeT019: borradores ausentes en respuesta válida200 del endpointT027, nunca aceptar404/error como filtrado; verificar catálogo mediante consumidor003 con historia activa preparada por repositorio de prueba, sin depender de UIUS3; registrar evidencia en `specs/007-gestion-historias/evidence.md`.

**Checkpoint**: historia verificable con datos sintéticos aislados; aceptación final requiere fases siguientes y evidencia externa.

## Fase 5 — US3: Activar y desactivar (P1)

**Objetivo**: Cambiar visibilidad sin borrar contenido, publicar borradores ni alterar trabajo pendiente.

**Prueba independiente**: Desactivar/reactivar publicada con cambios pendientes conserva ambas versiones y muestra solo la vigente; conflicto o fallo no finge toggle. Cubre US3.1–5 / SC003.

- [X] T032 [P] [US3] Escribir pruebas de activación, borrador con flagerróneo, CAS, dobleenvío y cambios simultáneos en `tests/story-management-repository.test.ts`; comparar catálogo y elegibilidad de recursos antes/después de commit.
- [X] T033 [P] [US3] Escribir recorrido de toggle confirmado/desconocido y activación explícita tras primera publicación en `tests/e2e/story-management-editing.spec.ts`, diferenciando publicada/inactiva de borrador.
- [X] T034 [US3] Implementar activación CAS/idempotente en `server/stories/service.ts` y ruta /activacion en `server/stories/http.ts`: activar exige publicación válida; desactivar conserva ambos snapshots/archivos; guard006 atómico y recibo, nunca reactiva al guardar/publicar.
- [X] T035 [US3] Añadir control de activación accesible e indicador de estado en `src/components/admin/StoriesManager.astro` y `src/scripts/admin-stories.ts`, sin éxito optimista; tras error mostrar estado comprobado/incertidumbre y comprobar/reintentar explícitamente, con metadatos mínimos previos a tablaUS5.
- [X] T036 [US3] Ejecutar US3.1–5 con servicio real en `tests/e2e/story-management-editing.spec.ts`: retirada del catálogo/nuevas lecturas de recursos exclusivos, reactivación sin duplicados con publicación previa, recurso compartido sigue elegible y lectura ya autorizada/copias descargadas no se prometen revocadas; registrar evidencia en `specs/007-gestion-historias/evidence.md`.

**Checkpoint**: historia verificable con datos sintéticos aislados; aceptación final requiere fases siguientes y evidencia externa.

## Fase 6 — US4: Editar preservando publicación (P2)

**Objetivo**: Completar Q1 y conflictos entre ediciones, conservando identidad/enlaces y activación.

**Prueba independiente**: Guardar cambios incompletos sobre publicada activa conserva texto/audio públicos; Publicar completo los sustituye juntos, sin reactivar inactiva. Cubre US4.1–6 / SC004.

- [X] T037 [P] [US4] Escribir pruebas snapshot A/B, opciónID estable, guardado sin cambios, CAS dos cuentas y publicación concurrente en `tests/story-management-repository.test.ts`; asegurar Guardar no cambia published ni active y pending no crea otra identidad.
- [X] T038 [P] [US4] Escribir recorridos de edición Q1, otra pestaña, cambio de registro/respuesta tardía, salida con cambios y relogin sin replay en `tests/e2e/story-management-editing.spec.ts` y `tests/e2e/story-management-draft.spec.ts`, con regresión de sesión/otras pestañas en `tests/e2e/admin-service.spec.ts`.
- [X] T039 [US4] Completar ciclo Q1 en `server/stories/service.ts` y `server/stories/sqlite-repository.ts`: working y published separados, pending calculado, reapertura recupera working, reemplazo íntegro al Publicar; título/categoría y recursos nuevos conservan identidad/links y publicación previa mientras estén privados.
- [X] T040 [US4] Completar UI de edición/conflicto en `src/components/admin/StoryEditor.astro` y `src/scripts/admin-stories.ts`: pending visible, recuperar estado confirmado conservando texto local autorizado, no sobrescritura ciega ni respuestas inferiores/otra historia; versiones no se presentan como historial navegable.
- [X] T041 [US4] Ejecutar US4.1–6 en `tests/e2e/story-management-editing.spec.ts` con dos cuentasSQLite y recursosA/B reales: pública no mezcla campos/archivos, error conocido mantieneA y desconocido consulta cuál quedó, IDs/links/active estables; registrar evidencia en `specs/007-gestion-historias/evidence.md`.

**Checkpoint**: historia verificable con datos sintéticos aislados; aceptación final requiere fases siguientes y evidencia externa.

## Fase 7 — US5: Tabla, resumen y resultado público (P2)

**Objetivo**: Gestionar datos reales, filtros y contadores globales sin confundir Contacto con ejercicios.

**Prueba independiente**: Mezclar borradores/publicadas/inactivas, filtrar/buscar y contrastar resumen; Contacto desconocido no se vuelve0 y enlace abre003. Cubre US5.1–7 / SC005.

- [X] T042 [P] [US5] Escribir pruebas de tabla/búsqueda/globales y cuenta de Contacto disponible/ausente/error en `tests/story-management-summary.test.ts`; publicada con pending no sumaBorradores, responder no aumenta consultas y baja009 cambia total.
- [X] T043 [P] [US5] Escribir UI de carga/vacío/error/sin resultados, teclado y enlace web en `tests/e2e/story-management-draft.spec.ts`, sin filas/cifras capturadas ni acciones de eliminación/moderación pública.
- [X] T044 [US5] Implementar consulta de listado/resumen en `server/stories/sqlite-repository.ts` y GET colección en `server/stories/http.ts`: «activas=count(publicada AND active), borradores=count(no publishedJSON)»; orden por creación, metadata real y ausencia de título como etiquetaUI, sin cambiar título guardado ni DTO público.
- [X] T045 [US5] Implementar adaptador agregado de Contacto en `server/stories/contact-summary.ts` y composición en `server/admin/start.ts`: countconsultations privado, read-only y esquema verificado sin migrar005, solo total o unavailable; revalidar autorización antes de responder, sin mensajes/correos, nuevos endpoints públicos ni bandeja/correo008.
- [X] T046 [US5] Completar jerarquía/tabla/filtros en `src/components/admin/StoriesManager.astro` y estilos en `src/styles/admin.css`, montados en `server/admin/views/src/pages/historias.astro`: title/categoría/duración real/estado/acciones aprobadas; Todas/Activas/Inactivas, búsqueda por título trim/casefoldUnicode, contadores globales y Consulta recibida total o No disponible, sin números de demo.
- [X] T047 [US5] Conectar búsqueda/filtros/resumen/estados y enlace `/historias.html#casos` en `src/scripts/admin-stories.ts`; Todas=todas autorizadas, Activas=publicadasactivas, Inactivas=resto incluidos borradores; sin resultados!=vacío global, Borrador no es categoría y no hay respuestas por historia.
- [X] T048 [US5] Ejecutar US5.1–7 con servicio real005/006/007 y shell003 en `tests/e2e/story-management-draft.spec.ts` y `tests/story-management-summary.test.ts`: fuente Contacto agrega nuevos/baja sin inventar respuesta008, contador fuente errónea unavailable, cuatro elegibles expandibles sin duplicados y sin datos privados; registrar evidencia en `specs/007-gestion-historias/evidence.md`.

**Checkpoint**: historia verificable con datos sintéticos aislados; aceptación final requiere fases siguientes y evidencia externa.

## Fase 8 — Integración y cierre

**Objetivo**: Ejecutar evidencia transversal; dependencias externas pendientes bloquean solo su cierre, no trabajo local independiente.

- [X] T049 Implementar importación restringida idempotente en `server/stories/import.ts` y probar en `tests/story-management-import.test.ts`: tresIDs/orden003, no duplicar ni pisar cambios gestionados; sin materiales/revisión => bloqueo, nunca seeds oficiales desde fixtures. No añadir pantalla/rol/borrado.
- [X] T050 Implementar limpieza local en `server/stories/media.ts` y mantenimiento en `server/admin/start.ts`: huérfanos/incompletos sin referencias tras24h, excluir operaciones en curso y no borrar snapshots/recursos referenciados; probar reinicio/carrera/fsync en `tests/story-management-media-recovery.test.ts`.
- [X] T051 Añadir logs mínimos de operationId/tipo/código/duración y límites de capacidad en `server/stories/http.ts` y `server/stories/media.ts`; probar429/Retry-After, timeouts JSON30s/upload120s/inspección30s y semáforo2 en `tests/story-management-http.test.ts`, sin textos/archivos/cookies/credenciales/payloads en logs.
- [X] T052 Añadir gate007 al build de entrega en `scripts/require-story-management-publication.mjs` y `package.json`, configuración validada en `src/config/story-management.ts`; conservar gates001–006, rechazar fixture/operación incompleta y no considerar referencias escritas como evidencia de proveedor/proxy real. Probar rechazos en `tests/story-management-gate.test.ts`.
- [X] T053 [P] Ejecutar matriz de seguridad por cada ruta/método privado y medios en `tests/story-management-security.test.ts` y `tests/story-management-http.test.ts`: dos cuentas con mismo permiso, sin/alterada/expirada/cerrada/revocadasesión, revocación entre preparar/commit, CSRF/origen/traversal, guard antes de bytes/efecto, sin datos privados en public/dist/cachés; registrarSC006 en `specs/007-gestion-historias/evidence.md`.
- [X] T054 [P] Ejecutar accesibilidad automática/renderizada en `tests/e2e/story-management-accessibility.spec.ts`: 360/390/430/768/1024/1280/1440×texto100/200%, teclado/foco/labels/feedback y estados, contraste4.5:1/3:1 medido y controles~44px; registrar resultados por combinación en `specs/007-gestion-historias/evidence.md`, sin atribuir axe a lector manual.
- [X] T055 [P] Medir objetivos locales del plan con1000historias sintéticas y30lecturas calientes en `tests/story-management-performance.test.ts`: listar y publicar metadata preparada<=1sp95 sin blobs/transferencia, máquina y mediciones reales en `specs/007-gestion-historias/evidence.md`; no afirmarSLA/escala productivos.
- [ ] T056 Ejecutar suites007 por capa y regresión afectada001/003/005/006 según `specs/007-gestion-historias/quickstart.md`; vigilar red/cookies/storage de ejercicios, recarga/bfcache y nueve cambios de opción sin persistencia/envío ni scoring; resultados/skips por Chromium/Firefox/WebKit en `specs/007-gestion-historias/evidence.md`.
- [ ] T057 Verificar materiales oficialesP01/P03, derechos, tresaudios con play/pause/seek, dimensiones/duración, equivalencia de transcripciones y nueveexplicaciones con fuentes; realizar comparación captura y lector de pantalla011 en `specs/007-gestion-historias/evidence.md`. Si faltan recursos/revisión, dejar tarea pendiente con bloqueo, no sustituir por fixtures.
- [ ] T058 CalificarP02/009/010 con responsable/entorno reales en `specs/007-gestion-historias/evidence.md`: proxy same-originHTTPS/no-store/Range y sin aliasprivados, storage/FFmpeg sandbox, capacidad/disco, backup/restauración y retención historias/temporales/copias/logs/recibos distinta de90dContacto; dependencia006 y fuente005/008 reales. Sin credenciales/proveedor o evidencia, mantener pendiente; no desplegar ni enviar correo desde esta tarea.
- [ ] T059 Validar build de entrega y API/medios con configuración/materiales aprobados, importación trescasos y nueva publicación real controlada, documentando resultado en `specs/007-gestion-historias/evidence.md`; sin aprobaciones/manifiestos ficticios ni desactivar guards para verde. Dependencias ausentes mantienen tarea pendiente.
- [X] T060 Cerrar trazabilidad31escenarios/5AD/8SC con evidencia o bloqueo y sincronizar `specs/007-gestion-historias/spec.md`, `specs/007-gestion-historias/plan.md`, `specs/007-gestion-historias/quickstart.md`, `specs/007-gestion-historias/tasks.md` y `specs/TRACEABILITY.md`; no inventarIDs históricos ni marcar casillas solo por existir código, y no hacer commit/push sin solicitud.

**Checkpoint**: prerrequisitos/evidencia de la fase comprobados o bloqueo explícito, sin aparentar cierre.

## Dependencias y orden de ejecución

Preparación → fundamentos → US1 → US2 → US3 → US4 → US5 → cierre.
Las dependencias reflejan que publicación usa borradores/recursos y edición usa publicación;
no se promete ejecución independiente desde cero. Cada historia tiene una prueba aislada con
prerrequisitos preparados por repositorio de prueba, sin saltarse autorizaciónHTTP ni necesitar
el recorridoUI de otra historia. US5 puede diseñar tests/adapter de lectura tras fundamentos,
pero su validación completa esperaUS1–4. No trabajar simultáneamente sobre service/http/controller
compartidos; [P] solo permite archivos distintos dentro de la misma etapa.

- T001 precede T002–T004; completar preparación antes de fundamentos. T004 comprueba y documenta capacidad: si no está disponible, bloquea T023/T024 y publicación con medios, sin bloquear fundamentos/US1 textual; registrar ese límite sin fingir aceptación de archivos.
- T005→T006→T007→T008→T009→T010; T011 puede escribirse trasT007 mientras se implementaT008–T010, y ejecutarse al terminar fundamentos.
- US1: T012–T019; sus dos tareas iniciales de pruebas pueden prepararse en paralelo; implementar el resto en orden y ejecutar verificación de servicio al final.
- US2: T020–T031; sus dos tareas iniciales de pruebas pueden prepararse en paralelo; implementar el resto en orden y ejecutar verificación de servicio al final.
- US3: T032–T036; sus dos tareas iniciales de pruebas pueden prepararse en paralelo; implementar el resto en orden y ejecutar verificación de servicio al final.
- US4: T037–T041; sus dos tareas iniciales de pruebas pueden prepararse en paralelo; implementar el resto en orden y ejecutar verificación de servicio al final.
- US5: T042–T048; sus dos tareas iniciales de pruebas pueden prepararse en paralelo; implementar el resto en orden y ejecutar verificación de servicio al final.
- Cierre T049–T060 espera todas las historias. Las verificaciones [P] pueden ejecutarse con bases/puertos/salidas independientes; trabajos sobre evidence.md se integran secuencialmente. Materiales/P02/009/010/011 bloquean sus casillas, sin impedir verificación local.

## Ejemplos de trabajo paralelo

| Historia | Archivos independientes (tras fundamentos/prerrequisitos) |
|---|---|
| US1 | T012 y T013: pruebas de dominio y recorridoUI; integración de código compartido posterior en serie |
| US2 | T020 y T021: pruebas de publicación y medios; integración de código compartido posterior en serie |
| US3 | T032 y T033: pruebas de dominio y recorridoUI; integración de código compartido posterior en serie |
| US4 | T037 y T038: pruebas de dominio y recorridoUI; integración de código compartido posterior en serie |
| US5 | T042 y T043: pruebas de dominio y recorridoUI; integración de código compartido posterior en serie |

## Estrategia incremental y aceptación

MVP: preparación+fundamentos+US1, crear/guardar/reabrir borrador privado con fallo/reintento
honestos. No habilitar un botón de publicación simulado ni un catálogo de demostración como entrega.
Después US2 publica completo pero no activa implícitamente; US3 completa visibilidad real. US4
compruebaQ1 en ediciones y conflictos; US5 completa gestión/resumen. PrioridadP2 no significa opcional.

EscenariosUI de error/vacío simulados, servicioSQLite+archivos reales y calificación productiva tienen evidencia separada.
No hacer despliegue, provisión, correo, commit o push por generar/ejecutar tareas. Bloqueos documentados
no equivalen a prueba aprobada ni casilla cerrada. Fase final cubre SC006/007/008 transversalmente.

## Trazabilidad resumida

| Requisito | Historia / criterio | Evidencia prevista |
|---|---|---|
| AD03 / FR001 | US5.1/3–5/7, SC005 | Resumen real/global, Contacto disponible o desconocido |
| AD04 / FR002 | US1.1/3/5, US3.5, US4.1/4, US5.1–3/5/7 | Identidad/reintentos, conflictos, tabla/filtros y sin borrado |
| AD05 / FR003 | US2.2–3/5/7, US3.1–5, SC002/003 | Publicada AND activa, recursos privados y de/reactivación |
| AD06 / FR004 | US1.1–6, US2.1–7, US3.3, US4.1–6, SC001/002/004 | Borrador/publish, campos/medios, Q1 y conflictos |
| AD10 / FR005 | US2.2/5, US3.1, US4.4, US5.6–7, SC005 | Catálogo003 vigente, enlace y ausencia de datos privados |
| Todos | SC006/007/008 | Autorización por entrada, matriz14combinaciones y31escenarios con evidencia/bloqueo |

Las31 unidades locales son US1(6)+US2(7)+US3(5)+US4(6)+US5(7). LosIDs originales
AD03/04/05/06/10 y SC-001–SC-008 siguen vigentes; notación abreviada de esta tabla no crea IDs nuevos.

## Inventario

60 tareas: 56 cerradas localmente y cuatro pendientes (T056–T059). US1: 8, US2: 12, US3: 5, US4: 5, US5: 7. Las 17 marcas [P] describen el diseño de ejecución, no agentes utilizados.

## Resultado de implementación — 2026-10-19

Ver [evidence.md](evidence.md) para resultados por capa y los31escenarios. Se consolidaron pruebas
por comportamiento en repository/http/draft/editing, manteniendo criterios e IDs; no se crearon
archivos vacíos para repetir cobertura. La UI usa servicio real aislado en lugar de un segundo mock
integral; solo carga/error/vacío y error de upload se simulan explícitamente para comprobar estados.

- T056: Chromium y regresiones afectadas comprobados; Firefox/WebKit no instalados. Regresión001 directa no ejecutada en esta fase; integración de enlaces003 y acceso006 sí.
- T057: recursos oficiales, revisión editorial/derechos/transcripciones/nueve explicaciones y fidelidad/lector manual pendientes.
- T058: proveedor, proxy/HTTPS y políticas009/010/P02, backups y operación reales no calificados.
- T059: build de entrega bloqueado por recursos/revisión002 y dependencias productivas; gate007 también rechaza configuración pendiente.

Ninguna de estas casillas se cierra por aceptar archivos sintéticos, pasar tests locales o escribir
una referencia. Sin commit/push/despliegue ni envío de correo a terceros. T060 cierra la trazabilidad
local con bloqueos explícitos; no acredita aceptación productiva de los cinco requisitos.

## Conexión local003 — 2026-10-28

- [X] T061 Conectar catálogo/medios públicos del servicio007 al servidor Astro local con activación explícita, SQLite privado persistente, acceso loopback y sin rutas administrativas, cuentas ni publicación automática; verificar API/estado vacío real en navegador y exclusión de borradores/medios privados. No cierra calificación productiva T056–T059.

2026-10-28 — T061 completa: catálogo real y medios públicos007 conectados a Astro local;6/6 pruebas de navegador y2/2 Node nuevas,TypeScript/check conformes. Regresión adicional17aprobadas/2bloqueadas por ffmpegLinux ausente. No publicación automática; catálogo actual vacío. [Evidencia](local-connection.md).

## Adaptación local de medios — 2026-10-28

- [X] T062 Adaptar el inspector y pruebas007 a los binarios ARM64 instalados mediante perfil nativo restrictivo y supervisor de recursos, conservando Linux y fail-closed; comprobar archivos, CPU/memoria/tiempo/salida, lectura privada/escrituras/red/fork y suite de subidas/importación. Resultado42/42; TypeScript/check conformes. No cierra T056–T059 ni publica fichas. [Evidencia](macos-media-validation.md).

- [X] T063 Ejecutar publicación local de las cuatro fichas por mandato de la responsable, con hashes exactos, recursos oficiales y portada cuarta asignada explícitamente; usar proceso privado de operador sin credenciales web nuevas y verificar audio/transcripción/expansión/ejercicios en tres motores. Resultado confirmado; no cierra calificación productivaT056–T059. Ver ../003-historias-educativas/evidence/local-publication.md.
