# Research: 009 — Privacidad y conservación

**Date**: 2026-10-20. Investigación del código y contratos del repositorio; sin pruebas de
aplicación ni validación externa ejecutadas. R35, constitución y Q1–Q4 son autoridad de producto.

## R1 — Fuente y frontera temporal

**Decision**: conservar contact.sqlite como fuente única; usar instantesUTC epochms e
ISO normalizado para compatibilidad. RETENTION=90×24×60×60×1000ms; vencido si now≥activity+RETENTION.
Actividad=max(recepción, aceptaciones originales nuevas), no fecha de reconciliación. Confirmación
anticipada fija due=min(vencimiento+1h, confirmedAt+24h); desde vencimiento se excluye acceso,
y desde confirmación se marca deleting para impedir nuevas respuestas sin esperar al borrado.
**Rationale**: respeta Q1–Q4 y evita prolongación por lecturas, reintentos o correo incierto.
La exclusión temprana tras confirmación es una medida técnica conservadora dentro del plazo.
**Alternatives considered**: calcular por días de calendario local, por fecha de lectura o
extender por unknown viola o hace ambiguos los límites. Una consulta ya eliminada nunca se
recrea por aceptación tardía, aunque esa aceptación tuviera fecha anterior.

## R2 — Scheduler y supervisión

**Decision**: worker009 separado del tick de correo de admin/start; barrido al arranque y cada60s,
sin solapamiento, lotes100 y deadline absoluto persistido. Watchdog separado del proceso registra
último éxito, oldestOverdue y plazos incumplidos sin datos personales; comprobación cada60s.
Objetivo interno completar limpieza en15min desde vencimiento o confirmación, siempre dentro
de los máximos aprobados. Fallo del watchdog o mantenimiento no se convierte en cumplimiento.
**Rationale**: mantenimiento actual compara >3600000ms y comparte promesa con red, por lo que
no acredita máximo1h. Detener el correo no debe detener conservación. Indexar actividad/deadline.
**Alternatives considered**: cron horario exacto sin margen deja poco tiempo de ejecución; tick
existente comparte bloqueos y demora; borrar solo cuando se visita una página no cumple.

## R3 — Borrado operativo físico

**Decision**: configurar y verificar secure_delete=ON en TODAS las conexiones escritoras005/008/009,
FK/FULL/busy_timeout y aislamiento de rutas existentes. Centralizar delete/revoke/purge en009;
tras commit, drenar lectores y suspender conexiones escritoras en una ventana de mantenimiento
mediante barrera compartida entre procesos. Ejecutar checkpoint(TRUNCATE), comprobar busy=0 y
WAL vacío y realizar saneamiento inicial mediante VACUUM fuera de transacción al migrar datos
anteriores, con temporales en directorio privado. Reabrir/verificar tras limpieza; no marcar
completed hasta prueba de ausencia de residuos recuperables en archivos controlados. Evitar
copias automáticas de DB/WAL por herramientas no inventariadas.
**Rationale**: removeConsultation borra filas y revoca recibos, pero WAL/freelist y datos antiguos
pueden retener contenido. La garantía local es sobre archivos bajo control del servicio;
SSD/COW/snapshots, logs del proxy y copias de proveedor requieren evidencia aparte.
**Alternatives considered**: DELETE, VACUUM aislado o checkpoint con lectores activos no prueban
limpieza; cifrado actual cubre payloads008, no alias/email/mensaje005; retirar una clave compartida
destruiría conversaciones vigentes. No prometer borrado de soporte físico por sobreescritura SQL.

## R4 — Supresión durable y recuperación

**Decision**: plan de supresión en contact.sqlite sin contenido, más diario externo autenticado
con secuencia monotónica y recibo de réplica. Persistir intención → replicar entrada fuera de
locks → verificar recibo y captura durable de handles externos mínimos → borrar contenido → limpiar archivos → completar. Todas las rutas de
borrado deben pasar por ese protocolo, incluidas purge/revoke de005/008 y vencimiento en claim.
Manifiestos básicos y captura de handles forman parte de fundamentos: la migración necesita
el manifiesto y el primer borrado no puede perder referencias externas que US3 necesitará.
Si falla la captura no se destruye la única referencia; se registra fallo con deadline original,
sin atribuir éxito al proveedor. La intención confirmada bloquea lecturas/envíos durante el proceso. Una caída reanuda por jobId;
la réplica es idempotente y append-only con conflicto/fork rechazado.

