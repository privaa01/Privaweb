# Data Model: 009 — Privacidad y conservación

**Date**: 2026-10-20. Esquema9 implementado y migración/restore probados con datos sintéticos; ninguna base productiva migrada.

## Autoridad y compatibilidad

contact.sqlite pasa de esquema8 a9 mediante migración offline, sin alterar IDs/recepción,
lastActivityAt/respuestas/recibos vigentes. admin.sqlite y claves006 no migran. Todos los lectores
005/007/008 deben reconocer esquema9 antes de reabrir; versión desconocida falla cerrada.
Conservar status Pendiente/Respondido; lifecycle deleting no es un tercer estado editorial.

## Entidades

| Entidad | Campos mínimos y restricciones | Vida y relaciones |
| --- | --- | --- |
| consultations existente | id aleatorio, alias/email/message privados, receivedAt, lastActivityAt, status, revision, lifecycle; índice activity/lifecycle | activity=max recepción/aceptación nueva; vence a90d; no reactivar deleting |
| privacy_requests | requestId UUID, actorAccountId, createdAt, expiresAt, state, confirmedAt, deadlineAt, failedAttempts0–5, challengeDigest/keyVersion, sendOperationId | Estados awaiting_send/awaiting_confirmation/confirmed/expired/locked/canceled/completed; sin email/texto/código en claro |
| privacy_request_targets | requestId, consultationId, reviewedRevision | Conjunto inmutable1–50 IDs, mismo correo exacto; FK a request; relación consulta se retira al borrar sin impedir supresión; ID mínimo puede pasar al diario |
| privacy_mail_operations | operationId/deliveryId únicos, requestId, payloadEncrypted, state queued/dispatching/unknown/accepted/rejected/canceled, originalAcceptedAt, leaseOwner/generation/until, nextLookupAt, proofEncrypted | Payload solo correo/código/referencias mínimas; cifrado009 separado; ventana de dedup/lookup obligatoria; no reutilizar008 |
| erasure_jobs | jobId UUID, consultationId, reason expiry/request, intentAt, expiryDeadline, requestDeadline, dueAt, state, journalSequence, replicaReceipt, logicalDeletedAt, physicalVerifiedAt, overdueAt, failureCode, lease | Uno activo por ID; dueAt=min límites disponibles; no contenido/hash de conversación ni email; reintentos no cambian dueAt |
| suppression_entries | sequence, consultationId aleatorio, deletedAt/intendedAt, reason, previousDigest, signature/keyVersion | Diario independiente del backup restaurado, autenticado/réplica durable; IDs seudónimos restringidos, sin payload/hash del contenido |
| backup_manifest | backupId, createdAt, snapshotSequence, schemaVersion, keyVersions, restoreUntil, contentDigest, signature, destroyedAt/evidenceRef | Sin datos de conversación; inventario incluye copias de migración, snapshots y exportaciones; horizon externo verificado |
| erasure_verification | jobId opaco, etapa, checkedAt, result pass/fail/blocked, evidenceRef | Sin contenido, tokens, códigos o identificadores de proveedor en logs; evidencia privada/redactada y mínimo ciclo necesario |

Las referencias de borrado externo se mantienen solo en la ubicación privada calificada del
adaptador de proveedor con ciclo explícito, no como copia de email/texto en jobs operativos.
Antes de retirar registros008 capturar los identificadores opacos necesarios en ese procedimiento;
La captura mínima y su recibo durable pertenecen a fundamentos, antes de cualquier borrado
local; US3 ejecuta y sigue el borrado externo sobre esos handles. Si la captura falla, no
destruir su única referencia: mantenerla inaccesible y reintentar con el deadline original,
registrando incumplimiento si se supera. No declarar completada la eliminación de ese proveedor. Los
identificadores siguen siendo datos seudónimos y su plazo no se presume infinito.

## Estados e invariantes

1. `awaiting_send`: consulta vigente revisada y operador006 autorizado. No bloquea lectura/envío
   de respuestas ni amplía actividad. Guardar códigoHMAC y outbox cifrado en una transacción.
