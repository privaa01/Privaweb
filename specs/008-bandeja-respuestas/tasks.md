# Tasks: Bandeja privada y respuestas por correo — 008

**Input**: [spec](spec.md), [plan](plan.md), [investigación](research.md), [modelo](data-model.md),
[contrato](contracts/inbox.md) y [guía](quickstart.md). Constitución vigente y Q1=A.
**Fecha**: 2026-10-19. **Estado**: implementación local, 60/66 verificadas;
T056/T057/T060/T062/T063/T064 pendientes. Ver [evidence.md](evidence.md).
**Tests**: requeridos por spec SC-001–008, CT01 y CONST-06/10; escribir las pruebas críticas antes
que su implementación, comprobar fallo por comportamiento ausente (no importación) y volver a
verificar tras implementar. No se exige una cobertura arbitraria ni TDD para estilos triviales.
**Organización**: cuatro historias, por prioridad; tareas locales no sustituyen IDs históricos ausentes.

## Formato y rutas

Cada tarea usa `- [ ] Tnnn [P?] [USn?] descripción con rutas relativas a la raíz`.
[P] indica trabajo en archivos distintos que puede coincidir tras completar sus prerrequisitos;
no autoriza editar el mismo archivo simultáneamente ni ejecutar una tarea dependiente antes de tiempo.
Las rutas nuevas se crean en implementación, no son funcionalidad existente. Ninguna tarea envía
correos a terceros ni despliega producción sin la configuración y autorización correspondientes.

## Phase 1: Setup — preparación compartida

Preparar herramientas y bancos aislados sin modificar aprobaciones productivas.

- [x] T001 Preparar estructura `server/inbox/`, `server/inbox/tsconfig.json` y scripts `check:inbox:service`, `test:inbox`, `check:inbox:contract`, `build:inbox:contract`, `test:e2e:inbox:contract`, `test:e2e:inbox:service`, `test:e2e:inbox:integration` en `package.json`; conservar lock y herramientas Node 24/Astro 7/TypeScript 5.9 del plan; no añadir proveedor.

- [x] T002 [P] Crear fixture UI sintética en `tests/fixtures/inbox/astro.config.mjs`, `tests/fixtures/inbox/src/pages/contacto.astro` y `playwright.inbox.config.ts`, puerto 4332, con mocks identificados, claves/credenciales fuera de artefactos y traces/video/screenshots de acceso desactivados.

- [x] T003 [P] Crear helpers de bases privadas/cuentas sintéticas/reloj/barreras y doble send/lookup con fallos controlados en `tests/fixtures/inbox-service/helpers.ts`, `tests/fixtures/inbox-service/mail.ts`, `tests/fixtures/inbox-service/serve.ts` y `playwright.inbox.service.config.ts`, puerto 4333; no reutilizar bases/puertos ni introducir rutasHTTP de test.

- [x] T004 [P] Definir DTO schemaVersion1, errores allowlist y límites de C2/C3 en `src/lib/inbox-contract.ts`; declarar referencias de readiness 008 por defecto pendientes en `src/config/inbox.ts`, incluyendo proveedor/dedup/recepción/migración/009/010/011; cero aprobaciones inventadas.

- [x] T005 Crear matriz inicial de los cinco FR, 26 escenarios y SC-001–008 con estado No ejecutado en `specs/008-bandeja-respuestas/evidence.md`; separar Node/SQLite, UI mock, navegador+servicio, proveedor/buzón y operación 009; registrar restricciones del entorno sin datos reales.

## Phase 2: Foundational — prerrequisitos bloqueantes

No iniciar historias antes de cerrar esta fase. Ensayar migración y autorización con SQLite de archivo; ninguna red bajo locks.

- [x] T006 [P] Escribir pruebas de migración en `tests/inbox-migration.test.ts`: preservar IDs/tuplas/fechas/contact.key/attempts 005, ampliar CHECK, repetición sin cambios, esquema desconocido, fallo/rollback y FK/integrity; nuevo submit y replay 005 tras Respondido deben conservar semántica.

- [x] T007 [P] Escribir pruebas con dos conexiones/procesos en `tests/inbox-authorization.test.ts` para lock admin→contacto, revocación antes/después del commit, prohibición de async/red/camino inverso, sesión expirada y fallo tras COMMITcontacto antes del touchadmin; resultado incierto recuperable sin segundo efecto.

