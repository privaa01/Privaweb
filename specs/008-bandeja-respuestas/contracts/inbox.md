# Contrato de bandeja y correo — 008

Contrato implementado y verificado localmente; sin endpoints008 desplegados ni proveedor calificado.
Resultados y limitaciones en [evidence.md](../evidence.md).
Ver [modelo](../data-model.md), [decisiones](../research.md) y [validación](../quickstart.md).

## C1 — Vista privada y composición

`/admin/contacto`, vista Astro privada 006 fuera de dist/public. Insertar InboxManager en AdminShell,
reemplazar mensaje provisional 008; no duplicar shell/nav/autenticación. Orden: título/explicación,
resumen real, filtros Pendiente/Respondido, listado paginado, detalle con destinatario/consulta,
historial paginado y editor. En móvil mismo orden; detalle/editor accesibles tras seleccionar.
Historia/categoría/duración/Aprobar no existen en esta bandeja.

Entrada inicial Pendiente; cada cambio conserva selección solo si sigue válida. Revisión se obtiene
con detalle/historial; antes de nueva respuesta Q1 exigir acción explícita de revisar historial
actual (incluyendo acceso a todas sus páginas), sin afirmar que el sistema puede demostrar lectura
humana. Cambio de revision invalida esa confirmación. Nunca rellenar texto de otra consulta.
Editor texto plano 1–5000 caracteres Unicode tras normalización R7; contador/límite y destinatario
visibles, botónEnviar bloqueado durante registro del intento y mientras hay intento no resuelto.

Cliente usa fetch same-origin credentials; módulo comparte evento de acceso 006 y token CSRF
solo en memoria. AbortController y generación por sesión/registro/filtro: respuesta antigua no
modifica el estado nuevo; finally antiguo tampoco habilita Enviar. No local/sessionStorage,
IndexedDB, serviceworker, URL con PII, trazas ni cachés para contenido privado. Al abandonar texto
sin enviar, advertir descarte. Ante fallo conservar texto dentro de sesión autorizada. Ante pérdida
de acceso limpiarDOM/variables, cancelar polling y no reintentar envío tras login; los intentos
ya registrados se consultan mediante detalle autorizado al volver.

Loading, vacío, error de lectura, enviando, incierto, rechazado y aceptación son estados distintos.
Al aceptar, historial inmutable y status Respondido; fallo adicional mantiene Respondido. Anunciar
feedback mediante live region, errores asociados, foco visible/primer error/foco tras selección.
No banners24h, Entregado/Leído, cifras de captura o correo ficticio.

## C2 — Protección y formato HTTP

Router compuesto por `createAdminHandler`, nuevo callback inbox anterior al fallback 404 de 006.
Mismo origin HTTPS productivo y cookies 006; loopback HTTP solo banco aislado. Reusar cabeceras
securityHeaders 006/no-store/nosniff/no-referrer/CSP. Cada lectura y mutación comprueba 006 en
protocolo R2, no solo al entregar HTML. GET requiere `X-Priva-Request: 1`, rechazoSec-Fetch-Site
cross-site y Origin ajeno; POST requiere además Origin exacto y X-CSRF-Token de sesión.
Sin CORS amplio, redirects de proveedor, JSONP o endpoints de prueba/debug.

Rutas canónicas sin encoding ambiguo, barras dobles o query string. Para filtros/paginación usar
POST de consulta protegido por CSRF; no PII enURL. IdentificadoresUUID solo en rutas privadas y no
como autorización. Body JSON de 32 KiB, UTF8 estricto, objetos/campos exactos, sin claves desconocidas,
plazo 30 s; mensajes de error allowlist sin valores ni detalles internos. Rechazar Content-Type ajeno.
HEAD no devuelve cuerpos; no lectura alternativa pública. Métodos no listados405.

## C3 — Endpoints implementados localmente

Base `/api/admin/contacto` (no modifica `/api/contacto/*` público 005).
Respuestas incluyen `schemaVersion:1`. status de consulta: `Pendiente|Respondido`.
El dominio no ofrece 'entregado' ni 'leído'. No devolver tokens/digests, proofs de proveedor o claves.

| Método y ruta | Entrada | Resultado autorizado |
| --- | --- | --- |
| POST /api/admin/contacto/listado | `{status, cursor:null\|string, limit:25\|50}` |200 `{result:'list',items,nextCursor,summary}` |
| GET /api/admin/contacto/resumen | Sin cuerpo/query |200 `{result:'summary',summary}` |
| GET /api/admin/contacto/consultas/:id | Sin cuerpo/query |200 `{result:'detail',consultation,replies,nextRepliesCursor,currentOperation}` |
| POST /api/admin/contacto/consultas/:id/historial | `{cursor,limit:25}` |200 `{result:'history',revision,replies,nextCursor}` |
| POST /api/admin/contacto/consultas/:id/respuestas | `{operationId,expectedRevision,reviewedRevision,text,retryOf:null\|UUID}` |202 `{result:'registered',operationId,state,revision}` o200 recibo existente |
| GET /api/admin/contacto/operaciones/:operationId | Sin cuerpo/query |200 `{result:'operation',operationId,consultationId,state,revision,responseId?,acceptedAt?,text?}` |