2. `awaiting_confirmation`: aceptación original del correo009 comprobada. Código válido solo
   hasta createdAt+30min, no hasta fecha de reconciliación. Fallos≤5; quinto bloquea y purga secreto.
3. `confirmed`: verificar y consumir código de un uso, CAS de solicitud, alcance inmutable y
   consultas todavía existentes. Marcar targets deleting y crear jobs en la misma transacción;
   deadline=requestConfirmedAt+24h, o anterior por conservación. Una consulta inexistente nunca
   se recrea; respuesta al operador no expone datos al solicitante sin verificación.
4. Job `intent`→`replicated`→`logical_deleted`→`physical_verified`→`completed`. Reintento por
   mismojobId/sequence, sin nuevo deadline. Réplica se confirma fuera de locks; fallo no permite
   borrar sin protección de restore ni declarar cumplimiento. Targets deleting se excluyen
   inmediatamente de vistas y reservas; dispatching anterior conserva frontera008.
5. Completado operativo no implica copias/proveedor completados. Registrar fases separadas;
   error sigue pendiente, y retraso del deadline es incumplimiento aun si luego se completa.
6. Restore aplica diario actual y expiración antes de acceso005/007/008. Diario ausente,
   firma inválida, discontinuidad o high-water no verificable bloquea habilitación.

## Caducidades técnicas y minimización

- Código válido30min, máximo5fallos; sin código en logs, argumentos o lectura privada de estado.
  Al consumir/cancelar/expirar purgar digest y payload; el mantenimiento cada60s limpia residuos.
- Requests no confirmadas y metadatos de outbox se eliminan a más tardar24h tras estado terminal;
  ese plazo no prolonga código ni conserva destinatario/código cifrado tras terminación. Un envío
  unknown pasado expiresAt se cancela para fines de confirmación y no autoriza otro send; su
  reconciliación técnica puede terminar sin reactivar código ni crear consulta.
- Requests confirmadas se reducen al job y comprobante mínimo de supresión al completar; no
  conservar lista de consultas en dos lugares. Cuenta de límites de abuso: contadores mínimos
  sin correo, purgados al vencer ventana30min. No extender esta política a logs006.
- Diario/manifest: conservar mientras exista copia restaurable afectada; purgar después de prueba
  de destrucción/caducidad de última copia y réplica. El horizonte concreto requiere P02; sin él,
  no habilitar producción. No es aprobación de una categoría de registros perpetua.
- Recibos005 REVOKED opacos mantienen su TTL firmado original24h sin email/consulta vinculada.
- Evidencia de cierre: sintética y redactada; una retención jurídica general no se inventa aquí.

## Migración y restauración

Detener todos los escritores, respaldo con node:sqlite backup y manifiesto registrado antes de
mutar; permisos/canonicalidad y espacio libre verificados. Migrar8→9, activar secure_delete en
cada escritor y sanear residuos previos, integrity_check/FK check. Conservar claves y evidencias
mínimas; inicializar réplica/manifiesto base y purgar vencidos mediante el nuevo protocolo antes
de reabrir. Rollback de código NO restaura una copia antigua sin la barrera009. La bandera
--writers-stopped declara mantenimiento: el CLI debe verificar adquisición de la barrera y no
pretender detener procesos ajenos por esa bandera.

## Precisiones de implementación local

Borrado físico de lotes combina physical_verified/completed en la misma confirmación tras
saneamiento,guardando physicalVerifiedAt; una caída antes deja logical_deleted para repetir la
limpieza. overdueAt conserva que se superó el plazo,incluso si después se completa. Heartbeat
privado lleva solo timestamps/estado/agregados. El worker009 también purga códigos/outbox
caducados sin depender de la disponibilidad del correo. DiarioHMAC soporta keyVersion y keyring;
retirar registros exige prueba de inventario firmada y deja ancla sin IDs retirados. La caché de
verificación solo reutiliza firmas para el mismo cuerpo exacto y clave todavía disponible;
no sustituye la comprobación de continuidad/head,ni vuelve válida una entrada alterada.
