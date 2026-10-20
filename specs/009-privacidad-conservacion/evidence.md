# Evidencia009 — Privacidad y ciclo de vida de datos

**Fecha**: 2026-10-20 (America/Bogota). **Estado**:57/67 tareas verificadas localmente;
10 parciales/bloqueadas. X02/FR-001 no tiene cierre productivo. Q1–Q4 conservadas.
No se han enviado correos a terceros,migrado datos reales,hecho commit/push ni desplegado.

## Qué se implementó

- Esquema9 sobre contact.sqlite,migración offline8→9 con backup/manifiesto y bloqueo flock
  real,PRAGMAs seguros y compatibilidad005/008. admin.sqlite no cambia de esquema.
- Política común90d y deadlines:sin acceso/despacho al vencer,borrado operativo≤1h; solicitud
  confirmada≤24h o límite anterior. Lecturas/fallos/replay y correo009 no reinician actividad.
- Coordinador durable:deleting,intención,diarioHMAC versionado en réplica independiente del
  rollback,captura mínima durable de handles externos,revocación005/borrado008,saneamiento
  SQLite/WAL bajo barrera y confirmación física. Caídas,reintentos y leases con fencing.
- Worker009 independiente del correo,tick60s/lotes100,reintentos,timeout de adaptadores10s,
  limpieza de códigos/outbox sin proveedor,heartbeat privado y watchdog externo. Deadline
  nunca se desplaza por caída; overdueAt conserva incumplimiento aunque luego se complete.
- API privada y CLI de operador con guard006/CSRF/origen,no-store/JSON16KiB/30s; scope1–50,
  código80bits30min,máximo5fallos,de un uso al correo guardado,consumo atómico y deduplicación.
  Outbox009 cifrado separado,aceptación/unknown/lookup,claves versionadas y sin secretos en logs.
- Restauración con head actual independiente,manifiesto/cadena,supresiones y vencimientos antes
  de habilitar acceso/envío. Compactación autenticada tras horizonte de copias acreditado;
  ancla firmada sin IDs retirados y eliminación de jobs completados. Sin política perpetua.
- Readiness ligado a evidencia/revisión/hash/fecha/alcance; null,fixture,booleano o referencia
  arbitraria no aprueban producción. Integrado con entradas005/006 y gates005/006/008.

## Entorno y resultados

Linux/Node24.19.0,TypeScript5.9.3,Astro7.4.0,SQLite de archivo,util-linux/flock y Playwright1.64.1.
Fixtures temporales privadas y cuentas/correos sintéticos; réplicas fuera del conjunto restaurado,
sin afirmar independencia de volumen productivo. Los servicios de navegador se crean en puertos
loopback libres y se cierran al terminar. No son mocks de la API ni un despliegue.

| Comprobación | Resultado | Evidencia |
| --- | --- | --- |
| `npm run test:privacy` |43/43 Node aprobadas,0fallos/omitidas | [node-tests.txt](evidence/node-tests.txt) |
| Browser privado009 |6aprobadas:3Chromium+3Firefox,servicio real+doble de correo | [browser-tests.txt](evidence/browser-tests.txt) |
| Checks TypeScript005/006/007/008/009 | Aprobados; sin emisión | Scripts check:*:service del package |
| RegresiónNode003/005/006/007/008 |225casos únicos aprobados:220primera ejecución;5fallos iniciales de entorno,bloqueo externo de bwrap;15casos de archivos afectados repetidos y aprobados,incluidos esos5 | [local-validation.json](evidence/local-validation.json) |
| Rendimiento |1000consultas/10respuestas por fixture,lotes100,10lotes completos de calentamiento+30medidos;p95≈0.962s<5s;consulta indexada medida aparte | Log Node y JSON de validación |
| CLIs migrate/verify/apply/retire | Caso incluido en43Node; flock exclusivo heredado real,backup firmado,bypass --locked rechazado,backup antiguo no revive datos,retirada con prueba firmada | privacy-cli.test.ts |
| Build de entrega | Bloqueado por recursos/revisión editorial002; no se relajan gates | require-home-publication y `npm run build` |
| Gate009 | Bloqueado correctamente con10referencias sin calificar | require-privacy-publication.mjs |
| WebKit | No ejecuta casos: dependencias/descubrimiento del host pendientes; no se cuenta como aprobado | Detalle de entorno al final |

El conteo225 es único:no sumar los15repetidos a los220originales. Las pruebas43Node incluyen
CLI,carga y seguridad; tampoco sumarlas de nuevo como casos adicionales.

## Correspondencia con aceptación

