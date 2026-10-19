# Modelo de datos — 003

Diseño 2026-10-16; no crea base de datos ni registros de producción.

## Historia pública (PublicStory)

Proyección de 007, nunca el registro administrativo. Campos obligatorios:

| Campo | Regla |
|---|---|
| id | Identificador estable único, no índice ni título; patrón seguro para IDs DOM |
| title, category, description | Texto no vacío, coherente con relato validado; sin HTML ejecutable |
| image | src autorizada, alt con propósito, width/height positivos |
| audio | src de recurso publicado válido y type de formato admitido; sin duración del wireframe |
| transcript | Texto completo equivalente validado; no depende de descarga del audio |
| question | Texto editorial no vacío; los tres casos iniciales conservan ¿QUÉ ERROR SE COMETIÓ? |
| options | Exactamente 3 objetos id/label/explanation; IDs únicos dentro del caso |
| explanation | Específica de riesgo y prevención, no vacía, validada contra relato |

Proyección excluye correos, cuentas, comentarios, respuestas de visitantes, secretos,
campos privados de auditoría, borradores y registros inactivos. Publicación+activación se
comprueban en servidor007, no mediante un booleano confiado al cliente.
Contrato rechaza IDs duplicados y formas/URLs inválidas; no convertir error en catálogo vacío.
Validar URLs con parser: mismas rutas de recursos publicados o HTTPS de origen de medios
explícitamente configurado/verificado; prohibir javascript:, data:, credenciales y traversal.
Los límites de subida y formatos definitivos se resuelven en007; no imponerlos aquí como producto.

## Catálogo público

`{ schemaVersion: 1, stories: PublicStory[] }`, colección completa ordenada y sin duplicados.
Orden lo determina 007 de forma estable; los tres casos iniciales elegibles conservan orden PDF.
Nuevos casos se incorporan sin recortar el listado completo. Lista vacía válida significa vacío
confirmado; error HTTP/red/esquema significa error. No se inventan historias para completar tres.

Estados UI: loading → ready | empty | error; ready incluye visibleCount=min(3,n) o n al expandir.
Revalidar: cualquier estado → loading (descartar tarjetas previas y pausar audios) → resultado.
El borrado DOM elimina selección; respuestas nunca se guardan. Expansión no reconstruye tarjetas
existentes. Sin ID válido no generar enlaces ni grupos de controles inseguros.

## Estado de audio (por instancia)

idle/loading/ready/playing/paused/ended/error; currentTime/duration solo desde HTMLMediaElement.
Duración desconocida hasta metadatos finitos positivos. Error muestra mensaje asociado, no
confirmación de reproducción; transcripción permanece disponible. Retirada pausa y libera listeners.
No sincronización/estadísticas entre casos ni autoplay; no requisito de reproducción exclusiva.

## Estado educativo (por historia)

`selectedOptionId: null | optionId` solo en memoria. Al change muestra explanation de esa opción.
ID DOM/nombre de radio compuesto con storyId+optionId evita interferencias. Cargar/recargar,
restaurar documento o reemplazar catálogo reinicia. Cambiar una opción no cambia otro caso.
No correcta, puntuación, contadores, URL, form submit, requests ni almacenamiento asociado.

## Contenido de página y revisión

StoriesPageContent: hero (etiqueta/título/descripcion/imagen/CTA#casos), metodología
(imagen/título/tres pasos), dos bloques de identidad con anclas Inicio, cierre (título/imagen/
párrafo exacto C16/social). Activos con src/alt/dimensiones/sourceRef y revisión documentada.
`testOnly` identifica fixtures, que el gate de entrega rechaza. Estado pendiente no equivale a aprobado.
SocialLink compartido con005: URL Instagram HTTPS oficial y reviewRef; ausencia bloquea publicación.
Revisión editorial incluye respaldo de historias reales, nueve explicaciones y revisión Juan/P03.

## Ciclo de vida externo (007)

Borrador incompleto → publicación solo con campos/recursos/revisión válidos; solo publicada+activa
se proyecta. Desactivar retira sin borrar; reactivar vuelve sin duplicar; editar conserva id.
No definir en003 concurrencia del editor, almacenamiento o permisos de administración.
Revisión y evidencia deben cubrir tanto JSON público como acceso a recursos excluidos.
