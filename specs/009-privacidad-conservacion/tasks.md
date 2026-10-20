# Tasks: Privacidad y ciclo de vida de datos — 009

**Date**: 2026-10-20 | **Feature Directory**: `specs/009-privacidad-conservacion` | **Rama real**: `main`.
**Input**: [spec](spec.md), [plan](plan.md), [research](research.md), [data-model](data-model.md),
[contrato](contracts/privacy.md), [quickstart](quickstart.md) y constitución del proyecto.
**Estado**:57/67 tareas verificadas localmente;10 parciales/bloqueadas. [Evidencia y límites](evidence.md). Una tarea local completa no acredita producción ni cierra SC-005/007/008 globalmente.

**Format**: `- [ ] Tnnn [P opcional] [USn en historias] Acción y ruta`. Rutas relativas al repositorio;
los archivos nuevos son objetivos para implementación. Cada tarea enumera dependencias explícitas.
[P] indica archivos distintos y ausencia de dependencia entre tareas del mismo grupo; no autoriza
trabajo paralelo antes de cumplir sus prerrequisitos ni obliga a usar agentes.

**Tests**: se incluyen porque el spec exige demostración de seguridad, borrado, no resurrección
y ocho métricas; verificar fallos pertinentes antes de implementar y resultados después. No se
crean pruebas que solo repitan el código ni se interpreta un checklist como ejecución aprobada.
**Autoridad**: X02/FR-001 literal, Q1–Q4; ninguna tarea cambia alcance, proveedor o política de
otras categorías. Nuevas rutas auxiliares detallan el diseño009, sin añadir producto público.

## Phase 1: Setup — estructura y validación compartida

Objetivo: preparar tooling y fixtures009 sin habilitar producción. No requiere rehacer el proyecto existente.

- [x] T001 Crear el módulo009 y su chequeo TypeScript en `server/privacy/tsconfig.json` y scripts de check/test en `package.json`, reutilizando Node24.19.0/TypeScript5.9.3 y lock existentes. Dependencias: ninguna.

- [x] T002 [P] Crear fixtures sintéticos con reloj inyectable y1000 consultas/10respuestas en `tests/helpers/privacy-fixtures.ts`; directorios0700/archivos0600 fuera de roots públicos y limpieza determinista. Dependencias: T001.

- [x] T003 [P] Crear dobles controlables de correo send/lookup/verify y réplica independiente del backup en `tests/helpers/privacy-doubles.ts`, con aceptación/rechazo/unknown, fork y fallos por etapa. Dependencias: T001.

- [x] T004 Crear harness de servicios reales con cuentas006 sintéticas y configuración Playwright en `tests/helpers/privacy-service-harness.ts` y `playwright.privacy.service.config.ts`; sin endpointsdebug ni flags productivos. Dependencias: T002, T003.

- [x] T005 Crear referencias de readiness en `src/config/privacy.ts` y validador `scripts/require-privacy-publication.mjs`: policy/channel/confirmationMail/operationalErasure/replica/backups/restore/providers/tracking/notices; verificar artefacto/fecha/alcance y bloquear null, vacío, referencia inválida o caducada. Dependencias: T001.

## Phase 2: Foundational — prerrequisitos de todos los recorridos

Bloquea implementación de historias hasta completar T006–T017. El diario, los manifiestos básicos, la captura mínima durable para borrado externo y la barrera de recuperación son infraestructura compartida: no se dejan para después del primer borrado.

- [x] T006 Definir esquema9 en `server/contact/schema.ts` con entidades de `data-model.md`: requests "requestId UUID", "failedAttempts0–5", estados "awaiting_send/awaiting_confirmation/confirmed/expired/locked/canceled/completed"; targets "Conjunto inmutable1–50 IDs, mismo correo exacto"; mail "operationId/deliveryId únicos", estados "queued/dispatching/unknown/accepted/rejected/canceled"; jobs "Uno activo por ID", "dueAt=min límites disponibles" y secuencia/recibo/etapas; manifest y evidencias mínimos, índices/FK y transición8→9 sin pérdida de IDs, actividad o recibos. No migrar admin.sqlite. Dependencias: T005.

