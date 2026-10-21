# Validación de publicación — 002

Pruebas de Node: 23 aprobadas, 0 fallidas/omitidas. Primero se ejecutaron contra interfaz
sin validación: fallaron las comprobaciones negativas, no los imports. Luego se implementó
validación y pasaron. Casos: material pendiente/ausente/fuera de public, dimensiones/alt,
procedencia, contenido de fixture, C16, orden/anclas y cinco revisiones editoriales.
El ejemplo sintético válido solo prueba el camino de aceptación; no certifica aprobación real.

`node scripts/require-home-publication.mjs` sale 1 con bloqueos concretos del contenido real.
El build de entrega conserva require-pages → require-home-publication → astro build.
`npm run build` sale 1 porque faltan páginas reales historias/app/contacto.
Se probó también render defensivo mediante API build Astro con salida aislada
.test-output/rejected-home: falla por BLOQUEADO 002 y no genera index.html de entrega.
No se interpretan los chunks temporales de ese intento como un sitio publicable.

Logs de evidencia adjuntos; no hay dist de entrega ni guard desactivado.

## Actualización 2026-10-21

24/24 pruebas pasan tras incorporar referencias comunes y cinco revisiones editoriales aprobadas explícitamente. La revisión exacta sigue invalidándose al cambiar descripción. El gate real devuelve salida 1 únicamente por hero/identidad/cierre pendientes: ya no indica revisión editorial, marca, fuente ni paleta. Ver resume-2026-10-21-publication.txt y resume-2026-10-21-publication-blocked.txt. El enlace provisional aportado devuelve HTTP 403 y no se incorporó como recurso oficial.
