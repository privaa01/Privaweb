# Modelo de datos — 008

Modelo implementado localmente; resultados y límites en [evidence.md](evidence.md). Ver [R2–R6](research.md) y [contrato](contracts/inbox.md).
Unidades: timestamps nuevos epoch ms UTC; fechasISO existentes 005 se preservan y se convierten
sin pérdida al comparar; reloj inyectable. UUIDv4 canónico para IDs nuevos, SQL parametrizado.

## Consulta (tabla consultations de 005, migración 008)

| Campo | Regla |
| --- | --- |
| id | ID 005 inmutable, conservado por migración; nunca reciclado |
| nameOrAlias/email/message | Valores normalizados 005, privados, destinatario inmutable en 008 |
| receivedAt | Fecha original 005, inmutable |
| lastActivityAt | max(receivedAt, acceptedAt de respuestas nuevas); replay no actualiza |
| status | Pendiente o Respondido; Respondido si existe al menos una aceptación persistida |
| revision | Entero positivo, inicial1 para migrados y nuevos 005; aumenta al registrar o resolver una intención, aceptar una respuesta o cambiar lifecycle; renovación de lease/lookup no altera el historial |
| lifecycle | active o deleting; deleting no visible ni elegible para nuevos envíos |

Índice por lifecycle/status/receivedAt/id. Listado y contadores toman misma instantánea de contacto.
No sumar respuestas como consultas. Consultas deleting no entran en total 007.

## Intención de respuesta (reply_operations)

- operationId UUID único global; consultationId FK con borrado coordinado; actorAccountId y
  sessionDigest internos permiten revalidar autorización sin bearer. No duplicar datos de sesión.
- expectedRevision y reviewedRevision verifican detalle/historial vigente y acción explícita Q1.
- text normalizado 1–5000 puntos de código, destinatario snapshot del correo guardado, nunca del cliente.
  Payload sellado AES-256-GCM con clave versionada fuera del checkout; AAD incluye operationId,
  consultationId, actor y deliveryId. Respuesta aceptada pertenece a la política 009 igual que consulta.
- deliveryId aleatorio estable, único; payloadHash interno para comparar replays, no se publica ni loguea.
- state: queued, dispatching, unknown, rejected, accepted, canceled; createdAt/updatedAt,
  leaseOwner aleatorio, leaseGeneration monótono, leaseUntil, nextLookupAt, dispatchStartedAt,
  providerKeyExpiry y retryOf opcional. No confundir attempts de 005 con estas operaciones.
- acceptedAt/proof cifrado solo tras prueba terminal del proveedor; rejectionCode allowlist,
  sin guardar mensajes de error externos. Sin fecha de entrega/lectura ni rastreo.
- Índice único parcial de consultationId para estados queued/dispatching/unknown. Aceptaciones,
  recibos y state se escriben en una transacción de contacto. Queued/unknown no son Respondido.

Identidad de replay incluye consulta, actor, texto, expectedRevision, reviewedRevision y retryOf.
Primero comprobar operationId existente y comparar intención, luego CAS para operaciones nuevas;
replay exacto no falla por revisión que su propia operación ya incrementó. Otro payload409.
Reintento de rejected exige otra operationId con retryOf, revisión actual y acción explícita;
repetir operationId rejected solo devuelve el resultado anterior.

## Respuesta aceptada (reply_responses)

responseId, consultationId, operationId UNIQUE/FK, actorAccountId, acceptedAt,
sealedPayload y aceptación verificada; inmutable. Historial ordenado acceptedAt/id ascendente.
La copia cifrada de operación puede eliminarse al transferir su contenido a la respuesta y dejar
solo el recibo mínimo; comparación de replay usa hash interno mientras la consulta está conservada.
Consulta.status y lastActivityAt se actualizan atómicamente al insertar la respuesta.
Nueva respuesta Q1 añade fila sin reemplazar las anteriores; rechazo posterior mantiene Respondido.

## Recibo y borrado

Recibos 005 conservan COMMITTED/REJECTED/REVOKED con su semántica actual. Extender revoke de 005
para bloquear dispatch y eliminar texto/respuestas/operaciones junto con consulta sin dejar FKs rotas.
Una reserva dispatching previa puede haber iniciado correo externo: borrar payload local no lo retira.
El borrado puede dejar tombstone opaco de operationId/deliveryId y límite de vigencia cuando sea
necesario impedir replay/ack tardío, nunca alias/correo/texto/hash del contenido. Una operación UUID
no crea consulta: si ya no existe devuelve unavailable incluso después de purgar tombstone.
Las claves y copias/respaldos se tratan según 009; 90 días no se aplica automáticamente al log de seguridad.

## Transiciones

| Inicial | Evento comprobado | Final | Efecto en consulta |
| --- | --- | --- | --- |
| Sin intención | Enviar autorizado, revisión vigente, texto válido | queued | Revision aumenta; estado público de bandeja igual |
| queued | Reserva autorizada, vigente, lease nuevo | dispatching | Inicio durable de envío; sin Respondido |
| queued | Sesión inválida o eliminación antes de reserva | canceled | No correo nuevo; conservar texto solo si consulta sigue disponible y autorizado |
| dispatching | Aceptación verificable | accepted | Insertar respuesta, status Respondido y actividad según acceptedAt |
| dispatching | Rechazo terminal que excluye aceptación tardía | rejected | Estado/actividad previos conservados |
| dispatching | Timeout, crash, lease vencido | unknown | Bloquea nueva respuesta; no volver automáticamente a queued |
| unknown | Lookup demuestra aceptación | accepted | Misma operación, sin segundo envío |
| unknown | Prueba terminal sin aceptación ni posibilidad tardía | rejected | Permite reintento explícito |
| unknown | Sin prueba concluyente | unknown | Sigue bloqueada; nunca failed por agotar reintentos |
| active | Borrado 009 | deleting→eliminada | No nuevos despachos, retirar de todas las vistas y totales |

Resultados tardíos aplican solo si coinciden operationId/leaseGeneration y consulta existente active;
si no, descartar payload y no recrear consulta. Fencing previene escrituras antiguas; la idempotencia
externa/reconciliación previene duplicados de red, no el lease por sí solo.

## Invariantes y migración

1. Una fuente de consultas; un intento no resuelto por consulta y una respuesta por aceptación.
2. Solo state accepted más respuesta durable permite status Respondido; desconocido no es rechazo.
3. Leer/fallar/replay no actualiza lastActivityAt. Aceptación adicional nueva sí, con fecha original.
4. Autorización 006 bajo lock admin → contacto, sin red dentro; sesión invalidada no reserva envío nuevo.
5. Migración offline: detener 005/006/workers, backupSQLite consistente en directorio privado,
   migración con versión, columnas explícitas 005, reconstrucción del CHECK y preservación de attempts.
   Verificar count/IDs/fechas, foreign_key_check e integrity_check antes de reabrir escritores.
6. Si no termina la migración, rollback de esa transacción y servicios detenidos; no restaurar backup
   antiguo después de procesar nuevas consultas.007 lee schema compatible o muestra unavailable.