- [x] T007 [P] Implementar política pura en `server/privacy/policy.ts`:90d=7776000000ms, expiryDue=expiresAt+3600000ms, requestDue=confirmedAt+86400000ms, mínimo aplicable; igualdad vence, UTC, fecha inválida falla cerrada y nunca se reinicia por lectura/fallo/unknown/replay/correo009. Dependencias: T006.

- [x] T008 Crear repositorio en `server/privacy/repository.ts` sobre contact.sqlite, transacciones síncronas sin await y guard006 admin→contacto; commitcontacto antes de commitadmin, errores recuperables por requestId sin atomicidad distribuida ficticia. Dependencias: T006.

- [x] T009 Implementar políticas de apertura privada y secure_delete=ON verificable en cada conexión escritora mediante `server/privacy/storage.ts`, `server/contact/sqlite-repository.ts` y `server/inbox/sqlite-repository.ts`; WAL/FULL/FK, rutas canónicas sin symlink, claves versionadas separadas,0700/0600. Dependencias: T008.

- [x] T010 Implementar contrato de diario append/currentHead/readRange y espejo local de pruebas en `server/privacy/deletion-journal.ts`: secuencia monotónica, firma/HMAC versionado, idempotencia por jobId, ID aleatorio/fecha/motivo sin email/texto/hash del contenido; rechazar fork/replay/discontinuidad y exigir réplica durable fuera del conjunto restaurado. Dependencias: T008, T003.

- [x] T011 Implementar barrera supervisor/flock en `server/privacy/maintenance.ts` y `scripts/privacy-supervisor.ts`: procesos participantes bajo lock compartido, cierre de admisión/drenaje, lock exclusivo para saneamiento, IPC privado, sin robar lock por timeout ni fingir que --writers-stopped detiene escritores. Dependencias: T009, T010.

- [x] T012 Implementar creación, firma, registro y validación básica de manifiestos en `server/privacy/backups.ts` con "backupId, createdAt, snapshotSequence, schemaVersion, keyVersions, restoreUntil, contentDigest, signature, destroyedAt/evidenceRef", incluyendo el backup de migración; crear verificador de head actual, manifiesto/cadena y recibo de reapertura en `server/privacy/restore.ts`; falta de réplica, firma, continuidad o actualidad bloquea acceso005/007/008 y envíos. Define primitives de reaplicación antes de habilitar restauración completa en US3. Dependencias: T010, T011.

- [x] T013 Implementar coordinador base idempotente en `server/privacy/erasure.ts` y captura mínima durable en `server/privacy/copies.ts`: intención/deleting→réplica verificada fuera de locks→captura confirmada de handles externos necesarios→borrado lógico→verificación física→completed; guardar handles opacos por jobId solo en ubicación privada calificada con ciclo explícito, sin email/text/hash en jobs/logs. Si hay ubicación afectada y la captura falla, no destruir su única referencia: dejar etapa fallida/bloqueada con deadline original y sin falso éxito; solo evidencia de ausencia de copias externas permite captura vacía. Prueba local usa doble identificado; producción exige calificación. Sin tratar ausencia de fila como borrado completo. Dependencias: T008, T010, T011, T007, T012.

- [x] T014 Crear `scripts/migrate-contact-privacy.ts`: adquirir barrera real, detener conexiones, backup coherente con manifiesto inventariado, migrar8→9, secure_delete y VACUUM de saneamiento previo con temporales privados, integrity/FKcheck y recibo inicial. No reabrir sin verificador de recuperación; rollback respeta diario. Dependencias: T012, T013.

- [x] T015 Integrar esquema9/barrera/recibo en `server/contact/runtime.ts`, `server/inbox/composition.ts`, `server/admin/start.ts` y `server/stories/contact-summary.ts`; sustituir arranques que solo purgeExpired. No admitir lector o escritor que eluda supervisor. Dependencias: T014.

- [x] T016 Validar migración/compatibilidad005/008 y fallos de inicialización en `tests/privacy-foundation.test.ts`: datos/IDs/claves/recibos conservados, manifiesto firmado del backup antes de migrar, captura de handles durable antes de borrar008 y fallo/reintento idempotente sin pérdida de referencias, PRAGMAs por escritor, rutas inseguras, FK, replica ausente, backup antiguo y writer ajeno; usar SQLite de archivo/procesos reales. Dependencias: T015, T002, T003.

