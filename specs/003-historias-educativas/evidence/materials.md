# Inventario de materiales — Historias003

Actualización: 2026-10-26 (America/Bogota).

## Recursos compartidos recibidos

Logo oficial `disenovisual/Link-PrivaHome.png`, copia local `/brand/priva-logo.png`, 104 × 40; Plus Jakarta Sans local/OFL y paleta de `disenovisual/referencias.txt`. La configuración de003 referencia esos recursos ya aportados. CSS de Historias usa los tokens aprobados y foco claro en el cierre oscuro. No se vuelve a solicitar la marca/fuente/paleta.

## Seis imágenes oficiales recibidas y conectadas

Recibidas en el commit GitHub6e7f523, inspeccionadas visualmente y verificadas desde sus encabezados PNG sin modificar bytes.

| Destino | Archivo | Dimensiones verificadas | SHA-256 |
|---|---|---|---|
| Hero | `/images/stories/aprende.png` | 500 × 350 | `aa342d070f7ba9eeb56c829c25fb0ce0714e1897c2a40f1ece33459a36e2e55a` |
| Metodología | `/images/stories/identifica.png` | 500 × 350 | `3939b698e8f9265ec17d132533a5eaf5f1d561ede6677bc4bd62f75047d1bf77` |
| Cierre | `/images/stories/explora.png` | 500 × 350 | `3e74b16f8b0888f3c8005379ae90c2f3fcb842541e321972f8c8da512705c93c` |
| Enlace falso | `/images/stories/enlace.png` | 660 × 195 | `3975acdf39f26e48b8314d527246c7eb2938146e63d66768c3a704379a837737` |
| La llamada sospechosa | `/images/stories/llamada.png` | 660 × 195 | `a9e507bfcec0f8a05b450c03bf4f9e19ff966d1ef580e8a404cb00ca14a49288` |
| La contraseña compartida | `/images/stories/contra.png` | 660 × 195 | `85266b1b2563e92b5050f7aec8bf09f19b1259f7441d9d82ddc3a94ead1c767c` |

Hero, metodología y cierre están configurados en storiesContent como recursos verificados y decorativos, con alt vacío: complementan títulos/textos completos. Las portadas de casos tienen alternativas descriptivas y se asocian a sus IDs en src/content/story-images.ts. El importador restringido007 las usa cuando el operador omite imagePath; conserva autorización, revisión, inspección real, publicación separada y respeto de cambios gestionados. Las imágenes de historias ya publicadas siguen proviniendo del catálogo007, sin sobreescribirlas desde el cliente.

La relación horizontal660/195 se conserva sin recortes; el CSS no fuerza el anterior aspecto1.6. El banco de pruebas usa las tres portadas reales y mantiene audios/datos explícitamente sintéticos. Ver connected-images.md para validación y límites. El bloqueo de imágenes/Instagram/referencias ya no aparece en el guard003; permanecen las cinco revisiones editoriales.

## Recepción de audios