- [x] T008 Implementar esquema versionado y migración offline en `server/contact/schema.ts` y `scripts/migrate-contact-inbox.ts`: status «Pendiente o Respondido», revision «Entero positivo, inicial1 para migrados y nuevos 005», lifecycle «active o deleting»; tablas reply_operations/reply_responses e índices/FK del modelo; detener escritores, backup privado consistente, transacción/reversión, integrity_check/foreign_key_check y rechazo de versiones desconocidas; CLI con rutas absolutas y ensayo idempotente.

- [x] T009 Adaptar `server/contact/sqlite-repository.ts` y `server/contact/runtime.ts` al esquema compartido: INSERT de columnas explícitas/defaults, validar versión sin migración online implícita, mantener normalización/acuse/IDs/recibos/clave 005; preservar inicial Pendiente, lastActivityAt original y replay aun después de responder; borrado básico de nuevas dependencias sin FKs huérfanas, a completar con carreras en T052.

- [x] T010 Implementar repositorio/base de transacciones en `server/inbox/repository.ts`, `server/inbox/sqlite-repository.ts` y guard interno de sessionDigest en `server/admin/sqlite-repository.ts`: admin.withAuthorizedTransaction exterior→contacto BEGIN IMMEDIATE→COMMITcontacto→touchadmin; síncrono, sin await/red, timeout 5 s; permisos 0700/0600 y WAL/FULL/FK; no afirmar atomicidad multiarchivo ni convertir digest en credencialHTTP.

- [x] T011 [P] Implementar cifrado versionado AES-256-GCM en `server/inbox/crypto.ts` y pruebas de manipulación/AAD/clave ausente en `tests/inbox-crypto.test.ts`; AAD «operationId, consultationId, actor y deliveryId», claves fuera del checkout; lectura de datos conservados falla cerrada sin clave; retirada de claves condicionada a 009/copias.

- [x] T012 [P] Definir contrato independiente `ReplyMailAdapter` en `server/inbox/mail-adapter.ts` y sus dobles tipados en `tests/fixtures/inbox-service/mail.ts`: send/lookup, deliveryId estable, payloadDigest, capabilities/version/scope/ventanas y acceptedAt/proof o rejected terminal/noFutureAcceptance, en otro caso unknown; no reutilizar resetURL/admin_jobs/MailWorker 006.

- [x] T013 Preparar routerHTTP común 008 en `server/inbox/http.ts`: no-store/CSP/nosniff/no-referrer, X-Priva-Request1, mismo origen/cookie 006, POST con Origin exacto/CSRF, paths canónicos sin query, JSON 32 KiB/UTF8 estricto/plazo 30 s, campos exactos, códigos401/403/404/405/409/413/415/422/429/503 sin datos internos; GET/polling sin touch automático.

- [x] T014 Implementar guard fail-closed `scripts/require-inbox-publication.mjs` e integrarlo en `package.json` y `server/admin/start.ts`; probar en `tests/inbox-gate.test.ts` que faltantes reales de P02/009/010/011 bloquean build/startup y fixtures nunca habilitan producción; conservar guards 005/006/007.

- [x] T015 Ejecutar pruebas T006/T007/T011/T014 y typecheck con Node 24; documentar comandos/resultados en `specs/008-bandeja-respuestas/evidence.md`; verificar ensayo completo de migración 005 y lock/auth, no cerrar con error de importación como supuesto fallo funcional. Dependencias: T008–T014 implementadas.

## Phase 3: User Story 1 — consultar y filtrar (P1, MVP)

Entregar listado/detalle privado útil sin proveedor. Prueba independiente: consultas sintéticas recibidas por 005, Pendiente/Respondido preparados por helper interno, filtros/detalle/totales reales y acceso directo denegado (US1.1–6).

- [x] T016 [P] [US1] Escribir pruebas repositorio/HTTP en `tests/inbox-reading.test.ts` para US1.1–5: listado por estado, alias/correo/preview, detalle/historial, cursor/HMAC inválido, vacío≠error, misma snapshot/totales, eliminación no visible y acceso inválido sin datos.

- [x] T017 [P] [US1] Escribir recorridosUI en `tests/e2e/inbox-reading.spec.ts` para US1.2/3/6: filtro inicial Pendiente, paginación, selección, loading/error/reintento y respuesta tardía que no mezcla consulta/filtro ni vuelve a mostrar privados; distinguir mocks de servicio.

- [x] T018 [US1] Implementar lecturas/cursores en `server/inbox/sqlite-repository.ts`: consultas lifecycleactive, orden receivedAt/id descendente estable, lista 25 o50, preview 160 puntos, historial 25 acceptedAt/id ascendente, cursorHMAC máximo 2048 bytes y revision de historial; listado y summary en misma transacción; DBausente/incompatible es unavailable, nunca0.