- [x] T017 Añadir reloj, leases con fencing y logs allowlist en `server/privacy/observability.ts`; solo etapa/código/duración/agregados, sin correo/alias/texto/IP/código/token/identificadores de proveedor ni IDs privados en logs; heartbeat para watchdog independiente. Dependencias: T016.

## Phase 3: User Story 1 — Aplicar conservación sin prolongaciones indebidas (P1, MVP local)

Objetivo: exclusión desde90d y limpieza operativa≤1h. Prueba independiente: V01–V04 y V15 con Pendiente/Respondido, fronteras exactas, reinicios y residuos sintéticos; consultas vigentes intactas. Fundamentos y protección de restore ya disponibles.

- [x] T018 [P] [US1] Definir casos V01/V02 en `tests/privacy-policy.test.ts`: antes/en/después90d, igualdad, UTC, nueva aceptación original/reconciliada, borrador/lectura/fallo/unknown/replay; demostrar fallo pertinente antes de implementar comportamiento. Dependencias: T017.

- [x] T019 [P] [US1] Definir V03/V04/V15 en `tests/privacy-erasure.test.ts`: fila/freelist/WAL/temporal, lector bloqueante, caída tras cada etapa, pérdida de réplica y reinicio con deadline vencido; no aprobar por DELETE aislado. Dependencias: T017.

- [x] T020 [US1] Unificar exclusión activa/vigente en `server/inbox/sqlite-repository.ts` y `server/stories/contact-summary.ts`, usando política009 en detalle/lista/historial/summary/reservas; confirmación/replay tardío no recrea ni prolonga consultas. Dependencias: T018.

- [x] T021 [US1] Sustituir revoke/purge/remove y borrado en claim por coordinador009 en `server/contact/schema.ts`, `server/contact/sqlite-repository.ts` y `server/inbox/sqlite-repository.ts`; revocar/desvincular comprobantes005 conservando TTL firmado original24h, eliminar operaciones/respuestas sin copia de payload/hash. Dependencias: T020, T019.

- [x] T022 [US1] Completar saneamiento físico en `server/privacy/erasure.ts` y `server/privacy/storage.ts`: secure_delete en todos los escritores, drenaje/flock, checkpoint(TRUNCATE) busy=0 y WAL vacío, temporales controlados; physical_verified solo tras comprobar etapas, reabrir bajo recibo. No prometer sobrescritura SSD/COW/snapshots. Dependencias: T021.

- [x] T023 [US1] Implementar worker independiente en `server/privacy/worker.ts`: startup/tick60s sin solapamiento, lotes100 ordenados por dueAt, lease60s renovable/fencing, reintentos5s/30s/60s, no starvation ni cambio de deadline; objetivo interno limpieza≤15min desde vencimiento/confirmación. Dependencias: T022.

- [x] T024 [US1] Implementar watchdog independiente en `scripts/privacy-watchdog.ts`: revisión cada60s, heartbeat/oldestOverdue y señal de fallo/atraso, sin datos personales; detectar worker/red/parada prolongada sin reiniciar fechas. Dependencias: T023.

- [x] T025 [US1] Separar lifecycle de conservación del bucle de correo006/008 en `server/admin/start.ts` y `scripts/privacy-supervisor.ts`; asegurar mantenimiento aun sin proveedor de correo disponible y barrido antes de reapertura. Dependencias: T024.

- [x] T026 [US1] Medir lotes con1000consultas/10respuestas y30muestras después de calentamiento en `tests/privacy-performance.test.ts`; p95≤5s por lote, revisión al menos horaria y limpieza≤1h, sin borrar vigentes; reloj real para duración y reloj controlado para deadlines. Dependencias: T025, T018, T019.

- [x] T027 [US1] Ejecutar V01–V04/V15 y fallos concurrentes de conservación, registrando SC-001/002 y límites de inspección de bytes en `specs/009-privacidad-conservacion/evidence.md`; no declarar limpieza de soporte o proveedores por éxito local. Dependencias: T026.

