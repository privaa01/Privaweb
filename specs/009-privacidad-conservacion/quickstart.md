# Quickstart: validación futura de 009

**Date**: 2026-10-20. Guía de implementación local. Consultar [evidence.md](evidence.md) para resultados reales y límites; producción sigue bloqueada porP02/010/011.

## Preparación

Node24, dependencias del lock y navegadores de Playwright instalados. Usar exclusivamente
consultas/cuentas/correos sintéticos en directorio temporal privado fuera de checkout/staticroots;
dobles de correo/réplica explícitos y separados de producción. Leer [contrato](contracts/privacy.md)
y [modelo](data-model.md). No aportar credenciales por chat, argumentos o archivos versionados.

Comprobaciones existentes, que se ejecutarán al implementar según archivos afectados:

```bash
cd /workspace/Privaweb
node --version
npm run check:contact:service
npm run check:inbox:service
npm run check:admin:service
```

Pruebas implementadas, sin correo o datos de producción:

```bash
node --experimental-strip-types --testtests/privacy-*.test.ts
npx playwright test --config=playwright.privacy.service.config.ts
```

La suite009 prepara y limpia sus fixtures automáticamente, inicia servicios en loopback,
doble de correo con send/lookup y réplica en almacenamiento separado del backup restaurado.
No reutilizar base de trabajo ni ejecutar comandos de borrado sobre datos reales.

## Matriz de validación

| Caso | Preparación y acción | Resultado observable / criterio |
| --- | --- | --- |
| V01 | Pendiente/Respondido justo antes/en/después90d, fechaUTC fija y cambios de día | Acceso y nuevo despacho bloqueados desde vencimiento; SC-001/002 |
| V02 | Lecturas/borrador/fallo/unknown, aceptación nueva/tardía/replay | Solo nueva aceptación original actualiza, nunca recrea eliminados; SC-001 |
| V03 |1000 consultas con10respuestas; tick60s y lotes100, concurrencia de lectores | Revisión al menos horaria, limpieza≤1h y objetivo interno medido; vigentes intactas; SC-002 |
| V04 | Alias/email/text sintéticos únicos, purge y caída tras cada etapa; leer bytes de DB/WAL/temporales | Ningún residuo recuperable tras physical_verified; fila ausente no basta; fallo checkpoint/lock o captura durable externa no da éxito ni destruye referencias necesarias; SC-002/005 |
| V05 | Operador006 crea solicitud scope1–50 mismo correo; doble de correo acepta | Código solo llega al destino guardado; nunca HTTP/log/args; solicitud no actualiza actividad; SC-003/006 |
| V06 | Código correcto, incorrecto5veces,30min,usado,otro scope;dos procesos confirman | Una confirmación y deadline; ningún acceso/borrado ajeno o replay; SC-003 |
| V07 | Confirmación válida, timeout antes/después commit, reinicio y vencimiento por conservación anterior | Borrado≤24h o límite anterior, fecha no reinicia; estado recuperable por requestId; SC-003 |
| V08 | Correo accepted/rejected/unknown, lease vencido, revocación006, pérdida de respuestaHTTP | No duplicar send ni aceptar unknown como éxito; código vence por fecha original; SC-003/006 |
| V09 | Copia antigua con vigente/vencida/eliminada anticipada, head actual independiente | No acceso005/007/008 ni despacho antes de reaplicar diario/vencimientos y limpieza; SC-004 |
| V10 | Diario viejo/fork/firma inválida/replica ausente; caída entre intención/réplica/DELETE/limpieza | Fallo cerrado, reanudación idempotente sin perder supresión ni falsear éxito; SC-004/005 |
| V11 | Inventario copias/migración/proveedor/buzón y restauración probada | Ciclo/máximo/responsable/evidencia por ubicación; desconocidos bloqueados; SC-005 |
| V12 | AccesoHTTP directo sin sesión/CSRF, sesión revocada, entrada maliciosa, confirmaciones concurrentes | Guard006 por operación, salida segura, no secretos/PII públicos; SC-006 |
| V13 | Navegación/audio/ejercicios/Contacto/admin, sesión nueva y autenticada, tráfico y storage | Cero rastreo; cookies necesarias inventariadas; ejercicios sin persistencia; SC-007 |
| V14 | Avisos010 y claims junto a matriz de operación/proveedores | Cada afirmación con evidencia vigente; sin canal o ciclos ficticios; SC-008 |
| V15 | Detener worker/red/servicio, superar deadline, restaurar/reabrir | Incumplimiento registrado, sin cambio de fecha ni falso éxito; recoverygate previo; SC-002/003/004/008 |

Pruebas de seguridad/códigos no necesitan pantalla nueva: usar CLI/API privada y canal sintético.
Regresión afectada005/006/007/008 y ejercicios003 según cambios; suites de servicio se ejecutan
secuencialmente si comparten builds privados. No imponer recuentos heredados como resultados009.

## Operación y calificación externa

