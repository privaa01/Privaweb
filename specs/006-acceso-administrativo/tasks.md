# Tasks: Acceso individual y sesiones administrativas

**Feature**: `006-acceso-administrativo` | **Rama real**: `main` | **Fecha**: 2026-10-19
**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md),
[data-model.md](data-model.md), [contratos](contracts/admin-access.md), [quickstart.md](quickstart.md)
y [constitución](../../.specify/memory/constitution.md).
**Estado**: 58/63 tareas verificadas localmente; T058–T062 abiertas por dependencias externas y build de entrega. Ver [evidencia](evidence.md).
**Tests**: requeridos por los escenarios y SC-001–SC-007. Escribir las pruebas de comportamiento
antes de implementar cada regla y observar el fallo pertinente; no llamar prueba de negocio a
un error de importación/infraestructura. Registrar ejecución/evidencia después de verificar.

## Formato y límites

`- [ ] Tnnn [P opcional] [USn en fases de historia] Acción con rutas concretas`.
IDs T001–T063 locales, sin inventar HU/CA/TSK del catálogo histórico ausente. `[P]` indica archivos
independientes después de los prerrequisitos; no concurrencia sobre el mismo archivo, root de build,
base o servicio. Las casillas reflejan trabajo verificado; las dependencias externas conservan casilla abierta. Rutas relativas a raíz del repositorio.

No añadir paquetes, proveedor, cuentas iniciales, registro, roles, MFA, interfaz de gestión de cuentas,
editor 007 o bandeja 008 por defecto. Configuración desconocida sigue pendiente. El servicio de
Contacto 005 conserva su contrato público; ninguna prueba expone una lectura privada como ruta demo.
UI mock, servicio real local y operación productiva son evidencias diferentes.

## Fase 1 — Preparación compartida

**Objetivo**: bancos y herramientas separados de 001–005, sin abrir administración productiva.

- [X] T001 Crear `specs/006-acceso-administrativo/evidence.md` con inventario recibido/pendiente/revisado de marca/copy/capturas, P02 provisión/correo/origen/adaptadores, políticas 009 y avisos 010; registrar baseline Git/runtime y bloqueos de navegadores conocidos, sin credenciales ni aprobaciones inventadas.
- [X] T002 Preparar `tests/fixtures/admin/astro.config.mjs`, `tests/fixtures/admin/tsconfig.json`, `tests/fixtures/admin/src/content.ts` y páginas bajo `tests/fixtures/admin/src/pages/`, con recursos sintéticos en `tests/fixtures/admin/public/`; compilar componentes reales cuando existan, salida `.test-output/admin`/`admin-cache`, sin contenido privado real ni asumir que la página ficticia de 001 autentica.
- [X] T003 Configurar `playwright.admin.config.ts`, `playwright.admin.service.config.ts`, `playwright.admin.projects.ts` y scripts `test:admin`, `check:admin:contract`, `build:admin:contract`, `test:e2e:admin:contract`, `test:e2e:admin:service`, `test:e2e:admin:integration` en `package.json`; UI Python4328 vs Node4329, artefactos/reportes separados de quickstart, integración sin fallback y URL real obligatoria; desactivar trazas que capturen passwords/cookies/CSRF/resetURL o sanearlas antes de persistir, enmascarar capturas sensibles y no alterar scripts previos.
- [X] T004 Configurar `server/admin/tsconfig.json` estricto/noEmit y `check:admin:service` en `package.json` incluyendo backend, módulos compartidos y wrappers de prueba; conservar compatibilidad frontend y Node24 para servicio; asegurar `.gitignore` para `.private-build/`, DB/key/WAL/SHM/sobres/salidas, sin modificar lockfile ni instalar dependencias nuevas.

## Fase 2 — Fundamentos

**Prerrequisito**: T001–T004. Completar antes de implementar historias.
**Objetivo**: tipos, validación, persistencia y hash verificables, sin sesiones falsas.

