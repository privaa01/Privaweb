# Evidencia de implementación — 006

Fecha: 2026-10-19 (America/Bogota). AD01/AD02, US1–US4, SC-001–007.
**58/63 tareas verificadas localmente; T058–T062 abiertas.** No aceptación productiva ni despliegue.

## Inventario, entorno y límites

- Capturas de login/consola recibidas como referencia estructural. Usuario→Correo y comunidad→Contacto privado;
  no se copian estadísticas, avatar/cuenta ficticia, editor007 ni bandeja008.
- Recursos oficiales/logo, fuente/paleta exactas, revisión de copy/alternativas/fidelidad y lector manual: pendientes011.
- P02: responsable/procedimiento de provisión, proveedor/adaptador, remitente, buzón controlado, origenHTTPS/proxy,
  capacidad y políticas operativas: pendientes. No se eligió proveedor ni se crearon cuentas productivas.
- 009/010: políticas de cuentas/sesiones/registros/copias y avisos pendientes; no heredar90d de Contacto.
- Baseline Git: main, ed06213; documentación de tareas/correcciones preexistente preservada. Sin commit/push.
- Node24.19.0, Astro7.4.0, TS5.9.3, Playwright1.64.1, axe4.14.0. SQLite nativo experimental, archivo real local.
  Dependencias/lock conservados, sin paquetes nuevos. Prettier ya instalado se usó solo para formatear archivos nuevos.
- Chromium del sistema `/usr/bin/chromium`. Bancos UI Python4328 y servicio Node4329, roots/archivos aislados.
  Node usa directorios temporales y reloj privado; no flags ni endpoints HTTP de fallos/control/provisión/buzón.
- Se comprobaron nombres/presencia de bindings sin imprimir valores: no estaban configurados los de producción/
  integración006. No se solicitó ni guardó una credencial, no se envió correo a terceros.
- Instrucciones `start_skill` guardadas en el borrador del entorno; requieren revisar/guardar y publicar la
  configuración del entorno para reutilización futura. El guardado no aplica cambios de runtime ni despliega el sitio.

## Resultados comprobados

Todos los resultados siguientes son del 19 de octubre de2026. Los reportes generados se conservan localmente,
ignorados por Git; este documento registra el resultado saneado. No incluye passwords, tokens, CSRF, cookies,
resetURL, direcciones reales ni contenido de correo.

| Comprobación | Resultado | Evidencia local |
|---|---|---|
| `check:admin:service` | PASS, TypeScript estricto/noEmit, backend/shared/tests/wrappers | `.test-output/admin-service-check.log` |
| `check:admin:contract` | PASS, 0 errores/warnings/hints | `.test-output/admin-contract-check.log` |
| `check` público | PASS, 0 errores/warnings/hints | `.test-output/admin-root-check.log` |
| `check:contact:service` | PASS, servicio005 preservado | `.test-output/admin-contact-check.log` |
| `test:admin` | 39 PASS, 0 fail/skipped, incluida frontera Unicode, callbacks síncronos y rechazo de symlinks con destino inexistente | `.test-output/admin-node-run.log`, `admin-email-boundary.log` |
| UI Chromium/API mock | 28 PASS en suite completa; complemento final7 PASS incluye dos casos nuevos (correo Unicode y contraste no textual), cinco repetidos: 30 casos únicos | `.test-output/admin-results.json`, `admin-browser-smoke-results.json`, `admin-access-final.log` |
| Servicio real Chromium/SQLite/worker y buzón doble privados | 8 PASS, 0 fail/skipped | `.test-output/admin-service-results.json`, `admin-browser-service-run.log` |
| Build fixture y vistas privadas | PASS por arranque de bancos; seis vistas en `.private-build/admin`, fuera de dist/public | logs de bancos y `build:admin:views:local` |
| Node de002–005 | 181 PASS, 0 fail/skipped | `.test-output/admin-regression-node.log` |
| Navegación001 Chromium | 45 PASS, 0 fail/skipped | `.test-output/contract-results.json`, `admin-regression-navigation.log` |
| Contacto005 Chromium | 39 PASS, 0 fail/skipped | `.test-output/contact-results.json`, `admin-regression-contact.log` |
| Publicación/startup006 sin calificación | Rechazo esperado, antes de abrir runtime o sembrar cuentas | `tests/admin-publication.test.ts`, `tests/admin-runtime.test.ts`, `admin-publication-gate.log` |
| `npm run build` | BLOQUEADO por gate002 preexistente; gates001–005 conservados y006 agregado | `.test-output/admin-delivery-build.log` |
| `test:e2e:admin:integration` | BLOQUEADO006 por falta de origen real; sin fallback ni prueba de operación ejecutada | `.test-output/admin-integration-blocked.log` |
| Firefox/WebKit smoke | Arranque fallido, comportamiento NO verificado | `.test-output/admin-browser-smoke.log`, `admin-firefox-profile-check.log` |

