# Guía de validación — 006

Actualización2026-10-28: UI90/90en3motores;servicio16/24,WebKit requiereHTTPSconfiable por cookiesSecure. [Resultados actuales](revalidation-2026-10-28.md). Implementación local disponible; aceptación final pendiente.
Resultados y bloqueos: [evidence.md](evidence.md). El correo del banco es un doble privado,
no recepción productiva. Requisitos AD01/AD02; [contrato](contracts/admin-access.md).

## Entorno y comandos

Ejecutar desde la raíz del checkout, con Node24+ para el servicio, dependencias del lock,
Python3 y PRIVA_CHROMIUM_EXECUTABLE apuntando al Chrome/Chromium instalado. En el host macOS de esta revisión: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`; los ejemplos `/usr/bin/chromium` corresponden al host Linux anterior. No hacen falta paquetes nuevos ni modificar el lock.
Mantener TLS, integridad de paquetes, Secure y sandbox. Revisar cambios locales antes de trabajar.

```bash
npm run check:admin:service
npm run check:admin:contract
npm run test:admin
npm run build:admin:contract
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:admin:contract -- --project=chromium
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:admin:service -- --project=chromium
```

Los scripts de Playwright construyen, arrancan y cierran sus servicios automáticamente. No ejecutar
simultáneamente dos comandos del mismo banco/root/puerto. No se requiere un servidor persistente.

| Banco | Arranque/puerto | Salida y alcance |
|---|---|---|
| UI | Python4328, `tests/fixtures/admin/serve.py` | `.test-output/admin`; componentes reales/API mock explícita |
| Servicio | Node4329, `tests/fixtures/admin-service/serve.ts` | `.private-build/admin`; SQLite/cookies/CSRF/worker reales con cuentas y buzón sintéticos |
| Node | Puertos/directorios temporales aislados | Archivo SQLite real, procesos independientes, reloj inyectado |

El supervisor privado de pruebas siembra cuentas solo al iniciar el banco. SIGUSR2 reinicia el
proceso servidor sin resembrar; su PID, DB, claves e inbox están en `.test-output/admin-service-data`
0700/0600 fuera del staticroot. `writer.ts` recibe JSON por stdin de procesos autorizados, nunca por
HTTP. El servidor productivo no importa estos helpers ni contiene endpoints/flags de prueba.
No extraer claves, cookies, passwords, CSRF, comprobantes o enlaces en consola/evidencia.

Traces, vídeo, screenshots y snapshots automáticos de error se desactivan para los flujos 006;
`PLAYWRIGHT_NO_COPY_PROMPT=1` evita capturar contraseñas escritas en snapshots de Playwright1.64.1.
Los reportes no deben convertirse en evidencia con secretos. No usar cuentas reales en estos bancos.

Reportes: `.test-output/admin-results.json`, `admin-service-results.json` y respectivos artifacts.
`PRIVA_ADMIN_REPORT_TAG=browser-smoke` o `session` separa verificaciones focalizadas del reporte general.
Los logs y reportes son locales/ignorados; evidence.md conserva resultados saneados.

## Qué se comprueba

- Correo 1–254 puntos de código, trim y emailKey minúscula conservando puntos/+; sin maxlength
  HTML que trunque Unicode. Password nueva 15–128 puntos, sin controles/surrogates/transformación;
  login admite claves previas estructuralmente válidas. Lista local versionada, revisión P02 pendiente.
- Scrypt-v1 N131072/r8/p1, salt16/hash64/maxmem192MiB; hash dummy, comparación constante,
  dos trabajos activos/ocho en cola y saturación antes de consultar identidad. Benchmark local ≠ SLA.
- SQLite WAL/FULL/FK/busy_timeout5000, directorio0700/archivos0600 y rechazo de roots públicos/symlinks.
- Sesiones con 30min inactividad/8h absoluto; estado/contexto no renuevan actividad. Cookies __Host,
  Secure/HttpOnly/SameSite=Strict/Path=/; login rota sesión y consume preauth de5min. CSRF/origen/header
  no simple, JSON UTF8≤8KiB y no-store/CSP. No registro público ni roles adicionales.
- Navegación posterior al login siempre `/admin` del mismo origen; ignora returnTo/next/redirect de
  URL/formulario/API y nunca reproduce modificaciones. Guard antes de HTML y dentro de la misma
  transacción que cada operación privada; callback síncrono obligatorio, sin await/Promise. Dos cuentas con igual permiso; slots 007/008 sin datos falsos.
- Salida durable del acceso actual, replay denegado, historial/tabs/expiración, resultado desconocido
  sin reabrir datos, respuestas tardías descartadas y reinicio completo del proceso.
- Recuperación indistinguible: 202 condicional aun ante límite de identidad/fallo selectivo, sin
  afirmar entrega. Límites globales/conexión antes de lookup; HMAC sin IP/correo desconocido crudos.
- Proof32B/15min/digest, GET no consume; outbox AES256GCM/AAD/nonce/tag/keyVersion y worker con lease60s,
  máximo3 intentos/30s–120s/timeout10s. Sin reenvío ciego de aceptación desconocida no deduplicable.
  Versiones de claves anteriores se retiran del keyring al no quedar sobres vigentes (máximo15min).
- Reset: hash fuera de transacción, revalidación final, nuevo hash/verificación/version++/todos los
  proofs/sesiones invalidados atómicamente. Sin autologin ni reenvío automático de contraseña.
  CSRF puede provenir de otra sesión, pero solo el proof decide qué cuenta se recupera.
- Temporización C5: 20 muestras alternadas por clase bajo carga registrada; comparar cada par de
  medianas≤50ms y p95≤100ms, conservando mínimo250ms+jitter0–50ms. No equivale a tiempo constante.
- Matriz 7 anchos×texto100/200 antes de carga, labels/errores/foco/teclado/aria-live/axe/contraste y
  controles≥44px, overflow y sin JS sin GET de credenciales. Lector y fidelidad manual siguen pendientes.

## Vistas y provisión

```bash
npm run build:admin:views:local
```

Compila para verificación local fuera de public/dist. No sirve ni publica administración. El servidor
Node mapea rutas exactas, protege `/admin`, `/admin/historias`, `/admin/contacto` antes de HTML y
permite solo assets compilados de la whitelist. Nunca servir `.private-build/admin` con Python.
El banco UI es independiente y sintético. Las vistas no incluyen identidad ni datos privados compilados.

Provisión real: `server/admin/provision.ts crear|habilitar|deshabilitar correo`, solo operador con
`PRIVA_ADMIN_DATA_DIR` privado y permisos adecuados. No password por argv/env/demo ni alta HTTP.
Crear/rehabilitar deja credencial/buzón pendientes hasta completar la recuperación por correo.
Deshabilitar/rehabilitar invalida versiones/sesiones/proofs. No ejecutar contra producción sin P02.

## Producción e integración — bloqueadas actualmente

`npm run build` conserva gates001–005 y añade006; `npm run build:admin:views` exige el gate006.
`server/admin/start.ts` no inicia si falta calificación. No quitar guards para simular entrega.

Configuración del operador, sin valores secretos en repositorio ni chat:

- `PRIVA_ADMIN_PUBLIC_ORIGIN`: origen HTTPS canónico exacto sin slash final, ruta ni credenciales.
- `PRIVA_ADMIN_DATA_DIR`: directorio privado absoluto fuera de staticroots/Git.
- `PRIVA_ADMIN_PORT`: puerto interno de loopback, por defecto4329; proxy del mismo origen reserva
  `/admin` y `/api/admin`, sin fallback a archivos estáticos privados. XFF arbitrario no es confiable;
  esta referencia aplica límites por conexión de socket y globales. Calificar el efecto del proxy en P02.
- `PRIVA_ADMIN_MAIL_ADAPTER`: módulo absoluto privado del operador que exporta `mailAdapter` con
  `idempotent:boolean` y `send({deliveryId,to,resetURL},signal)→accepted|rejected|unknown`.
  Debe declarar idempotencia real y no asumir que aceptación prueba recepción.
- Claves separadas admin-csrf/admin-abuse/admin-mail-v1, generadas por runtime en archivos privados.
  Calificar rotación/custodia/copias con P02: drenar/expirar sobres≤15min y reiniciar de forma coordinada;
  solapamiento versionado solo con keyring del operador y mientras haya sobres vigentes. Sin claves
  antiguas persistentes innecesarias. La gestión productiva del keyring no se certifica por tests locales.

Requiere revisión exacta de copy/marca/recursos, avisos, política009 de cuentas/sesiones/registros/copias,
responsable/procedimiento de provisión, proveedor/remitente/buzón controlado, almacenamiento/TLS/proxy,
cookies/CSRF, capacidad hash/cola/abuso/tiempos. No heredar90d de Contacto ni inventar esas aprobaciones.
Los bindings de producción/integración no estaban presentes al comprobar sus nombres, sin revelar valores.

Integración necesita `PRIVA_INTEGRATION_BASE_URL` HTTPS real y
`PRIVA_ADMIN_INTEGRATION_ADAPTER` absoluto que exporte `integrationAdapter`:
`prepare()→{accounts:[{email,password},{email,password}]}`, `readMailbox(email)→{resetURL}|null`,
`verifySessionRevoked(email)→boolean`, `cleanup()`. Provisión/lectura del buzón/verificación permanecen
privadas en el runner, sin endpoints de pruebas ni cuentas de terceros. cleanup debe respetar P02/009.

```bash
npm run test:e2e:admin:integration
```

Sin origen/adaptadores reales falla explícitamente antes de usar fixtures. La suite espera correo
realmente recibido y comprueba reset, proof usado, clave vieja/nueva y cierre; todavía NO se ejecutó
contra un entorno real. El doble local no acredita recepción productiva.

Firefox/WebKit: binarios encontrados en `/workspace/.cache/ms-playwright`; smoke falló al arrancar.
Firefox: perfil inaccesible incluso al cambiar TMPDIR a workspace. WebKit: bibliotecas del sistema
faltantes. Descarga por APT del repositorio configurado recibió403 del proxy; no se instaló ni se
retiraron verificaciones para aprobar. Volver a ejecutar cuando el entorno tenga esos prerrequisitos.

Regresión afectada: `test:e2e:contract` y `test:e2e:contact:contract` con Chromium del sistema, más
Node de002–005; resultados en evidence.md. Los fallos de build/recurso/navegador son bloqueos abiertos.
