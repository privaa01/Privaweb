# Guía de validación — 008

Estado: implementación local. Los comandos 008 están disponibles; resultados y bloqueos en
[evidence.md](evidence.md). Las fixtures no califican correo ni privacidad productivos. Ver [plan](plan.md), [modelo](data-model.md) y [contrato](contracts/inbox.md).

## Prerrequisitos

Node 24.19.0, Python3 solo para servir la fixture estáticaUI, dependencias fijadas en package-lock y Playwright del repositorio. Si hace falta instalar,
`npm ci` conserva el lock. Usar directorio temporal 0700 fuera del checkout/public/dist, bases de
archivo 0600, dos cuentas sintéticas 006, claves efímeras del banco y consultas inventadas identificadas.
No reutilizar datos reales, buzones de terceros o servicios productivos. Mantener HTTPS para operación
real; HTTP loopback solo harness. Puertos aislados propuestos 4332 para UI y 4333 para servicio 008, sin reutilizar
4327/4329/4330/4331 ni servidores de otras suites. Runner inicia y detiene solo sus propios procesos.

## Comprobaciones existentes

Desde la raíz del repositorio, estos comandos existen hoy y sirven de regresión; no acreditan 008:

```bash
npm run check:contact:service
npm run check:admin:service
npm run check:story-management:service
npm run test:contact
npm run test:admin
npm run test:story-management
```

La implementación ejecutó las regresiones indicadas en evidence.md; no inferir resultados de otros entornos. El build de entrega mantiene gates pendientes;
no cambiar aprobaciones, omitir guards ni publicar fixtures para obtener un resultado verde.

## Comandos disponibles de implementación local

Los scripts y configuraciones están implementados; ejecutar cada suite de navegador secuencialmente,
pues las suites privadas de006/007/008 reconstruyen `.private-build/admin`:

```bash
npm run check:inbox:service
npm run test:inbox
npm run check:inbox:contract
npm run build:inbox:contract
npm run test:e2e:inbox:contract
npm run test:e2e:inbox:service
npm run test:e2e:inbox:integration
```

UIcontract solo usa mocks identificados. Servicefixture compone receptor 005 y router 006+008 con
SQLite de archivo, cuentas individuales provisionadas exclusivamente por helper interno, worker y
adaptador controlado send/lookup. Ninguna rutaHTTP de test, bypass de autenticación ni bandera
productiva de aceptación. Integration requiere proveedor/remitente/buzón controlado calificados;
sin ellos registrar bloqueo antes de enviar. Mantener recuperación 006 y respuesta 008 independientes.

## Migración: ensayo obligatorio antes de cualquier uso real

1. Preparar base 005 sintética con consultas/recibos válidos, rechazados y revocados; guardar
   inventario privado de IDs/fechas/tuplas/recibos y claves fuera de artefactos públicos.
2. Detener receptor 005, administración 006 y workers. Crear backupSQLite consistente privado;
   ejecutar `scripts/migrate-contact-inbox.ts` con rutas absolutas explícitas conforme a
   la CLI documentada abajo. CLI disponible: `node --experimental-strip-types scripts/migrate-contact-inbox.ts ABS_DATABASE ABS_NEW_BACKUP --writers-stopped`.
   El flag declara la parada operativa; la herramienta no detiene procesos ajenos. No correr sobre datos reales para probar esta guía.
3. Verificar schemaVersion, integrity_check, foreign_key_check, conteos, IDs, tuplas y fechas
   idénticas; defaults revision/lifecycle; permitir status Respondido. Repetir migrador no cambia datos.
4. Arrancar implementaciones compatibles 005/008 y comprobar submit nuevo, replay exacto antiguo,
   consulta respondida con replay 005, rechazo, revoke y purga sin resurrección.007 apunta al mismo archivo.
5. Inyectar fallo de migración y comprobar rollback antes de reabrir escritores. No restaurar una
   copia vieja una vez que se hayan recibido nuevas escrituras. Documentar procedimiento real en P02/009.

## Recorridos de aceptación

| Escenarios / criterios | Acción y resultado esperado |
| --- | --- |
| US1.1–4 / SC-001 | Guardar por 005, listar Pendiente, abrir detalle y cambiar filtros; texto/correo correctos, cero real distinto a error, contadores concuerdan con 007 |
| US1.5–6 / SC-004 | Sin sesión, expiración/revocación/cierre y cargas fuera de orden: ninguna nueva lectura o mutación autorizada, limpiar UI sin callback antiguo que vuelva a mostrar datos |
| US2.1–3/6 / SC-002/006 | Destinatario inmutable, texto como datos, vacío y fronteras0/1/5000/5001 puntos Unicode/espacios/NUL y byte32 KiB; sin enviar inválidos, errores asociados |
| US2.4–5 / SC-002 | Aceptar en proveedor controlado, recargar/reiniciar y comprobar respuesta asociada; revisar historial y enviar otra por Q1, conserva anteriores y no incrementa totalconsultas |
| US3.1–2/5 / SC-003 | Rechazo probado conserva texto; doubleclick/Enter/replay paralelo una aceptación; reintento explícito de rejected con retryOf y revisión actual |
| US3.3–4/8 / SC-003 | PérdidaHTTP/lease/crash antes y después de aceptación/commit: unknown bloquea nueva intención, lookup recupera fecha original sin send adicional; sin prueba permanece unknown |
| US3.6–7 / SC-003/004 | Dos cuentas con misma revisión: solo una nueva intención; cerrar/revocar entre cola/despacho cancela no iniciado, no repetir al relogin |
| US4.1–3 / SC-007 | Guardado público→lectura privada→aceptación→asociación; registrar recepción real separada cuando P02 disponible; ejercicios 003 no generan tráfico 008 ni consultas |
| US4.4–6 / SC-007 | Eliminación/retención y restore impiden vistas/replays/nuevos envíos; ack tardío no recrea; leer/fallar/reconciliar no prolonga 90 días |
| Todas / SC-006/008 | Siete anchos×texto 100/200%, teclado/live regions/foco/contraste; cada requisito y 26 escenarios enlazados con evidencia o bloqueo explícito |