- [x] T019 [US1] Implementar servicio autorizado de listado/detalle/historial/resumen en `server/inbox/service.ts`, DTO allowlist en `src/lib/inbox-contract.ts`; no exponer sessionDigest/providerProof/keys; responder404 uniforme para consulta no disponible y409 si cambia revision al recorrer historial.

- [x] T020 [US1] Completar rutas C3 de lectura en `server/inbox/http.ts`: POST listado, GET resumen/detalle y POST historial; autorización por operación, CSRF en POSTlectura, paginación/errores definidos y sin tocar inactividad por polling.

- [x] T021 [US1] Adaptar conteoactive de misma base en `server/stories/contact-summary.ts` y pruebas `tests/inbox-summary.test.ts`; total 007 coincide con summary 008, Respondido no suma consultas, deleting no cuenta; conservar available0/unavailable y lectura compatible con despliegue coordinado del esquema.

- [x] T022 [US1] Construir listado/filtros/resumen/detalle/historial de `src/components/admin/InboxManager.astro` y estilos en `src/styles/admin.css`, conservando ordenC1/estética 006, labels/foco/live regions, sin cifras128, casos ni Aprobar; cada estado vacío/error/carga tiene texto distinto.

- [x] T023 [US1] Implementar lectura interactiva en `src/scripts/admin-inbox.ts`: eventos 006, tokenCSRF solo memoria, fetch same-origin, AbortController/generación por sesión/filtro/registro, navegación de cursores y reintento explícito; limpiarDOM/variables ante pérdida de acceso, ningún almacenamiento persistentePII.

- [x] T024 [US1] Componer lecturas 008 en `server/inbox/composition.ts`, `server/admin/http.ts`, `server/admin/start.ts`, `server/admin/views/src/pages/contacto.astro` y `src/components/admin/AdminShell.astro`; insertar callback antes de fallback404, reemplazar placeholder 008 sin duplicar shell/auth y arrancar/cerrar conexión privada; fixture de servicio usa misma composición.

- [x] T025 [US1] Ejecutar T016/T017 y pruebasresumen con SQLite real y navegación 006 en `tests/fixtures/inbox-service/serve.ts`; registrar evidencia US1.1–6/AD07/AD11/SC-001/004 en `specs/008-bandeja-respuestas/evidence.md`. CheckpointMVP: consulta privada útil sin enviar correos ni afirmar cierre 008.

## Phase 4: User Story 2 — redactar y enviar respuesta asociada (P1)

Permitir envío deliberado e historial Q1 con aceptación comprobada. Prueba independiente: consulta sintética y adaptador local controlado; verificar destinatario/contenido/aceptación/persistencia y respuesta adicional; recepción real queda en US4.

- [x] T026 [P] [US2] Escribir fronteras de normalización en `tests/inbox-validation.test.ts`: «text normalizado 1–5000 puntos de código», 0/1/5000/5001, trim/soloespacios, Unicode astral/inválido, CRLF→LF, tab/LF permitidos, NUL/control rechazado; texto cliente/servidor idéntico y sin aplicar límite 1500 de 005.

- [x] T027 [P] [US2] Escribir pruebas de intención/aceptación en `tests/inbox-response.test.ts`: destinatario guardado, payload inmutable, replay antes de CAS, otra intención409, operationId/deliveryId únicos, una intención no resuelta, respuesta única por aceptación y transacciónconsulta/respuesta/estado/actividad tras aceptación válida.

- [x] T028 [P] [US2] Escribir recorridos de composición Q1 en `tests/e2e/inbox-response.spec.ts`: destinatario visible fijo, vacío/error, estado en curso sin falso Respondido, recarga/historial, revisión explícita vigente y respuesta adicional que conserva anteriores sin aumentar total; US2.1–6.

- [x] T029 [US2] Implementar normalización/validación compartida en `src/lib/inbox-validation.ts` y `server/inbox/validation.ts` con restriccionesT026 y contratos exactosC3; servidor ignora/rechaza destinatario/CC/BCC/adjuntos/campos desconocidos; asunto fijo/remitente calificado sin interpolar entradas en cabeceras.

- [x] T030 [US2] Implementar registro durable en `server/inbox/sqlite-repository.ts`: operationId «UUID único global», deliveryId «aleatorio estable, único», «consulta, actor, texto, expectedRevision, reviewedRevision y retryOf» como identidad de replay; comprobar operación antes de CAS, UNIQUEparcial consultationId para queued/dispatching/unknown; payload cifrado, timestamps/actor/sessionDigest, state «queued, dispatching, unknown, rejected, accepted, canceled», retryOf opcional, createdAt/updatedAt y providerKeyExpiry; una intención por consulta y revision incrementada en commit.

