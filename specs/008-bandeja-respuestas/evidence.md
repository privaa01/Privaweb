# Actualización del 30 de octubre de 2026

T060 parcial: 57/57 pruebas UI aprobadas en Chromium, Firefox y WebKit (42 celdas de accesibilidad + 15 casos existentes). Corregido el desbordamiento de la casilla de revisión. Pendientes lector y comparación manual P04/011; total 60/66. [Evidencia actual](accessibility-review-2026-10-30.md). Los registros siguientes conservan sus fechas y alcances históricos.

# Evidencia de implementación — 008

**Fecha local**: 2026-10-19, America/Bogota (ejecución también registrada en UTC 2026-10-20).
**Repositorio/rama**: Privaweb/main. Cambios locales, sin commit/push ni despliegue por esta tarea.
**Resultado**: implementación y verificación local; 60/66 tareas completas, seis pendientes de
calificación externa, motores/revisión manual o build de entrega. No se certifica CT01 productivo.
**Checklist de especificación**: 16/16, leído sin alterar marcadores; no es evidencia de implementación.

## Comportamiento implementado

Bandeja privada en `/admin/contacto`, reutilizando shell/sesiones 006. Consulta 005 es la única fuente;
listado por Pendiente/Respondido, detalle/historial paginados, error/vacío diferenciados, conteos
reales coherentes 007 y respuesta al correo almacenado. Respuestas adicionales Q1 requieren revisar
historial vigente, CAS y ausencia de intención no resuelta. Texto plano 1–5000 puntos Unicode,
JSON 32 KiB y lectura 30 s; sin comentarios por historia, Aprobar, adjuntos, CC/BCC o tracking.

Migración 005 offline versionada a esquema 8, backup privado consistente y conservación de IDs,
fechas/tuplas/recibos/contact.key. Runtime rechaza esquema legado/desconocido; no migra escritores
activos. Autorización admin→contacto síncrona excluye revocación hasta commit; una caída posterior
al commit de contacto se recupera por misma operationId, sin afirmar atomicidad multiarchivo.

Outbox y worker 008 separados del correo 006. Payload AES-256-GCM/versionado/AAD, sesión validada
por digest interno antes de reservar despacho, un no-resuelto por consulta, deliveryId estable y
fencing. Reserva dispatching marca inicio autorizado; red fuera de locks, timeout 10 s/lease 30 s,
lookup autenticado/prueba verificable, unknown bloqueante sin reenvío. Lease vencido no recicla
queued; una aceptación comprobada se guarda con respuesta/estado/actividad en una transacción.
Aceptación jamás se presenta como entrega o lectura.

Cliente conserva texto ante error; no publica ni persiste PII en navegador. Reintento de registro
perdido reutiliza explícitamente misma identidad/payload, pasando por dedup/CAS. Rechazo confirmado
permite otra intención con retryOf. Conflicto conserva el borrador propio sin sobrescribirlo con
texto ajeno de otra intención. Cierre/pérdida de sesión limpia datos y detiene automatismos.

Borrado coordinado revoca recibos 005 y retira payload/historial/operaciones; ack tardío no recrea
consulta. No hay tombstone nuevo con PII: una operationId no crea consultas, y el recibo 005 opaco
vence conforme a su capacidad. Restauración barre vencidos antes de habilitar vistas/worker;
las consultas vencidas no son elegibles ni visibles. Esto no acredita borrado en buzones/copias.

## Resultados y artefactos locales

Pruebas con Node 24.19.0/Linux, SQLite real de archivo y datos/cuentas/buzón controlado locales
sintéticos. Ningún proveedor/remitente real seleccionado, correo enviado a terceros ni cuenta
productiva provisionada. No contar ejecuciones repetidas como casos nuevos.

| Capa | Resultado | Referencia |
| --- | --- | --- |
| Node008 | 43/43 aprobados en suite final de cierre | `.test-output/inbox-node-qualified.txt` |
| Servicio005+006+008 y navegador | 14 casos: 7 Chromium + 7 Firefox aprobados | `.test-output/inbox-service-results.json` |
| UI con respuestas simuladas | 5 Chromium aprobados; no acreditan almacenamiento/correo | `.test-output/inbox-ui-results.json` |
| Regresión005 Node |66/66 aprobados | `npm run test:contact`, salida de ejecución de esta sesión |
| Regresión006 Node |39/39 aprobados | `.test-output/inbox-regression-admin.txt` |
| Regresión007 Node |37/37 aprobados con decoder/bwrap reales | `.test-output/inbox-regression-stories-qualified.txt` |
| Regresión003 Node |40/40 aprobados | `.test-output/inbox-regression-003.txt` |
| Regresión006 Chromium |8/8 aprobados en ejecución secuencial | `.test-output/admin-service-results.json` |
| Regresión007 Chromium |25/25 aprobados, incluye upload/decoder/catálogo003 | `.test-output/story-management-service-results.json` |
| Tipos | tsc de008/005/006/007 y Astro fixture008 aprobados | comandos check de package.json |
| Build local | Fixture008 y vistas privadas006 aprobados | `.test-output/inbox-ui`, `.private-build/admin` ignorados |
| Gate008 | Rechaza readiness pendiente, exit1 esperado | `tests/inbox-gate.test.ts` |
| Build de entrega | Bloqueado por revisiones/materiales previos y calificación008 | no equivale a aprobación productiva |