Carpeta fuente de GitHub: **content/stories/audio/**, preparada en0d024c4. Preferir MP3, con nombres enlace-falso.mp3, llamada-sospechosa.mp3 y contrasena-compartida.mp3. También se admite WAV conforme al inspector existente. Subir mediante Add file → Upload files. Transcripciones existentes pueden acompañarse en archivos .txt del mismo nombre.

La carpeta está fuera de public: los archivos no se sirven automáticamente en la web. Es una carpeta versionada del repositorio, no un almacén privado por esa ubicación. La importación definitiva requiere audios revisados, transcripciones y explicaciones, y mantiene las historias como borrador/inactivas hasta publicación explícita. No se sustituyen relatos finales por los tonos del banco.

## Pendientes adicionales

| Elemento | Estado |
|---|---|
| Audios y transcripciones | Cuatro originales aprobados e inspeccionados; tres asociados a casos iniciales, cuarto Número desconocido para contenido ampliado. Transcripciones/fichas pendientes; ver audio-assignment.md |
| Nueve explicaciones | Riesgo/prevención y coherencia con los relatos pendientes de revisión |
| Textos de relatos reales/capacidades | Revisión editorial identificable pendiente; aprobación de Inicio no se extrapola a003 |
| Instagram | https://www.instagram.com/priva_inc/ aportada y configurada; ver social-reference.md para comprobaciones y limitación de acceso remoto |
| Revisión visual/manual final | Imágenes recibidas; espera revisión de contenido/audios finales y lector de pantalla |
| Integración007 | Recursos/publicación/estado de catálogo real y entorno integrado pendientes |

T031 permanece parcial por audios, transcripciones, explicaciones y revisión editorial; las seis imágenes y recursos compartidos ya están recibidos.

## Audios recibidos —2026-10-26

Se sincronizaron los cuatro archivos de GitHub325fc49 en content/stories/audio/. Todos son MP3 válidos (audio/mpeg), aprobados por la responsable e inspeccionados con aislamiento FFmpeg. Correspondencia con los tres casos iniciales y función del cuarto solicitadas y pendientes. Registro: audio-approval.md y content/stories/audio/manifest.json. No se aprueban transcripciones o explicaciones por esa declaración.

## Correspondencia confirmada —2026-10-26

1→La contraseña compartida;2→La llamada sospechosa;3→Enlace falso;4→Número desconocido para Ver todas las historias. Los tres primeros están conectados como audios por defecto del importador privado007 con huella de aprobación; no se publican/activan por recibirlos. Para el cuarto se conserva la ficha pendiente y el ID se generará mediante gestión normal. Ver audio-assignment.md.

## Aprobación editorial aplicada — 2026-10-28

La responsable respondió «Sí, apruebo los textos públicos corregidos» para hero, metodología, cierre, identidad, catálogo y pasos Escucha/Reflexiona/Aplica. Se registraron cinco snapshots inmutables en src/content/stories-review.json, con referencia a evidence/public-copy-review.md; el guard sigue invalidando modificaciones materiales. No se aprobaron ejercicios ni se importaron/publicaron historias.

Verificación: 45/45 pruebas Node Inicio/Historias, guard003 salida 0 y Astro check (95 archivos, 0 errores/advertencias, 1 hint previo). Integración real002: 18/18 aprobadas, seis recorridos por motor Chromium/Firefox/WebKit. Historias HTTP200; /api/public/historias HTTP404: el catálogo007 aún no está conectado al servidor local. Captura .test-output/stories-approved.png. Build completo conserva salida1 en guard010/009.

La navegación desde Inicio ya está verificada; T027/T031 de002 mantienen el requisito residual de build completo, y T028 el cierre integral: 30/33 tareas. No se confunde renderizado de Historias con disponibilidad del catálogo, aprobación de ejercicios ni publicación productiva. Logs: .test-output/stories-approved-unit.log, stories-approved-check.log, home-approved-integration.log y home-approved-build.log.

## Publicación local vigente

Las cuatro fichas fueron publicadas por mandato explícito de la responsable el2026-10-28. Cuarta portada: reutilización de llamada.png autorizada; audios/transcripciones/ejercicios incluidos por la orden de publicación. No se afirma cotejo independiente no ejecutado. [Resultado y pruebas](local-publication.md). Pendientes anteriores de fichas sin publicar son históricos para este entorno.

## Cotejo documental y coherencia — 2026-10-28

Se inspeccionaron las tres páginas renderizadas del PDF original y se compararon sus cuatro relatos con los TXT y los campos transcript de las fichas JSON. Coincidencia íntegra al normalizar únicamente espacios y saltos de línea; se conservan la puntuación y las particularidades del original. SHA256 del PDF y de los cuatro audios coinciden con sus manifiestos. Resultados reproducibles por archivo: [registro de verificación](materials-verification-2026-10-28.json).

Revisión editorial de las doce explicaciones (nueve iniciales y tres de la cuarta ficha): cada opción contiene riesgo y prevención, y corresponde a una acción narrada. Luisa: reutilización de contraseña, apariencia de tienda y oferta sin verificar. Juliana: código compartido, identidad telefónica no comprobada y supuesto problema de cuenta. Carolina: logos/perfiles, datos personales y de cuenta, transferencia bajo presión. Salomé: conocimiento del nombre, código compartido y temor al supuesto acceso. Las descripciones y categorías mantienen esos protagonistas y situaciones. No se introducen puntuaciones ni afirmaciones de casos reales. En Carolina, la prevención advierte que imágenes, audios y videos del mismo contacto no bastan para verificarlo, coherente con la falsificación narrada.

Portadas iniciales vinculadas mediante src/content/story-images.ts; cuarta con llamada.png por autorización explícita. Instagram conserva la referencia oficial previamente confirmada por la responsable en src/config/social.ts; esta revisión no acredita disponibilidad remota actual.

T031 permanece parcial: este cotejo documental no acredita equivalencia palabra por palabra entre los audios y las transcripciones mediante escucha. No se solicita de nuevo autorización de publicación ya recibida ni se modifica el contenido aprobado. T032 (revisión manual/lector) y T033 (calificación de producción/build) conservan sus pendientes.

Reinicio local de esta sesión: la carpeta temporal disponible estaba vacía. Se recuperaron las cuatro publicaciones mediante el operador privado y el mandato existente, conservando hashes y contenidos. Se regeneró únicamente el identificador local de la cuarta ficha y se sincronizaron recibo/manifiesto. Esto evidencia que el almacenamiento temporal de desarrollo no sustituye persistencia productiva.

## Aprobación de la responsable — 2026-10-28

Después del resumen del cotejo y sus pendientes, la responsable indicó: «apruebo todo, realiza commit y sube cambios». Se registra aprobación general de los cambios presentados y autorización de commit/push. Esta declaración no documenta por sí misma la ejecución de escucha comparada, pruebas con lector de pantalla ni validación productiva; esas verificaciones conservan su estado pendiente hasta contar con evidencia.