- [X] T005 Definir DTOs/errores/estados en `src/lib/admin-contract.ts` y contenido/config tipados en `src/content/admin.ts`/`src/config/admin.ts`: estados de login/sesión/logout/recuperación/reset del modelo, AdminContent/AdminReadiness con revisión ligada al texto exacto, recursos/referencias/`testOnly` y dependencias operativas; valores reales desconocidos permanecen pendientes, sin claves o ruta privada en bundle.
- [X] T006 [P] Escribir `tests/admin-validation.test.ts` para correo trim/formato/1–254 puntos de código y emailKey único minúsculo sin quitar puntos/+; contraseña 14/15/128/129 puntos, espacios/Unicode preservados, controles/surrogates aislados y prohibición de truncar/normalizar; distinguir política de contraseña nueva y validación estructural del login, sin consultar existencia de cuenta para errores de formato.
- [X] T007 Implementar validadores puros compartidos en `src/lib/admin-validation.ts`: correo coherente con 005 y `email.toLowerCase()` para identidad; contraseña nueva de 15–128 puntos, Unicode bien formado sin U+0000–001F/U+007F y validación común por regla inyectada para lista versionada (carga/aplicación autoritativa en servidor T011); nunca trim/normalización/truncamiento de contraseña ni DNS/identidad legal; pasar T006 y mostrar reglas antes de pedir contraseña nueva.
- [X] T008 [P] Escribir en `tests/admin-repository.test.ts` y `tests/admin-http.test.ts` pruebas iniciales de archivo/reinicio, restricciones de cuentas, PRAGMA/permisos/rutas/symlinks y cuerpo JSON/origen/headers/no-store/CSP del contrato C2; fallos inyectados solo por proceso, nunca endpoint público; preparar inspección autorizada de DB sin imprimir secretos.
- [X] T009 Implementar `server/admin/runtime.ts`, `server/admin/repository.ts` y base de `server/admin/sqlite-repository.ts`: AdminAccount id «ID aleatorio estable del servidor; clave primaria», email «string recortado, 1–254 puntos de código, formato compartido con 005; dirección usada para envío», emailKey «email.toLowerCase(); único; no quitar puntos ni sufijos + ni aplicar reglas de proveedor», authorized «boolean; false impide login, sesión y recuperación efectiva», passwordRecord «null durante activación inicial; en otro caso registro scrypt protegido descrito abajo», credentialVersion «entero >=1; aumenta en reset y cambios operativos de autorización», mailboxVerifiedAt «null hasta completar comprobación recibida por correo; UTC después de completarla», createdAt/updatedAt «UTC; no son actividad de Contacto», permission «único valor lógico administrador; no colección de roles ni permiso editor»; WAL/FULL/FK/busy_timeout=5000 comprobados por conexión, BEGIN IMMEDIATE/SQL parametrizado, directorio0700/archivos0600 incluidos sidecars fuera de staticroot/Git; pasar casos de T008 y permitir cuenta sintética solo por helper privado de prueba.
- [X] T010 [P] Escribir `tests/admin-password.test.ts` para salt/versión/parámetros/comparación, rechazo de registros inválidos, hash dummy equivalente, límite de dos trabajos activos y ocho en cola, saturación independiente de identidad y ausencia de bloqueo síncrono del event loop; prever medición saneada de memoria/latencia sin convertirla en SLA.
- [X] T011 Implementar `server/admin/password.ts` y `server/admin/password-denylist.txt`: PasswordRecord «version='scrypt-v1'; salt=16 bytes aleatorios; hash=64 bytes; N=131072,r=8,p=1,maxmem=192 MiB», scrypt asíncrono/timingSafeEqual, cola2+8, sin degradar coste silenciosamente ni hash rápido/contraseña en claro; versionar fuente/licencia/revisión de la lista local sin API externa y aplicar su rechazo en la validación del servidor sin importar fs al módulo de cliente, pasar T010 y medir coste/memoria local en `specs/006-acceso-administrativo/evidence.md`, separándolo de calificación P02.
- [X] T012 Implementar frontera HTTP base en `server/admin/http.ts`: JSON UTF8 <=8KiB, POST mutadores/Origin exacto/X-Priva-Request:1/Fetch Metadata, respuestas no-store/no-referrer/nosniff/CSP self/frame-ancestors none/base-uri none/form-action self según C2, timeout servidor30s y errores genéricos saneados; lecturas API no simples sin CORS amplio y sin alta/debug/SQL/fallos públicos; pasar pruebas aplicables de T008 antes de añadir endpoints por historia.

**Checkpoint**: reglas y almacenamiento privado reales, sin proveedor o correo productivo configurados.

## Fase 3 — US1: Iniciar sesión individual (P1; MVP de acceso)

**Objetivo**: correo/contraseña autorizados crean sesión real y ningún fallo confirma acceso ficticio.
**Prueba independiente**: helper privado crea cuenta sintética autorizada; login y GET de sesión
comprueban identidad real, rechazo, error y persistencia. El MVP no acredita panel 007/008 ni producción.

### Pruebas primero

- [X] T013 [P] [US1] Escribir en `tests/admin-session.test.ts` y ampliar `tests/admin-http.test.ts` los contratos contexto/acceso/sesión: cookies/CSRF, expiración5min/30min/8h, hash dummy, cuenta ausente/no autorizada/no verificada, rotación/reinicio, rate limits y carrera hash frente a versión/autorización cambiada; éxito solo después de commit, sin guardar bearer crudo ni devolverlo en JSON.
- [X] T014 [P] [US1] Escribir `tests/e2e/admin-access.spec.ts` para US1.1–6 con mocks explícitos: /admin/login/footer, Correo reemplaza Usuario, Bienvenido de nuevo, labels/errores/toggle/gestor/pegado, doble Enter/click, login fallido/desconocido/timeout y callback viejo; sesión previa de otra cuenta no confirma el intento vigente, sin registro ni identidad demo; verificar navegación fija a /admin del mismo origen y que returnTo/next/redirect externos, relativos al protocolo o codificados desde URL/formulario/respuesta API se ignoran sin ejecutar acciones pendientes.

### Implementación

