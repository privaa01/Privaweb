# Alcance de Contacto para la demo publicada

2026-10-30, America/Bogota. Continuación solicitada después de001–004. Prevalece la decisión explícita «es modo demo conectalo sin backend» y la aceptación posterior «perfecto, funciona». Se cierra esta etapa de demostración; el producto de consultas reales conserva sus obligaciones pendientes.

La página demo es demo/src/pages/contacto.astro con DemoLayout, textos explícitos de prueba, campos de nombre, correo y mensaje con el texto aportado por la responsable; solo se admite el catálogo ficticio y prueba@example.test. Puede escribirse en los campos, pero solo el catálogo ficticio pasa la validación local y las reglas de Firestore. No hay recepción de consultas reales, respuesta por correo ni panel. Tras la observación de la responsable («el contactanos no es igual que el wireframe»), se corrige la interpretación previa: la demo debe conservar hero/ilustración, Instagram y formulario en columnas, orden móvil y cierre del wireframe. Solo los controles/avisos de envío se adaptan al modo ficticio. No se afirma cotejo preciso contra PDF4 original ausente.

El navegador crea documentos demo_contact mediante Firestore REST sin servidor propio. Reglas: siete campos exactos, valores ficticios, confirmación y fecha del servidor; lectura/listado/actualización/borrado públicos denegados. Operador autorizado comprueba y elimina solo registros sintéticos de la ejecución. No secretos administrativos en cliente ni endpoint público de lectura de prueba.

Los avisos y documentos demo describen almacenamiento real de pruebas, sin correo ni consultas reales ni promesas de borrado automático. No se califican la retención90d, copias/restauración, proceso de eliminación, canal/identidad legal completos o correo del producto final. Se conservan como pendientes009/010, además del panel006/008.

Doble envío se bloquea en cliente y create-only por UUID. El reintento conserva UUID; ante respuesta perdida se informa resultado desconocido y puede no recuperarse el acuse porque la lectura/actualización pública está denegada. No se afirma replay verificable, exactamente-una-vez tras pérdida de respuesta o no-resurrección tras borrado del operador. La recuperación completa firmada/ledger del contrato original sigue pendiente para producción; no se sustituye por garantías ficticias de Firestore.

T045 verifica composición, avisos, destinos y revisión específica manual; la aceptación visual de la corrección fue confirmada por la responsable («esta perfecto»); T046 califica restricciones operativas demo y mantiene producción diferida; T047 prueba persistencia y denegaciones reales con lectura privada del operador; T048 verifica build:demo, publicación corregida y matriz. No se alteran guards del build completo. Las pruebas históricas SQLite/UI del producto se conservan con su alcance, sin contarlas como Firebase.

La responsable confirmó los controles de Contacto anteriores a la corrección visual: «Sí, todo funciona con teclado y VoiceOver» para opciones ficticias, correo de solo lectura, confirmación, Enviar prueba, resultado y Nueva prueba. Evidencia humana reportada el30 de octubre; versiones no proporcionadas.

Actualización de textos/campos: [form-copy-2026-10-30.md](form-copy-2026-10-30.md). No se reutiliza la revisión de controles anteriores como prueba manual de los inputs actuales.
