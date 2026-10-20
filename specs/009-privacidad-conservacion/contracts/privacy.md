# Contracts: 009 — Privacidad y conservación

**Date**: 2026-10-20. Contratos implementados/verificados localmente; adaptadores productivos y calificaciónP02 pendientes.

## C1 — Política común

`activityAt=max(receivedAt, nuevas acceptedAt originales verificadas)`;
`expiresAt=activityAt+7776000000ms`; `expiryDueAt=expiresAt+3600000ms`;
`requestDueAt=confirmedAt+86400000ms`; `dueAt=min(límites aplicables)`.

Al alcanzar expiresAt se excluye consulta de detalle/listas/historial/resumen007/008 y no
se crean nuevas reservas de envío. Confirmación anticipada marca deleting inmediatamente.
La expiración no depende de que un worker haya borrado la fila. Leer, buscar, borrador,
fallo/unknown, solicitud de eliminación o su correo NO actualizan actividad.
Una aceptación nueva solo actualiza consulta todavía activa/no vencida; replay no prolonga.
Fechas inválidas/futuras no se consideran actividad válida; aplicar validaciones008, no inventar
actividad para permitir acceso. RelojUTC sincronizado y vigilado con evidencia operativa.

## C2 — Operación privada y canal

Sin endpoint público nuevo ni pantalla de autoservicio. Canal P02 entrega petición y devolución
de código al equipo; no asumir una dirección de correo. API privada loopback detrás del guard006:
cookie segura, CSRF y mismo origen para mutaciones, Cache-Control:no-store, límites JSON16KiB,
30s bodytimeout, validación estricta y no PII en URL, errores/logs o argumentos.

| Método / ruta propuesta | Entrada y resultado | Errores observables |
| --- | --- | --- |
| POST /api/admin/privacidad/solicitudes | requestId UUID del cliente y targets1–50 `{id,revision}`;202 con requestId/state; mismo contenido/ID devuelve misma operación | 401 sesión;403origen/CSRF;409revisión/ID ocupado/unknown previo;422alcance;429límite;503dependencia |
| GET /api/admin/privacidad/solicitudes/:id | Estado autorizado, expiresAt, etapa y deadline; jamás código, digest o payload de correo | 401/404 y503 sin fingir estado vacío |
| POST /api/admin/privacidad/solicitudes/:id/confirmar | `{code}` de16caracteres base32;200estado confirmado y deadline persistido, o estado terminal sin repetir efectos | 401/403;422comprobante inválido/vencido/usado;429bloqueado;503 no prueba de envío |

El operador recopila el código por el canal oficial y lo introduce sin guardarlo en logs o
historial de terminal; CLI propuesta `privacy-operator.ts create/status/confirm` pide sesión/código
por stdin protegido, usa API y no ofrece bypass de autorización. El mensaje externo al solicitante
es neutro antes de comprobar legitimidad; respuestas privadas al operador no se reenvían como
prueba de existencia. No habilitar C2 sin canal calificado y aviso010 accesible. No se añade botón
al panel por este plan; operador usa CLI privada y canal existente.

Toda operación privada mantiene orden adminBEGINIMMEDIATE→contactBEGINIMMEDIATE, síncrona,
sin red, commitcontacto→commitadmin. No atomicidad distribuida; commitcontacto seguido de fallo
HTTP se recupera por requestId. Worker técnico usa jobs ya autorizados; no acepta nuevos targets.
Creación y confirmación revalidan sesión, consulta y alcance. Si una revisión cambió antes de
confirmar, no ampliar alcance; mismoID y correo guardado siguen siendo autoridad. La revisión
inicial protege selección; una respuesta008 posterior no debe bloquear indefinidamente eliminar.

## C3 — Comprobante y correo009

Código CSPRNG80bits/base32, duración30min, máximo5fallos, HMACSHA256 con clave independiente
versionada; comparación constante, consumo mediante CAS en misma transacción que jobs/deadline.
Tres solicitudes nuevas/30min por cuenta y consulta; duplicar requestId/payload no consume cuota.
No aceptar correo de destino en petición: derivarlo de consultas seleccionadas, mismo correo exacto.
Sin texto original del mensaje. Sin linkGET, HTML rastreador, pixel ni recurso externo en el correo.