- [X] T015 [US1] Crear sesiones en `server/admin/sessions.ts`/`server/admin/sqlite-repository.ts`: tokenDigest «SHA256 del token canónico completo, único; el bearer crudo no se persiste», accountId «FK a cuenta; ninguna sesión anónima sirve de permiso», credentialVersion «versión observada al crear; debe coincidir en cada operación», createdAt/absoluteExpiresAt «UTC; absoluteExpiresAt=createdAt+8 horas», lastActivityAt/idleExpiresAt «UTC; idleExpiresAt=min(lastActivityAt+30 minutos, absoluteExpiresAt)», revokedAt «UTC nullable; no volver de revocada/expirada a vigente»; validez exige cuenta autorizada/verificada/credencial presente/versiones iguales y now<ambos límites; estado/contexto/heartbeat no renuevan actividad; purgar inválidas <=24h y pasar pruebas de T013.
- [X] T016 [US1] Implementar cookie/contexto/CSRF en `server/admin/sessions.ts` y rutas contexto/sesión en `server/admin/http.ts`: __Host-priva_session Secure/HttpOnly/SameSite=Strict/Path=/ sin Domain/Max-Age absoluto restante; __Host-priva_preauth equivalente de5min sin permisos, solo digest persistido; HMAC-SHA256 de tipo+digest con clave privada para CSRF y comparación constante; contexto usa sesión vigente o reutiliza preauth, creación limitada60/conexión y300 globales/15min; no JSON de bearer, cache ni renovación privada por consultar estado.
- [X] T017 [US1] Implementar login en `server/admin/service.ts` y `server/admin/sqlite-repository.ts`: hash real o dummy con coste equivalente, límites login5/emailKey,30/conexión y300 globales/15min, HMAC/bucket/windowEnd sin correo desconocido/IP cruda y purga al vencer; límites globales/cola antes de lookup, conexión de proxy confiable sin aceptar XFF arbitrario; revalidar cuenta/versión después de hash en transacción, rotar acceso/revocar sesión previa del navegador y emitir cookie/acuse solo tras commit, manteniendo otras sesiones independientes; respuestas de C3 sin enumeración ni bloqueo permanente.
- [X] T018 [US1] Crear `src/components/admin/AdminLogin.astro` con composición de captura, Correo/Contraseña requeridos y labels visibles, toggle accesible no submit, Entrar/carga/error/recuperación, política/feedback correspondiente; contenido sin JS informa y envío inactivo, POST explícito sin GET con credenciales, sin bloquear gestores/pegado ni añadir registro público.
- [X] T019 [US1] Implementar `src/scripts/admin-login.ts`: validación compartida, obtener contexto, submit único, timeout10s y generación/secuencia para descartar respuestas antiguas; ante resultado desconocido consultar sesión real y correlacionar emailKey del intento sin tratar correo del formulario como autorización; no reenvío automático de contraseña, no storage/log/URL ni éxito por sesión vieja de otra cuenta; tras confirmar acceso navegar exclusivamente a /admin del mismo origen, ignorar destinos de retorno de URL/formulario/API y no ejecutar acciones pendientes; pasar T014.
- [X] T020 [US1] Preparar root privado `server/admin/views/astro.config.mjs`, `server/admin/views/tsconfig.json` y `server/admin/views/src/pages/login.astro`, reutilizando componentes/tipos reales; base/admin y salida `.private-build/admin` fuera de public/dist, mapa Node /admin/login al fichero interno/login.html, assets propios por whitelist y ningún fallback privado; login del fixture001 sigue siendo solo referencia de navegación.
- [X] T021 [US1] Crear `tests/fixtures/admin-service/serve.ts` y helper de cuentas bajo `tests/fixtures/admin-service/writer.ts`: servicio/SQLite reales, vistas compiladas compartidas, datos/claves en `.test-output/admin-service-data` fuera del staticroot, procesos/puertos aislados y fallos por DI privada; no rutas de alta/lectura SQL/demo en el servidor de producción ni flag que siembre usuarios al arrancar.
- [X] T022 [US1] Escribir antes de conectar y ejecutar los casos de acceso en `tests/e2e/admin-service.spec.ts`: cuenta sintética real, login válido/rechazado, doble envío, sesión/identidad contrastadas por proceso privado, respuesta perdida y reinicio; comprobar destino fijo /admin del mismo origen incluso ante returnTo/next/redirect externos, relativos al protocolo o codificados, sin modificaciones ni replay de acciones por navegar; comprobar mismos atributos Secure de producción en loopback o TLS local confiable, sin quitar Secure/validación TLS para aprobar.
- [X] T023 [US1] Ejecutar pruebas de T006/T008/T010/T013/T014/T022, check del servicio y check/build del fixture según `specs/006-acceso-administrativo/quickstart.md`; registrar hash/cola/memoria, cookies sin sus valores, rechazo de origen/CSRF y persistencia local en `specs/006-acceso-administrativo/evidence.md`, distinguiendo mocks de servicio real.
- [X] T024 [US1] Documentar en `specs/006-acceso-administrativo/evidence.md` y actualizar guía local `specs/006-acceso-administrativo/quickstart.md` con MVP de acceso comprobado, políticas efectivas y pendientes; no cerrar AD01 por existir login si salida/recuperación o calificación real siguen incompletas.

## Fase 4 — US2: Permisos iguales y protección por operación (P1)

**Objetivo**: panel y navegación privados con igual permiso y autorización antes de revelar/cambiar datos.
**Prueba independiente**: dos cuentas autorizadas en contextos distintos y matriz de sesiones no
vigentes, con lectura/cambio sintéticos dentro del mismo contexto transaccional. No construir 007/008.

### Pruebas primero

