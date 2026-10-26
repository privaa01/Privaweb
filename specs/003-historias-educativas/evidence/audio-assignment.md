# Correspondencia de audios confirmada por la responsable

Fecha:2026-10-26 (America/Bogota). Originales recibidos desde GitHub325fc49. Aprobación de los archivos registrada en audio-approval.md; inspección real en audio-inspection.json.

La responsable indicó: «2- llamada sospechosa / 1- contraseña compartida / 3- enlace falso / 4- en ver más». Posteriormente tituló el cuarto «nuemero desconocido», normalizado ortográficamente a **Número desconocido**, sin alterar su significado.

| Archivo | Caso / uso | Duración inspeccionada |
|---|---|---:|
| historia_tres_editada.mp3.mpeg | Enlace falso, enlace-falso |142.999542s |
| hidtoria_dos_editada.mp3.mpeg | La llamada sospechosa, llamada-sospechosa |118.993042s |
| historia_uno_editada.mp3.mpeg | La contraseña compartida, contrasena-compartida |138.715500s |
| hidtoria_cuatro_editada.mp3.mpeg | Número desconocido, contenido adicional de Ver todas las historias |109.954667s |

## Conexión implementada

`server/stories/initial-audio.ts` vincula los tres IDs iniciales a sus archivos exactos, duración/tipo y SHA-256. El importador privado usa ese audio cuando se omite audioPath, conservando la opción de ruta explícita para el operador. Comprueba que los bytes coinciden con la aprobación, inspecciona MP3 y registra un recurso de audio/mpeg: no depende de que la extensión sea .mp3.mpeg ni necesita recodificar el original. Authorization, revisión requerida y verificación de medios se mantienen.

No se cambian historias ya gestionadas ni se insertan registros en una base productiva. La recepción/asociación de medios no activa el catálogo. Los tres casos seguirán apareciendo según sus estados publicados/activos persistidos en007.

## Cuarto audio

El manifiesto de fuentes lo identifica como Número desconocido, clave de material numero-desconocido y placement expanded-catalog, con storyId aún null: el ID real lo generará el flujo de gestión007 al crear la ficha. No se incorpora al conjunto de tres IDs iniciales ni se inventa un registro publicado.

La UI ya ofrece las primeras tres historias y amplía las adicionales al pulsar Ver todas las historias; no necesita un comportamiento nuevo para esta cuarta. Su aparición requiere completar ficha (categoría, descripción, portada, transcripción, tres opciones y explicaciones), revisión y publicación/activación. El título y el audio ya están identificados y aprobados, pero no sustituyen esos campos.

Las transcripciones equivalentes y explicaciones de los tres casos iniciales tampoco fueron aportadas por esta respuesta. No se usan transcripciones sintéticas para publicar audios reales. Los registros con texto de prueba se usan únicamente en la suite aislada para comprobar asociación, hash y estados.

## Verificación de la conexión

- `npm run test:story-management`:40casos aprobados,0fallidos/omitidos; incluye asociación de los tres MP3 reales mediante sus hashes y conservación de catálogo inactivo, y rechazo atómico de una huella de aprobación alterada.
- `npm run check:story-management:service`: TypeScript NodeNext estricto aprobado.
- Cuatro MP3 aprobados reproducen, pausan y permiten buscar al segundo10 en Chromium,Firefox yWebKit:4casos por motor. Se prueban códec/controles mediante Blob local, sin servidor público ni afirmar entregaHTTP/Range o publicación de historias. Resultados en approved-audio-{chromium,firefox,webkit}.json; reproducer approved-audio-playback.cjs. WebKit usa el wrapper aislado ya documentado por001.
- La prueba de asociación falló antes de conectar el valor por defecto de audioPath y pasó después; audio-mapping-red.txt conserva ese fallo funcional. No se suman repeticiones como casos adicionales.

Los archivos originales y sus extensiones se conservan sin modificar bytes. Cambios locales, sin commit/push de la conexión en esta fase.

## Actualización: transcripciones entregadas por la responsable

Se recibió `TRANSCRIPCIONES.pdf` y se conservó en `content/stories/transcripts/`. La numeración coincide con la asignación anterior: Luisa (1), Juliana (2), Carolina (3), Salomé (4). El índice registra el hash del PDF y las rutas de las cuatro extracciones. Este aporte resuelve la falta de texto fuente, sin afirmar cotejo independiente contra los MP3.

Se prepararon cuatro fichas en `content/stories/drafts/`, cada una con pregunta, tres opciones y explicaciones de riesgo y prevención, ajustadas al documento. Los ejercicios son borradores pendientes de revisión, no una aprobación editorial implícita. Las cuatro fichas pasan el validador real de StoryDraft en modo borrador; no se han importado, publicado ni activado. La portada de la cuarta sigue pendiente. El manifiesto vincula cada audio con su transcripción y su ficha propuesta.
