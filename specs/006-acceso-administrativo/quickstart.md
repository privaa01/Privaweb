# Guía de validación — 006

Fecha: 2026-10-19. Comandos previstos tras implementar; **todavía no existen los scripts/archivos
nuevos**. Este documento no acredita autenticación, benchmark ni correo recibido.

## Prerrequisitos

Raíz /workspace/Privaweb, Node 24.19.0, dependencias del lock (`npm ci` existente), Python 3 y
Chromium del sistema. Mantener verificaciones TLS e integridad de paquetes. No añadir dependencias
por defecto. TSC del servicio debe incluir server/admin, módulos compartidos y wrappers de pruebas;
Astro check del frontend no acredita tipos del backend por accidente.

Leer [contrato](contracts/admin-access.md), [modelo](data-model.md) y [plan](plan.md).
Recursos/cuentas de prueba se crean por proceso privado y son sintéticos; no credenciales reales en
capturas, trazas, consola o repositorio. Ninguna prueba debe enviar correo a terceros sin autorización.

## Comandos futuros, no ejecutados

```bash
npm run test:admin
npm run check:admin:service
npm run check:admin:contract
npm run build:admin:contract
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:admin:contract -- --project=chromium
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:admin:service -- --project=chromium
PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:admin:contract -- --project=firefox --project=webkit
```

Scripts deberán separar UI mock Python4328 (.test-output/admin, admin-cache/admin-artifacts y
admin-results.json) de servicio Node4329 con SQLite real (admin-service-artifacts y
admin-service-results.json). Datos/claves/sobres del banco bajo .test-output/admin-service-data
0700, fuera de cualquier staticroot; el root de vistas solo contiene contenido sintético/shell vacío.
Node tests usan directorios/puertos aislados y reloj inyectado por proceso. Fallos controlados solo
mediante DI/archivo del wrapper privado, sin ruta/header/query de prueba en servidor real.
No ejecutar dos builds del mismo root ni bancos que compartan DB simultáneamente.

Producción compila root server/admin/views a .private-build/admin mediante build:admin:views;
este root NO se sirve con Python ni se copia a public/dist. Entry futuro server/admin/start.ts
exige calificación de configuración/gates. Proxy del origen HTTPS reserva /admin y /api/admin
al servicio; no fallback estático privado. .private-build, DB/key/WAL/SHM y sobres deben ignorarse en Git.

## Recorrido por capas

1. **Validación y publicación**: correo coherente en provisión/login/recuperación, contraseña
   14/15/128/129 puntos de código y Unicode/espacios sin transformación; rechazo explícito de
   surrogates aislados/controles, sin sustitución silenciosa al codificar; gestores/pegado/toggle;
   fixtures rechazados por gate, recursos/copy/revisiones pendientes no publicables.
2. **Hash/capacidad**: verificar salt/parámetros y comparación; usuario desconocido usa hash dummy;
   dos trabajos activos/ocho en espera, saturación uniforme y memoria/latencia medidas. No llamar
   benchmark a importar crypto ni rebajar coste para obtener un check verde.
3. **SQLite/provisión real de prueba**: archivo privado, WAL/FULL/FK/busy_timeout efectivos por
   conexión; permisos DB/clave/WAL/SHM y rechazo de rutas públicas/symlinks. Crear dos cuentas
   sintéticas mediante helper privado y demostrar permisos iguales; reiniciar y releer por proceso
   autorizado, sin endpoint SQL/debug/alta. CLI de producción sin cuenta default ni contraseña en argv.
4. **Acceso**: login válido/erróneo/desconocido/desautorizado, datos inválidos y fallos antes/después
   de commit; ningún éxito antes de guardado ni identidad vieja por callback tardío. Capturar atributos
   de cookie, no su valor; probar rotación, CSRF y origen ajeno/ausente. Una respuesta perdida obliga
   a consultar sesión vigente y correlacionar la cuenta, nunca repetir credencial automáticamente.
5. **Frontera privada**: GET de HTML y lecturas/cambios directos con sesión ausente/inválida/expirada/
   cerrada o cuenta revocada; denegar antes de entregar datos o modificar. Prueba de operación privada
   inyectada comparte transacción con guard. Dos procesos compiten logout/reset/revocación vs write:
   solo se aceptan acciones ordenadas antes de invalidación; código de prueba no crea rutas de demo.