- [X] T025 [P] [US2] Ampliar `tests/admin-repository.test.ts` y `tests/admin-http.test.ts` para C1/C4: dos cuentas con mismos permisos; sesión ausente/manipulada/expirada/cerrada, cuenta revocada o versión vieja niegan HTML/lectura/cambio antes de datos/efectos; alias .html/traversal/private-build/recursos no eluden guard; operación sintética solo inyectada por proceso, no endpoint demo real.
- [X] T026 [P] [US2] Escribir `tests/e2e/admin-session.spec.ts` para US2.1–6: shell inicialmente oculto/sin identidad, navegación Historias/Contacto, cuenta del servidor, expiración en pantalla, cambio de cuenta, pagehide/visible/pageshow/historial y callbacks viejos; no datos privados persistentes ni contadores o perfiles de muestra.

### Implementación

- [X] T027 [US2] Implementar withAuthorizedTransaction y guard en `server/admin/repository.ts`/`server/admin/sqlite-repository.ts`: comprobar cuenta/sesión/vigencia/versión y leer/cambiar dentro de la misma transacción/conexión; no check separado de write ni cruzar archivos sin coordinación equivalente probada; errores no entregan datos ni producen cambios, actualizar actividad solo por operación válida y pasar T025.
- [X] T028 [US2] Completar router privado en `server/admin/http.ts` para /admin,/admin/historias,/admin/contacto, antes de servir templates de `.private-build/admin`; tabla exacta, guard/no-store y manejo canónico de alias sin acceso directo a ficheros/secretos; bloquear ausencia/invalidez de sesión antes de HTML y nunca redirigir después de revelar datos; rutas futuras 007/008 heredan misma protección.
- [X] T029 [US2] Crear `src/components/admin/AdminShell.astro`, `src/components/admin/AdminNavigation.astro`, `src/styles/admin.css` y páginas privadas `server/admin/views/src/pages/panel.astro`, `server/admin/views/src/pages/historias.astro`, `server/admin/views/src/pages/contacto.astro`; templates sin identidad/datos privados compilados, navegación legible Historias/bandeja Contacto/cierre, un permiso; slots pendientes 007/008 identificados, sin inventar filas, comentarios públicos o estadísticas.
- [X] T030 [US2] Implementar `src/scripts/admin-session.ts` con hidden/checking/authorized y datos desde sesión/operación realmente autorizada: ocultar/vaciar en pagehide/hidden o rechazo, revalidar pageshow/visible sin heartbeat que renueve inactividad, BroadcastChannel solo invalidación sin PII/token; generaciones impiden reinsertar identidad/datos viejos, cambio de cuenta limpia otras pestañas y no hay almacenamiento de secretos ni replay automático de acciones.
- [X] T031 [US2] Ampliar y ejecutar `tests/e2e/admin-service.spec.ts` con dos contextos/cuentas y recursos privados reales de prueba, comparar mismos permisos y no exposición por acceso directo, DOM/historial y expiración; contrastar resultados por proceso privado sin API mock, sin endpoint de lectura pública ni reclamar bandeja/editor implementados.
- [X] T032 [US2] Añadir en `tests/admin-repository.test.ts` con `tests/fixtures/admin-service/writer.ts` pruebas de conexiones/procesos independientes que compiten autorización retirada/versiones/cambios privados; demostrar orden transaccional, rechazo de operaciones posteriores y no modificación de datos de Contacto/actividad fuera del alcance de la prueba.
- [X] T033 [US2] Ejecutar matriz de autorización Node/browser de US2 y registrar por ruta/lectura/cambio y estado de cuenta/sesión en `specs/006-acceso-administrativo/evidence.md`; separar cobertura del guard de integración completa de futuros módulos007/008 y conservar bloqueo de calificación productiva.

## Fase 5 — US3: Cerrar este acceso (P2)

**Objetivo**: revocación confirmada real, reintento coherente y contenido local oculto si el resultado es desconocido.
**Prueba independiente**: logout, replay de cookie vieja, recarga/historial/otra pestaña y escritura
concurrente; ningún dato vuelve por fallo o respuesta atrasada. No presupone cierre global de dispositivos.

### Pruebas primero

- [X] T034 [P] [US3] Ampliar `tests/admin-session.test.ts` y `tests/admin-http.test.ts` con salir válido/repetido/ausente/expirado, cookie vieja y carrera logout vs write, fallos antes/después de commit; exigir revocación durable y respuesta idempotente solo si puede confirmarse ausencia, sin éxito ante DB desconocida ni omitir CSRF de una sesión vigente.
- [X] T035 [P] [US3] Ampliar `tests/e2e/admin-session.spec.ts` con US3.1–4: ocultar DOM desde clic, cierre en curso/unknown/retry, historial/varias pestañas/visibility y finally viejo; ninguna ruta ni acción pendiente se reabre automáticamente después del login y no se confunde BroadcastChannel con revocación servidor.

### Implementación