- [x] T031 [US2] Implementar servicio de envío e historial Q1 en `server/inbox/service.ts`: consultaactive, destinatario almacenado, expectedRevision=reviewedRevision vigente, revisión explícita invalidada al cambiar revision, una intención no resuelta; respuesta nueva aceptada se añade inmutable, fallo adicional mantiene Respondido; no requiere probar lectura humana de todas las páginas.

- [x] T032 [US2] Implementar primer ciclo seguro de worker en `server/inbox/worker.ts`: reserva autorizada por sessionDigest bajo ordenadmin→contacto, frontera durable dispatching, I/O fuera de locks con 10 s, send/lookup tipados; aceptación/proof/acceptedAt válidos→respuesta única+statusRespondido+max(receivedAt,acceptedAt), rechazo probado conserva estado; cualquier timeout/error incierto quedaunknown bloqueante, sin reenvío automático incluso antes de completar US3.

- [x] T033 [US2] Completar POST consultas/:id/respuestas y GET operaciones/:operationId en `server/inbox/http.ts`, recibo202registered o200replay, 200operation, 409revision/operation/unresolved; errores/HTTPperdido no prueban ausencia de envío; red de correo nunca ocurre dentro del POST ni de transacciónHTTP.

- [x] T034 [US2] Añadir editor/historial/confirmación explícita de revisión en `src/components/admin/InboxManager.astro` y estilos en `src/styles/admin.css`: texto 1–5000, contador/límite, destinatario visible, advertencia al descartar, una selección por consulta, feedback accesible; no copias, HTML enriquecido, chat ni promesa de24 h.

- [x] T035 [US2] Implementar composición/registro/recibo en `src/scripts/admin-inbox.ts`: UUID por intención y snapshot de texto/revisión, doble clic/Enter bloqueados, cliente 10 s, conservar texto ante fallo con acceso vigente y distinguirqueued/unknown/rejected/accepted; no crear nuevaoperationId para eludir unknown ni repetir después del login.

- [x] T036 [US2] Integrar worker/adaptador/clave 008 separados en `server/inbox/composition.ts` y `server/admin/start.ts`: carga de módulo operador seguro, origen/remitente/proof/capabilities validados, tick 1 s sin solapamiento y cierre ordenado; conservar MailWorker 006 y sus claves/finalidad; producción aún bloqueada por readiness.

- [x] T037 [US2] Ejecutar T026–T028 con worker/doble local y SQLite real, reinicio/recarga, datos como texto y Q1; registrar US2.1–6/AD08/AD09/SC-002 en `specs/008-bandeja-respuestas/evidence.md`; ninguna aceptación mock acredita recepción real ni habilita envío productivo.

## Phase 5: User Story 3 — fallos e incertidumbre sin duplicar (P1)

Completar recuperación durable y conflictos sin reenvíos inadvertidos. Prueba independiente: fallos antes/después del correo/commit, dos conexiones/cuentas/workers, reinicio y lookup controlado; medir número real de aceptaciones del doble.

- [x] T038 [P] [US3] Escribir adversidades del worker en `tests/inbox-worker.test.ts`: crash/timeout/lease vencido, aceptación externa seguida de fallo local, not_foundeventual, proof/acceptedAt inválidos, ventanaidempotente vencida, lookup tras revocar sesión y resultado tardío de otro lease; ningúnunknown se convierte en fallo seguro.

- [x] T039 [P] [US3] Escribir pruebas de concurrencia/replay en `tests/inbox-concurrency.test.ts`: dos procesos con mismaoperationId, payload distinto, dos cuentas con igual revisión, índice no-resuelto, fallo entre commits y retryOf de rejected; máximo una aceptación por intención y resultado antiguo no modifica nueva revisión.

- [x] T040 [P] [US3] Escribir recuperaciónUI en `tests/e2e/inbox-recovery.spec.ts`: pérdidaHTTP/doble click/errorcomprobación, polling sin touch, texto conservado, rechazo y reintento explícito, cambio de consulta/filtro/sesión, confirmación antigua ignorada y ausencia de reenvío tras login; US3.1–8.

