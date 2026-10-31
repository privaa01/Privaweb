# Alcance de cierre de Historias para la demo

Fecha: 2026-10-30, America/Bogota. La responsable pidió «sigamos con la 003» tras cerrar 001/002 para la demo publicada. Se continúa el mismo objetivo de demostración sin habilitar gestión administrativa o backend productivo.

H01–H12 conservan bloques, cuatro recreaciones educativas aprobadas, audio/transcripción, ejercicios sin puntuación ni envío, metodología, identidad y destinos. Tres tarjetas iniciales y Ver más historias para la cuarta; recursos y textos ya autorizados, sin volver a pedir permiso para publicarlos.

La fuente demo es GET /demo/catalog.json, generado por build-demo.mjs desde fichas/manifiesto y mandato de publicación, con hashes validados. No se usa el endpoint productivo007 ni se introduce una copia de consultas privadas. Cambios/retiros del catálogo requieren nuevo despliegue. Páginas/catálogo: no-store; MP3 públicos con nombre SHA256 y caché de una hora para Range. No se promete desactivación instantánea o autorización sobre archivos públicos previamente descargados.

Aceptación: build:demo y página real de Firebase; matriz publicada y recorridos de los cuatro audios/ejercicios, contraste, foco, privacidad de selecciones y paridad de materiales. Se requiere revisión humana del cotejo de audios/transcripciones y de los controles educativos con teclado/VoiceOver; no se reutiliza como tal la revisión de navegación de 001.

Se difieren para producción las operaciones y API007, retiro de URLs/cachés privadas/desactivadas, carga de un catálogo futuro no acordado y build completo condicionado por009/010. Sus contratos se conservan como referencia futura; no se desactivan guards ni se certifican con la demo estática.

La revisión de escucha y de controles con teclado/VoiceOver fue confirmada por la responsable el 30 de octubre. Se acepta la composición de la demo ya revisada; una comparación nueva contra PDF2 original se conserva pendiente para producción. Véase evidence/demo-closure-2026-10-30.md.
