# Investigación técnica — 008

Fecha: 2026-10-19. Decisiones de diseño conservadas; implementación y pruebas locales en [evidence.md](evidence.md).
La investigación original se realizó por lectura; los resultados de aplicación se registran aparte.
Fuente: [spec](spec.md), Q1 y constitución; contrato resultante en [bandeja](contracts/inbox.md).

## R1 — Mantener la composición existente

**Decisión**: Astro 7.4/TypeScript 5.9.3, Node 24.19.0 con node:sqlite; panel privado
`/admin/contacto` servido por 006, módulo de bandeja nuevo `server/inbox`, navegador sin framework
adicional y sin copia de consultas. Mantener servicios 005/006 separados y sus cookies/contratos.
**Motivo**: `server/admin/views/src/pages/contacto.astro` ya contiene el shell 006; `package.json`
y sus fixtures aportan herramientas reproducibles. No hay que crear una segunda autenticación.
**Alternativas**: SSR público, SPA nueva o bandeja en un servicio externo añaden alcance y exposición.

## R2 — Autorización y datos en dos bases, con orden de locks definido

**Decisión**: autoridad de consultas/intentos/respuestas en contact.sqlite de 005. Mantener admin.sqlite de 006
para cuentas/sesiones/historias. En cada operación privada 008, tomar `withAuthorizedTransaction`
BEGIN IMMEDIATE en admin; dentro abrir transacción síncrona BEGIN IMMEDIATE de contacto, comprobar
existencia/revisión y leer o modificar, COMMIT contacto, luego finalizar admin. Orden único
admin → contacto en todo código que necesite ambos; retención 005/009 toma solo contacto.
**Motivo**: 006 mantiene exclusión frente a revocación hasta el commit de contacto. Solo contacto
escribe el dominio 008, con consulta+intento+respuesta+estado+actividad atómicos en un archivo.
El touch de sesión es secundario: fallo posterior al commit de contacto implica resultado HTTP
incierto; recuperación por operationId, nunca rollback distribuido ni segundo envío.
**Alternativas**: copiar consultas pierde fuente única; comprobar sesión antes y escribir después
permite carrera; ATTACH con WAL no da atomicidad de crash entre archivos. Unificar todos los
archivos exigiría migración de 005/006/007 y cambiaría operación no necesaria para 008.
**Condiciones**: ningún await, red, hash lento ni JSON grande bajo locks; timeout 5 s, 401/503 cerrados.
Probar con dos conexiones/procesos y revocación bloqueada antes/después del commit. En lecturas
la instantánea se autoriza dentro del mismo protocolo; no prometer retirar bytes ya enviados.

## R3 — Migración compatible de 005 y conteos 007

**Decisión**: migración offline versionada y transaccional reconstruye consultations para permitir
Pendiente/Respondido e incorporar revision y lifecycle, preservando IDs, datos, fechas, attempts,
claves y recibos. Cambiar INSERT de 005 a columnas explícitas y revoke de 005 a eliminación coordinada.
`PRIVA_CONTACT_DATABASE` sigue apuntando a la misma fuente y contactSummary de 007 mantiene total real.
**Motivo**: hoy 005 tiene CHECK(status='Pendiente') y `INSERT INTO consultations VALUES(...)`;
no se puede actualizar estado ni añadir columnas ignorando ese contrato. No derivar otro estado
solo en memoria ni mantener dos tablas de consultas.
**Alternativas**: añadir una copia respondida duplica registros; cambiar solo el CHECK sin adaptar
INSERT/revoke rompe 005. No migrar al iniciar un proceso mientras otro sirve tráfico.
**Verificación**: copia privada consistente con todos los servicios detenidos; foreign_key_check,
conteos/IDs/fechas/recibos y replay comparados antes/después; abortar ante esquema desconocido.
Rollback de la migración solo antes de reabrir escritores, nunca restaurar copia antigua sobre datos nuevos.

## R4 — Correo 008 separado del correo de recuperación 006

**Decisión**: interfaz `ReplyMailAdapter` send/lookup, claves de idempotencia estables, aceptación
con fecha real y referencia verificable, resultado unknown preservado. Worker específico 008.
No seleccionar proveedor, remitente o URL sin datos operativos P02.
**Motivo**: `server/admin/repository.ts` MailAdapter de 006 usa resetURL y solo tres strings; su worker
puede convertir unknown en failed y eliminar envelope. Eso no permite historial/reconciliación 008.
**Alternativas**: reutilizar el worker 006 o SMTP simple sin comprobación durable no satisface 008;
reintentar ciegamente con otro Message-ID no garantiza no duplicar.
**Calificación**: servicio elegido debe demostrar idempotencia de intención y lookup verificable de aceptación o rechazo
terminal sin aceptación tardía. Un lookup not_found momentáneo no prueba fallo. Si no se puede
resolver el resultado, estado unknown bloqueante, sin botón para saltárselo. Al agotar la ventana
contractual de idempotencia, solo lookup; jamás repetir send. Ningún proveedor está calificado hoy.

