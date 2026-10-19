# Investigación — 006

Fecha: 2026-10-19. Contexto: spec/constitución, R35, capturas, package/lock y servicio/fixtures de 005.
Investigación delegada de autenticación/sesión y recuperación, solo lectura. Las siguientes decisiones
son de diseño; no se ha probado ni certificado su implementación.

## R1 — Separación de vistas y autorización

**Decisión**: conservar Astro estático y compilar las vistas administrativas en root separado fuera
de public/dist. Servicio Node del mismo origen sirve HTML privado tras guard y JSON autorizado;
los templates compilados no contienen datos privados de cuentas/consultas.
**Motivo**: el servidor 005 actual solo recibe Contacto; su fallback estático y el login ficticio de
001 no protegen un panel. 007/008 necesitan autorización reutilizable, no otra comprobación de UI.
**Alternativas**: Astro SSR global añade un cambio innecesario; HTML privado en dist con redirección
client-side expone contenido; JWT autosuficiente sin estado complica revocación inmediata.

## R2 — Identidad y contraseñas

**Decisión**: correo trim, 1–254 puntos de código y formato pragmático de 005; clave de identidad
igual a toLowerCase() del correo completo, sin quitar puntos/+alias ni normalización del proveedor.
Conservar dirección recortada para envío. Un índice único impide dos cuentas bajo la misma clave.
Provisión/login/recuperación usan el mismo módulo; contraseña nunca se recorta, normaliza o trunca.
Política nueva/restablecida: 15–128 puntos de código, Unicode bien formado y sin controles
U+0000–001F/U+007F, permitir espacios/pegado/gestores;
rechazar cadenas de lista local versionada de contraseñas comunes, con fuente/licencia/revisión
registradas al implementarla. Sin reglas de composición, caducidad periódica ni API de brechas externa.
**Motivo**: un solo factor exige longitud y protección del hash; identidad coherente evita cuentas
ambiguas. La lista no se presenta como prueba exhaustiva de que una clave no está comprometida.
**Alternativas**: contraseñas demo, truncamiento, restricciones de nombre legal o consultas externas
no revisadas contradicen alcance/privacidad. No atribuir estos límites a la captura.

## R3 — Hash y capacidad

**Decisión**: crypto.scrypt asíncrono nativo, N=131072, r=8, p=1, sal aleatoria 16 bytes,
derivado 64 bytes, maxmem=192 MiB; persistir versión/parámetros y comparar con timingSafeEqual.
Un correo desconocido/no autorizado también recorre un hash dummy con coste equivalente.
Límite por proceso: 2 hashes activos, 8 en cola; saturación se decide antes de consultar identidad.
**Motivo**: evita añadir un runtime nativo externo y bloquear el event loop con hashing síncrono.
Dos hashes pueden consumir ~384 MiB de presupuesto; medir memoria/latencia y dimensionar workerpool.
**Alternativas**: SHA para contraseñas es insuficiente; cambiar coste en producción sin recalificar no
es una solución de rendimiento. Ninguna cifra aquí es benchmark del entorno ni capacidad productiva.

## R4 — Sesiones, revocación y transacciones

**Decisión**: token opaco 32 bytes, SHA256 en DB, cookie Secure/HttpOnly/SameSite=Strict con prefijo
__Host-, Path=/ y sin Domain. Inactividad 30 min, límite absoluto 8 h; reloj servidor, renovación
solo por operación autenticada válida. No polling que mantenga sesión viva por sí mismo.
Login rota acceso y revoca la sesión previa de ese navegador; otras sesiones de la cuenta pueden
seguir hasta logout/reset/revocación/expiración. Logout invalida solo el acceso en uso.
**Motivo**: controles de sesión pueden revocarse y probarse después de reinicio. accountId y versión
de credencial se revalidan justo antes de aceptar login calculado fuera de la transacción.
Toda lectura/cambio protegido comprueba autorización y sesión dentro del límite transaccional;
reset/revocación y acciones privadas se serializan. No basta middleware separado de una escritura.
**Alternativas**: tokens en localStorage, un estado booleano del cliente o autorización leída antes
de un cambio concurrente no demuestran protección.

