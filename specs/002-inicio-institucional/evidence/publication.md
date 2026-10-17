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
