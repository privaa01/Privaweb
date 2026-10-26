# Imágenes de003 conectadas y carpeta de audios

Fecha:2026-10-26 (America/Bogota).

Se conectaron las ilustraciones500×350 a hero/aprende, metodología/identifica y cierre/explora en storiesContent. Las tres portadas660×195 se asocian a enlace-falso/enlace.png, llamada-sospechosa/llamada.png y contrasena-compartida/contra.png en src/content/story-images.ts.

El módulo de importación restringida007 admite omitir imagePath para usar la portada inicial oficial. No hay nuevo endpoint, cuenta, permiso o publicación automática. Conserva imagePath explícito como alternativa, autorización/referencias/inspección reales y borradores inactivos; reimportar IDs existentes no sustituye cambios gestionados. El frontend sigue respetando imágenes/estados del catálogo servido.

Se corrigió el aspecto forzado de portadas para mostrar los archivos horizontales sin recorte. Las pruebas y vista de revisión dentro del banco muestran imágenes oficiales con audio/catálogo sintéticos rotulados; no se modifica el guard de la entrada real. La página de prueba imagenes.html no es una nueva ruta pública de producto. También se corrigió la extensión de un import exclusivamente de tipos en brand.ts para compatibilidad NodeNext; no cambia comportamiento visual.

## Verificación

| Comprobación | Resultado |
|---|---|
| Unitarias003 |41aprobadas,0fallidas/omitidas; incluye comparación de metadatos contra los PNG reales y rechazo por editorial pendiente |
| Gestión007 |38aprobadas,0fallidas/omitidas; nueva prueba importa las tres portadas con audio sintético, verifica dimensiones/hash y catálogo aún vacío |
| Importador007 final |3casos repetidos y aprobados tras separar el mapa de imágenes; ya incluidos en38, no sumarlos |
| TypeScript007 |Aprobado con NodeNext y noEmit |
| Astro check003 |5archivos del banco,0errores/advertencias/hints |
| NavegadorChromium003 |29aprobadas;14celdas ancho/texto, audio/ejercicios y catálogo de prueba con portadas oficiales |
| Capturas a1440/390 |Seis PNG oficiales decodificados; proporción renderizada coincide con la natural sin recortes. connected-images-validation.json |
| Guard real003 |Salida1 únicamente por las cinco revisiones editoriales; sin errores de imágenes/Instagram/referencias |

La prueba nueva del importador falló antes del fallback por ausencia de imagePath y pasó después. Se conserva connected-images-import-red.txt; no fue un fallo de importación de módulos. Los audios usados en tests son tonos sintéticos; no acreditan las narraciones definitivas. Captura de escritorio inspeccionada visualmente: connected-images-1440.png; móvil: connected-images-390.png. La banda de prueba impide confundirlos con publicación aprobada.

## Siguiente recepción

Audios en content/stories/audio/ (GitHub0d024c4), preferiblemente enlace-falso.mp3, llamada-sospechosa.mp3 y contrasena-compartida.mp3. Recibir originales no los publica automáticamente; faltan transcripciones equivalentes, nueve explicaciones y revisión. El reproductor admite MP3/WAV conforme a su validador; no se crea audio ficticio de entrega.

30/35 tareas de003 siguen completas; T031 avanza en imágenes, sin dar por aprobados los relatos/editorial, revisión manual o integración. Los cambios de código siguen locales; solo se subió la carpeta de recepción de audios en esta fase. Se preservan los cambios pendientes de001/WebKit.
