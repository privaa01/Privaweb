# Modelo de datos — 007

Modelo implementado y migrado en bancosSQLite locales sintéticos; no migración productiva ejecutada. Ver [contrato](contracts/story-management.md).

## Historia (stories_records)

- id: slug estable; nuevas historias `historia-<UUID>` en minúsculas. Los tres IDs iniciales003 se preservan.
- revision: entero>=1, creciente en guardar/publicar/activar; CAS obligatorio en cambios existentes.
- workingJSON: snapshot privado actual; publishedJSON: snapshot vigente nullable.
- pendingChanges: booleano; active: booleano independiente, false al crear.
- createdAt/updatedAt/publishedAt: fechas UTC del servidor; publishedAt nullable.
- createdBy/updatedBy: referencias de cuenta privada, nunca parte del catálogo.
- Orden público: createdAt ascendente e id como desempate; importación conserva orden de los tres iniciales.
- Estado editorial derivado: publishedJSON null => Borrador; no null => Publicada.
- Elegible público: publishedJSON no null AND active. Invariante: no activar sin publicación válida.

Una historia publicada con cambios pendientes conserva su estado editorial/activación. No suma otra
fila ni aumenta Borradores. Tabla Inactivas incluye todas las no elegibles, incluidos borradores.
Guardar sin cambios puede conservar revision y devolver recibo confirmado sin introducir pendingChanges.

## Snapshot editorial

Texto plano, sin HTML/Markdown ejecutable; recortar extremos al validar, sin convertir faltantes en
contenido. Contar puntos de código Unicode, rechazar NUL/controles no textuales (permitir tab/salto
en campos multilínea). Límite aplica también al borrador; mínimo solo a publicación.

| Campo | Límite técnico | Para publicar |
|---|---|---|
| title | 160 | No vacío |
| category | 80 | No vacío; texto, sin módulo de categorías |
| description | 3000 | No vacío |
| imageResourceId | ID opaco o null | Ready; imagen válida |
| imageAlt | 500 | No vacío para imagen informativa |
| audioResourceId | ID opaco o null | Ready; audio válido |
| transcript | 20000 | No vacío y revisión de equivalencia |
| question | 300 | No vacío; iniciales conservan pregunta aprobada |
| options | Exactamente tres posiciones de editor | Tres opciones completas |
| options[].id | Estable único dentro de historia | Preservar al editar |
| options[].label | 500 | No vacío |
| options[].explanation | 3000 | No vacío; riesgo y prevención |

Borrador puede omitir cualquier contenido y recursos; editor conserva tres posiciones vacías sin
inventar opciones. Publicación exige conjunto completo; validación de cadena no demuestra revisión
editorial, derechos, transcripción equivalente ni explicación correcta. No existe correctAnswer,
score, respuestas de visitantes ni contador por historia.

## Recursos (stories_resources)

id opaco, historiaId FK, kind(image/audio), storageKey interno único, sha256, bytes, mime validado,
width/height o durationSeconds reales, state(staging/ready/rejected), createdAt, uploadedBy.
No aceptar rutas/URL ni reusar un ID de otra historia en un snapshot. Los snapshots guardan referencias
inmutables; cambiar imagen/audio crea recurso distinto. ready no equivale a público: se comprueba
pertenencia al snapshot vigente de historia elegible en cada petición pública.
Inspección/decodificación y fsync preceden estado ready; FK no demuestra presencia física. Publicar
comprueba existencia/integridad preparada y no acepta staging. Fallo de disco antes de commit bloquea
publicación; pérdida posterior de recurso produce error observable y no certifica disponibilidad.

## Operación (stories_operations)

operationId UUID PK, accountId, storyId, kind, requestHash, expectedRevision nullable, resultRevision,
resultSummary y committedAt. El recibo se escribe con la mutación en la misma transacción.
Consulta de recibo exige cuenta autora autorizada; lecturas de historia siguen disponibles para todas
las cuentas autorizadas. Recibo no contiene payload completo, credenciales ni archivos.
No purgar recibos automáticamente en referencia local: política operativa009/P02 antes de producción.
Una clave desconocida no demuestra fallo: puede haber solicitud en curso; verificar/reintentar
explícitamente misma clave y payload, sin generar nueva creación por un timeout.

## Resumen y tabla

Resumen derivado, no contador mutable: activas=count(publicada AND active), borradores=count(no
publishedJSON). Consultas de Contacto: available+total o unavailable, sin datos personales.
Listado administrativo ordenado por creación, búsqueda por título trim con comparación casefold
Unicode consistente servidor/cliente, sin búsqueda en contenido privado adicional. Todas/Activas/
Inactivas filtran tras búsqueda; contadores globales no dependen de filtros. Título vacío se etiqueta
como falta de título solo para UI, nunca se guarda un título ficticio.

## Transiciones atómicas

| Acción | Precondición | Resultado |
|---|---|---|
| Crear/Guardar borrador | Autorización, límites, operationId nuevo | Una historia, activefalse, working conservado |
| Guardar existente | Autorización, revision coincidente | Cambia working; published y active intactos |
| Publicar | Autorización, CAS, working completo y recursos ready | published=working; pendingfalse; active intacto |
| Activar | Autorización, CAS, publicación válida | activetrue; conserva pending/working |
| Desactivar | Autorización, CAS | activefalse; conserva ambos snapshots/archivos |
| Duplicado exacto | Autorización y recibo de esa cuenta | Devuelve resultado original sin mutación |
| Conflicto | Revision antigua o clave/payload distintos | 409, no escribe ni pierde borrador cliente |

Publicar no hace guardado implícito de texto sin confirmar: UI exige guardar cambios actuales primero
y hace visible esa condición. Al publicar inactiva informa Publicada, inactiva; activar es acción
explícita separada. No borrar historias ni revertir por una respuesta de red tardía.