- [x] T041 [US3] Completar leases/fencing en `server/inbox/sqlite-repository.ts`: «leaseOwner aleatorio, leaseGeneration monótono, leaseUntil, nextLookupAt, dispatchStartedAt», lease de 30 s, transición queued → dispatching o canceled tras guard; lease vencido→unknown, nuncaqueued; comparar generation en toda escritura tardía y no reservar otro send por recuperar lease.

- [x] T042 [US3] Implementar reconciliación en `server/inbox/worker.ts`: lookup del mismo deliveryId, backoff2/5/15/30/60s y máximo1/min, timeout 10 s, no ticks solapados; sin prueba concluyente mantenerunknown sin límite artificial que implique rechazo; tras ventana de dedup solo lookup; sesión original revocada no impide comprobar aceptación ya autorizada, pero sí otrodispatch.

- [x] T043 [US3] Hacer recuperación de aceptación y persistencia atómica en `server/inbox/sqlite-repository.ts`: acceptedAt original/proof cifrado y verificado, responseId/consultationId/actorAccountId/sealedPayload inmutables y respuesta «operationId UNIQUE/FK», commit conjunto y replay sin actualizar lastActivityAt/revision otra vez; transferir payload al historial protegido y recuperar vía lookup tras crash, sin duplicar respuesta ni recrear consulta borrada.

- [x] T044 [US3] Implementar reintento explícito y conflictos en `server/inbox/service.ts`: rejected terminal/noFutureAcceptance permite nuevaoperationId con retryOf y revisión actual, replay de rejected solo devuelve recibo; unknown bloquea cualquier intención equivalente/nueva por consulta, cambio de historial exige revisar antes de responder de nuevo; canceled por sesión no autoriza reenvío automático.

- [x] T045 [US3] Implementar cuotas HMAC y respuestas409/429/Retry-After de C3 en `server/inbox/http.ts`: 10 intenciones/cuenta/min, 2/consulta/min, 60 comprobaciones/cuenta/min; replay no consume cuota de intención y429 no registra operación ni afirma fallo del correo; separar buckets 006/007, GETpolling no toca sesión.

- [x] T046 [US3] Completar polling/control de incertidumbre en `src/scripts/admin-inbox.ts` y estados de `src/components/admin/InboxManager.astro`: cada 2 s visible, a 30 s comunicar resultado desconocido y ofrecer comprobar, mantener identidad/texto y deshabilitar Enviar; fallo demostrado permite acción explícita, sin botón para saltarseunknown.

- [x] T047 [US3] Completar limpieza por acceso/navegación en `src/scripts/admin-inbox.ts` usando eventos de `src/scripts/admin-session.ts`: limpiarDOM/memoria en sesión perdida, invalidar generaciones/cancelar polling, evitar textodeotra cuenta/consulta y callbacks/finallyantiguos; advertir descarte antes de navegación con texto, jamás persistir PII en navegador.

- [x] T048 [US3] Añadir observabilidad allowlist en `server/inbox/http.ts`, `server/inbox/worker.ts` y pruebas en `tests/inbox-logging.test.ts`: solo evento/código/duración, sin textos/correo/IP/cookie/tokens/providerReference; proof y errores externos no van a logs ni artefactos; métricas no son estadísticas de ejercicios.

- [x] T049 [US3] Ejecutar T038–T040/T048 y verificar reanudación con dos workers/procesos y SQLite durable en `specs/008-bandeja-respuestas/evidence.md`; enlazar US3.1–8/AD08/AD09/CT01/SC-003/004 con aceptaciones contadas, rechazos/unknown separados, cero duplicados y sin replay tras login.

## Phase 6: User Story 4 — recorrido integrado y privacidad (P2)

Verificar desde Contacto hasta aceptación/recepción y eliminación. Prueba independiente: cuentas y consulta sintéticas, proveedor controlado y reloj; calificación externa queda bloqueada si faltan proveedor/buzón/operación 009.

- [x] T050 [P] [US4] Escribir ciclo de vida en `tests/inbox-retention.test.ts`: lectura/fallo/replay no reinician 90 días; nueva aceptación adicional sí con fechaoriginal, borrar queued/dispatching/unknown, recibos 005 y respuesta tardía, restorevencido y purga de metadatos sin recreación; US4.4–6.

- [x] T051 [P] [US4] Escribir recorrido 005→006→008 en `tests/e2e/inbox-contact-flow.spec.ts` con SQLite real/adaptadorcontrolado y regresión 003: guardado público una vez, Pendiente privado, respuestaasociada/Respondido y mismo total 007; público no permite leer consulta ni ejercicios crean entradas; separar aceptaciónmock de recepciónreal.

