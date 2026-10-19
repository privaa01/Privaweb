# Modelo de datos — 006

Fecha: 2026-10-19. Modelo implementado localmente; tablas/cuentas/claves sintéticas de prueba,
sin provisión productiva. Ver [evidencia](evidence.md).
Todas las fechas son UTC de reloj servidor. Secretos aleatorios: 32 bytes/base64url canónico sin padding.

## AdminAccount

| Campo | Restricción |
|---|---|
| id | ID aleatorio estable del servidor; clave primaria |
| email | string recortado, 1–254 puntos de código, formato compartido con 005; dirección usada para envío |
| emailKey | email.toLowerCase(); único; no quitar puntos ni sufijos + ni aplicar reglas de proveedor |
| authorized | boolean; false impide login, sesión y recuperación efectiva |
| passwordRecord | null durante activación inicial; en otro caso registro scrypt protegido descrito abajo |
| credentialVersion | entero >=1; aumenta en reset y cambios operativos de autorización |
| mailboxVerifiedAt | null hasta completar comprobación recibida por correo; UTC después de completarla |
| createdAt / updatedAt | UTC; no son actividad de Contacto |
| permission | único valor lógico administrador; no colección de roles ni permiso editor |

Crear por CLI autorizada: authorized=true, passwordRecord/mailboxVerifiedAt=null; no puede entrar
hasta completar activación por el mismo flujo de restablecimiento. Deshabilitar revoca sesiones/tokens;
rehabilitar exige recuperación nueva y no restaura credencial/sesión vieja. Estas operaciones no son
rutas de administración web ni crean un segundo permiso. Fixtures pueden sembrar credenciales y
verificación sintéticas por proceso privado, nunca mediante startup de producción o endpoint público.

## PasswordRecord

version='scrypt-v1'; salt=16 bytes aleatorios; hash=64 bytes; N=131072,r=8,p=1,maxmem=192 MiB.
No contraseña en claro ni hash rápido como credencial. Política para credencial nueva: 15–128 puntos
de código; Unicode bien formado, sin controles U+0000–001F/U+007F; sin trim/normalización/
truncamiento, espacios/Unicode permitidos y lista común local
versionada. Comparación constante. La versión/parámetros permiten reconocer registros inválidos;
no aceptar coste desconocido ni rehash que reduzca seguridad silenciosamente.

## AdminSession

| Campo | Restricción |
|---|---|
| tokenDigest | SHA256 del token canónico completo, único; el bearer crudo no se persiste |
| accountId | FK a cuenta; ninguna sesión anónima sirve de permiso |
| credentialVersion | versión observada al crear; debe coincidir en cada operación |
| createdAt / absoluteExpiresAt | UTC; absoluteExpiresAt=createdAt+8 horas |
| lastActivityAt / idleExpiresAt | UTC; idleExpiresAt=min(lastActivityAt+30 minutos, absoluteExpiresAt) |
| revokedAt | UTC nullable; no volver de revocada/expirada a vigente |

Vigente solo si cuenta autorizada y verificada, credencial presente, versión coincidente, no revocada
y now<ambos vencimientos. En igualdad de instante ya expiró. Operación de usuario autenticada válida
puede actualizar actividad; consulta de estado/CSRF/heartbeat no renueva inactividad. Nunca se extiende
límite absoluto ni se confunde actividad administrativa con plazo de Contacto. Login genera token nuevo
y revoca el acceso previo de ese navegador; múltiples navegadores pueden tener sesiones independientes.

Cookie: __Host-priva_session; Secure; HttpOnly; SameSite=Strict; Path=/; sin Domain.
Max-Age hasta límite absoluto restante. Logout confirmado revoca el acceso utilizado y borra cookie.
Purgar filas expiradas/revocadas a más tardar 24 horas después de su invalidez; un digest ausente nunca
vuelve a autorizar. La política de auditoría/productiva de cuentas/copias sigue siendo 009/P02.

## PreAuthContext / CSRF

Cookie __Host-priva_preauth con atributos de seguridad equivalentes, token opaco/digest, expiración
5 minutos, sin permisos de cuenta. Si hay sesión vigente, CSRF se deriva de esa sesión; si no, del
contexto anónimo válido. Valor CSRF=HMAC-SHA256(clave servidor, tipo+digest del bearer), nunca la clave.
Se obtiene solo por llamada same-origin no simple; no usar localStorage ni devolver bearer de sesión.
Verificación constante y origen exacto en POST. Login consume contexto previo, rota acceso y emite
CSRF nuevo. Reset permite cualquiera de esos contextos válidos; la cuenta recuperada la determina
exclusivamente el comprobante de correo, no la identidad de una sesión previa. Contextos vencidos se purgan; no heredan el plazo de Contacto.

## PasswordReset

