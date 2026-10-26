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