- [x] T052 [US4] Extender eliminación coordinada en `server/contact/sqlite-repository.ts`, `server/contact/schema.ts` y `server/inbox/sqlite-repository.ts`: lifecycledeleting excluido de UI/totales/reservas, cancelar queued, revocar attempts 005, retirar operaciones/respuestas/payload y FKs; tombstone solo opaco sin alias/correo/texto/hash; no recrear tras ack/replay/purga, guardando solo vigencia de capacidades necesaria.

- [x] T053 [US4] Integrar reloj/últimaactividad/vencimiento en `server/inbox/service.ts` y `server/inbox/sqlite-repository.ts` con contrato 009: max(receivedAt,nuevaacceptedAt), ninguna prolongación por lectura/fallo/replay; antes de reservar comprobar no eliminada/no expirada según política operativa calificada; distinguir reserva dispatching ya autorizada de nuevareserva prohibida tras borrar; no prometer cancelar llamadaexterna ya autorizada.

- [x] T054 [US4] Preparar barrera de restauración y coordinación de mantenimiento en `server/inbox/composition.ts`, `server/admin/start.ts` y `specs/008-bandeja-respuestas/quickstart.md`: no habilitar vistas/worker antes de procedimiento 009 que retira vencidos; no rollback a backupantiguo tras escriturasnuevas, no introducir nueva consola ni declarar scheduler 009 terminado por este hook.

- [x] T055 [US4] Completar fixture integrada y prueba CT01 en `tests/fixtures/inbox-service/serve.ts`, `tests/fixtures/inbox-service/helpers.ts` y `tests/e2e/inbox-contact-flow.spec.ts`: recepción 005 real, cuenta 006 real, worker 008 y lectura tras reinicio; fallo/reintento y borrado coordinado, screenshots sintéticas si procede; mantener APIpública 005 sin IDinterno ni información de respuesta.

- [ ] T056 [US4] Calificar proveedor/remitente/adaptador 008 y buzóncontrolado solo cuando P02 esté disponible, mediante contrato en `server/inbox/mail-adapter.ts` y registro en `specs/008-bandeja-respuestas/evidence.md`: documentar scope/ventanas/idempotencia/lookup/proof/acceptedAt/rechazo y verificar recepción aparte de aceptación/estado; no elegir proveedor ni enviar a terceros por defecto; si falta, registrar tarea bloqueada y no marcarla completa.

- [ ] T057 [US4] Calificar integración 009/010 real en `specs/008-bandeja-respuestas/evidence.md` y referencias de `src/config/inbox.ts`: criterio operativo de 90 días, frecuencia/canal/verificaciónsolicitud, backups/buzones/proveedor y restauración; demostrar eliminación con límites reales y avisos coherentes; sin evidencia mantén bloqueo, sin extender 90 días a cuentas/logs ni prometer borradoabsoluto.

- [x] T058 [US4] Ejecutar T050/T051 con T052–T055 y registrar US4.1–6/AD11/CT01/SC-007 en `specs/008-bandeja-respuestas/evidence.md`; separar ensayo local de T056/T057 y nunca declarar CT01 cerrado mientras recepciónreal o política 009 sigan bloqueadas.

## Phase 7: Polish & Cross-Cutting Concerns — verificación y cierre

Cerrar únicamente lo probado. Las dependencias externas permanecen abiertas sin impedir corregir/verificar trabajo local independiente.

- [x] T059 Medir SC-005 en `tests/inbox-performance.test.ts`: 1000 consultas con 10 respuestas, 30 muestras calientes por listado/filtro/detalle, p95 ≤ 2 s, entorno/tamaño/reloj registrados y paginaciónmultihistorial; resultados en `specs/008-bandeja-respuestas/evidence.md`, sin contar benchmarks como pruebas de recepción.

- [ ] T060 Después de T059, verificar SC-006 en `tests/e2e/inbox-accessibility.spec.ts` y revisiónmanual en `specs/008-bandeja-respuestas/evidence.md`: 360/390/430/768/1024/1280/1440px × 100/200%, teclado/foco/error/live/contraste/tamaño de controles y lector de pantalla; comparar diseñoP04 con estilo/wireframe/diferenciaC28, marcar bloqueada revisión noejecutada.

- [x] T061 Ejecutar controles de seguridadC2/C4/C6 en `tests/inbox-security.test.ts` y `tests/inbox-authorization.test.ts`: origen/CSRF/métodos/path/body 32 KiB/deadline 30 s/chunked/Unicode/429, revocaciónentrelocks, no PII en storage/logs/public/dist y acceso denegado a DB/WAL/SHM/claves/templates; comprobar límites0068KiB y 007 sin debilitarlos.