**77 casos únicos de006 aprobados** (39 Node +30 UI +8 servicio) y **265 regresiones aprobadas**.
Las repeticiones focalizadas no se suman como casos nuevos. Un fallo de arranque o gate no es una prueba
funcional aprobada ni un skip. No se certifica el entorno completo por disponer de Chromium.

## Cobertura por historia y criterio

| Historia/criterio | Pruebas/código y resultado local | Límite de aceptación |
|---|---|---|
| US1.1–6 / SC-001 | Validación/codepoints/Unicode, scrypt/dummy/cola, identidad del servidor, cookies/CSRF, error genérico, doble envío/teclado, destino fijo/admin y retorno externo ignorado, éxito viejo descartado, respuesta perdida correlacionada | Recursos/copy y provisión/calificación reales pendientes |
| US2.1–6 / SC-002 | Dos cuentas con igual permiso; guard antes de HTML y lecturas/escrituras sintéticas en la misma transacción/conexión. Estado ausente/alterado/expirado/revocado/versión vieja denegado; traversal/alias/.html no abren rutas. Ocultación/limpieza al navegar y rechazo de identidad tardía | Integración de funciones007/008 no implementada por006; autorización local no certifica adaptadores remotos |
| US3.1–4 / SC-003 | Cierre durable, replay rechazado, idempotencia/ausencia, falloDB503 sin afirmar cierre, red perdida antes/después del commit, retry explícito, DOM oculto/identidad vacía, historial/tabs, operación posterior no modifica. Sesión conservada tras reiniciar proceso Node sin resembrar | TLS/proxy/capacidad/operación productiva pendientes; no promesa de borrar memoria o capturas previas |
| US4.1–7 / SC-004 | 202 condicional igual para elegible/desconocida/desautorizada/límite de identidad/fallo selectivo; proveedor fuera del request. 20 muestras por clase, HMAC/TTL sin email/IP crudos, buzón doble por proceso privado | No se recibió correo en buzón real: SC-004 integral sigue abierto |
| US4 / SC-005 | GET no consume; proof15min/un uso/digest, AAD/keyVersion/corrupción, lease/retry/expiry y aceptación desconocida sin reenvío ciego; dos procesos compiten por reset y solo uno cambia; rollback antes de commit, mail tardío no reactiva proof. Cambio invalida credenciales/sesiones/proofs, no autologin, otra cuenta de contexto CSRF no afectada. Respuesta real perdida tras reset no reenvía clave | Prueba productiva y calificación de keyring/copias pendientes |
| SC-006 | 14 combinaciones360/390/430/768/1024/1280/1440×texto100/200 antes de carga, escenas acceso/recuperación/reset/panel/cierre unknown, axe WCAG A/AA, labels/feedback/foco/teclado, controles≥44px y sin overflow. Contraste no textual de borde/controles/foco≥3 calculado sobre estilos renderizados; texto con axe. Sin JS envío inactivo/POST; bundle sin fs/sqlite/crypto/claves/storage de credenciales | Firefox/WebKit, lector manual y fidelidad con recursos oficiales pendientes |
| SC-007 | Tareas/spec/plan/contratos/guía/matriz/evidencia sincronizados; gates niegan fixtures/revisión desactualizada y dependencias no calificadas | No cierre AD01/AD02, CT01, política009 ni catálogo histórico ausente |

