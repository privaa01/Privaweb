# T033 — entrega e integración local

Fecha2026-10-28. La responsable confirmó «todo esta correcto, sigamos con la siguiente tarea» después de la matriz final y la corrección de Leer transcripción. Se registra aceptación visual general del resultado; no sustituye una sesión documentada con lector de pantalla ni una comparación con el PDF2 original.

## Verificaciones realizadas

Auditoría HTTP sobre http://127.0.0.1:4321, servicio007 real y cuatro relatos publicados. Resultado estructurado: [delivery-audit-2026-10-28.json](delivery-audit-2026-10-28.json).

- Catálogo200,14217bytes, cuatro entradas; una muestra de36.7ms en loopback. Las cuatro fichas conservan exactamente título, categoría, descripción, transcripción completa, pregunta y tres opciones de los archivos aprobados; sin truncamiento en esta colección. Se verificaron1755–2194caracteres por transcripción.
- GET de los cuatro MP3:200 y SHA256 exactamente igual al original aprobado. Content-Type audio/mpeg; longitud íntegra2652951–3444518bytes.
- HEAD:200, sin cuerpo y Content-Length igual al archivo original.
- Range bytes=0-99:206 con Content-Range y100bytes idénticos al inicio del original. Range bytes=-100:206 con los últimos100bytes exactos.
- Range fuera del archivo:416 con Content-Range bytes */longitud, en cada audio.
- Catálogo y medios con Cache-Control:no-store; medios Accept-Ranges:bytes, sin habilitar Access-Control-Allow-Origin. Host ajeno example.test rechazado403. UUID de recurso inexistente404.
- Las transiciones publicar/desactivar/reactivar/editar y la exclusión de recursos privados ya se verificaron en9/9casos sobre servicio real aislado; véase [transitions-review-2026-10-28.md](transitions-review-2026-10-28.md). No se repitieron escrituras en la base de la responsable.
- UI y catálogo completo:42/42combinaciones reales aprobadas en3motores, con expansión de3a4sin truncamiento/overflow y comprobación adicional de desbordamiento interno del summary. Véase [accessibility-final-materials-2026-10-28.md](accessibility-final-materials-2026-10-28.md).

Auditoría de medios ejecutada mediante urllib contra el servicio, comparando bytes y cabeceras con content/stories/audio/manifest.json. Medición de descarga de cada MP3 en esta muestra:4.15–7.25ms; refleja únicamente el equipo local, sin cache/CDN remoto, red móvil ni compromiso de rendimiento. Cuatro relatos constituyen la colección actual aprobada; no se atribuye representatividad a un volumen futuro no acordado.

## Build completo

Se ejecutó exactamente package.json/scripts.build mediante spawnSync con shell y el PATH de Node del entorno, sin eliminar ni saltar guards. Salida1 antes de Astro:

```text
BLOQUEADO010: documentos, revisión o calificación operativa pendientes: operation:location, operation:copies, operation:categories, operation:cookies, operation:permissions, operation:evidence, document:terms, document:manifesto, review:terms, review:manifesto, review:notice, privacy:policy, privacy:channel, privacy:confirmationMail, privacy:operationalErasure, privacy:replica, privacy:backups, privacy:restore, privacy:providers, privacy:tracking, privacy:notices
```

Log:.test-output/stories-complete-build.log. Las páginas existen; el bloqueo es de información/revisión y evidencia operacional009/010. No se califica como error de compilación de Historias ni como build exitoso.

## Estado y siguiente dependencia

T033 queda parcialmente verificada localmente: faltan origen público/backend y entrega desplegada con Firebase, cabeceras/CDN/rangos/retiro de recursos en ese entorno, volumen representativo acordado y build completo habilitado por009/010. Firebase está elegido para el frontend, sin asumir proveedor/región del backend ni políticas de copia/borrado. No se ejecutó despliegue. T031 conserva escucha comparada y T032 las verificaciones manuales pendientes. Total003:32/35; no se cierran casillas con evidencia local que exige producción.