| Campo | Restricción |
|---|---|
| tokenDigest | SHA256 del comprobante canónico aleatorio completo, único; no token crudo |
| accountId / credentialVersion | FK y versión al emitir; autorización/versión se vuelven a comprobar |
| issuedAt / expiresAt | UTC; expiresAt=issuedAt+15 minutos; no renovar al reintentar correo |
| consumedAt / invalidatedAt | UTC nullable; cualquiera impide uso posterior |

Abrir GET no consume. Solo POST válido cambia contraseña. Hash se calcula fuera de transacción
acotada; antes de commit revalidar cuenta, versión, vencimiento y estado no consumido. En la misma
transacción cambiar hash, establecer verificación de buzón, incrementar versión, consumir/inutilizar
todos los comprobantes pendientes y revocar todas las sesiones de la cuenta. Dos escritores no
producen dos cambios válidos. No iniciar sesión automáticamente. Purga de registros inválidos <=24h.

## RecoveryJob / MailEnvelope

Job opaco con id, accountId nullable, credentialVersion nullable, tipo real/noop, createdAt, expiresAt,
leaseUntil, attempts, estado queued/leased/accepted/failed/expired, deliveryId nullable.
- Cuenta elegible: transacción crea PasswordReset y job con sobre cifrado de destino/token/enlace.
- Desconocida/no autorizada: mismo acuse y fila noop opaca, sin correo desconocido, token real ni cuenta.
- Sobre: AES-256-GCM, nonce 12 bytes único por clave, tag 16 bytes, keyVersion y AAD con jobId/accountId/
  versión. Claves aleatorias fuera de DB/staticroot/Git; no derivadas de contraseña o claves de Contacto.
- «Solo digest» se refiere al comprobante persistido. El sobre temporal cifrado contiene el token para
  enviarlo y se elimina al aceptar el proveedor o expirar. No registrar contenido, correo o token crudo.
- Job/lease nunca amplía los 15 min. Worker revalida autorización/versión y vigencia antes de enviar.
  Nuevo reset confirmado invalida el sobre pendiente; un envío en vuelo puede llegar tarde, pero su
  comprobante no autoriza ningún cambio después de invalidarse.
- Lease 60s, máximo 3 intentos con esperas 30s/120s; cada intento con timeout 10s y solo antes de expiresAt.
  deliveryId estable por job; adaptador declara soporte real de idempotencia. Si aceptación externa es
  desconocida y no hay deduplicación, no reenvío ciego: terminar ambiguo y permitir nueva solicitud.
- El mismo enlace eventualmente duplicado nunca permite un segundo cambio de contraseña.
- Sobre/noop se borran al finalizar/expirar; metadatos mínimos de estado (sin correo/contenido) <=24h.

No SMTP/SDK elegido. MailAdapter es interfaz; doble local explícito prueba contrato, no recepción.
Un proveedor real y su política de copias/retención deben calificarse antes de activar correo productivo.

## AbuseWindow y datos operativos

Clave HMAC(namespace+emailKey o dirección de conexión confiable), contador y windowEnd. Sin email
desconocido ni IP cruda persistida. Mismas reglas para conocidos/desconocidos. Ventana fija 15 min;
contador purgado al vencer, nunca historia permanente de persona. Login: 5 por emailKey, 30 por origen
de conexión y 300 globales por ventana. Recuperación: 3 por emailKey, 10 por conexión y 100 globales.
Reset: 5 por digest de comprobante, 30 por conexión y 100 globales. Límites globales previos a lookup;
HMAC tiene clave propia fuera de DB. Configuración de proxy define conexión confiable, no un XFF arbitrario.

Sin log de autenticación de larga duración por defecto. Solo fallos operativos saneados sin cuentas,
correo, IP, contraseña, bearer o contenido de correo; persistencia adicional exige política 009/P02.
Cuenta conserva datos mientras esté operativa y hasta disposición aprobada de 009; sin plazo inventado.
La falta de política productiva bloquea producción, no pruebas sintéticas aisladas.

## UI / publicación

Estado login: editing→invalid/submitting→confirmed/rejected/unknown. unknown consulta estado real;
no hace reenvío automático de credencial ni usa una respuesta vieja como acceso de otra cuenta.
Estado privado: hidden/checking→authorized→hidden al salir, pagehide o pérdida de vigencia; generación
local impide reinserción por callbacks viejos. BroadcastChannel solo evento de invalidación.
Logout: hidden/pending→confirmed/unknown; nunca vuelve a mostrar datos por fallar el cierre.
Recuperación: editing/submitting→generic-accepted/global-error; comprobante de correo solo en memoria
tras borrar fragmento. Reset desconocido no confirma ni reenvía contraseña: login/nueva recuperación.

AdminContent/AdminReadiness: revisión del texto exacto, recursos oficiales/marca/alternativas/fuente/
paleta, referencia de provisión, origen HTTPS, adaptadores, remitente, capacidad hash, privacidad y
calificación de cookies/acceso/correo. Fixtures testOnly se rechazan en entrega. No mostrar identidad,
contadores, sesión, enlace o aprobación ficticios como estado real.