## Phase 4: User Story 2 — Solicitar eliminación anticipada (P1)

Objetivo: solicitud por canal oficial, código al correo guardado y borrado≤24h tras confirmación, o antes por conservación. Prueba independiente: V05–V08 con operador006 y persona/canal sintéticos, sin pantalla pública nueva ni envío real.

- [x] T028 [P] [US2] Definir V05/V06 en `tests/privacy-confirmation.test.ts`:80bits/base32 de16caracteres,30min, máximo5fallos, un uso/scope exacto, quinto fallo bloquea, expiración/replay/carreras sin borrar datos ajenos. Dependencias: T017.

- [x] T029 [P] [US2] Definir V08 en `tests/privacy-mail.test.ts`: accepted/rejected/unknown, proof/dedup/lookup,lease vencido, expiración y caída tras aceptación; jamás reenvío a ciegas, prolongación de código o actividad009. Dependencias: T017.

- [x] T030 [US2] Crear solicitudes/targets en `server/privacy/service.ts` y `server/privacy/repository.ts`: requestIdUUID, "Conjunto inmutable1–50 IDs, mismo correo exacto", revision inicial y no ampliar alcance si luego hay respuesta008; tres nuevas solicitudes/30min por cuenta y consulta, replay mismoID/payload sin consumir cuota; unknown previo bloquea alcance. Dependencias: T028, T027.

- [x] T031 [US2] Implementar códigos CSPRNG80bits/HMACSHA256 constante y claves versionadas en `server/privacy/confirmation.ts`;30min desde creación, cinco fallos máximos, nunca devolver código/digest por API ni logs, sin exigir documentos. Dependencias: T030.

- [x] T032 [P] [US2] Implementar contrato separado009 send/lookup/verify en `server/privacy/mail-adapter.ts`:deliveryId estable, proof vinculado, capacidades de ventana dedup/lookup y rechazo terminal verificables; sin seleccionar proveedor ni reutilizar namespace006/008. Dependencias: T029.

- [x] T033 [US2] Persistir outbox y destinatario/código mínimos cifrados AES256GCM con AAD y clave009 independiente en `server/privacy/mail-repository.ts`; "operationId/deliveryId únicos", estados "queued/dispatching/unknown/accepted/rejected/canceled" y lease/proof sin datos sensibles en logs. Dependencias: T031, T032.

- [x] T034 [US2] Crear `server/privacy/mail-worker.ts`:red fuera de locks, timeout10s,lease30s/fencing,lookup2/5/15/30/60s; unknown nunca rechazo ni nuevo send; expiración/cancelación destruye payload sin reactivar, lookup por clave/digest sin conservar email/código. Dependencias: T033.

- [x] T035 [US2] Confirmar mediante CAS en `server/privacy/service.ts` y `server/privacy/repository.ts`:aceptación del correo comprobada, código válido consume una vez y crea jobs/deleting/confirmedAt/deadline en misma transacción; mínimo24h/retención, fallo/repetición no reinicia; consulta inexistente no se recrea. Dependencias: T034, T022.

- [x] T036 [US2] Implementar minimización en `server/privacy/worker.ts` y `server/privacy/mail-repository.ts`: purgar digest/payload al consumir/cancelar/expirar; requests no confirmadas y metadatos a más tardar24h tras terminal, contadores al vencer30min; confirmed reducido a job/comprobante mínimo al completar; no duplicar IDs en listas perpetuas. Dependencias: T035.

- [x] T037 [US2] Implementar POSTcreate/GETstatus/POSTconfirm en `server/privacy/http.ts` según C2:JSON16KiB/30s/no-store, cookie006/CSRF/origen y validación estricta, errores401/403/404/409/422/429/503; sin código/payload en estado ni bypass, red fuera de guard. Dependencias: T036.

- [x] T038 [US2] Crear `scripts/privacy-operator.ts` create/status/confirm sobre API privada; sesión y código por stdin protegido, no argumentos/echo/historial; mensaje previo externo neutro y alcance explícito, sin crear UI pública o saltarse verificación. Dependencias: T037.