## R5 — Recuperación sin enumeración

**Decisión**: respuesta 202 condicional idéntica para correo conocido/desconocido/desautorizado,
con job cifrado real o marcador noop opaco en el mismo camino transaccional; proveedor fuera del
request. Un worker prueba autorización/versión antes de enviar. Sin persistir correo desconocido.
Acuse no afirma envío/entrega. Error global de almacén/capacidad se decide de forma independiente
de existencia de cuenta. Si un error selectivo surge después, no exponerlo como resultado por cuenta.
**Motivo**: esperar a correo o fallar solo para conocidos permite enumeración. Igualar texto o añadir
una pausa aislada no acredita protección temporal: se compara comportamiento bajo carga igual.
**Alternativas**: decir «correo no registrado», devolver comprobante al navegador que solo conoce
correo, o confirmar entrega por el resultado del adaptador vulneran el flujo aprobado.

## R6 — Token y correo transitorio

**Decisión**: comprobante aleatorio 32 bytes, 15 min desde emisión, ligado a accountId/version;
DB de comprobantes conserva solo digest. Outbox requiere un sobre AES-256-GCM con clave privada
fuera de DB/staticroot para transportar el secreto; precisar esa excepción temporal cifrada.
Enlace a origen HTTPS configurado, `/admin/restablecer#token=...`; nunca Host del request. Capturar
fragmento en memoria y quitarlo del historial antes de llamadas de recuperación; nada de query token,
servicios externos o consumo por GET. Referrer-Policy no-referrer y scripts/recursos propios.
**Motivo**: evita secretos en logs de URL y consumo por previsualizador de correo. Un cambio confirmado
consume todos los comprobantes pendientes, cambia hash/versión y revoca sesiones atómicamente.
**Alternativas**: outbox con token en claro contradice «solo digest»; cambio por abrir enlace o tokens
sin expiración/revocación permiten abuso. Reintentar correo no debe volver a emitir validez indefinida.

## R7 — CSRF, historial y límites

**Decisión**: origen exacto, JSON/POST y encabezado no simple; CSRF ligado a preautenticación o sesión.
Cookie preauth de 5 min, sin permisos; GET de contexto no renueva sesión privada. Denegar CORS amplio,
Origin ausente/ajeno en POST y Sec-Fetch-Site cross-site. No-store/CSP self/frame-ancestors none/nosniff.
Ocultar/vaciar contenido privado al salir/ocultarse/pagehide; revalidar en pageshow y retorno visible.
BroadcastChannel comunica invalidación sin identidad/token; callbacks viejos no reinsertan datos.
**Motivo**: no confiar en SameSite solo ni presentar historial/caché como sesión válida. No se promete
borrar memoria, capturas o información que alguien ya vio antes de cerrar.
**Alternativas**: logout GET, desbloquear UI por cookie presente o activar reenvío de acción pendiente
al login contradicen la especificación.

## R8 — Provisión, privacidad y calificación

**Decisión**: CLI del operador, no HTTP/panel, para crear/habilitar/deshabilitar cuentas; sin rol web
nuevo, contraseña por argumentos, secreto en Git ni cuenta default. Inicio mediante correo de
activación/restablecimiento al buzón asignado; activar cuenta no prueba por sí solo recepción.
Permitir hash de contraseña sintética por canal privado solo en el proceso de pruebas.
**Motivo**: el responsable restringido es operativo, no una segunda clase de administrador.
Los datos de cuentas/seguridad no heredan 90 días. TTL de elementos efímeros se fija en el modelo;
conservación de cuentas/registro y copias productivas requiere aprobación operativa 009/P02.
**Alternativas**: interfaz Crear cuenta, compartir password o llamar a buzón simulado «correo real»
introducen alcance o confirmaciones falsas.

Referencias de criterio (no auditoría de proveedor): OWASP Password Storage, Session Management,
Forgot Password y CSRF Prevention Cheat Sheets. El plan no afirma haber consultado versiones en
línea ni que seguirlo certifique cumplimiento legal. Condiciones P02/009/010/011 siguen pendientes.