Adaptador separado con `send`, `lookup`, `verify` y capacidades de idempotencia/lookup verificadas,
conforme al modelo de pruebas008, sin compartir namespace con recuperación006 o respuestas008.
Payload cifrado009, stable deliveryId y digest de vinculación, lease30s con fencing, timeout10s,
red fuera de locks, lookup a2/5/15/30/60s. Lease vencido→unknown, no nuevo send. Aceptación
comprobada vinculada a operación habilita confirmación; no acredita entrega ni lectura. Desconocido
no es rechazo. Reconciliar aun si sesión original expiró solo para conocer una intención previa;
no autoriza nueva petición ni lectura sin sesión. No enviar código ya expirado; reserva previa
puede terminar y nunca extiende su vigencia. Código válido que llega mientras proveedor sigue
unknown espera verificación de aceptación, sin consumir intentos por fallo de infraestructura.

Al vencer/cancelar/consumir, destruir digest/código cifrado y destinatario; metadatos mínimos del
resultado incierto no contienen payload y no pueden reactivar solicitud. Proveedor debe permitir
lookup por deliveryId/digest sin retener email/código localmente; sin esa capacidad no calificar.

## C4 — Eliminación y limpieza física

1. En transaccióncontacto crear intención idempotente, marcar deleting y cancelar queued; no
   cambiar status editorial ni dueAt por reintentos. Todas las rutas005/008 deben usar el coordinador.
2. Append de supresión a réplica externa al backup con jobId/ID aleatorio/tiempo/motivo;
   confirmar firma, secuencia y persistencia antes de destruir. Capturar además, antes de retirar
   registros008, los handles externos mínimos necesarios por jobId y confirmar su persistencia
   en la ubicación privada calificada del adaptador, fuera de jobs/logs. Si esa captura falla,
   conservar la referencia original inaccesible y reintentar con el mismo jobId/deadline; no
   declarar éxito ni eliminar la única referencia. Una captura vacía exige evidencia de que
   no hay ubicación externa afectada. Sin red dentro de transacciones.
3. En nueva transacción validar intención/recibo, revocar/desvincular attempts005, borrar
   reply_responses, reply_operations y consulta mediante primitiva común. No conservar
   payload/hash/email como comprobante. Captura de handles mínimos de proveedores solo mediante
   procedimiento externo calificado ya confirmado en el paso2, nunca log/copia de contenido.
4. Limpieza: todas las conexiones con secure_delete=ON; barrera interproceso de mantenimiento
   impide nuevos lectores/escritores y drena conexiones005/007/008/009; checkpoint(TRUNCATE)
   busy=0, WAL vacío y verificación de residuos. Migración requiere VACUUM de saneamiento previo
   con temporales privados. No ejecutar VACUUM dentro de transacción ni con procesos sin drenar.
La barrera de referencia usa supervisor local y `flock` de util-linux: cada proceso005/007/008/009
abre su conexión bajo lock compartido del mismo archivo privado y registra su proceso con el
supervisor. Mantenimiento cierra admisión, pide drenaje de conexiones y detiene los procesos
necesarios; el ejecutor de limpieza obtiene lock exclusivo antes de abrir SQLite. Reapertura
requiere liberar exclusivo y verificar recibo de limpieza, sin aceptar conexión que omita el
wrapper. No borrar/renombrar el archivo de lock ni robarlo por timeout; la muerte del proceso
libera el lock del kernel. Supervisor/IPC privado y manifiesto de procesos forman parte de la
calificación operativa. Si un lector no drena o un escritor no participa, limpieza falla cerrada,
no se marca completada y el deadline sigue vigente. Las pruebas deben incluir procesos externos.

5. physical_verified se confirma solo al completar pasos anteriores. completed_operational no
   significa completed_all_copies. En fallo reintentar con deadline original; alertar overdue y
   mantener datos afectados inaccesibles. La ausencia de fila tras caída no prueba paso4.

Worker independiente: startup+tick60s, lotes100 ordenados dueAt, lease60s renovable/fencing;
reintentar5s/30s/60s sin bloqueo perpetuo por un job. Barrera de mantenimiento de corta duración
reintentable, watchdog independiente registra timestamps/etapa/código sin IDs privados en logs.
Objetivo interno≤15min desde el vencimiento de conservación o la confirmación válida de
solicitud, según el motivo; límites aprobados1h/24h. Si detenido al vencer, registrar incumplimiento
si corresponde y borrar antes de reabrir, sin ajustar deadline al arranque.

008 dispatching ya reservado es frontera de envío: una llamada previamente autorizada puede
iniciarse o continuar; no prometer cancelación. Después de deleting no hay nuevas reservas,
reintentos send o reconstrucción por ack/lookup. Extender guard de claim al coordinador009 sin
introducir orden inverso de locks. Borrado de soporte/COW/snapshot y buzón externo queda enC5.