- [X] T036 [US3] Implementar POST /api/admin/salir en `server/admin/service.ts`, `server/admin/sessions.ts` y `server/admin/http.ts`: revocar solo la sesión utilizada en transacción, borrar ambas cookies tras cierre/ausencia confirmados; mantener Origin/JSON/header al faltar sesión y exigir CSRF si sigue vigente; DB/commit desconocido→error genérico sin signed_out, reintento no reabre acceso; pasar T034.
- [X] T037 [US3] Integrar Cerrar sesión en `src/components/admin/AdminNavigation.astro` y `src/scripts/admin-session.ts`: vaciar/ocultar antes de petición, invalidar vistas locales, estados pending/confirmed/unknown con verificar/reintentar sin mostrar datos; no borrar prueba remota por redirección ni afirmar cierre global; respuesta antigua nunca repara otro acceso; pasar T035.
- [X] T038 [US3] Completar pruebas de historial/dos pestañas y GET de estado sin renovación en `tests/e2e/admin-session.spec.ts`, con avance de reloj exclusivamente por proceso privado de prueba; cookies compartidas por pestañas vs contextos de cuentas distintos, invalidación y nueva verificación, no promesa de borrar memoria/capturas ya vistas.
- [X] T039 [US3] Ampliar y ejecutar `tests/e2e/admin-service.spec.ts` con cierre real, replay rechazado, reintento e inyección privada de pérdida de respuesta antes/después de commit; comprobar estado durable y exclusión de cambios posteriores por proceso autorizado, manteniendo otras sesiones independientes si no se reseteó la cuenta.
- [X] T040 [US3] Ejecutar pruebas de US3 y registrar resultados/orden de carreras/estado unknown/efectos de caché en `specs/006-acceso-administrativo/evidence.md`; sesión cerrada en UI sola no cuenta como aceptación de AD01.

## Fase 6 — US4: Recuperación por correo verificado (P2)

**Objetivo**: comprobación de un uso, no enumeración y cambio real que invalida sesiones anteriores.
**Prueba independiente**: localmente servicio/SQLite con doble explícito; cierre integral exige además
proveedor real y correo recibido en buzón controlado (T061). El doble no acredita entrega.

### Pruebas primero

- [X] T041 [P] [US4] Escribir `tests/admin-recovery.test.ts` y ampliar `tests/admin-http.test.ts`: respuestas iguales elegible/desconocida/desautorizada, límites/fallos selectivos vs globales, outbox cifrado/digest-only, GET sin consumo, expiración/uso/alteración/carreras/reset/versión; CSRF preauth o sesión vigente también de otra cuenta no determina identidad recuperada, cuyo permiso proviene únicamente del comprobante válido.
- [X] T042 [P] [US4] Escribir `tests/e2e/admin-recovery.spec.ts` con US4.1–7, mocks identificados para request/worker: destinos, política/errores/202 condicional, fragmento quitado sin query/storage, GET no cambia contraseña, no secretos en mensajes ni inicio automático, fallo/unknown conserva opciones seguras y no reenvía contraseña automáticamente.

### Implementación