Antes de habilitar: canal/responsableP02 verificables, buzón de prueba controlado, proveedor con
idempotencia/lookup y borrado comprobables, almacenamiento con barrera y réplica independiente,
inventario/horizonte de backups, permisos/claves/HTTPS/proxy y watchdog calificados. Ejecutar
migración offline bajo barrera real con backup/manifiesto inventariados; la bandera de CLI no
sustituye detener escritores. Los comandos siguientes ya se probaron con fixtures efímeras y dobles explícitos; no ejecutar sobre datos reales sin calificación.

Verificar recepción de código aparte de aceptación; prueba de eliminación tanto en datos
operativos como por ubicación externa; restore sintético contra réplica real sin habilitar envío.
No afirmar borrado de soporte/SSD/snapshot por buscar bytes en SQLite. Si una ubicación no
permite borrado inmediato, documentar su ciclo real y avisos, sin habilitar afirmaciones falsas.

## Evidencias y salida

Mantener [evidence.md](evidence.md) con casoVxx, regla/SC, fecha, entorno, pass/fail/blocked,
referencia de artefacto redactado y límites de simulación. No guardar códigos, tokens, correos
reales, HAR crudo o contenido privado. La inspección de residuos usa marcadores sintéticos,
no vuelca bases. Una fila ausente, correo aceptado o spec aprobado nunca implica cierre global.
El build público puede seguir bloqueado por recursos y gates de otras features; no relajarlos.

## Comandos de operador implementados

Estas rutas son argumentos del operador, no valores productivos por defecto. Usar directorios
privados0700,archivos0600,absolutos y canónicos fuera del checkout/roots estáticos. La configuración
privadaJSON contiene `module`, `manifestKey`, `journal`, `restoreUntil` y `keyVersions`; el módulo
privado exporta `privacyOperations(config)` con journal/copies/close. Las claves se leen de
archivos privados,nunca de argumentos o del chat. Proveedor e inventario reales requierenP02.

```text
node --experimental-strip-types scripts/migrate-contact-privacy.ts ABS_DATABASE ABS_NEW_BACKUP ABS_CONFIG --writers-stopped
node --experimental-strip-types scripts/privacy-restore.ts verify ABS_BACKUP ABS_NEW_TARGET ABS_CONFIG
node --experimental-strip-types scripts/privacy-restore.ts apply ABS_BACKUP ABS_NEW_TARGET ABS_CONFIG
node --experimental-strip-types scripts/privacy-retire.ts ABS_DATABASE ABS_CONFIG ABS_SIGNED_PROOF THROUGH_SEQUENCE
node --experimental-strip-types scripts/privacy-watchdog.ts ABS_HEARTBEAT --watch
node --experimental-strip-types scripts/privacy-operator.ts create
node --experimental-strip-types scripts/privacy-operator.ts status REQUEST_UUID
node --experimental-strip-types scripts/privacy-operator.ts confirm REQUEST_UUID
```

La migración comprueba flock exclusivo heredado,barrera real y copia/manifiesto antes de cambiar
esquema8→9; la bandera no detiene procesos por sí sola. `--locked` manual sin flock heredado se
rechaza. Restore exige un destino nuevo,verifica firma/hash/horizonte/head actual independiente,
reaplica supresiones y termina borrados/saneamiento antes del recibo; nunca inicia correo.
Retire exige inventario completo/actual autenticado y copias afectadas caducadas/destruidas;
compacta diario con ancla firmada y metadatos completados,sin inventar un horizonteP02.

Para CLI privada, `PRIVA_ADMIN_PUBLIC_ORIGIN` debe ser HTTPS calificado; sesión,código y JSON
requestId/targets se introducen porTTY sin eco. La CLI obtiene CSRF006,usa API real y no salta
verificación. No tiene sentido ejecutarla contra un proveedor/canal aún no configurados.

Para arranque productivo, `PRIVA_RELEASE_REVISION` debe corresponder a las referencias de
readiness verificadas. `PRIVA_PRIVACY_OPERATOR_MODULE` es un módulo privado autorizado,con
beforeAdminStart/beforeContactStart para admisión bajo supervisor/restore antes de abrir bases y
openPrivacy para composición009; usar composePrivacy y un heartbeatPath privado. No hay módulo
productivo por defecto ni testflag para aprobarlo. El supervisor mantiene locks compartidos,
drena participantes para exclusivo y no roba locks por timeout. Los módulos de prueba solo
viven bajo tests y nunca se importan de producción. Proveer claves009 challenge/mail distintas
y versionadas; retener claves antiguas necesarias. El arranque falla si no puede verificar esas
condiciones. El watchdog independiente lee heartbeat mínimo persistido cada tick60s.

Objetivo técnico: lotes100,p95≤5s con1000consultas/10respuestas,30muestras completas tras
calentamiento; consulta indexada medida aparte. Tick60s y deadlines absolutos no se sustituyen
por los tiempos acelerados del reloj de prueba. Una hora/24h productivas requieren calificación
operativa real,además de las pruebas locales de frontera y duración.
