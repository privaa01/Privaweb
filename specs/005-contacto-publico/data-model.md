# Modelo de datos — 005

Diseño 2026-10-17. Entidades de contrato; no se creó DB ni se guardaron consultas en esta fase.

## ContactInput / NormalizedContact (v1)

| Campo | Regla compartida |
|---|---|
| nameOrAlias | string requerido; trim extremos,1–60puntos de código; no nombre legal |
| email | string requerido; trim,1–254puntos de código, regla sintáctica de researchR2 |
| message | string requerido; trim,1–1500puntos de código |

Array.from(value).length; preservar espacios internos/tildes/caso, no normalizar Unicode ni truncar.
Valores no string, faltantes, blancos o fuera de límites son inválidos. No usar maxlength UTF16
como una segunda regla. Correo válido no prueba buzón, identidad o recepción de respuesta.
Comparación de reintento sobre tuplaJSON de valores normalizados v1, no sobre email/texto globales.

## Consulta privada

id servidor aleatorioestable; nameOrAlias/email/message normalizados; receivedAtUTC servidor;
status='Pendiente'; lastActivityAt inicial=receivedAt, pendiente de contrato de actividad009/008.
No guardarIP/userAgent/fingerprint/atribuciónhistoria ni campos adicionales de visitante.
Datos accesibles solo en repositorio/lectura autorizada; HTTP público no ofrece listado/consulta.
Tokens/lectura/reintentos/fallos no actualizan lastActivityAt. Respuesta/Respondido pertenece008.
Política90d aprobada; trabajo de scheduler, respuesta aceptada, borrado/respaldos/restauración
no se implementa como si estuviera resuelto dentro de 005.

## SignedAttempt (en memoria del formulario)

Token v1: payload con attemptId aleatorio256bits, issuedAtUTC, expiresAtUTC=issuedAt+24h,
firmado HMAC-SHA256 servidor (formato base64url y versión). Cliente recibeid/token/expiresAt,
no clave ni registro privado. No campos de contacto en token, URI, cookies o almacenamiento.
Configuración/rotación de clave es del servidor; referencia local genera archivo0600 fuera de public
una vez y lo conserva al reiniciar. Nunca regenerar por cada petición ni registrar tokencrudo.

24h es límite técnico para autorizar una inserción nueva, no retención de consulta ni garantía
de respuesta. Replay conocidoCOMMITTED todavía existente puede confirmar después de 24 h por
digest del tokenexacto; un intento desconocido expirado jamás crea registro. Relojservidor inyectable
para pruebas; no confiar en relojcliente ni ampliar expiración al reintentar.

## AttemptLedger (persistencia técnica acotada)

| Campo | Regla |
|---|---|
| tokenDigest | SHA256 del token completo; único, nunca bearercrudo o huella del mensaje |
| attemptId | IDopaco del token aceptado; correspondencia con petición |
| expiresAt | Copia de expiración firmada, sin renovación |
| state | COMMITTED / REJECTED / REVOKED, con transiciones terminales indicadas |
| consultationId | SoloCOMMITTED; FK a consulta existente; eliminar asociación al revocar |

COMMITTED+consulta insertados atómicamente. Repetición exacta compara datos con consulta y
confirma sin nueva escritura/actividad. Mismo token/datos distintos→conflict, sin datos en respuesta.
Para un token ya conocido se exige digest del bearer completo exacto; no aceptar intento porid
solo ni firma inválida diferente. Así replay existente sigue siendo verificable tras rotación de clave.

REJECTED: se confirma transaccionalmente que ese intento no tiene ni podrá crear consulta.
Si otro escritor ya hizoCOMMIT no se puede declarar not_stored; replay/conflict según datos.
Nuevoenvío tras rechazo obtiene otrotoken, conserva valores y vuelve a validar. REJECTED no
contiene payload/errores con PII y se purga al expirar. Un fallo sin terminal durable es unknown.

REVOKED: eliminar contenido/huella/asociación en la misma transacción de borrado; retener solo
los campos opacos anteriores necesarios hasta expiresAt. Sin consulta, nunca devolverstored.
Tras expiración purgar ledger; token expirado sin ledger se rechaza y no resucita datos.
Contrato de revocación/protección de replay se prueba aquí; calendario/retención integral009
sigue pendiente. No crear huellas permanentes o nuevo historial de visitantes.

## FormState

editing → invalid / preparing → submitting → confirmed / rejected / unknown.

- editing/invalid: campos editables, errores asociados y foco localizable.
- preparing: solicitar intento sin enviar datos; falla aquí no crea consulta y conserva campos.
- submitting/unknown: snapshot normalizado+intento inmutables; campos readonly, no perderlos.
  unknown conserva Reintentar con mismo token+snapshot. Timeout/abort/cuerpoilegible/acuse no
  correlacionado no prueban fallo definitivo ni cancelación.
- rejected: solo tras respuesta terminalnot_stored fiable; liberar edición conservando campos,
  descartar tokenREJECTED y generar otro al enviar de nuevo.
- confirmed: acuse correlacionado de COMMIT/replay, no correo entregado; acción explícita permite
  otra consulta vacía con generación nueva, sin repetir la anterior.
- unknown→otra consulta: mostrar advertencia de posible guardado previo y exigir acción explícita
  de continuar; no se llama cancelar el intento anterior. Nueva generación invalida callbacks viejos.
- retired/conflict: mantener resultado anterior sin confirmación falsa; informar que no puede
  reintentarse con ese identificador y ofrecer la misma acción de otra consulta advertida.

Generación y secuencia de petición identifican callbacks vigentes; no limpiar/desbloquear nueva
consulta por un finally o respuesta vieja. No hay draftpersistente ni recuperación tras cerrar pestaña
prometida. Abort cambia solo espera de cliente; no elimina consulta del servidor.

## ContactContent / Notice / Claim

Hero/imagen/indicadores, Instagram con4temas, formulario/aviso antes de enviar y cierre con
Respondemos al correo que indiques / Puedes usar un alias. Recursos con src/dimensiones/alt/
referencia/estado y revisión de copy ligada a textoexacto; testOnly rechaza fixtures en entrega.
Instagram deconfigsocial única003/005; revisiónURL exacta. Aviso requiere responsable/canal real,
Manifiesto real, usos/90d/respuesta privada/advertencia y revisión010/P03, sin placeholders finales.

Claim (Cero rastreo publicitario / Sin cookies de rastreo): evidencia y ámbito deconfiguración
revisada, no booleano heredado del aviso. Cambio de integración invalida evidencia; sin ella no
emitirclaim. No implica cero cookies necesarias ni privacidad deInstagram externo.
ServiceReadiness: origen HTTPS/proxy/persistencia/secretos/acceso/borrado/avisos y referencias de
calificación real; no inventar disponible=true ni usarSQLitelocal como prueba deproducción.