- [X] T043 [US4] Añadir PasswordReset/RecoveryJob en `server/admin/repository.ts` y `server/admin/sqlite-repository.ts`: reset tokenDigest «SHA256 del comprobante canónico aleatorio completo, único; no token crudo», accountId/credentialVersion «FK y versión al emitir; autorización/versión se vuelven a comprobar», issuedAt/expiresAt «UTC; expiresAt=issuedAt+15 minutos; no renovar al reintentar correo», consumedAt/invalidatedAt «UTC nullable; cualquiera impide uso posterior»; job con id opaco, accountId/credentialVersion/leaseUntil/deliveryId nullable según estado, tipo real/noop, createdAt/expiresAt/attempts y «estado queued/leased/accepted/failed/expired»; no correo desconocido ni comprobante real en noop, FK/restricciones y purga de registros inválidos/metadatos <=24h.
- [X] T044 [US4] Implementar sobre transitorio en `server/admin/recovery.ts`: AES-256-GCM, nonce12B único por clave, tag16B, keyVersion y AAD jobId/accountId/versión, claves fuera de DB/staticroot/Git separadas de 005; cifrar destino/token/enlace, no guardar secreto crudo en tabla de comprobantes ni logs, borrar sobre al aceptar/expirar y conservar claves viejas solo hasta resolver sobres vigentes <=15min; probar corrupción/AAD/rotación y distinguir dato cifrado temporal de «solo digest».
- [X] T045 [US4] Implementar solicitud de recuperación en `server/admin/recovery.ts`/`server/admin/sqlite-repository.ts`: mismo camino transaccional de job real cifrado o noop, token32B canónico/15min ligado a cuenta/versión; 202/cuerpo/headers condicionales uniformes aun por bucket de identidad y errores selectivos, sin afirmar encolado/envío/entrega; límites3/emailKey,10/conexión,100 globales/15min con HMAC/TTL y conexión confiable, fallos globales/429 independientes antes de lookup; no proveedor dentro del request, aplicar ventana temporal250ms+jitter0–50ms sin declarar tiempo constante; pasar T041.
- [X] T046 [US4] Implementar `server/admin/mail-worker.ts` y MailAdapter en `server/admin/repository.ts`, con doble privado `tests/fixtures/admin-service/mail-double.ts`: leases60s, <=3 intentos/esperas30s–120s/timeout10s y solo antes de expiresAt, deliveryId estable, comprobar cuenta/versión/vigencia antes de enviar; aceptación desconocida sin idempotencia real termina ambiguamente sin reenvío ciego, email en vuelo tardío no autoriza token invalidado, borrar sobre al finalizar/expirar; demostrar reinicio/contención y no llamar recepción al resultado del adaptador.
- [X] T047 [US4] Implementar reset atómico en `server/admin/recovery.ts`/`server/admin/sqlite-repository.ts`: token32B canónico válido ligado a cuenta autorizada/versión, hash nuevo calculado fuera y revalidación dentro de transacción; cambiar hash/verificación de buzón/incrementar versión/consumir o invalidar todos los comprobantes pendientes/revocar todas las sesiones de la cuenta en un commit, éxito solo después; no afectar la cuenta ajena del contexto CSRF ni iniciar sesión automáticamente; límites5/digest,30/conexión,100 globales/15min y manejo unknown sin doble consumo.
- [X] T048 [US4] Integrar rutas POST /api/admin/recuperacion y /api/admin/restablecer y documentos públicos correspondientes en `server/admin/http.ts`: C3 status/cuerpos/errores y CSRF preauth o de sesión vigente, sin mutar por GET ni cuenta obtenida del contexto; resetURL usa PRIVA_ADMIN_PUBLIC_ORIGIN HTTPS configurado y fragmento, nunca Host/Forwarded arbitrario; pasar casos HTTP de T041 sin endpoint de correo/secretos de prueba.
- [X] T049 [US4] Crear `src/components/admin/AdminRecovery.astro`, `src/components/admin/AdminReset.astro` y páginas `server/admin/views/src/pages/recuperar.astro`/`restablecer.astro` con política visible, campos/errores/feedback y volver al login; POST/no JS honesto sin fallback GET, destinos reales internos y ningún registro/cuenta demo; integrar mismos componentes en fixture, sin scripts externos.
- [X] T050 [US4] Implementar `src/scripts/admin-recovery.ts` y `src/scripts/admin-reset.ts`: validación común, contexto CSRF correcto, capturar fragmento solo en memoria y history.replaceState antes de peticiones, no consumo en GET ni token en URL/storage/log; respuesta condicional sin prometer correo, generación/timeout/carga, unknown sin éxito ni reenvío automático de password y opciones login/nueva recuperación; pasar T042 y no mostrar secreto en capturas/trazas.
- [X] T051 [US4] Implementar provisión restringida en `server/admin/provision.ts`: crear/habilitar/deshabilitar por operador fuera de HTTP/panel, correo único normalizado, sin password en argv/env demo/salida; creación/rehabilitación dejan passwordRecord/mailboxVerifiedAt=null y requieren flujo de correo para primer acceso, deshabilitar/rehabilitar invalidan versiones/sesiones/tokens en transacción; probar ciclo con helper/mail-double privado, sin inventar responsable/rol o proveedor productivo.
- [X] T052 [US4] Completar y ejecutar `tests/admin-recovery.test.ts`, `tests/admin-repository.test.ts` y `tests/fixtures/admin-service/writer.ts` para dos procesos de reset, reset frente a login calculando hash/revocación/worker, pérdida antes/después de commit, estado viejo y purga; verificar un único cambio, nueva clave funciona/vieja no, sesiones/comprobantes anteriores fallan y un cambio de cuenta no revoca la ajena; secretos no aparecen en DB sin cifrado o evidencias.
- [X] T053 [US4] Ampliar y ejecutar `tests/e2e/admin-service.spec.ts` con recuperación contra SQLite/worker reales y doble de correo leído solo por proceso privado: acceso a link sin consumir, cambio válido, inválido/vencido/usado, sesión previa misma/otra cuenta, repetidos y unknown; sin API mock ni endpoint que devuelva correo/token públicamente, sin certificar entrega productiva.
- [X] T054 [US4] Medir no enumeración en `tests/admin-recovery.test.ts` según C5: 20 muestras alternadas por clase sin superar buckets (lotes/almacenes aislados o reinicio de contadores exclusivamente por proceso autorizado; ninguna bandera HTTP ni cambio de límites productivos), iguales status/body/headers, mínimo250ms+jitter0–50ms independiente de identidad y para cada par de clases A/B (conocida/desconocida/desautorizada/fallo worker), abs(mediana(A)-mediana(B))<=50ms y abs(p95(A)-p95(B))<=100ms, diferencias entre clases y no límites de latencia absoluta, bajo carga registrada; si falla corregir o bloquear calificación, sin ampliar tolerancias ni afirmar seguridad universal por esa medición; registrar resultados saneados en `specs/006-acceso-administrativo/evidence.md`.
- [X] T055 [US4] Ejecutar suite local US4/CLI/worker/reset/UI/banco compuesto y actualizar `specs/006-acceso-administrativo/evidence.md`/`quickstart.md` con resultados, datos efímeros borrados, límites efectivos y dependencia del buzón real T061; mocks/doble/acuse202 no cierran SC-004 ni aceptación integral de correo.

## Fase 7 — Verificación transversal y cierre

**Prerrequisito**: historias aplicables verificadas; avanzar en trabajo independiente aunque falten
recursos/proveedor. Una tarea parcialmente bloqueada conserva casilla abierta.

