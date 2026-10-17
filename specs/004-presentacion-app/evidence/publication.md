# Publicación — evidencia y límites

2026-10-17.25 unitarias del gate aprobadas; antes de implementarlo4 casos positivos y21 negativos
fallidos con stub permisivo. Combinaciones00/10/01/11 pasan con metadatos/archivos sintéticos
completos; no aprueban activos reales. Negativos aíslan validación de nota/títulos/dimensiones/
alternativas de revisión obsoleta para comprobar cada restricción por separado.

Gate permite ambas pendientes y candidata no utilizada; declaración verificado sin evidencia
consistente bloquea hasta corregirla. Este error de autoría no equivale a exigir URLs oficiales
para publicar el estado pendiente. Renderer igualmente degrada entrada inválida a pendiente.

Rechaza testOnly, copy cambiado tras revisión, notaA07/títulos/orden alterados, imágenes/marca/
fuente/paleta pendientes, archivo vacío o symlink fuera de public, revisión del recurso distinta
y mockup incompatible. Snapshot de copy/recurso debe coincidir; comparación visual/manual
confirma contenido real de archivo, no la mera existencia de ruta.

node scripts/require-app-publication.mjs: exit1 BLOQUEADO004 por copy/recursos/revisión.
Entrada real /app.html en Astrodev:HTTP500; logs identifican assertAppPublication en app.astro,
antes de render. Build completo:exit1 por Contacto faltante; guardsInicio/Historias/App conservados.
No hubo páginas de relleno en src ni dist de entrega. Guard no consulta tiendas ni aprueba URLs.