- [x] T039 [US2] Componer API/outbox009 separados en `server/admin/start.ts` y `scripts/privacy-supervisor.ts`; no ejecutar correo si canal/adaptador no calificados, mantener sintéticos solo en harness. Sesión revocada impide nuevas mutaciones, no impide reconciliar intención previa autorizada. Dependencias: T038.

- [x] T040 [US2] Comprobar V06–V08 y V12 en `tests/privacy-http.test.ts`:concurrencia006→contacto, commitcontacto/HTTP perdido recuperable por requestId, controles de acceso/CSRF/body y no enumeración al trasladar resultados al solicitante. Dependencias: T039.

- [x] T041 [US2] Comprobar flujo V05–V08 con servicio real/correo y canal dobles en `tests/privacy-service.spec.ts`:código no llega al operador por API, confirmación explícita, pérdida/revocación y plazo≤24h o vencimiento anterior; usar harness preparado. Dependencias: T040, T004.

- [x] T042 [US2] Ejecutar casos de US2 y registrar SC-003/006/008 en `specs/009-privacidad-conservacion/evidence.md`; distinguir aceptación/recepción/confirmación y borrado operativo frente a copias externas pendientes. Dependencias: T041, T027.

## Phase 5: User Story 3 — Impedir reaparición y coordinar copias (P1)

Objetivo: restore de copias antiguas no reabre consultas vencidas ni eliminadas anticipadamente. Prueba independiente: V09–V11 con diario actual fuera del rollback y procesos detenidos; no requiere correo real.

- [x] T043 [P] [US3] Definir V09/V10 en `tests/privacy-restore.test.ts`:backup anterior a eliminación temprana, expirado y vigente; diario ausente/viejo/fork/discontinuidad, caída tras cada etapa y recibo falso; ningún acceso/dispatch antes de barrera. Dependencias: T017.

- [x] T044 [P] [US3] Definir inventario/caducidad/réplica y fallos V11 en `tests/privacy-copies.test.ts`:manifest válido pero antiguo no prueba actualidad; ninguna entrada se purga con copia afectada restaurable; handles opacos no acaban en logs. Dependencias: T017.

- [x] T045 [US3] Ampliar los manifiestos básicos de T012 con inventario completo y adaptadores inventory/erase/status en `server/privacy/backups.ts`; incluir snapshots/exportaciones y buzones además de backups de migración ya registrados, resultado completed/pending/failed separado por ubicación. Reutilizar firma/registro/validación sin duplicar su implementación. Dependencias: T043, T044, T025, T012.

- [x] T046 [US3] Completar `server/privacy/restore.ts`:head actual independiente autenticado, cadena y manifiesto, reaplicar supresiones y vencimientos, limpieza/integridad antes de recibo; no tomar diario restaurado por autoridad actual ni reconstruir datos eliminados. Dependencias: T045, T012, T022.

- [x] T047 [US3] Crear `scripts/privacy-restore.ts` verify/apply con rutas absolutas y configuración privada, sin secretos en args; barrera interproceso real, ninguna escritura sobre original ni arranque de correo durante pruebas; rollback también reaplica diario. Dependencias: T046.

- [x] T048 [US3] Acotar supresiones/manifiestos en `server/privacy/deletion-journal.ts` y `server/privacy/backups.ts` al último backup restaurable afectado y su destrucción/caducidad acreditada; ID es seudónimo restringido, sin horizonteP02 bloquear producción, no aprobar conservación infinita. Dependencias: T047.

- [x] T049 [US3] Completar borrado externo y seguimiento en `server/privacy/copies.ts` sobre los handles ya capturados duraderamente por T013 antes de eliminar008: ejecutar erase/status, recuperar tras reinicio y retirar handles al concluir su ciclo verificado; no intentar reconstruirlos desde registros borrados ni repetir su captura. Plazo/acceso por ubicación, fallos pendientes, sin email/text/hash en jobs y copias independientes del destinatario fuera de garantía. Dependencias: T048, T013.

- [x] T050 [US3] Verificar restore/dispatch concurrentes y procesos externos en `tests/privacy-restore-service.test.ts`:deleting impide nueva reserva; dispatching anterior puede iniciar/completar llamada, ack/lookup no reconstruye; recuperación falla cerrada en005/007/008. Dependencias: T049, T039.