## R5 — Outbox, concurrencia y recuperación

**Decisión**: intención durable con UUID operationId y deliveryId estable, payload inmutable,
revisión CAS de consulta y máximo un intento no resuelto por consulta. Encolar bajo autorización;
antes de despachar, verificar sesión/cuenta vigentes con digest interno, existencia/lifecycle y
fencing de lease en el protocolo R2. No guardar bearer de sesión en claro.
**Motivo**: doble click, dos cuentas o reinicio no deben producir dos respuestas inadvertidas.
Una nueva respuesta Q1 exige detalle/historial vigente y confirmación explícita, no efecto automático.
**Alternativas**: bloqueo de botón no protege servidor; lease vencido no demuestra que no se envió;
repetir con otra operación para salir de unknown elude el requisito.
**Recuperación**: si lease vence tras frontera de despacho, pasar a unknown, consultar proveedor;
no volver a queued por timeout. Rechazo terminal permite reintento explícito nuevo con referencia
al anterior, contenido conservado y revisión vigente. La misma operationId devuelve recibo propio.

## R6 — Borrado y frontera de envío en curso

**Decisión**: lifecycle deleting excluye consulta de UI, totales y nuevos despachos. Se cancela
trabajo no despachado, revocan recibos 005 y purgan payload/respuestas de forma coordinada;
una aceptación tardía jamás recrea consulta. Una reserva durable dispatching es la frontera
de inicio autorizado; después red fuera de locks, sin prometer cancelar un envío ya iniciado.
**Motivo**: no existe transacción atómica entre SQLite y correo externo. Eliminación tras iniciar
envío requiere registrar límites reales del proveedor y copias, sin fingir deshacer el correo.
**Alternativas**: DELETE aislado deja replays y jobs; retener payload indefinidamente para lookup
contradice minimización. Tombstone opaco sin texto/correo solo hasta vencimiento de sus capacidades;
política de metadatos de seguridad de 009 debe calificarse, no heredar 90 días por defecto.
**Actividad**: max(receivedAt, nueva acceptedAt); lectura, redacción, fallo y replay no amplían.
La especificación 009 confirma criterio operativo/frecuencia/canal/copias antes del cierre integrado.

## R7 — Límites técnicos y UX derivados P04

**Decisión**: respuesta texto plano 1–5000 puntos de código Unicode tras trim; saltos normalizados
CRLF→LF, internos conservados, rechazar NUL/controles salvo tab/LF y Unicode inválido. Sin HTML,
adjuntos, CC/BCC, destinatario enviado por cliente ni seguimiento. Asunto fijo de aplicación sin
interpolar texto del visitante, remitente operativo calificado. Body JSON de 32 KiB y plazo 30 s; cliente 10 s.
Lista 25 registros, máximo 50, cursor estable recibido/id, historial 25 por página hasta recorrerlo;
filtro inicial Pendiente, orden recibido descendente. Sin búsqueda/asignaciones/archivo.
**Motivo**: límite explícito protege recursos sin confundir 1500 del comentario 005 con respuesta;
recorrido móvil conserva destinatario/consulta antes de editor e historial revisable.
**Alternativas**: ilimitado, HTML enriquecido o personalizar cabeceras añade riesgos no requeridos.
Polling intento cada 2 s mientras visible; a 30 s sin resultado avisar desconocido y permitir comprobar,
no enviar; no longpoll ni contadores que prolonguen sesión. Máximo 10 envíos nuevos/cuenta/min,
2 por consulta/min y 60 comprobaciones/cuenta/min; 429 no consume intención ni dice fallo de correo.
Leases 30 s, un despacho concurrente por proceso, send/lookup con timeout 10 s y fencing durable;
lookup con backoff de 2/5/15/30/60 s, luego máximo una vez/min mientras existe y requiere resolución.

## R8 — Gates y evidencia proporcional

**Decisión**: referencias de preparación 008 por defecto pendientes, gate de producción/startup y
build de entrega que rechaza P02/009/010 y calificación ausentes. Fixtures aislados no activan
aprobaciones ni exponen bypass. Logs allowlist evento/código/duración; sin payload, tokens, correo,
identificadores de proveedor ni IP. Evidencia sintética sin screenshots/traces de credenciales.
**Motivo**: el repositorio ya usa guards 005/006/007 y vistas privadas fuera de dist.
**Alternativas**: gate basado solo en bandera o test mock no acredita correo ni borrado reales.
**Pendiente externo**: capacidad/almacenamiento/proxy/HTTPS/backup, proveedor, remitente, recepción
real, ciclo de eliminación, revisión manual 011. Se resuelven como calificación requerida, no como
tecnología desconocida ni solicitud de secretos en chat. No impiden diseño y pruebas locales aisladas.
