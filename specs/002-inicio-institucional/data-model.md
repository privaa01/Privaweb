# Modelo de contenido — Inicio 002

Sin persistencia de visitante, base de datos ni entidades administrativas nuevas.
Modelo versionado de contenido y metadatos de revisión, no un CMS ni pantalla de aprobación.

## HomeContent

Cuatro bloques ordenados: hero → identidad → áreas → cierre. Un solo h1 en hero;
títulos de sección h2; títulos de tarjetas h3. Propiedades tipadas y contenido explícito.
No #maria, formularios, historias adicionales o cifras de demostración.

## InstitutionalBlock

- `id`: hero, somos-priva, que-hacemos o cierre; único por página.
- `eyebrow`, `title`, `description`: texto requerido según spec.
- `image`: referencia del inventario para hero/identidad/cierre; áreas contiene cuatro tarjetas.
- `cta`: solo hero y cierre; etiqueta/href según contrato, no acciones en tarjetas.

Conocer más apunta a #somos-priva; Explora nuestras historias apunta a /historias.html.
Párrafo C16 exacto; no permitir versión anterior como contenido aprobado.

## AreaCard

Cuatro entradas y orden fijo: Educación Digital, Historias educativas, Herramientas Seguras,
Acompañamiento. Cada una tiene `title`, `description` y `review`.
No href, onClick ni control enfocable agregado. Descripción no vacía y revisada para entrega.
La introducción de Qué hacemos también requiere review por capacidades anunciadas.

## EditorialReview

- `status`: pendiente o revisado.
- `decisionReference`: evidencia/decisión que respalda el texto, requerida al pasar a revisado.
- `reviewedText`: texto exacto aprobado para usar en entrega; no inferirlo del título de tarjeta.

Pendiente → revisado solo por decisión o evidencia identificable del responsable; generar
un spec o copiar el wireframe no cambia ese estado. Un cambio material al texto invalida la
revisión previa y requiere nueva revisión. No hay servicio de aprobación dentro de 002.

## ImageResource

- `block`: hero, identidad o cierre.
- `status`: pendiente o verificado.
- `src`: ruta de archivo oficial local; requerida y existente para verificado.
- `width`, `height`: dimensiones reales positivas, conocidas al recibir el recurso.
- `purpose`: informativo o decorativo, clasificado con el recurso recibido.
- `alt`: significativo si informativo; vacío si decorativo.
- `sourceReference`: procedencia oficial registrada, no una URL inventada.

Marca/logo se recibe mediante BrandAsset del layout de 001; fuente/colores oficiales y
clasificación final siguen en inventario de recursos compartido. Los assets de fixture solo
son datos de prueba y no pasan verificación de publicación como si fueran oficiales.

## PublicationReadiness

Lista de bloqueos derivada del contenido y archivos: recurso ausente/no verificado,
descripción pendiente, texto C16 incorrecto, anclas/orden o inventario incompletos.
La entrada real no renderiza entrega si hay bloqueos; informa archivo/regla afectada en
herramientas de desarrollo/build. No insertar checklist técnico ni marcadores en UI pública.
Conocer la existencia de /historias.html no acredita aprobación/fidelidad del destino: su
aceptación integrada se prueba aparte, sin fetch ni autenticación en este modelo.
