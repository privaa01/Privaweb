# Inventario de privacidad009

**Fecha**: 2026-10-20. Referencia local comprobada con datos sintéticos; inventario productivo,
responsables/canal y ubicaciones externas pendientesP02. No publicar este documento como
Manifiesto final ni interpretar una fila pendiente como conformidad.

| Ubicación / datos | Uso y acceso | Ciclo local / prueba | Calificación real |
| --- | --- | --- | --- |
| contact.sqlite: alias,correo,mensaje,recepción,actividad | Consulta privada005/008, autorización006 por operación |90d; desde vencimiento sin acceso ni nuevos despachos; borrado operativo≤1h. WAL/freelist y temporales controlados incluidos | Volumen,supervisor,backups y reloj pendientes |
| reply_operations/reply_responses | Correo008, aceptación e historial cifrado | Se eliminan con consulta; captura opaca previa para borrado externo, ninguna aceptación tardía recrea datos | Proveedor/buzones/ciclo externo pendientes |
| attempts005 | Recibos opacos anti-replay, sin contenido ni destinatario | Al eliminar,REVOKED desvinculado; capacidad firmada24h original sin prolongación | Backup y acceso operativo pendientes |
| privacy_requests/targets | Alcance explícito1–50 del mismo correo y verificación por operador006 | Código80bits,30min,máximo5fallos; un uso; confirmación≤24h o límite anterior. Digest/payload se purgan al consumir/expirar/cancelar; metadatos terminales≤24h | Canal y atención anterior a confirmar pendientes |
| privacy_mail_operations | Envío de código009, cifrado/clave versionada propios | Destino derivado de consulta; no correo009 como actividad. Timeout10s,unknown por lookup estable, sin reenvío a ciegas; no éxito sin aceptación comprobada | Proveedor,remitente,buzón y borrado externos pendientes |
| erasure_jobs / diario independiente | Intención/deadline y no resurrección; solo UUID aleatorio/tiempo/motivo/recibo mínimo | DiarioHMAC versionado,replicación previa,leases/fencing,retirada con prueba firmada de inventario y horizonte vencido,ancla sin IDs retirados | Ubicación realmente independiente/horizonte/completitud pendientes |
| Copias/manifiestos de migración/restauración | Recuperación restringida,DB nunca bajo checkout/staticroots | Copia coherente,hash/firma,restoreUntil explícito; restaurar requiere head actual y reaplicación antes de acceso/envío | Inventario completo,soporte,COW/snapshots y máximos por ubicación pendientes |
| Handles externos | Permitir borrado sin conservar copia de correo/texto en jobs | Captura durable por jobId antes de eliminar008; adaptadorcalificado gestiona estado y ciclo,fallo impide perder única referencia | No existe proveedor/ciclo aprobado; doble local solo prueba contrato |
| Claves006/008/009 | Autenticación,cifrado y comprobantes; archivos privados fuera de cliente | Separadas/versionadas; retener claves necesarias para datos/copias todavía conservados. No retirar clave global para borrar una consulta | Rotación/custodia y respaldo real pendientes |
| admin.sqlite/cuentas/sesiones/historias/logs | Dominio006/007; sin política90d por defecto | Se mantienen contratos006/007; no se añaden datos ni plazos generales | Políticas propias y avisos010 pendientes |

## Cookies y almacenamiento del navegador

006 usa `__Host-priva_session` (Secure,HttpOnly,SameSite=Strict,Path=/; máximo absoluto8h,
inactividad30min en servidor) y `__Host-priva_preauth` (necesaria para CSRF preacceso,5min).
No son cookies publicitarias.009 no añade cookies ni guarda códigos/conversaciones en storage
persistente del navegador. La CLI solicita secretos sin eco y no los acepta por argumentos.
La prueba privada009 sin sesión no instala cookies ni escribe local/sessionStorage.

## Matriz de revisión de rastreo

| Recorrido | Estado y evidencia |
| --- | --- |
| Servicio privado/API009 | Navegador real sobre banco sintético:sin requests externos ni storage/cookies nuevas; no acredita producción |
| Navegación pública | Código/recursos servidos reales,CDN/proxy y fuentes finales pendientes de auditoría integrada |
| Audio | Medios/servidores oficiales y tráfico real pendientes; no simular proveedor aprobado |
| Ejercicios | Contrato003 y regresión local sin persistencia; verificación de despliegue pendiente |
| Contacto | Persistencia005 y regresión local comprobadas; proveedor,proxy y aviso final pendientes |
| Administración | Autorización006 y API009 verificadas; revisión global de assets/cookies/proveedores productivos pendiente |
| Instagram | Distinguir enlace de navegación externa y recurso incrustado; no extender política de Priva a la plataforma |

Cualquier cambio de recurso/configuración/proveedor/revisión invalida la referencia afectada.
No guardarHAR crudo,tokens,códigos o mensajes reales. Tracking,channel y demás readiness009
continúan null hasta evidencia productiva verificable por hash/revisión/fecha/alcance.