## C5 — Réplica, copias y restauración

Interfaces de operador/adaptador propuestas:

- `journal.append(entry, idempotencyKey)` → recibo durable firmado de secuencia/entryDigest.
- `journal.currentHead()` → high-water actual autenticado; `readRange(from,to)` → cadena completa.
- `backups.inventory()` → manifiestos firmados, localización controlada y fecha máxima restaurable.
- `copies.erase(handle, jobId)` / `copies.status(jobId)` → completed/pending/failed con evidencia;
  ausencia de capacidad implica bloqueo explícito de esa ubicación, no éxito inferido.

Crear, firmar, registrar y validar el manifiesto básico en fundamentos antes de la migración
y antes de producir su respaldo; registrar la copia coherente y su digest antes de mutar la base.
La ampliación de inventario y acciones de copias en US3 reutiliza estas primitivas.

No escoger almacenamiento remoto ni proveedor. La implementación local usa doble de réplica
identificado; una segunda copia en el mismo rollback no es réplica productiva válida. Journal
es seudónimo, acceso0700/0600, firmas/HMAC versionadas, sin cadena de contenido personal.
Retención acotada al horizonte de copias restaurables afectadas; calificar ese horizonte antes
de producción. La prueba de high-water debe ser actual e independiente de la copia restaurada;
un manifiesto antiguo con firma válida no acredita actualidad. Fork/replay/discontinuidad bloquean.

CLI propuesta `privacy-restore.ts verify|apply` recibe rutas absolutas de copia/manifiesto y
configuración de réplica por archivo privado, no secretos en args. Verifica esquema/claves,
head actual, entradas posteriores al snapshot, supresiones y expiración; sanea archivos e
integridad antes de sellar un recibo de recuperación que incluye backupId/head aplicado.
Todos los arranques005/007/008 verifican ese recibo y su actualidad, no solo composeInbox.
Fallos bloquean habilitación. Una prueba de restore no arranca correo real ni envía mensajes.

Inventario incluye backups de migración008/009, clones de diagnóstico, WAL/snapshots, proveedor
correo, buzones del equipo y exportaciones. Cada ubicación tiene responsable, alcance, acceso,
ciclo y máximo real, evidencia y mecanismo de no resurrección. Correo del destinatario fuera del
control de Priva se declara límite explícito, no promesa de retirada.

## C6 — Verificación de seguridad, rastreo y publicación

Matriz por ruta y flujo: scripts/frames/audio/fonts/conexiones/cookies/storage/serviceworkers;
visitante nuevo y repetido, audio, elegir/recargar ejercicios, enviar Contacto, entrar/usar/salir
administración. Revisar código y tráfico efectivamente servido por proxy/CDN y proveedores;
no declarar ausencia por pruebas de fixture. Cookies006 documentadas con propósito/duración/
flags; cero tracking publicitario. Evitar HAR con cookies, tokens o mensajes reales; redactar
localmente con allowlist antes de guardar evidencia. Pruebas usan datos sintéticos.

`privacyReadiness` propuesta: referencias verificables a policy, channel, confirmationMail,
operationalErasure, replica, backups, restore, providers, tracking, notices. Null/valor vacío
bloquea uso productivo y build afectado; el validador verifica artefacto/fecha/alcance y cambios
relevantes invalidan su referencia. No aceptar texto arbitrario o booleano como prueba. Integrar
con gates005/006/008, no ponerlos a verde mediante testdouble. Sin políticas de otras categorías
resueltas por010, no publicar un Manifiesto que finja cubrirlas.

## C7 — Evidencia y límites de la referencia local

El worker agrupa hasta100 eliminaciones lógicas y sanea una vez por lote bajo barrera antes
de confirmar physicalVerifiedAt/completed. Firma/cadena se siguen verificando; la caché de
firmas está vinculada al cuerpo exacto/keyVersion y no omite claves retenidas. Adaptadores de
réplica/captura tienen timeout10s; un fallo no destruye referencias ni reinicia deadlines, y no
bloquea indefinidamente otros jobs. El mantenimiento autónomo también purga códigos/outbox
caducados y sanea archivos afectados,independientemente del worker de correo.

La composición productiva exige hooks de admisión antes de abrir bases y una referencia de
recuperación actual. Los componentes locales y los comandos no seleccionan proveedor/canal.
Solo hay auditoría automática del banco privado009, no una aprobación de los cinco recorridos
públicos/despliegue/proveedores reales. Evidencia y bloqueos en [evidence.md](../evidence.md).