- [x] T051 [US3] Ejecutar V09–V11 y registrar SC-004/005 en `specs/009-privacidad-conservacion/evidence.md`, con diario/soporte sintéticos identificados, referencias mínimas y bloqueo de copias/proveedores reales no comprobados. Dependencias: T050, T042.

## Phase 6: User Story 4 — Acceso privado y afirmaciones verificables (P1)

Objetivo: seguridad transversal y matriz verificable de rastreo/avisos. Prueba independiente: V12–V14 y V15; acceso directo y cinco flujos con datos sintéticos, luego evidencia separada del despliegue real.

- [x] T052 [P] [US4] Comprobar V12 en `tests/privacy-security.test.ts`:sin sesión/revocada/CSRF/origen, salida segura ante entrada hostil, secreto fuera del cliente, consulta/code/payload ausentes de dist y logs; lectura y cada mutación autorizadas. Dependencias: T039.

- [ ] T053 [P] [US4] Crear prueba de tráfico/storage en `tests/privacy-tracking.spec.ts`:navegación, audio, ejercicios, Contacto, administración; sesión nueva/repetida/autenticada, recarga sin selecciones persistentes ni estadísticas; lista de cookies necesarias con finalidad/duración/flags. Dependencias: T004, T039.

- [x] T054 [P] [US4] Crear inventario verificable en `specs/009-privacidad-conservacion/privacy-inventory.md` para scripts/frames/audio/fonts/conexiones/cookies/storage/serviceworkers/proveedores; finalidad,datos,ubicación,ciclo y alcance de evidencia; separar enlaceInstagram de recursos incrustados y marcar desconocidos. Dependencias: T005.

- [x] T055 [US4] Integrar gate009 con `scripts/require-contact-publication.mjs`, `scripts/require-admin-publication.mjs`, `scripts/require-inbox-publication.mjs` y `package.json`; referencias a evidencia real, cambios invalidan aprobación y testdouble no satisface producción; no poner otros gates en verde. Dependencias: T052, T053, T054.

- [x] T056 [US4] Añadir pruebas de falsificación/caducidad y ausencia de prueba para claims en `tests/privacy-readiness.test.ts`: referencia arbitraria, null, booleano y fixture no califican proveedor/sitio; no publicar Cero rastreo/Sin cookies sin evidencia integrada. Dependencias: T055.

- [x] T057 [US4] Preparar correspondencia aviso/Manifiesto010 en `specs/009-privacidad-conservacion/notices-review.md`:90d+≤1hoperativo,≤24hconfirmada, canal real pendiente, cookies necesarias, proveedores/ciclos y límites; no reemplazar pendientes con copy final ni extender90d a cuentas/historias/logs. Dependencias: T056.

- [ ] T058 [US4] Ejecutar V12–V15 con navegador/servicio real y datos sintéticos, inspección redactada de tráfico/storage y fallos de watchdog en `specs/009-privacidad-conservacion/evidence.md`; separar fixture, sitio real, seguridad, privacidad y promesas no comprobadas. Dependencias: T057, T051.

- [ ] T059 [US4] Revisar canal/CLI y textos públicos afectados con011 en `specs/009-privacidad-conservacion/accessibility-review.md`:instrucciones comprensibles, errores/alternativa accesible de código, sin exigir identidad legal; avisos en siete anchos y200% si cambian páginas; registrar bloqueos de revisión real. Dependencias: T058.

## Phase 7: Cierre — regresión, calificación y documentación

Objetivo: evidencia completa por criterio. T061–T065 requieren recursos u operación externa cuando corresponda; mantenerlas pendientes si falta evidencia, sin impedir completar trabajo local independiente.

- [ ] T060 Ejecutar checks y regresión afectada003/005/006/007/008 y009 conforme a `specs/009-privacidad-conservacion/quickstart.md`; registrar versiones, comandos/resultados únicos y limitaciones en `specs/009-privacidad-conservacion/evidence.md`; secuenciar suites que comparten build privado. Dependencias: T059.

- [ ] T061 Calificar responsable/canal oficialP02, atención previa a confirmación, código por proveedor real y recepción en buzón controlado; registrar solo referencias redactadas en `specs/009-privacidad-conservacion/evidence.md`, sin enviar nada sin autorización operativa explícita. Dependencias: T060.