## Pruebas adversas e integraciones necesarias

- Dos conexiones/procesos: detener en barrera entre autorización y COMMIT de contacto e intentar revocar 006;
  comprobar orden linealizable admin → contacto. En camino inverso prohibir tomar admin bajo contacto.
  Fallar después de COMMIT de contacto y antes de COMMIT de admin: HTTP incierto, recibo durable, cero duplicados.
- Runtime mantiene JSON00832 KiB/plazo 30 s sin ampliar el lector0068 KiB ni quitar timeout de 007.
  Origen ajeno, CSRF falso, cuerpo truncado/chunked, Unicode inválido, path/query ambiguos y429:
  no exponer contenido ni realizar envíos nuevos. Polling no amplía inactividad de sesión.
- Fencing de leases con dos workers y resultado antiguo; unknown tras lease no vuelve a queued.
  Probar ventana idempotente vencida, lookup not_found eventual y fecha inválida de aceptación;
  nunca convertirlos en rechazo seguro ni crear otra operación equivalente.
- Reloj controlado: acceptedAt original, nueva respuesta mueve actividad una sola vez; lectura,
  fallo y replay no. Eliminar durante queued/dispatching/unknown y restaurar copia vencida; sin
  resurrección ni nuevo send. Separar límite de envío ya iniciado de uno aún no autorizado.
- Intentar leer DB/WAL/SHM/claves/templates desde servidor público; comprobar permisos 0600/0700,
  ausencia de PII/secretos en dist/public/logs, cachés y almacenamiento persistente de navegador.
- Historial multipágina y 1000 consultas con 10 respuestas: cursor estable, cambios detectados, confirmación
  de revisión invalidada al cambiar revision; medir p95 de30 muestras para listado/filtro/detalle ≤ 2 s.
- Regresión 005 (66casos Node de referencia, sin asumir conteo futuro), 006, 007 y 003/001 afectados.
  El total real de consultas sigue coherente entre 005/007/008. No hay segundo almacén ni historias en bandeja.

## Correo real y cierre

Solo con proveedor/remitente y buzón controlado configurados de forma segura, ejecutar CT01 real.
Conservar evidencia minimizada separada de: 1) persistencia, 2) aceptación verificable del servicio,
3) respuesta asociada, 4) estadoRespondido, 5) recepción efectiva en buzón. Nunca inferir lectura.
Calificar también rechazo, resultado incierto, idempotencia/lookup y ventana real; evidencia del
proveedor debe demostrar garantías, no basarse en un booleano del adaptador.

Registrar fecha/commit/entorno, navegador y criterio, comandos/exitcode, casos ejecutados,
aprobados/fallidos/skips/bloqueados y evidencia sintética. Traces/video/screenshot de credenciales
desactivados; pruebas visuales separadas sin datos reales. Chromium/Firefox/WebKit si disponibles;
faltante no equivale a aprobado. Lector de pantalla y revisión visual/manual 011 pendientes hasta probar.

Ninguna fixture acredita producción, envío a buzón real, borrado de proveedores/respaldos o cierre de 009/010.
Gate 008 y gates existentes deben bloquear build/startup productivos sin referencias reales. No ejecutar
provisión productiva, notificar a terceros ni cambiar flags para completar esta guía. Planificar no es probar.

## Configuración local y productiva

Chromium del entorno: `PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium`. Caché de motores disponible:
`PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright`. Firefox necesita ejecutar su perfil
temporal fuera del sandbox exterior de Codex; eso no cambia autorización, cookies ni la aplicación.
WebKit no inicia por bibliotecas GTK4/Graphene/Harfbuzz-ICU/Manette/Hyphen/GLES ausentes.
Los intentos de descarga de esas dependencias no encontraron índices APT; registrar bloqueo,
sin desactivar verificaciones ni declarar el motor aprobado.

Producción usa `PRIVA_CONTACT_DATABASE` canónico sobre la misma base de005/007,
`PRIVA_INBOX_MAIL_ADAPTER` (módulo absoluto seguro con export `replyMailAdapter`),
`PRIVA_INBOX_SENDER` y versión opcional `PRIVA_INBOX_KEY_VERSION` (v1 por defecto).
Claves `inbox-mail-vN.key` privadas en `PRIVA_ADMIN_DATA_DIR`, distintas del correo006;
se cargan versiones conservadas y falla el arranque si un payload perdió su clave.
El adaptador debe implementar verify de evidencia/deliveryId/payloadDigest y las capacidades
calificadas del contrato. Las variables no sustituyen readiness ni prueban recepción.
No escribir secretos en comandos, repositorio o evidencias; usar configuración segura del entorno.

El gate008 conserva todas sus referencias pendientes, y el build de entrega sigue bloqueado por
requisitos anteriores y calificación ausente. `test:e2e:inbox:integration` se detiene explícitamente
antes de arrancar un doble sintético: requiere una futura calificación real con P02/009/010.

## Matriz UI actual

2026-10-30: `playwright.inbox.config.ts` incluye 42 celdas de accesibilidad y 15 casos de estados en los tres motores. Usa python3 para el servidor estático. Las APIs son mocks explícitos; no sustituye servicio ni correo productivo. Mantener desactivadas trazas/vídeo/capturas automáticas. [Resultados y comandos del host](accessibility-review-2026-10-30.md).