- [X] T056 Escribir `tests/admin-publication.test.ts` antes de implementar `src/lib/admin-publication.ts`, `scripts/require-admin-publication.mjs`, `server/admin/start.ts` y scripts `build:admin:views`/build de entrega en `package.json`: rechazar fixtures, copy/recursos/políticas/operación pendientes y startup inseguro; compilar vistas solo a `.private-build/admin`, sin datos privados en public/dist, proxy reservado sin fallback, claves/directorios privados y sin cuentas default/doble de correo productivo; conservar gates001–005, y demostrar que referencias locales no equivalen a comprobar proveedor remoto.
- [X] T057 Escribir y ejecutar `tests/e2e/admin-accessibility.spec.ts` con 360/390/430/768/1024/1280/1440 × texto100/200 antes de carga/navegación, acceso/panel/cierre/recuperación/reset y estados invalid/unknown: labels/foco/teclado/aria-live/contraste4.5:1–3:1/controles~44px/overflow, sin JS sin GET de secretos, sin cookies de rastreo/storage de credenciales en este flujo; comprobar bundle sin fs/sqlite/claves y evidencias enmascaradas en `specs/006-acceso-administrativo/evidence.md`, sin equiparar axe a lector manual.
- [ ] T058 Revalidar Chromium/Firefox/WebKit con `playwright.admin.config.ts` y `playwright.admin.service.config.ts` según `specs/006-acceso-administrativo/quickstart.md`; localizar binarios existentes, diagnosticar fallos sin desactivar seguridad y registrar proyectos/fechas/resultados en `specs/006-acceso-administrativo/evidence.md`; si falta runtime/dependencia queda bloqueada, no marcar por instalar o recolectar tests.
- [ ] T059 Incorporar recursos oficiales/revisión exacta de textos/alternativas/identidad en `src/content/admin.ts` y `src/config/admin.ts`, con archivos oficiales bajo `public/brand/` según inventario; contrastar render con capturas (Usuario→Correo, Contacto privado) y comprobar lector de pantalla/fidelidad visual manual en `specs/006-acceso-administrativo/evidence.md`; mantener pendiente si faltan materiales/revisión, sin inventar cuentas/avatar ni recursos finales.
- [ ] T060 Calificar P02/009/010 en `src/config/admin.ts` y `specs/006-acceso-administrativo/evidence.md`: responsable/procedimiento restringido de provisión, proveedor/adaptador transaccional/secretos, PUBLIC_ORIGIN HTTPS/proxy/cookies/CSRF, capacidad real scrypt/cola/abuso/temporización, remitente/buzón y privacidad/retención de cuentas/sesiones/registros/sobres/copias; reutilizar bindings existentes sin imprimir valores y no inventar proveedor, política de90d o aprobación para habilitar servicio real.
- [ ] T061 Implementar y ejecutar `tests/e2e/admin-integration.spec.ts` con PRIVA_INTEGRATION_BASE_URL real y adaptadores privados locales de provisión/verificación/buzón configurados por operador, sin fallback a fixtures ni endpoint de pruebas público: cuentas sintéticas, login/permisos/cierre y correo efectivamente recibido en buzón controlado, link/reset/nueva contraseña/vieja rechazada/sesiones y tokens invalidados; falta de entorno/acceso/remitente bloquea tarea, sin enviar a terceros ni atribuir recepción a aceptación del proveedor; registrar evidencia redactada en `specs/006-acceso-administrativo/evidence.md`.
- [ ] T062 Ejecutar comandos aplicables de `specs/006-acceso-administrativo/quickstart.md`, checks/build de entrega cuando gates se cumplan, y regresión afectada de navegación001/Contacto005 y resto si hay cambios/riesgos nuevos; separar unitarias/UI mock/SQLite/correo doble/integración real y fallos de build/navegador en `specs/006-acceso-administrativo/evidence.md`; no repetir suites ya verdes sin motivo ni retirar gates para aprobar.
- [X] T063 Sincronizar `specs/006-acceso-administrativo/tasks.md`, `specs/006-acceso-administrativo/spec.md`, `specs/006-acceso-administrativo/quickstart.md`, `specs/006-acceso-administrativo/evidence.md` y `specs/TRACEABILITY.md` con tareas efectivamente verificadas, escenarios/SC, evidencia y bloqueos; no cerrar AD01/AD02, 007/008, CT01 o política009 por diseño/mocks, ni inventar IDs históricos; sin commit/push/despliegue automático.

## Dependencias y orden

```text
Preparación T001–T004
        ↓
Fundamentos T005–T012
        ↓
US1 acceso T013–T024
        ↓
US2 protección/panel T025–T033
        ↓
US3 salida T034–T040
        ↓
US4 recuperación T041–T055
        ↓
T056/T057 → T058/T059/T060 → T061 → T062 → T063
```

- Fundamentos: T005 antes de pruebas/validadores; T006→T007, T008→T009/T012,
  T010→T011. T006/T008/T010 pueden escribirse en paralelo después de T005 (archivos distintos).
  T008 debe cubrir frontera HTTP inicial antes de implementarla; T012 no declara endpoints completos.
- US1: T013/T014 preceden comportamiento; T015→T016→T017 y T018→T019;
  T020/T021 compilan/componen solo después de disponer componentes/servicio correspondientes.
  T022 escribe casos de browser compuesto antes de conectar esa integración; T023/T024 verifican
  y documentan el MVP. Validar sesión mediante API no exige ya una UI de panel completa.
- US2: T025/T026 antes de T027–T030, luego T031/T032/T033. T027 es el límite obligatorio
  para datos/operaciones; un shell o sesión vigente por sí solos no sustituyen autorización.
- US3: T034/T035 antes de T036/T037, luego T038/T039/T040. La implementación de logout
  usa el mismo repositorio/cliente que US1/US2: no desarrollar esas fases en ramas paralelas incompatibles.
