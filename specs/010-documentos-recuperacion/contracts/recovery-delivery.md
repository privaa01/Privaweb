# Contrato HTTP de recuperación010

Diseño del 2026-10-20; X03/R-06/07; US3.1–5; SC-004–006.

Astro genera `404.html`; el alojamiento sirve ese cuerpo ante ruta pública desconocida conservando URL y estado404, sin redirect a Inicio ni fallback200. `/404.html` directo puede responder200 o404 según host: solo acredita presentación, no el error de una ruta desconocida. Recursos y salidas absolutos desde raíz para funcionar en rutas anidadas.

Matriz GET/HEAD: rutas desconocidas simples/anidadas, con/sin extensión y con query→404; GET cuerpo propio español+h1+salida `/index.html`; HEAD sin cuerpo. Recarga conserva error; Inicio real200; recurso ausente404 sin HTML exitoso; recurso conocido MIME correcto. No listado de directorios, traversal o lectura fuera de raíz.

Cuerpo fijo: no leer/reflejar pathname/query/hash/referer ni añadir analítica o reporte de URL. Aplicar `Referrer-Policy: no-referrer` en respuesta404 y metadato temprano equivalente para evitar reenviar ruta sensible al navegar/cargar recursos; no recursos externos nuevos. El host recibe necesariamente la URL: su política/logs se califican, sin prometer ausencia total de observación.

El fallback público excluye `/api/`, `/admin/` y prefijos reservados de servicios privados, que conservan sus contratos de autenticación/errores. No sustituir401/403 por recuperación pública ni revelar registros. Probar estas fronteras en integración real.

Servidor local propuesto `scripts/serve-documents.mjs`: loopback, directorio de build explícito, confinamiento de archivos, GET/HEAD y fallback de cuerpo404 propio, sin logs de URL completa/query o secretos. No usar404 genérico Python como evidencia del diseño. No es servicio productivo.

Antes de cierre: configurar hosting/CDN real sin elegir proveedor en este plan; registrar versión/configuración, fecha/baseURL, status/cuerpo saneados, caché, acceso directo/recarga y rutas privadas. Fixture, `astro preview` o captura aislada no acreditan entrega productiva. No se autoriza despliegue por este contrato.
