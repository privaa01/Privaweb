# Ejecución de conservación en ambos entornos — 2026-11-04

## Decisiones de la responsable

Pidió ejecutar009, no limitarse a describir pendientes. Eligió ambos entornos, mantener el plan gratuito y ejecutar desde su computador; «no quiero conservar copias»; mantener el correo desactivado. Estas decisiones gobiernan el perfil actual. No se infiere autorización para facturación, copias o correo.

Excepciones expresas de alcance: conservación90d mientras el equipo/proceso estén encendidos; al detenerse se reanuda al iniciar, sin garantía24/7 ni de1h durante una interrupción. No hay copias creadas porPriva, restauración productiva ni recuperación desde copia dePriva después del borrado. Eliminación anticipada por correo deshabilitada, nunca simulada. Ciclos internosGoogle/sistema operativo no comprobados. No se habilitan datos personales reales.

## Implementación activada

- scripts/run-admin-local.mjs supervisaHTTPS: barrido local antes de acceso, comprobación cada60s, drenaje/parada de conexiones, limpieza exclusiva y reapertura con cuentas/historias conservadas. Mantiene confianzaTLS durante el supervisor y la retira al detenerlo.
- scripts/privacy-local-sweep.ts: perfil aprobado y esquema8 conocido; transacción de bajas por90d y retiro de recibos caducados, secure_delete, VACUUM tras bajas, checkpointTRUNCATE/integridad/FK. No crea copias ni migra silenciosamente a9. Perfil avanzado9/diario/réplica/restore separado.
- scripts/privacy-flock-macos.py: flock real del kernel e inode conservado, descriptor heredado y comprobación exclusiva; Linux conserva util-linux/flock. No booleano de confianza ni eliminación del lock. Servidor/utilidad de ejemplos mantienen bloqueo compartido hasta cerrar conexiones.
- scripts/privacy-firestore.mjs: proceso privado del operador, autenticaciónFirebaseCLI fuera del cliente/servidorHTTP, colección única demo_contact y siete campos ficticios autorizados, corte90d, páginas acotadas, relectura/transacción/precondición. Identificador mínimo en privacy_suppressions sin nombre/correo/mensaje. Inicio y cada15min sin solapamiento; plazo30s y fallo explícito. No correo.
- firestore.rules desplegadas: impiden recrear IDs en privacy_suppressions; lectura/actualización/eliminación públicas siguen denegadas. Sin cambio de facturación ni CloudFunctions.
- Configuración privada privacy-local-settings.json registra elecciones. privacy-status.json solo resultados/fechas/conteos. Ambas en Library/Application Support/Priva/local-admin, no versionadas. Comprobación real: ambos estadosok y cuenta conservada.

Inicio: PRIVA_LOCAL_TLS_TRUST=approved bash scripts/admin-local.sh iniciar. Parada: bash scripts/admin-local.sh detener. Requiere equipo/proceso encendidos, conexión y autenticaciónFirebaseCLI vigente paraFirestore. No se instaló servicio de inicio de sesión delMac ni automatización deCodex. Cerrar sesión web no detiene el proceso.

## Pruebas

1. Suite009 inicialmente falló por flock ausente. Tras adaptación:44/44Node conformes, sin omitidas; procesos/bloqueos, migración, residuosSQLite/WAL, códigos con dobles, restauración y rendimiento. Fixtures identificadas, no correo/backup productivos.
2. Nuevas pruebas de barrido local/Firestore conformes; regresiónHTTPS006/007/008 conforme. Campaña conjunta3/3. Local: lector compartido bloquea limpieza; después baja solo vencido, conserva vigente/recibos correctos, sin marcador enSQLite/WAL ni copias nuevas.
3. Firestore real priva-785cb: regla compilada/desplegada. Dos documentos ficticios controlados: vencido eliminado, vigente conservado, metadato privado y recreación denegados403. Ejemplos y metadato de prueba retirados al terminar, sin tocar otros registros. Inspección real sin vencidos. Recibo agregado privacy-firestore-real-2026-11-04.log.
4.29/29Node finales:27documentos y dos nuevas de conservación. Typechecks009/006 conformes, builddemo7páginas y diff conformes. UI del aviso comprobada antes de revisión/publicación.

Logs ignorados bajo.test-output:privacy-execution-fixed-2026-11-03.log, privacy-macos-2026-11-03.log, privacy-both-2026-11-04.log, privacy-final-2026-11-04.log, privacy-firestore-rules-2026-11-04.log, privacy-firestore-real-2026-11-04.log y privacy-notice-ui-2026-11-04.log. La interrupción previa por límite del revisor de la aplicación no fue un rechazo de seguridad; la acción no ejecutada se retomó el4nov tras la petición de continuar.

## Estado

T068/T069 completas para este perfil. Las10tareas originales de cierre integral mantienen su estado; no se califican producción/correo/copias/restore por estas pruebas. Aviso público modificado preparado en vista4355; revisión humana010 solicitada antes de publicarHosting. Sin commit/push.

2026-11-04 — Decisión posterior: la responsable no quiere publicar el aviso actualizado. Se conserva en specs/010-documentos-recuperacion/privacy-notice-proposal.md y se retira de la fuente publicable de la demo, que mantiene su aviso anterior. No se despliegaHosting ni se infiere autorización para retirar el aviso público existente.