- US4: T041/T042 antes de código; T043→T044→T045→T046/T047→T048,
  T049→T050 necesita contrato/rutas al integrar; T051 usa el ciclo real local de recuperación.
  T052/T053 después de los comportamientos; T054 mide antes de calificación; T055 registra.
  Las APIs públicas de recuperación no dependen de estar autenticado en panel, aunque la ejecución
  secuencial reutiliza base/hashing/sesiones previamente construidos.
- T056/T057 se pueden comprobar en bancos sintéticos explícitos antes de recibir materiales.
  T058–T060 son puertas independientes: avanzar en las no bloqueadas. T061 requiere entorno,
  recursos/avisos y calificación reales T059/T060; no esperar completar editor007/bandeja008.
- T062 no se cierra si el build final sigue bloqueado, aunque sus regresiones pasen. T063 puede
  sincronizar una entrega parcial honestamente, manteniendo las casillas externas abiertas.
- Tests de mismo root/puerto/DB no corren simultáneamente; repositorios Node deben aislar archivos,
  procesos y reloj. Mayor paralelismo no justifica rebajar coste scrypt ni perder invariantes.

## Ejemplos de paralelo por historia

| Historia | Tareas independientes después de fundamentos/contratos previos | Límites |
|---|---|---|
| US1 | T013 pruebas sesión/HTTP + T014 pruebas UI de acceso | Separar archivos; backend y cliente se integran una vez sus contratos estén listos |
| US2 | T025 pruebas repo/HTTP + T026 pruebas UI panel/sesión | No editar ni ejecutar ambas con la misma DB; T027/T030 preceden integración |
| US3 | T034 pruebas sesión/HTTP + T035 pruebas UI | Servicio/cliente comparten archivos con fases previas, implementar secuencialmente |
| US4 | T041 pruebas recuperación/HTTP + T042 pruebas UI | T046/T047 comparten repo/contratos y no se marcan [P]; cuidado con claves/worker/DB de prueba |

Estos ejemplos no solicitan crear subagentes; son oportunidades de ejecución sobre archivos distintos.

## Matriz de cobertura prevista

| Requisito / criterio | Historias | Tareas principales | Comprobación |
|---|---|---|---|
| FR-001 / AD01 | US1/US2/US3/US4 | T006–T024, T025/T027–T028, T034–T055 | Acceso real, guard, cierre, recuperación/CLI; T060–T062 para operación final |
| FR-002 / AD02 | US1/US2/US3 | T013–T017, T025–T033, T036–T040 | Dos cuentas, mismas funciones, navegación/protección y cierre sin roles añadidos |
| SC-001 | US1 | T006–T007, T010–T024 | Fronteras/toggle/carga/error/hash/identidad y sesión real |
| SC-002 | US2 | T025–T033, T039, T052 | Matriz de estados y lectura/cambio transaccional ante carreras |
| SC-003 | US3 | T034–T040 | Cookie vieja/reinicio/historial/tabs/unknown, nunca éxito de cierre sin comprobar |
| SC-004 | US4 | T041/T045–T046, T050, T053–T055, T060–T061 | Respuestas/tiempos uniformes y correo recibido real, distinto del doble |
| SC-005 | US4 | T043–T044, T047–T048, T050–T053, T061 | Un uso/expiry/alteración, reset atómico y revocación/cuenta correcta |
| SC-006 | Todas | T014/T018–T019, T026/T029–T030, T035/T037–T038, T042/T049–T050, T057–T059 | Matriz14, teclado/feedback/contraste, lectores y capturas |
| SC-007 | Todas | T001/T024/T033/T040/T055–T063 | Evidencia por capas, revisión, provisión/correo/gates reales y sincronización |

Escenarios locales: US1.1–6→T014/T018–T024; US2.1–6→T025–T033;
US3.1–4→T034–T040; US4.1–7→T041–T055/T061. No equivalen al catálogo07 ausente.
Toda tarea transversal tiene cobertura AD01/AD02 y/o CONST-04–06/08–12; no hay funcionalidad nueva
huérfana. Cobertura prevista no acredita ejecución ni aceptación.

## Estrategia de implementación

1. Preparación/fundamentos y US1 como MVP local de acceso, validado de forma independiente con
   cuenta y persistencia sintéticas reales. No desplegarlo como administración productiva completa.
2. US2 aporta protección/navegación con igual permiso; US3 cierra acceso realmente.
3. US4 añade recuperación/activación verificada y revocación global por cambio de contraseña.
   P2 organiza trabajo; no hace opcionales cierre o recuperación para aceptar AD01.
4. Verificar límites/privacidad/seguridad/accesibilidad y regresar lo afectado; resolver calificación
   operativa y correo real. Si falta proveedor/aviso/recurso/navegador, registrar criterio y acción
   externa necesaria y completar trabajo independiente. Mantener tarea parcialmente bloqueada abierta.
5. No cerrar política009, envío de respuestas008 o módulos007 por autorizar operaciones sintéticas.
   El gate comprueba referencias/configuración; una prueba real comprueba comportamiento remoto.
6. Ejecutar `$speckit-analyze 006` antes de `$speckit-implement 006`.

## Resumen

63 tareas: preparación4, fundamentos8, US1=12, US2=9, US3=7, US4=15, cierre8.
11 tareas [P]. 58 verificadas localmente; cinco pendientes (T058–T062). La aceptación final y el correo real siguen abiertos.