Fuentes de pruebas: `tests/admin-{validation,password,repository,session,http,recovery,runtime,publication}.test.ts`
y `tests/e2e/admin-{access,session,recovery,accessibility,service}.spec.ts`. El archivo
`admin-integration.spec.ts` implementa el contrato futuro de operador/buzón real, pero está bloqueado.
No se inventan IDs HU/CA/TSK del catálogo07 ausente.

## Políticas efectivas y mediciones locales

- Correo trim/1–254 puntos de código, emailKey minúscula sin alterar puntos/+; frontend sin maxlength UTF16
  que trunque una dirección válida. Login valida estructura sin consultar cuenta para formato.
- Password nueva15–128 puntos de código, espacios/Unicode preservados, controles y surrogates aislados rechazados.
  Lista `priva-common-v1` con ejemplos originales CC0; no lista exhaustiva de filtraciones ni revisión P02 acreditada.
- Scrypt-v1 N131072/r8/p1/salt16/hash64/maxmem192MiB; comparación constante/dummy, cola2+8. Benchmark aislado
  de4 hashes: 748ms totales, maxRSS311756KiB, heap9MiB. `.test-output/admin-hash-benchmark.json`.
  Muestra local, sin TPS/SLA ni inferencia de capacidad productiva; no se redujo coste para aprobar.
- Sesión opaca32B con solo SHA256 persistido; preauth5min, inactividad30min/absoluto8h, igualdad de vencimiento
  inválida. Consultas de sesión/contexto no renuevan; vencimiento oculta sin polling. Cookie __Host Secure/HttpOnly/
  SameSiteStrict/Path=/sin Domain y CSRF HMAC con clave separada. Chromium comprobó mismos atributos en localhost.
- API POST JSONUTF8≤8KiB/Origin exacto/header no simple/CSRF; lecturas no simples, sin CORS amplio; no-store/
  no-referrer/nosniff/CSP self/frame-ancestorsnone/base-urinone/form-actionself. Servidor30s/cliente10s.
- Rate fijo15min: login5/email,30/conexión,300global; recuperación3/email,10/conexión,100global;
  reset5/proof,30/conexión,100global; emisión contexto60/conexión,300global. HMAC y purga efímera, sin locks permanentes.
- Temporización de recuperación,20 muestras alternadas por clase en último `test:admin` completo:

| Clase sintética | Mediana(ms) | p95(ms) | Mínimo(ms) |
|---|---:|---:|---:|
| Elegible | 288 | 305 | 253 |
| Desconocida | 275 | 302 | 255 |
| Desautorizada | 264 | 301 | 254 |
| Fallo de worker | 283 | 301 | 259 |

Diferencia máxima de medianas24ms≤50 y de p95 4ms≤100; todos los mínimos≥250ms. El jitter0–50ms es
independiente de identidad. Carga: fixture aislado/solicitudes secuenciales alternadas, junto al resto de suites Node del runner; no benchmark bajo toda carga ni garantía criptográfica de tiempo constante.
Counters se reiniciaron por proceso privado antes de cada muestra, nunca mediante HTTP ni relajando límites.
Provider falla fuera del request, mediante doble privado. El cuerpo/status/headers estables de las cuatro clases coincidió; Date/Connection/Keep-Alive de transporte no se comparan literalmente. p50/p95 por rango próximo.

- Reset15min, hash fuera del lock y autorización/versión/proof revalidados al final; cambio y revocación atómicos.
  Sobres AES256GCM/nonce12/tag16/AAD job+cuenta+versión, keyVersion, claves fuera deDB; retiro de keyring viejo
  cuando no hay sobres vigentes, sin extender TTL. Worker lease60s/3 intentos/30s–120s/timeout10s/deliveryId estable;
  no retry ambiguo sin deduplicación real. Noop/envelope se eliminan al finalizar/expirar; metadatos mínimos≤24h.