- [ ] T062 Calificar réplica independiente, horizonte de copias/buzones/proveedores y restore real con datos sintéticos; guardar ciclos/fechas/evidencia por ubicación en `specs/009-privacidad-conservacion/privacy-inventory.md` y `specs/009-privacidad-conservacion/evidence.md`; sin P02 mantener SC-005 bloqueado. Dependencias: T061.

- [ ] T063 Calificar Linux/flock/supervisor/IPC, almacenamiento/temporales/SSD/COW/snapshots, HTTPS/proxy, claves/permisos/reloj, alertas y carga; acreditar≤1h/≤24h e interrupciones sin nuevo plazo en `specs/009-privacidad-conservacion/evidence.md`, sin declarar borrado de soporte por SQL. Dependencias: T062.

- [ ] T064 Verificar matriz sin rastreo en despliegue/correo/CDN/proveedores reales y revisar avisos010 finales con011 en `specs/009-privacidad-conservacion/evidence.md`; ceroHARcrudo/cookies/tokens/contenido privado y cero promesas externas no verificadas. Dependencias: T063.

- [ ] T065 Validar build de entrega y arranques con gates reales en `package.json`, `src/config/privacy.ts` y `specs/009-privacidad-conservacion/evidence.md`; no aprobar si siguen bloqueos de otras features, copia/responsable/proveedor o revisión manual. Dependencias: T064.

- [ ] T066 Actualizar comandos exactos implementados y guía de migración/operación/restore en `specs/009-privacidad-conservacion/quickstart.md`; verificar que cada ejemplo sea ejecutable en fixture privado y distinga simulación de operación real. Dependencias: T065.

- [x] T067 Sincronizar resultado de X02/FR-001 y SC-001–008 en `specs/009-privacidad-conservacion/tasks.md`, `specs/009-privacidad-conservacion/evidence.md` y `specs/TRACEABILITY.md`; revalidar checklist solo si cambió cumplimiento, no cerrar CT01/010/011 ni pendientes por generar documentos. Dependencias: T066.

## Dependencies & Execution Order

```text
Setup T001–T005
  → fundamentos T006–T017 (diario+barrera+coordinador+restoregate)
  → US1 T018–T027 (MVP local seguro)
  → US2 T028–T042
  → US3 T043–T051
  → US4 T052–T059
  → cierre T060–T067
```

Las dependencias por tarea prevalecen sobre este orden resumido: tests y archivos independientes
pueden prepararse antes del cierre de otra historia. US2.scope depende del incrementoUS1;
T012 ya implementa manifiestos básicos antes de T014; T013 ya captura handles antes de T021/T022.
US3 amplía inventario/restauración y ejecuta borrado externo sobre esos fundamentos, no introduce
la primera protección tras borrar datos. US4 seguridad/tráfico puede iniciarse tras integración
privada. Todos los registros de evidence.md se serializan T027→T042→T051→T058→T060 y cierre;
no ejecutar dos tareas que escriban ese archivo a la vez. Cambios sucesivos en supervisor,
repositorios o gates también respetan dependencias y nunca se consideran paralelos por historia.

T061–T065 son calificación externa y entrega: datos/canal/proveedor/infraestructura no disponibles
se registran bloqueados. T066 puede prepararse localmente durante desarrollo, pero no cerrarse
sin concordancia con la entrega. T067 debe registrar la entrega parcial y bloqueos aun si no
puede completar cierre; eso no equivale a marcar T061–T065 cumplidas.

## Trazabilidad y pruebas independientes

| Original / reglas | Historias y escenarios | Tareas de fundamento e historia | Criterios / casos |
| --- | --- | --- | --- |
| X02/FR-001 R-01/02/03 | US1.1–6 | T006–T017; T018–T027 | SC-001/002, V01–V04/V15 |
| X02/FR-001 R-04/05 | US2.1–6 | T006–T017; T028–T042 | SC-003/006/008, V05–V08/V12 |
| X02/FR-001 R-05/06 | US3.1–6 | T010–T016; T043–T051 | SC-004/005, V09–V11 |
| X02/FR-001 R-01/07/08/09 | US4.1–7 | T005/T009/T017; T052–T059 | SC-006/007/008, V12–V15 |
| X02 cierre real | Todas | T060–T067 | TodosSC; P02/010/011 no se aprueban por pruebas sintéticas |