6. **Salida/navegador**: cierre normal, repetido, expirado y desconocido; DOM privado vacío desde el
   clic, sin reaparición por respuesta/finally viejos. Historial/pageshow, recarga, dos pestañas y vuelta
   visible revalidan. No polling que renueve 30min de inactividad; probar 30min/8h y sus fronteras con reloj.
7. **Recuperación con doble identificado**: 202/copy/headers iguales para direcciones conocidas,
   desconocidas y sin autorización; errores selectivos del worker no llegan al request. No conservar
   correo desconocido/IP cruda; comprobar HMAC/buckets/TTL. Comparar muestras temporales de C5,
   sin confundir una pausa con prueba de no enumeración. Dobles no prueban recepción de correo.
8. **Reset/transacciones**: recuperar token solo del buzón sintético privado del doble local; ver/GET
   no consume, token no queda en URL/storage/log. 15min de vigencia, alteración/uso ajeno/expiración,
   dos escritores, reset con navegador sin sesión y con sesión de la misma/otra cuenta,
   reset mientras login calcula hash, revocación mientras worker prepara correo;
   solo un cambio, clave vieja rechazada, sesiones/tokens anteriores inválidos y commit incierto sin
   éxito falso. Probar outbox cifrado, reinicio/lease/retry/expiry y aceptación externa desconocida.
9. **Browser compuesto**: componentes compilados reales + cookies/CSRF/servicio/SQLite reales,
   sin intercepción de API. Verificación de DB por proceso privado, sin secretos en reportes.
   Repetir permisos y salidas con dos cuentas; no afirmar que implementa gestión 007/bandeja008.
10. **Accesibilidad/recursos**: 360/390/430/768/1024/1280/1440 × texto100/200 antes de navegación,
    carga/error/empty/unknown, teclado/foco/feedback, axe/contraste/controles y overflow; lector/fidelidad
    manual separados. Sin JS, formulario inactivo y aviso honesto, sin GET con contraseña o correo.

## Configuración y calificación productiva

Prever nombres de configuración, no valores secretos: PUBLIC_ORIGIN, PRIVA_ADMIN_DATA_DIR,
PRIVA_ADMIN_PORT, referencias/versiones de claves privadas, adaptador de correo/remitente y proxy
confiable. No suponer que hay proveedor por existir esos nombres; confirmar bindings disponibles
antes de pedir credenciales, sin imprimir sus valores. Claves se generan/guardan por runtime
restringido y no se pasan por argv. Versiones antiguas de cifrado solo mientras haya sobres vigentes.

Antes de calificar: recursos/copy/avisos revisados, política de cuentas/seguridad/copias con 009/P02,
provisión responsable, directorio y adaptador productivos, HTTPS/proxy/cookies/CSRF, medición scrypt,
abuso sin enumeración y proveedor/remitente/buzón de prueba controlado. Un certificado local no
califica transporte externo ni el guard local demuestra disponibilidad del proveedor.

```bash
PRIVA_INTEGRATION_BASE_URL=https://entorno-real-verificado.example npm run test:e2e:admin:integration
npm run build
```

URL ilustrativa, nunca usarla como destino de entrega. Suite integrada requiere adaptadores privados
locales configurados para provisión/verificación y lectura de buzón (contratos de pruebas, no rutas
HTTP públicas). Credenciales mediante configuración segura, sin contenido secreto en argumentos.
Ausencia de URL/medio autorizado bloquea integración sin fallback al banco mock.

Prueba real completa: cuenta sintética autorizada creada por procedimiento restringido; login/
permisos/cierre, solicitar recuperación, comprobar correo efectivamente recibido en buzón controlado,
seguir enlace y restablecer, rechazar contraseña antigua/sesiones/tokens usados. Un servicio de correo
que acepta envío no acredita recepción ni lectura. No hacer esa prueba con correo real de otra persona.

Registrar fecha/navegador/entorno/escenario/SC/resultado/evidencia, latencias y límites efectivos;
no contraseñas, bearer, CSRF, resetURL, contenido de correo ni datos de cuentas reales en trazas.
Firefox falló con perfil y WebKit con bibliotecas ausentes en 005; revalidar, no presentarlos como
aprobados ni quitar seguridad para forzar ejecución. Gates de 001–005 deben conservarse; pendiente
editorial, proveedor, recurso o navegador es bloqueo, no éxito. No crear evidencia ni marcar tareas
completas al redactar este plan.
