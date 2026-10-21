# Modelo de contenido010

**Estado**: diseño, 2026-10-20; no esquema de base de datos ni datos oficiales completados.

## DocumentBundle

Una única fuente estructurada en `src/content/documents.ts` agrupa Términos, Manifiesto y aviso. Campos: `revision` identificable, `testOnly`, idioma `es`, documentos por ID estable `terms`/`manifesto`, aviso y datos públicos operativos. Cada documento tiene título, ruta fija, secciones con ID/título/párrafos/enlaces y vigencia cuando corresponda. Renderizar texto escapado; no HTML arbitrario ni contenido recibido de la URL.

Datos operativos: identidad/contacto del responsable, canal verificado, proveedores/destinatarios con función, ubicación/condiciones, políticas por categoría, cookies necesarias, ciclos diferenciados operativos/proveedores/buzones/copias, referencias de evidencia. Ausente es pendiente, no una cadena ficticia aceptable. Nunca incluir secretos, consultas, correos de visitantes o código de eliminación.

Los compromisos compartidos remiten a reglas009:90 días; actividad por recepción/aceptación original de nueva respuesta; bloqueo al vencer; revisión al menos horaria y borrado≤1h; solicitud verificada por correo guardado y borrado≤24h desde confirmación válida o límite anterior. El aviso puede resumir y enlazar al detalle; no se exige repetir cada párrafo en tres lugares.

## EditorialReview

Revisión por cada uno de los tres textos: `status` pendiente/revisado, identidad del revisor autorizado por el proyecto, fecha, referencia de revisión y huella SHA-256 del contenido/datos revisados. Fechas válidas no futuras; referencia resoluble en repositorio privado o expediente de revisión, sin publicar detalles internos. Huella canónica con orden de campos estable; excluye el propio registro de aprobación. Huella del conjunto enlaza versiones coherentes de los tres textos. No es firma criptográfica de identidad ni prueba legal: exige revisión humana registrada.

Estados derivados: **pendiente** si faltan contenido/datos/revisión; **discrepante** si existen contradicciones o huellas desactualizadas; **revisado editorialmente** si validación y revisión coinciden; **elegible para entrega** únicamente si además se califican operación009, alojamiento y gates relacionados. Cambiar texto/datos invalida revisión afectada y huella del conjunto. No habrá panel ni CRUD nuevo para estos estados.

## RecoveryDestination

Destino fijo con ruta y ancla opcional; `index`→`/index.html`; `casos`→`/historias.html#casos`; `como-funciona`→`/app.html#como-funciona`; `descarga`→`/app.html#descarga`; `escribir`→`/contacto.html#escribir`. Sin entradas basadas en petición ni redirecciones proporcionadas por visitante.

QR opcional: destino aprobado, referencia de aprobación y evidencia de lectura. Si no existe material QR aprobado, registrar no aplicable con motivo; no generar QR nuevo. Si existe y falta aprobación/prueba, queda bloqueado, nunca aprobado por omisión.

## Relaciones y validaciones

Bundle→dos documentos+aviso→tres revisiones→evidencia009 vinculada a revisión de entrega. Contacto consume el aviso del mismo conjunto; conservar compatibilidad con `ContactContent.notice`005 mediante adaptación y validar igualdad contra la fuente canónica. No duplicar textos editables independientemente.

Comprobar secciones obligatorias R-02–05, rutas, campos oficiales, marcadores de borrador, protocolos permitidos (`https:`/`mailto:` cuando corresponda y rutas internas fijas), fechas/huellas y `testOnly:false` en entrega. La mera ausencia de corchetes o presencia de palabras clave no acredita contenido completo: la revisión humana verifica sentido y operación. No crear persistencia de visitante para facilitar regreso al formulario.