- US1: fixture sintético y reloj; ausencia de filas/residuos DB/WAL y vigentes preservadas dentro
  de1h, sin tener que construir solicitud/correo. Diario y barrera comunes son obligatorios.
- US2: fixture/canal/operador/doble de correo, demostrar confirmación y borrado≤24h o límite
  previo, control de reutilización y desconocido; no requiere proveedor real para prueba local.
- US3: restaurar copia sintética anterior a borrado, con head independiente actual; comprobar
  bloqueo ante evidencia perdida y que consultas eliminadas/vencidas no reaparezcan.
- US4: rutas reales servidas por harness, cinco recorridos y evidencia redactada; no confundir
  ese resultado con auditoría de producción y proveedores externos.

## Parallel Examples

Solo después de cumplir las dependencias de cada tarea y con archivos distintos:

| Ámbito | Grupo independiente | Límite |
| --- | --- | --- |
| Setup | T002 + T003 | Tras T001; T004 espera ambos |
| US1 | T018 + T019 | Tras fundamentos; implementación espera las pruebas correspondientes |
| US2 | T028 + T029 | Tras fundamentos; T032 puede seguir pruebas de correo mientras T030/T031 preparan solicitudes |
| US3 | T043 + T044 | Tras fundamentos; T045 espera ambos y US1 integrado |
| US4 | T052 + T053 + T054 | Cumplir integración/harness/gates; T055 espera todos |

No paralelizar suites que regeneren las mismas vistas privadas. [P] permite preparar archivos
sin compartir estado; no implica que ejecución de test se pueda solapar de forma segura.

## Implementation Strategy

MVP local: T001–T027. Entrega conservación demostrable con diario y barrera previos, sin habilitar
producción ni dar por resuelta solicitud anticipada. Validar US1, añadir US2, completar US3 y
US4, después calificar operación real y entrega. Mantener todas las casillas pendientes hasta
evidencia aplicable; un bloqueo de correo/copia/recurso no invalida el avance local comprobado.
Implementación local registrada; repetir análisis si cambia alcance/contratos y completar calificación externa antes del cierre productivo.

## Estado de ejecución 2026-10-20

| Tarea pendiente | Avance y bloqueo concreto |
| --- | --- |
| T053 | Prueba privada de tráfico/storage implementada y ejecutada; faltan cinco recorridos completos con recursos/configuración reales |
| T058 | Seguridad/plazos/recuperación y servicio009 con navegador comprobados; V13 global y V14 productivo pendientes |
| T059 | Revisión de alcance/CLI documentada; faltan canal real,lector de pantalla y revisión visual/manual aplicable |
| T060 | RegresiónNode afectada y navegador009 ejecutados; cierre integrado/browser/manual de otros recorridos pendiente. No marcar dependenciaT059 satisfecha |
| T061 | Sin responsable/canal oficial,proveedor/remitente y buzón real calificados; ningún correo enviado a terceros |
| T062 | Réplica/restauración local probadas; faltan volumen independiente,inventario/horizonte y ciclos reales de proveedores/buzones/copias |
| T063 | flock/supervisor y deadlines probados localmente; sin calificación HTTPS/proxy,reloj,soporte físico,snapshots y alertas productivas |
| T064 | Avisos010 y auditoría de sitio/CDN/proveedores reales pendientes; claims no habilitados |
| T065 | Build de entrega bloqueado por recursos/revisión002 y gates009/productivos; no se relajan |
| T066 | Guía y CLIs comprobados con fixtures; cierre condicionado a concordancia con operación/entrega reales T065 |

T067 registra esta entrega parcial y sus bloqueos conforme a la excepción de seguimiento ya
indicada en Dependencies; no declara cumplidas T061–T065 ni cierra X02 productivo/CT01/010/011.
El checklist de requisitos permanece intacto16/16; sus notas históricas no son evidencia de ejecución.