Antes de habilitar005/007/008 tras restore, obtener el high-water actual de la réplica calificada,
verificar manifiesto y cadena completa, aplicar supresiones que afecten la copia y purgar vencidos,
limpiar archivos y validar integridad. Una copia local atrasada del diario no basta: sin prueba
actual e independiente de su completitud no se habilita acceso ni nuevos envíos.
**Rationale**: composeInbox solo purgeExpired; una copia anterior resucita eliminados anticipados.
Recibos REVOKED005 de24h no cubren el horizonte real de copias. El diario usa ID aleatorio de
consulta y tiempos, sin email/alias/text/hash; es dato seudónimo restringido, no anónimo.
**Alternatives considered**: tombstone solo dentro del backup revive junto a él; diario infinito
viola minimización. Su horizonte depende del último backup restaurable que pueda contener el ID;
no purgar entradas hasta acreditar caducidad/destrucción de esas copias. Sin inventario/horizonte
calificado, producción y cierre bloqueados, sin sustituirlo por retención ilimitada aprobada.

## R5 — Código y canal sin nueva pantalla pública

**Decision**: código aleatorio base32 de16caracteres (80bits),30min desde creación, máximo5 intentos
fallidos por solicitud, comparación constante y digestHMAC con clave separada versionada.
Operador autorizado recibe petición por canal oficial P02, selecciona IDs precisos y solicita
correo mediante API privada; la persona devuelve código por ese canal y el operador lo verifica
mediante el mismo guard006. Confirmar consume código y fija plazo en una sola transacción.
No usar enlace GET ni crear página pública. No exigir documentos de identidad ni inferir identidad
por alias. Una solicitud abarca como máximo50 IDs con el mismo correo guardado exacto; no
normalizar local-part ni ampliar a todas las consultas por coincidencia. Más IDs se tramitan en
solicitudes independientes. Límite técnico, sin nueva función de búsqueda pública.
**Rationale**: opción código está aprobada en Q3 y evita ampliar interfaz pública; alta entropía,
vigencia y límites previenen abuso y repetición. Operador no puede saltarse el comprobante.
**Alternatives considered**: confiar solo en remitente declarado, código en logs/CLIargs o enlace
que borra al abrirlo no verifica con seguridad; nueva pantalla pública excede alcance009.

## R6 — Confirmación por correo y estados inciertos

**Decision**: outbox009 separado de recuperación006 y respuestas008; adapter send/lookup/verify
con clave durable, prueba vinculada y ventanas verificables. No reutilizar worker006 que no
resuelve unknown. Código y destinatario cifrados AES-256-GCM solo mientras envío es necesario,
claves separadas/versionadas; código jamás vuelve al operador ni respuestaHTTP. Aceptación del
proveedor no es confirmación del usuario. Una confirmación válida debe esperar a aceptación
comprobada del envío; si sigue unknown, reconciliar sin reenviar a ciegas. Código caducado no
extiende por lookup tardío. Reintento deliberado crea nuevo código y revoca el previo tras
resolver incertidumbre; no más de3 solicitudes nuevas/30min por cuenta y consulta, verificado
bajo transacción. Bloquear mientras haya operación de envío incierta para ese alcance.

Purgar código/outbox al consumir, expirar o cancelar; nunca conservar el código en historial ni
usar el correo de verificación como nueva actividad de la conversación. Payload original no se
copia a la solicitud. El titular conoce el alcance en el mensaje con IDs de referencia y fechas,
sin citar el contenido de la consulta.
**Rationale**: privacidad, minimización e idempotencia sin falsos éxitos ni modificación de Q1.
**Alternatives considered**: hacer del código una respuesta008 reiniciaría conservación; enviar
por worker sin lookup duplica o hace incierto el efecto. Proveedor real permanece sin seleccionar.

## R7 — Auditoría y gates

**Decision**: matriz de recursos/tráfico/cookies/storage/proveedores para navegación, audio,
ejercicios, Contacto y administración, en sesión nueva y autenticada; repetir tras cambios de
recursos/configuración/proveedor. Evidencia fechada y redactada, inventario del recurso y su
propósito/retención; no almacenar HAR con tokens o mensajes reales. Cookies necesarias no son
rastreo. Instagram enlazado y recursos incrustados se auditan con límites distintos.
**Rationale**: revisar solo dependencias npm o código no prueba ausencia de rastreo en despliegue.
**Alternatives considered**: banners/copy como prueba, estadísticas educativas o promesas globales
sobre Instagram no cumplen X02. Readiness exige referencias reales, nunca booleanos de aprobación.

## Resultado y dependencias externas

Diseño local resuelto por R1–R7; sin marcadores técnicos pendientes. P02 no es investigación
sustituible: responsable/canal, proveedor de confirmación/borrado, réplica y horizonte de copias,
soportes/proxy/buzones requieren calificación real.010 aprueba los avisos conforme a evidencia.
No hay declaración de cumplimiento jurídico ni nueva política general de cuentas/historias/logs.