- Purga no modifica datos de Contacto ni aplica su plazo a cuentas. Custodia/copias/políticas productivas siguen009/P02.
- Rotación/keyring local se probó con versiones solapadas y retiro por vencimiento. La producción requiere procedimiento
  de operador coordinado y calificado; no se certifica rotación/custodia real por pasar esos tests.

## Hallazgos corregidos durante implementación

- Rojo inicial de validación observado (3 casos) antes de las reglas; después verde. Algunas pruebas de fundamentos
  se añadieron junto con el código: no se afirma un rojo previo documentado para cada regla de la feature.
- Corregidos tipos incompatibles con strip-only/target del servicio antes de cerrar los checks.
- Matriz inicial detectó ausencia de encabezado al ocultar panel; se añadió encabezado de estado y se corrigió
  el selector de prueba para distinguir encabezados visibles. Matriz final aprobada sin desactivar reglas axe.
- Enlace de reset nuevo por fragmento sobre la misma página se captura en hashchange y se retira antes de API;
  no se conserva un token consumido/ausente ni se reenvía password ante unknown.
- Snapshots de error podían incluir texto introducido incluso con traces off; se desactivaron también mediante
  PLAYWRIGHT_NO_COPY_PROMPT. Reportes de runs anteriores fueron reemplazados al ejecutar bancos limpios.
- Verificación de sesión a su deadline solo oculta y pide volver a verificar; no crea un ciclo de polling/renovación.
- Proyectos de navegador006 separados de config005 para evitar que una dependencia ajena oculte el bloqueo006.
- Retorno seguro y diferencias de mediana/p95 corregidos antes de implementar; pruebas correspondientes aprobadas.
- Guard interno restringido a callbacks síncronos por tipos y runtime, antes de ejecutarlos; una operación async
  no puede quedar programada tras terminar la transacción. Prueba de rechazo y check estricto aprobados.
- Prueba adicional observó rojo real para symlink SQLite con destino inexistente: existsSync seguía el enlace
  y no detectaba el alias. Se cambió a lstat antes de abrir DB/WAL/SHM; la suite final39 PASS comprueba que
  no se crea el destino. Ningún archivo privado se publicó durante la prueba; todo quedó en directorios temporales.

## Bloqueos que conservan tarea abierta

| Tarea | Estado y acción necesaria |
|---|---|
| T058 | Chromium verificado; Firefox falla `Could not find profile folder` con TMPDIR predeterminado y también bajo workspace. WebKit carece de libgtk-4, libgraphene, libharfbuzz-icu, libmanette, libhyphen y libGLESv2. APT con metadata/firma/TLS preservados hacia snapshot.debian.org recibió403 del proxy; no se instaló nada ni se desactivó seguridad. Reparar esos prerrequisitos y ejecutar ambas suites con Firefox/WebKit. |
| T059 | Faltan archivos oficiales, revisión exacta de copy/alternativas/identidad, comparación visual y lector de pantalla manual. No sustituirlos con un logo inventado o marcar fidelidad por aprobar axe. |
| T060 | Calificar responsable/provisión, proveedor/adaptador/remitente/buzón, origenHTTPS/proxy/conexión confiable, almacenamiento/claves/copias/rotación, capacidad/denylist/abuso/tiempos y políticas009/avisos010. Suministrar valores solo por configuración segura, no por chat. |
| T061 | Falta PRIVA_INTEGRATION_BASE_URL HTTPS y adaptador privado autorizado de provisión/verificación/buzón. Ejecutar flujo con cuenta sintética controlada y comprobar recepción real; no usar terceros ni atribuir recepción al doble/aceptación del proveedor. |
| T062 | Checks/regresión local aprobados; build final sigue bloqueado en002 y gate006 independiente también rechaza revisión/recursos/operación pendientes. Ejecutar entrega cuando se cumplan gates sin retirarlos. |

La lectura/revisión de checklist de requisitos fue16/16 PASS, sin modificar sus casillas ni atribuirles implementación.
No hay `.specify/extensions.yml`: hooks before/after no registrados. Sin commit, push ni despliegue automático.