items: `{id,nameOrAlias,email,messagePreview,receivedAt,status,revision}`; preview máximo 160 puntos,
resto en detalle; correo visible al equipo pero nunca en log/URL. consultation añade mensaje completo,
lastActivityAt y lifecycle público del DTO solo active; replies: `{id,text,acceptedAt,authorLabel}`,
label de cuenta autorizada sin crear rol nuevo ni exponer credentialVersion. currentOperation muestra
identidad/estado y texto recuperable exclusivamente cuando autorizado; no payloads de proveedor.
summary: `{total,pending,responded}`; misma snapshot de listado. Consulta eliminada/no visible404
uniforme, resumen indisponible503, jamás convertir a0. Cursor opaco HMAC (máximo 2048 bytes) con estado/orden/última
clave e historial con revision; cursor inválido422, no concatenar SQL. Cambios de revision de historial
409 exigen recargar antes de confirmar revisión; navegación no permite saltar control de concurrencia.

Procesar envío en orden: autorizar/origen/CSRF→validar body→buscar operationId existente y
comparar intención→replay propio o409 conflict→consulta active/revisión vigente→sin no-resuelto→
insertar queued+incrementar revision→COMMIT de contacto→confirmar recibo. No red en estePOST.
expectedRevision=reviewedRevision refleja detalle/historial revisado; no asumir que un número enviado
por cliente evita ataques por sí solo: autorización, CAS, unicidad e historial real se comprueban servidor.

Errores: 401sin sesión, 403origen/CSRF, 404no disponible, 409revision_conflict|operation_conflict|
unresolved_operation, 413body, 415formato, 422validation/cursor, 429rate, 503unavailable. Errores no
aseguran ausencia de un envío anterior salvo recibo rejected/canceled verificable de esa operación.
RespuestaHTTP inválida/perdida/timeout→comprobar misma operationId; no crear otra para salir del estado.
Si la consulta de operación devuelve404 y el cliente conserva el snapshot original, Comprobar resultado
puede registrar explícitamente otra vez la misma operationId y payload. Esa repetición pasa por
deduplicación/CAS del servidor;404 por sí solo nunca demuestra fallo ni permite otra intención.
PollingGET no toca inactividad 006; acciones humanas válidas sí. Reducir polling a máximo 30/min;
rate60 comprobaciones/min evita loops, 10 intenciones/cuenta/min y2/consulta/min. BucketsHMAC
opacos separados 006/007; 429 Retry-After, sin payload ni token en log. Replay existente no consume
otra cuota de intención; cuota insuficiente no registra una operación nueva.

## C4 — Integración SQLite y recepción 005

Mantener consultas y todas sus mutaciones 008 en archivo 005. Implementar repositorio 008 con una
conexión dedicada a contact.sqlite, mismo esquema/PRAGMA/seguridad y transacciones síncronas.
Guard exterior 006 excluye revocación hasta COMMIT de contacto. Nunca tomar admin dentro de lock contacto.
No afirmar atomicidad multiDB: si falla touch/COMMIT de admin después del contacto, devolver unknown
y recuperar por operationId. Worker requiere validación de sessionDigest/cuenta/versión/expiración
por ruta interna 006 equivalente a session(), no convertir digest en credencialHTTP pública.

Cambios mínimos 005: migración offline versionada compartida, INSERT con columnas explícitas,
nuevos valores por defecto de revision/lifecycle y revocación coordinada. Acuse/validación/normalización,
IDs/tokenDigest/contact.key y payloads públicos 005 conservan semántica. Consulta respondida aún
permite replay exacto de guardado 005 sin reiniciar actividad ni volver a Pendiente.

007 consume total de consultasactive de esta misma base; adaptar SELECT si lifecycle deleting
puede persistir. summary 008 usa la misma definición; responder no aumenta total. Esquema
incompatible o DBausente→unavailable. No exigir a 005 acceso a claves de correo 008.

## C5 — Adaptador de correo y worker

Interfaz interna nueva, distinta a MailAdapter de 006:

```text
capabilities: version, identityScope, idempotencyWindowMs,
              lookupRetentionMs, definitiveRejectionSemantics
send({deliveryId,to,from,subject,text,payloadDigest}, AbortSignal)
lookup({deliveryId}, AbortSignal)
verify(acceptedOrRejected, {deliveryId,payloadDigest}) -> boolean
result = accepted{acceptedAt,providerReference,evidence}
       | rejected{terminal:true,noFutureAcceptance:true,code,evidence}
       | unknown
```

Estos tipos describen contratos, no una implementación de proveedor. `to` proviene únicamente de
consulta; from/subject son configuración calificada; texto sin HTML ni tracking. send de misma
clave/payload debe tener como máximo una aceptación dentro de ventana documentada. lookup no
despacha correo; not_found eventual/HTTPerror no es rejected. evidence se valida con origen
confiable de proveedor, vínculo a deliveryId/payload y fecha original; no aceptar fechas futuras
posteriores a ahora+5min ni anteriores al registro de intención. El límite temporal local
es conservador; cualquier discrepancia queda unknown y el reloj se debe calificar con P02. Un booleano idempotent no basta.
No exponer ruta pública de callbacks; reconciliación por lookup autenticado del worker. Sin evidencia
suficiente→unknown. Proveedor sin esas capacidades bloquea envío productivo.

Lookup solo comprueba una intención ya autorizada: puede reconciliarse aunque su sesión original
haya expirado o se haya revocado; eso no autoriza otro envío ni permite leer resultados sin sesión.
Worker cada 1 s sin ticks solapados, un send por proceso. Reserva con fencing y lease 30 s enR2;
cuenta/sesión y consulta deben estar vigentes al inicio durable del despacho. Network fuera de
transacción, timeout 10 s. La reserva dispatching marca inicio del envío autorizado; revocación/
eliminación posterior no puede deshacer esa frontera. Si falla antes de frontera, cancelar sin enviar.
No reactivar queued por lease vencido: unknown y lookup del mismo deliveryId; otro leaseowner
solo reconcilia. Respuesta tardía exige generation vigente; una aceptación identificada válida puede
ser recuperada mediante lookup posterior, sin invocar nuevamente send. Pasada ventana de dedup
no hay send adicional. Rechazo terminal permite reintento explícito enlazado, no automático.

Al aceptar: en transaccióncontacto insertar respuesta única, modificar operación, status y actividad;
si consulta ya no existe/deleting, no almacenar de nuevo datos ni recrearla. Si almacenamiento
falla tras aceptación, dejar/reconstruir unknown y reconciliar. El recibo público 005 y estado 008
no aseguran recepción. Cifrado AES-256-GCM separado de recuperación 006, claves versionadas y
AAD estable; startup falla si falta clave de datos todavía conservados. No retirar claves hasta
purga/verificación de copias conforme a 009. Workers no guardan bearer de sesión.

## C6 — Eliminación, publicación y evidencia

Antes de cada nuevo despacho, comprobar lifecycle; eliminación 009 cancela queued, revocaattempts de 005,
retira respuestas/payload y bloquea replays. Dispatching iniciado no se promete cancelable; coordinar
quiescencia y limpieza local, tras tombstone no se autorizan nuevas reservas ni reintentos send. Una única llamada autorizada
por una reserva dispatching anterior puede iniciarse o continuar; no se promete cancelarla. Ack/lookup tardío nunca
recrea consulta. Tras restaurar, barrido 009 antes de habilitar UI/workers evita resucitar vencidos.

Readiness 008 debe tener referencias reales de adaptador/dedup, recepción, migración, privacidad 009,
avisos010 y revisión 011. Guard de arranque y build falla cerrado sin calificación. Test harness
compone servicios reales con cuentas sintéticas y doble de proveedor fuera de producción;
ningún endpointdebug/bandera de aprobación en runtime productivo. Contratos locales aprobados
no completan CT01 ni P02. Evidencias deben separar Node/SQLite, UI mock, navegador+servicio,
proveedor/buzón real y operación de eliminación/copia. Sin secretos ni correos reales en artefactos.

## C7 — Precisiones de la implementación local

No se mantiene tombstone adicional de respuestas: operationId no permite crear consultas y una
consulta eliminada no puede recibir un nuevo registro. FKs, revocación de recibos005 y ausencia
de operación/consulta hacen que ack/replay antiguos no reconstruyan datos. El único comprobante
opaco temporal que permanece es el ya definido por005 hasta expirar su capacidad de recepción.
El total007 acepta un reloj de referencia opcional para pruebas; producción usa Date.now y excluye
consultas deleting o vencidas igual que008. El contador no cuenta filas de respuestas.
Las suites de servicio reconstruyen vistas privadas; ejecutarlas secuencialmente evita que una
limpie plantillas/JS que otra está utilizando. No se han modificado sus controles de seguridad.