| Casos / escenarios | Resultado local y límites |
| --- | --- |
| V01/V02,US1.1–5,SC-001 | Fronteras90d,fechaUTC/actividad válida,lecturas/borrador/fallo/unknown/replay y aceptación original; sin prolongación indebida |
| V03/V04/V15,US1.6,SC-002 | Vencimiento/1h,borrado físico local,marcadores sintéticos ausentes en DB/WAL,vigentes intactos,caídas y deadline original; producción todavía sin calificar |
| V05/V06,US2.1–4/6,SC-003 | Scope,confirmación explícita,código correcto/incorrecto5veces,vencido/usado,CSRF,revocación,destinatario guardado,plazo24h/límite anterior y recuperación de respuestaHTTP perdida |
| V07/V08,US2.5,SC-003/008 | Fallo/unknown/aceptación comprobada/lookup,no reenvío a ciegas,no confundir aceptación con recepción o lectura; sin correo real |
| V09/V10,US3.1–4/6,SC-004 | Backup anterior a eliminación temprana,diario faltante/fork/atrasado respecto a head conocido,fallos por etapa,dispatch reservado anterior y ack tardío sin resurrección |
| V11,US3.5,SC-005 | Inventario/manifiestos,captura previa,retirada firmada y estados de adaptadores probados con datos sintéticos; ubicaciones,ciclos e independencia reales pendientes |
| V12,US4.1–3,SC-006 | Autorización real por operación,CSRF/origen,validación,scope malicioso y ausencia de contenido/código/token en respuestas/logs |
| V13,US4.4/6/7,SC-007 | Banco privado009 sin requests externos ni storage/cookies añadidos; regresión003 mantiene ejercicios locales. No acredita revisión completa de navegación/audio/formulario/administración servidos reales |
| V14,US4.5,SC-008 | Gates fallan cerrados,avisos pendientes documentados; correspondencia productiva010 y claims siguen bloqueados |

## Tareas y condiciones pendientes

T053/T058:auditoría integrada de cinco recorridos y avisos reales.T059:canal/lector/revisión
manual y presentación de textos públicos afectados.T060:cierre de regresión integrada/manual,
aunqueNode y navegador009 ya pasan.T061:responsable/canal/proveedor/remitente/buzón reales.
T062:inventario,horizonte,réplica de volumen independiente y copias/buzones/proveedores reales.
T063:HTTPS/proxy,reloj,almacenamiento/soportes/snapshots y alertas reales.T064:auditoría
productiva y avisos010 finales.T065:build de entrega y otros gates.T066:concordancia final de
guía con operación real. Ninguno se aprueba por aceptar documentación o ejecutar dobles locales.

[privacy-inventory.md](privacy-inventory.md),[notices-review.md](notices-review.md) y
[accessibility-review.md](accessibility-review.md) detallan alcance y pendientes. Checklist de
requisitos16/16 intacto:significa calidad documental,no que las métricas productivas se cumplan.

## Incidencias de verificación y entorno

- Playwright no encontró navegadores en su ruta predeterminada.Se usó Chromium del sistema
  `/usr/bin/chromium` y Firefox existente en `/workspace/.cache/ms-playwright`.
- Firefox y bwrap requirieron ejecución autorizada fuera del sandbox exterior; las protecciones
  de navegador/aplicación se mantuvieron. No se desactivó sandbox,TLS o cookiesSecure.
- La prueba de carga detectó verificación repetida costosa del diario; se eliminó repetición
  criptográfica para el mismo cuerpo exacto/keyVersion,conservando firma,cadena,head y detección
  de alteraciones. La medición completa posterior pasa,no se cambió el objetivo para aprobar.
- Migración/restauración no confían en una bandera de mantenimiento:las CLIs validan flock
  exclusivo heredado.El caso de bypass falla como se esperaba.
- Se corrigió limpieza de confirmaciones vinculadas al borrar una consulta y se desacopló
  expiración de códigos del correo; la prueba independiente está incluida en43Node.
- WebKit no pudo completar arranque:se descargaron paquetes Debian13 firmados/verificados a
  `/workspace/.tools/webkit-libs`,sin cambiar fuentesAPT del sistema ni el lock del proyecto.
  Las bibliotecas resuelven por LD_LIBRARY_PATH,pero el validador de Playwright consulta la
  caché global de ldconfig para libGLESv2,que este usuario no puede registrar(no dispone de sudo).
  No se omite la validación del host ni se cuenta un caso no ejecutado como éxito.
- Guardadas instrucciones de inicio009 en el borrador del entorno; guardar no publica el entorno
  ni aplica cambios en máquinas futuras. Recursos reales,P02 y aprobación productiva no se inventan.
