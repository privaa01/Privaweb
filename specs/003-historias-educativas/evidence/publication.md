# Publicación — controles y evidencia

2026-10-17.19 pruebas unitarias del gate aprobadas; antes de implementación19 fallos
con stub permisivo. Junto con contrato son40 unitarias aprobadas. Casos: fixture, archivos
faltantes/vacíos/symlink fuera de public, dimensiones/alternativas/revisión/referencias pendientes,
copy cambiado después de revisión, C16, Instagram, rutas/orígenes y referencia visual.
El caso positivo usa archivos/metadatos sintéticos temporales, nunca aprueba materiales oficiales.

node scripts/require-stories-publication.mjs produce exit1 BLOQUEADO003 por faltantes.
Entrada real /historias.html en Astrodev produjoHTTP500; logs identifican assertStoriesPublication
en historias.astro y BLOQUEADO003, antes de render. El HTML de error de Vite no incluía
mensaje, por eso la comprobación se contrastó con logs del servidor, no solo cuerpoHTTP.
npm run build produceexit1 en guard de páginas por app/contacto faltantes; guardsInicio/003
permanecen en cadena. No se generó dist completo ni páginas de relleno.

La revisión editorial se asocia al texto exacto de cada bloque y a copy común de catálogo/pasos;
un cambio invalida reviewedText. Gate local no consulta red ni acredita vigencia de007,
medios decodificables, equivalencia de transcripción, testimonios o revocación de recursos.
