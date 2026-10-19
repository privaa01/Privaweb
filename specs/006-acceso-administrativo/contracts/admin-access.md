# Contratos de acceso, sesión y recuperación — 006

Fecha: 2026-10-19. Contratos implementados y comprobados localmente; ninguna ruta o cuenta
productiva se ha desplegado. Ver [evidencia](../evidence.md).
Entidades/TTL: [modelo](../data-model.md). Requisitos originales AD01/AD02 intactos.

## C1 — Rutas de documento y frontera privada

| Ruta externa | Autorización antes de entregar HTML | Contenido |
|---|---|---|
| /admin/login | Pública | Marca, Bienvenido de nuevo, Correo, Contraseña/visibilidad, Entrar, recuperación |
| /admin/recuperar | Pública | Correo, mensaje condicional, volver al acceso |
| /admin/restablecer | Pública | Contraseña nueva/política; comprobante solo por fragmento recibido en correo |
| /admin | Sesión/cuenta vigente | Shell privado, identidad recuperada mediante sesión real, navegación y salida |
| /admin/historias | Sesión/cuenta vigente | Slot de 007, sin editor/contadores/registros inventados |
| /admin/contacto | Sesión/cuenta vigente | Slot de 008, sin lista pública ni datos de Contacto de demostración |

Templates en .private-build/admin, no dist/public. Node mapea rutas exactas a ficheros internos;
no fallback estático, traversal o .html alternativo que eluda guard. Alias solo redirigen a canónico
sin datos privados, o se rechazan. No crear un src/pages/admin privado que el build público exponga.
Assets propios compilados /admin/_astro/* tienen lista de rutas/extensiones permitidas; no acceso
al directorio privado general. Faltantes 007/008 se identifican como tales, no como una función completa.
Las mismas cuentas autorizadas reciben igual permiso en ambos destinos. Para comparar cuentas
usar contextos de navegador distintos; pestañas del mismo navegador comparten cookie/sesión,
y un cambio de cuenta obliga a limpiar/revalidar las otras vistas locales.

## C2 — Transporte, cookies y CSRF

Todo admin/API: Cache-Control:no-store, Referrer-Policy:no-referrer, X-Content-Type-Options:nosniff,
CSP default-src 'self', script/style-src 'self', connect-src 'self', frame-ancestors 'none',
base-uri 'none', form-action 'self'; sin servicios externos en acceso/reset ni framing autorizado.
Solo origen HTTPS exacto configurado (`PRIVA_ADMIN_PUBLIC_ORIGIN`); link de correo usa ese origen,
nunca Host/Forwarded del request.

API mutadora: POST application/json UTF8, cuerpo <=8 KiB, Origin exacto obligatorio y header
X-Priva-Request:1. Rechazar Sec-Fetch-Site:cross-site, CORS amplio, GET mutador y payload en URL.
Además X-CSRF-Token validado contra contexto preauth o sesión, según corresponda. Cambios privados
requieren CSRF de sesión vigente. Rechazos de formato/origen/CSRF no revelan cuentas/secretos.
Lecturas API exigen X-Priva-Request:1 (no simple) y no permiten CORS; si Origin está presente debe
coincidir; Fetch Metadata cross-site se rechaza. Header no simple/SOP evita leer contexto desde otro sitio.
Origin/CSRF no sustituyen autorización de cuenta ni protegen de una contraseña robada.

Cookie __Host-priva_session: Secure;HttpOnly;SameSite=Strict;Path=/;sin Domain, Max-Age restante hasta
8h absolutas. Preauth __Host-priva_preauth: mismos atributos, 5min. No bearer JSON de sesión ni
cookies sin seguridad en entry de producción. Logout confirmado elimina ambas cookies del navegador.
HTTP loopback solo en bancos sintéticos: probar los mismos atributos Secure en Chromium localhost;
si ese runtime no los admite, usar TLS local con CA confiable/verificación preservada, no quitar Secure
ni desactivar verificación. HTTP local no acredita HTTPS/proxy productivos.

## C3 — API mínima

Sin credenciales en logs, mensajes públicos o respuestas de error. Resultados se correlacionan con
petición/generación del formulario; timeout cliente 10s pasa a unknown cuando el resultado puede
haber ocurrido. No autoplay de una edición/respuesta pendiente después de nuevo login.
Tras confirmar el login, el cliente navega exclusivamente a `/admin` del mismo origen. No se
admiten destinos de retorno proporcionados por URL, formulario ni respuesta de API (por ejemplo,
returnTo/next/redirect); se ignoran también variantes externas, relativas al protocolo o codificadas.
La navegación no ejecuta modificaciones: cada acción posterior requiere autorización y decisión nuevas.

| Método/ruta | Entrada / contexto | Resultado |
|---|---|---|
| GET /api/admin/contexto | Header no simple; cookie si existe | 200 csrfToken/contextExpiresAt; usa sesión válida o crea contexto preauth sin permisos; no renueva actividad privada |
| POST /api/admin/acceso | {email,password}; CSRF preauth o sesión | 200 {result:authenticated}, cookie nueva/CSRF nuevo tras commit; 401 genérico para identidad/clave/autorización inválida; 422 formato local; 429 límites uniformes; 503 saturación/indisponibilidad global |
| GET /api/admin/sesion | Cookie; header no simple | 200 {result:authenticated,account:{id,email},idleExpiresAt,absoluteExpiresAt,csrfToken}; 401 {result:unauthenticated} sin causa específica; nunca contraseña/roles nuevos |
| POST /api/admin/salir | {}; CSRF de sesión si sigue vigente | 200 {result:signed_out} después de revocar/confirmar ausencia; idempotente para ausencia/expiración; 503 genérico si no se puede confirmar |
| POST /api/admin/recuperacion | {email}; CSRF preauth o sesión | 202 mismo cuerpo condicional para elegible/desconocida/no autorizada y límite por identidad; 422 formato; 429 solo límite global/conexión independiente de existencia; 503 solo indisponibilidad global previa a distinguir cuenta |
| POST /api/admin/restablecer | {token,password}; CSRF preauth o de sesión vigente | 200 {result:reset} tras commit; 400 {result:invalid_reset} para inválido/ajeno/expirado/usado; 422 política de contraseña; 429 abuso; 503 unknown genérico |

Reset acepta CSRF del contexto disponible (preauth o sesión vigente), también al abrir el correo
con otra cuenta ya autenticada en ese navegador. Ese CSRF protege la petición, no determina la
cuenta a cambiar: solo el comprobante válido vincula y autoriza el reset. Invalidar únicamente
sesiones/comprobantes de la cuenta recuperada, sin atribuir el cambio a la cuenta del contexto.
Contexto de logout ya ausente/expirado no necesita CSRF de una sesión que no existe: mantener
Origin/JSON/header obligatorio, borrar cookies y no cambiar nada privado; una sesión vigente sí
requiere su CSRF válido. Nunca usar ausencia de CSRF para omitir guard de una sesión real.
Tras login desconocido, GET de sesión debe corresponder al emailKey del intento vigente antes de
mostrar éxito; una sesión previa de otra cuenta no confirma ese intento. El panel usa siempre
identidad del servidor, no el correo escrito como fuente de autorización.
Cada login realiza hash equivalente aun si la cuenta no existe/no está autorizada; un rechazo no
indica si acertó el correo. Tras hash revalidar autorización/versión para impedir carreras con reset.
No usar el 422 de acceso para indicar existencia: solo estructura/formatos sin lookup de cuenta.

Recuperación 202: «Si corresponde a una cuenta autorizada y el servicio está disponible, recibirás
instrucciones. Esta respuesta no confirma envío ni entrega». Mismo status/cuerpo/headers para
conocida/desconocida/desautorizada y errores selectivos posteriores; fallo del proveedor solo se
trata en el worker, no altera el acuse. No devolver token, dirección destino, estado de job o existencia.
Si falla una transacción selectiva después de consultar identidad, responder de forma uniforme sin
prometer encolado; registrar error operativo saneado. Fallo global conocido devuelve 503 antes del lookup.
Una recepción 202 es acuse genérico del request, no afirmación de cambio de credenciales o correo emitido.

Contexto preauth reutiliza cookie no vencida; su emisión se limita a 60 por conexión y 300 globales
por 15min, antes de crear filas. El GET de estado no renueva permisos por sí mismo.
Límites globales y de conexión se aplican antes de lookup. El bucket por email se computa de igual
forma para todas las direcciones y su saturación sigue devolviendo el 202 genérico de recuperación.
Sin bloqueo permanente, CAPTCHA externo ni lista de cuentas accesible. Sin endpoint de alta,
SQL/debug, correo de prueba, introspección de sesión de otra persona o inyección de fallos HTTP.

## C4 — Guard transaccional y serialización

Interfaz interna withAuthorizedTransaction(sessionToken,operation) exige callback síncrono (sin await/Promise),
rechaza funciones async antes de ejecutarlas e inicia unidad transaccional,
comprueba cuenta/sesión/vigencia/versión y ejecuta lectura/cambio dentro del mismo límite; solo
confirma tras commit. Lecturas también comprueban antes de entregar datos. Logout/revocación/reset
usan la misma coordinación para que una operación posterior a su commit no use la autorización vieja.
Una operación confirmada antes del cierre no se presenta como anulada por ese cierre.

En SQLite de referencia, tablas admin_* y datos de una operación privada deben compartir transacción
por conexión. Integración futura puede usar el archivo privado de Contacto de 005. No permitir
check en auth.sqlite y write descoordinado en otro archivo. Un adaptador productivo diferente debe
probar garantías equivalentes de orden/atomicidad antes de calificarse. 006 usa recursos privados
sintéticos solo mediante inyección del proceso de pruebas, no rutas de demo añadidas al servidor real.

Hash de login/reset fuera de transacción para no bloquear disco; autorización/credentialVersion/token
se revalidan dentro de transacción final. Reset válido: nuevo hash+verificación buzón+incremento de
versión+consumo de comprobantes+revocación de sesiones en una transacción. Antes de commit no
hay éxito; respuesta perdida produce unknown y no autoriza reenvío automático de contraseña.
Revocar autorización/rehabilitar por CLI también invalida versiones/sesiones/recuperaciones en disco.

## C5 — Recuperación, worker y no enumeración temporal

La solicitud crea job real cifrado o noop opaco por el mismo camino de commit. Token real 32 bytes,
15 min desde emisión, un uso. GET/restablecer no consume ni cambia cuenta. Worker con leases,
reintentos/expiry del modelo y adaptador MailAdapter.send({deliveryId,to,resetURL}) que declara si
hay idempotencia real. El doble de correo solo existe en fixture/proceso, no se entrega en producción.
Clave AES-256-GCM y versiones fuera de DB; sobre eliminado al aceptar/expirar; recepción/lectura
no se deducen de la aceptación del adaptador. Rotación conserva claves antiguas solo hasta resolver
sobres vigentes (máximo 15min); revocación de emergencia invalida comprobantes afectados.

No comparar tiempos con el proveedor dentro del request. Ventana objetivo para recuperación
válida: mínimo 250ms desde recepción + jitter 0–50ms independiente de existencia; límite de respuesta
no se presume si la infraestructura está saturada. No afirmar tiempo constante por esta pausa.
Aceptación temporal en entorno controlado: 20 muestras alternadas por clase, identidades sintéticas
sin superar buckets y mismo cuerpo/headers/status. Para cada par de clases A/B (conocida,
desconocida, desautorizada y fallo de worker), exigir abs(mediana(A)-mediana(B)) <=50ms y
abs(p95(A)-p95(B)) <=100ms. Estos umbrales comparan clases, no limitan la latencia absoluta
de una respuesta; se mantiene el mínimo de 250ms + jitter 0–50ms. Registrar carga y valores observados.
Si no se cumple, corregir o bloquear calificación; no ensanchar tolerancias en silencio ni presentar
esta prueba como garantía criptográfica o de comportamiento bajo toda carga productiva.

## C6 — UI, fallos e historial

Campos/errores visibles asociados, foco al primer inválido, aria-live para feedback y carga bloqueada;
contraseña con toggle accesible sin submit ni transformación. No bloquear pegado/gestores.
Shell privado arranca sin datos/identidad y oculto hasta verificar sesión; rechazo limpia DOM privado
y requiere login. pagehide/hidden vacían datos; pageshow/visible requieren nueva verificación sin
mantener viva la sesión por polling. BroadcastChannel solo invalidación local; no bearer/PII.
Respuestas de generación anterior nunca rellenan otro login/cuenta/panel. No secretos en storage/URL.

Al cerrar se oculta/vacía antes de pedir revocación; unknown ofrece verificar/reintentar sin afirmar
cierre remoto ni reabrir datos. Otra pestaña recibe invalidación y se revalida; canal de navegador no
sustituye revocación servidor. No se promete eliminar capturas o información vista previamente.
Reset lee token del fragmento y history.replaceState lo retira antes de su lógica de peticiones;
lo mantiene en memoria, sin query/log/storage. Abrir/recargar sin token válido ofrece nueva solicitud.
No llamadas a terceros en esa página. Sin JS: aviso honesto, envío inactivo, ningún fallback GET con claves.

## C7 — Provisión, publicación y aceptación

Provisión CLI restringida del operador (crear/habilitar/deshabilitar) fuera de HTTP y panel. Sin
password por argumentos/env de demo ni secreto impreso. Crear/rehabilitar deja credencial pendiente;
primer acceso mediante correo controlado y reset. Prueba local puede inyectar cuenta sintética
habilitada por proceso autorizado, nunca mediante un flag de demo del entry productivo.

Guard de publicación y startup exige marca/copy/políticas revisadas, origen/proxy/TLS, almacenamiento,
provisión responsable, claves, capacidad hash/cola, MailAdapter/remitente/buzón y privacidad calificados.
Verifica estructura/referencias sin red; integración prueba operaciones reales. Mantener gates previos.
No inventar 007/008 completos, correo recibido, cookies de rastreo ausentes o proveedor por tener código.

| Criterio | Evidencia futura |
|---|---|
| SC-001 / AD01 | Validación, credenciales válidas/erróneas/desconocidas, hash/cola, toggle, respuesta perdida y sesión real |
| SC-002 / AD02 | Dos cuentas con mismos permisos; acceso directo y operaciones protegidas ante estados inválidos/revocación |
| SC-003 / AD01 | Logout durable, replay de cookie, historial/dos pestañas, fallo/unknown sin contenido privado |
| SC-004 / AD01 | Respuesta uniforme y temporización con worker separado; recepción efectiva en buzón controlado |
| SC-005 / AD01 | Alteración/expiry/uso único y carreras; nueva clave funciona, vieja/sesiones/comprobantes anteriores no |
| SC-006 | Matriz 14, foco/teclado/errores/contraste, lector y fidelidad manual |
| SC-007 | Provisión/guard/correo reales y privacidad; separar mock UI, servicio real local y operación productiva |