- [ ] T062 Ejecutar regresión afectada 005/006/007 y 003/001 con scripts existentes de `package.json`, registrando navegador/entorno/exitcode/casos en `specs/008-bandeja-respuestas/evidence.md`; cubrir submit/replay/revoke/migración, sesiones/recuperación 006, conteos 007 y noenvíoeducativo 003; Chromium/Firefox/WebKit disponibles, no presentar ausente como aprobado.

- [ ] T063 Calificar entorno productivo/origenHTTPS/proxy/almacenamiento/permisos/claves/backup/operación del worker en `specs/008-bandeja-respuestas/evidence.md` y `src/config/inbox.ts`, con referencias verificables de T056/T057 y revisión011; sin datos operativos registrar bloqueo, no editar readiness para simular aceptación ni desplegar por esta tarea.

- [ ] T064 Ejecutar typechecks/buildscontract/vistasprivadas y verificar gate 008/build de entrega en `package.json` y `scripts/require-inbox-publication.mjs`; registrar resultados/bloqueos reales en `specs/008-bandeja-respuestas/evidence.md`, sin bypass de guards/materiales/editorial ni publicación de fixtures.

- [x] T065 Recorrer `specs/008-bandeja-respuestas/quickstart.md` con comandos 008 realmente implementados, aislar mocks/servicio/operaciónreal y registrar resultados en `specs/008-bandeja-respuestas/evidence.md`; corregir fallos y repetir solo verificaciones afectadas, no marcar por cero tests/skips ni por diseño escrito.

- [x] T066 Sincronizar `specs/008-bandeja-respuestas/spec.md`, `specs/008-bandeja-respuestas/plan.md`, `specs/008-bandeja-respuestas/tasks.md`, `specs/008-bandeja-respuestas/evidence.md` y `specs/TRACEABILITY.md`: cinco FR/26 escenarios/ocho SC con tarea/prueba/evidencia o bloqueo, conservar Q1 y pendientes reales; checkbox solo con evidencia propia, no cierre de 009/010/011 ni aprobación productiva implícita.

## Dependencies & Execution Order

```text
Setup T001–T005
  → Foundation T006–T015
    → US1 T016–T025 (MVP de lectura privada)
      → US2 T026–T037 (envío e historial con unknown ya protegido)
        → US3 T038–T049 (recuperación/concurrencia completa)
          → US4 T050–T058 (CT01 y conservación integrada)
            → Cierre T059–T066
```

- T001 precede T002–T004; esos tres pueden prepararse a la vez, T005 registra el inventario inicial.
- T006/T007 son independientes después de Setup; T008 implementa lo probado por T006,
  T009 depende de T008 y T010 de T007–T009. T011/T012 pueden desarrollarse juntos tras T010;
  T012 amplía el doble preparado por T003, no se hace en paralelo con T003. T013/T014 preceden T015.
- Cada historia depende de Foundation. En esta implementación se integra secuencialmente US1→US2→US3→US4
  por compartir repositorio/servicio/router/cliente, aunque las pruebas de cada recorrido se pueden
  preparar con helpers internos sin terminar otras historias. No construir un backend sin control de
  incertidumbre para terminar US2: T032 ya bloquea unknown; US3 completa la recuperación, no la seguridad básica.
- T016/T017 preceden T018–T024. Backend T018→T019→T020; T021/T022 se pueden preparar tras
  T019 sin tocar archivos compartidos. T023→T024→T025 validan composición y recorrido real.
- T026/T027/T028 preceden US2. T029→T030→T031; T032 depende también de T011/T012,
  T033 de T031; T034/T035 implementan el cliente después del contrato/backend. T036 requiere T032/T033
  y T037 prueba T029–T036. Enviar a producción sigue bloqueado hasta todas las condiciones de cierre.
- T038/T039/T040 preceden US3; T041→T042→T043→T044→T045→T046→T047→T048→T049
  es orden de integración conservador; pruebas independientes no implican reordenar archivos comunes.
- T050/T051 preceden T052–T055; T058 prueba ese incremento. T056 y T057 son calificaciones
  externas, requieren P02/009/010 reales; si no están disponibles, continúan pendientes y T058 solo
  registra validación local sin cerrar CT01. Ninguna configuración faltante convierte una tarea en aprobada.