Total de regresión única local aprobada: 215 casos (182 Node + 33 Chromium); no incluye motores
bloqueados ni casos duplicados por rerun. Resultados externos, integración real y revisión manual
no están aprobados por esta tabla. Los artefactos locales están ignorados; este registro conserva
condiciones/resultados sin claves, tokens o mensajes reales.

## Verificaciones críticas ejecutadas

- Migración en memoria y CLI con SQLite de archivo: backup 0600, preserva ID/fecha/clave y v0 → v8;
  repetición sin cambios, versiones desconocidas rechazadas y FK/integrity comprobados.
- Proceso independiente intenta revocar sesión durante transacción: bloqueado hasta commit de contacto;
  tras liberar lock revoca y no permite lectura. Dos procesos registran misma intención: una fila,
  un replay y como máximo una llamada de correo. No se sustituyen procesos por mocks de DB.
- Dos conexiones/workers y leases vencidos: resultado antiguo cercado, lookup recupera aceptación
  sin send adicional. Caída tras aceptación externa y antes de commit local recupera misma respuesta.
- Aceptación perdida/rechazo/unknown/proof inválido y ventana idempotente vencida: estados correctos;
  unknown no libera otra intención ni se convierte en rejected por tiempo/reintentos.
- Pérdida de HTTP antes y después de registro: recuperación en navegador, una identidad estable;
  dos POST de misma intención no equivalen a dos envíos. Reintentos rechazados se enlazan con retryOf.
- Autorización real/CSRF/origen/paths/UTF8/JSON/byte 32 KiB y petición chunked incompleta: se corta
  a 30 s, sin respuesta en cola. Polling no toca lastActivity de sesión y 429 no crea otra operación.
- Cifrado autentica AAD y contenido; claves ausentes/alias/permisos inseguros rechazados. Logs
  contienen solo evento/código/duración, sin contenido, IP, cookie ni secretos del proveedor.
- Eliminar durante llamada externa no revierte un envío ya autorizado, pero impide recreación local;
  replay 005 retirado no confirma ni crea consulta. Lectura/fallo/replay no extienden actividad;
  aceptación nueva actualiza una vez con su fecha original. Barrido retira vencidos y respuestas.
- Navegador usa consulta/clave/sesión reales; valida Q1, conservación de borrador frente a conflicto,
  texto como datos, limpieza al cerrar, y tamaños 360/390/430/768/1024/1280/1440×100/200%.
  Axe sin violaciones en ámbito de bandeja en Chromium/Firefox; no sustituye lector manual/fidelidad.
- Rendimiento: 1000 consultas × 10 respuestas, 30 muestras por operación después de calentamiento;
  listado/filtro/detalle p95 muy por debajo de 2000 ms. Valores exactos en salida Node del banco local;
  no es promesa de capacidad productiva ni de latencia de correo.

## Matriz de escenarios

| Escenario | Resultado observable | Evidencia de prueba | Estado |
| --- | --- | --- | --- |
| US1.1 | Consulta 005 privada | Node reading/HTTP y navegador reading/contact-flow | Verificado local |
| US1.2 | Filtro/detalle/identidad | Node reading y UI reading | Verificado local |
| US1.3 | Vacío≠error/reintento | UI mock load failure y Node reading | Verificado local |
| US1.4 | Estados/conteos reales007 | Node summary/response y UIresponse | Verificado local |
| US1.5 | Acceso directo/sesión | Node authorization/HTTP y navegador logout | Verificado local |
| US1.6 | Cargas tardías/sesión perdida | UI mock older detail y navegador logout | Verificado local |
| US2.1 | Destinatario guardado | Node HTTP/security/response y navegador reading | Verificado local |
| US2.2 | Texto vacío/límites | Node validation y navegador response | Verificado local |
| US2.3 | En curso≠Respondido | Node response/worker y UI unknown | Verificado local |
| US2.4 | Aceptación/asociación durable | Node response close/reopen y navegador response | Verificado local; sin recepción real |
| US2.5 | Historial/Q1/misma consulta | Node response y navegador response | Verificado local |
| US2.6 | Contenido como texto | Node response/validation y textContent del cliente | Verificado local |
| US3.1 | Rechazo conserva texto/estado | Node worker y UI mock confirmed rejection | Verificado local |
| US3.2 | Misma intención concurrente | Node concurrency dos procesos/dos conexiones | Verificado local |
| US3.3 | Resultado incierto | Node worker/HTTP y UI recovery/mock unknown | Verificado local |
| US3.4 | Aceptación seguida de fallo local | Node worker post-provider failure y navegador lost HTTP | Verificado local |
| US3.5 | Reintento tras rechazo probado | Node worker y UI mock retryOf | Verificado local |
| US3.6 | Otra cuenta/vista antigua | Node response/concurrency y UI mock unsent text | Verificado local |
| US3.7 | Sesión perdida/relogin | Node worker revoked y navegador logout; intento no se reenvía | Verificado local |
| US3.8 | Incertidumbre no concluyente | Node worker unknown past window y UI unknown | Verificado local |
| US4.1 | Guardado público→Pendiente | Node HTTP y navegador contact-flow real005/006/008 | Verificado local |
| US4.2 | Aceptación≠recepción/lectura | Proveedor controlado local; no buzón externo | Parcial: recepción real bloqueadaP02 |
| US4.3 | Separación educativa/pública | API005 no expone ID/respuesta; regresión003/007 | Verificado local; revisión de tráfico final pendiente |
| US4.4 | Borrado/recibos/replay | Node reading/retention y regresión005 | Verificado local; operación009 pendiente |
| US4.5 | Actividad solo por aceptación nueva | Node retention/worker | Verificado local; confirmación operativa009 pendiente |
| US4.6 | Restauración/ack tardío | Node retention y barrera composeInbox.purgeExpired | Verificado local; backups/proveedor009 pendientes |