- T059 → T060 se ejecutan secuencialmente tras US1–US4 locales y sin modificaciones activas
  en UI/backend, porque ambas escriben `specs/008-bandeja-respuestas/evidence.md`.
  No se consolidan resultados concurrentemente en ese archivo compartido.
  T061/T062→T064/T065→T066 cierran verificación local; T063 depende de T056/T057 y de revisión011.
  T066 documenta los bloqueos aunque otros checks pasen: no permite cerrar una tarea externa por delegación.

## Ejemplos de paralelismo por historia

| Historia | Tareas que pueden coincidir | Condición |
| --- | --- | --- |
| US1 | T016 `tests/inbox-reading.test.ts` y T017 `tests/e2e/inbox-reading.spec.ts` | Foundation y helpers listos; pruebas en archivos distintos |
| US2 | T026 validación, T027 dominio y T028 composiciónUI | US1 completo, contrato estable; tres archivos de prueba distintos |
| US3 | T038 worker, T039 concurrencia y T040 recuperaciónUI | US2 completo y dobles listos; no cambiar worker/cliente a la vez que se ejecuta evidencia final |
| US4 | T050 retención y T051 CT01 | US3 completo; pruebas sintéticas, sin servicios productivos |

No lanzar tareas con cambios en el mismo archivo simultáneamente. Los marcadores describen
posibilidades de organización, no crean agentes ni hacen ejecutables las dependencias externas.

## Matriz requisito → escenarios → tareas → pruebas futuras

| Original / FR | Escenarios | Implementación / verificación | Criterios |
| --- | --- | --- | --- |
| AD07 / FR-001 | US1.1–6 | T016–T025; `inbox-reading.test.ts`, `inbox-reading.spec.ts`, `inbox-summary.test.ts`; T059–T062 | SC-001/004/005/006/008 |
| AD08 / FR-002 | US2.3–4, US3.1–8 | T027/T030–T033/T036–T049; `inbox-response.test.ts`, `inbox-worker.test.ts`, `inbox-concurrency.test.ts`, `inbox-recovery.spec.ts` | SC-002/003/004/008 |
| AD09 / FR-003 | US2.1–6, US3.1/3/4/6/7 | T011/T026–T049; `inbox-validation.test.ts`, `inbox-response.spec.ts`, `inbox-recovery.spec.ts` | SC-002/003/004/006/008 |
| AD11 / FR-004 | US1.1, US2.1, US4.1/3 | T016–T025/T029–T037/T051/T055/T058/T062; `inbox-contact-flow.spec.ts` y regresión 003 | SC-001/004/007/008 |
| CT01 / FR-005 | US3.2/4/8, US4.1–6 | T038–T058/T063–T066; `inbox-retention.test.ts`, `inbox-contact-flow.spec.ts`, evidencia real separada | SC-003/007/008 |

Rutas de pruebasNode: `tests/`; navegador: `tests/e2e/`. Las abreviaturas de la tabla conservan
esos prefijos. Cada escenario de la especificación queda cubierto por su rango US, no se inventan
los 195 criterios históricos. Evidencia se completará en T005/T025/T037/T049/T058/T066, sin marcar
aceptaciones por la mera creación de esos documentos.

## Estrategia de implementación y aceptación

MVP: Setup+Foundation+US1 entrega lectura privada, filtros y conteos reales sin depender del correo.
Demostración local con datos sintéticos; no habilita producción ni satisface CT01. Luego US2 añade
respuesta asociada/Q1 con seguridad de unknown desde su primer envío; US3 verifica/repara carreras
y recuperación; US4 valida la integración y retención sin confundir prueba local con operación real.

En cada checkpoint ejecutar solo pruebas apropiadas y registrar evidencia. Dejar abiertas T056/T057,
T060 (parte manual/motores ausentes), T063 o T064 si faltan condiciones materiales; no declarar esas
tareas terminadas parcialmente. Otros bloqueos encontrados se documentan igual, no se presuponen
resultados. T066 puede registrar estado parcial sin cerrar 008 ni políticas ajenas.

Se ejecutó la implementación local: 60 tareas verificadas y seis abiertas. Las pruebas y límites
se describen en [evidence.md](evidence.md); marcar trabajo local no califica correo, privacidad ni
entorno productivos. No se hace commit/push/despliegue por implementar esta lista. Para cierre
integrado, resolver las dependencias externas de las seis tareas abiertas y ejecutar su aceptación.

2026-10-30 — T060 parcial: 57/57 pruebas UI (42 celdas en tres motores + 15 estados existentes), tipado conforme. Corregida casilla de revisión que heredaba ancho/padding de los campos de texto. Lector y comparación manual P04/011 pendientes; 60/66 tareas. Evidencia: accessibility-review-2026-10-30.md.