## Tareas abiertas y condiciones de aceptación

| Tarea | Motivo concreto |
| --- | --- |
| T056 | P02: sin proveedor/remitente/adaptador calificado ni prueba de recepción en buzón real; doble local no lo sustituye |
| T057 | Política 009/avisos 010: canal, verificación de solicitud, periodicidad y ciclo de proveedores/buzones/copias sin calificación real |
| T060 | Actualizado 2026-10-30: automatización UI 57/57 en tres motores; casilla corregida y matriz completa. Lector de pantalla y revisión visual manual P04/011 pendientes. Ver accessibility-review-2026-10-30.md. |
| T062 | Regresión local relevante 215 casos aprobada; WebKit y comprobación directa 001 de esta entrega no completadas |
| T063 | Producción: HTTPS/proxy/capacidad/backup/claves/worker y referencias P02/009/010/011 sin calificar |
| T064 | Tipos/builds locales pasan; build raíz de entrega bloqueado por materiales/revisiones/gates reales |

T065 recorre los comandos locales disponibles y registra bloqueos de los externos; no marca sus
prerrequisitos abiertos como completos. T066 sincroniza el estado parcial, no cierra 008 ni 009/010/011.

## Fallos iniciales, diagnóstico y corrección

1. Pruebas de migración fallaron por comportamiento pendiente, sin fallo de importación; tras
   implementar pasaron. Se corrigió sintaxis de propiedades de parámetros no soportada por strip-only,
   sin sustituir el runtime ni ocultar fallos.
2. Un sexto login de una sola cuenta activó el límite real 006. Banco pasó a cuentas sintéticas
   individuales; no se relajó el límite del producto. Alias de consultas ahora distinguen motores
   para evitar que dos datos legítimos idénticos hagan ambiguos los selectores de pruebas.
3. Servidor Astro de desarrollo de fixture no arrancó en el entorno; el banco sirve el build estático
   con Python 3, como otras fixtures del repositorio. No es despliegue ni mecanismo productivo.
4. Suites 006/007/008 construidas a la vez limpiaron plantillas compartidas; se repitieron de forma
   secuencial. Solo los resultados posteriores completos cuentan como verificación aprobada.
5. Decoder 007/bwrap y perfil Firefox estaban bloqueados por sandbox exterior: ejecución aprobada
   fuera de ese sandbox mantuvo las protecciones de aplicación y pasó. No se desactivó bwrap.
6. Contador 007 recibió prueba sintética de 1970, ahora vencida por política 008. Se añadió reloj
   inyectable al contador y se actualizó la fixture para compartir reloj, manteniendo la aserción.
7. WebKit falla antes de ejecutar casos por GTK4/Graphene/Harfbuzz-ICU/Manette/Hyphen/GLES ausentes.
   Se intentó descargar bibliotecas oficiales a /workspace sin modificar sistema, pero APT carece
   de índices accesibles. Sigue bloqueado; sin desactivar verificación ni declarar casos aprobados.

Los informes de integración bloqueada usan rutas de artefactos distintas a los informes del servicio
local; no pueden sobrescribir una ejecución aprobada con un resultado de cero casos. Se comprobó
la presencia y el conteo real de casos en los JSON, además del exitcode de cada comando.

## Cierre del procedimiento

Checklist documental no alterado; sin hooks de extensión configurados. Sin commit/push/despliegue
por esta implementación. Las referencias readiness 008 permanecen null y el arranque/build productivo
falla cerrado. El trabajo local no acredita recepción real, privacidad operativa ni entrega final.
