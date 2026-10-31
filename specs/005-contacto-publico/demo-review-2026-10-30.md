# Aceptación vigente —2026-10-30

La responsable confirmó «esta perfecto, realiza commit y sube cambios» sobre Contacto corregido y publicado. T045 cerrada:53/53 tareas demo. Se mantiene producción diferida y no se afirma cotejo técnico exacto contra PDF4 original. Los estados de reapertura siguientes son históricos.

# Estado posterior: corrección de wireframe

La responsable objetó la composición simplificada. T045 reabierta,52/53 tareas; se restauran los bloques del wireframe manteniendo datos ficticios. [Corrección](wireframe-correction-2026-10-30.md). El cierre53/53 siguiente corresponde a la revisión anterior y queda sustituido en lo visual.

# Cierre005 para la demo — 2026-10-30

53/53 tareas del alcance demo completadas. [Alcance y diferencias con producción](demo-scope-2026-10-30.md), [resultados estructurados](demo-review-2026-10-30.json). URL: https://priva-785cb.web.app/contacto.html.

## Evidencia de cierre

- T045: composición simplificada ya aceptada, aviso previo de datos ficticios/Firestore/sin correo y enlace real a privacidad. La responsable confirmó «Sí, todo funciona con teclado y VoiceOver» para opciones ficticias, correo solo lectura, confirmación, envío, resultado y nueva prueba. Revisión humana reportada, versiones no suministradas. No se acredita comparación nueva contra PDF4.
- T046:15 comprobaciones efectivas de reglas después de restaurar la versión autorizada: creación ficticia con fecha servidor y lectura privada del operador; correo/alias/mensaje libres, campo extra, confirmación falsa, modo/revisión/fecha falsos, otra colección, ID inválido y acceso público read/list/update/delete denegados. Sin credenciales administrativas en navegador. Las reglas abiertas detectadas al inicio no se cuentan como aprobadas ni se infiere quién las cambió.
- T047:3 recorridos reales, uno por Chromium/Firefox/WebKit: confirmación obligatoria, commit HTTP200 y relectura autorizada de documento correcto, doble envío sin segunda solicitud, resultado posterior a commit, Nueva prueba sin casilla preseleccionada, axe sin infracciones y sin cookies/storage. No API interceptada ni endpoint de lectura de prueba. Cuatro documentos creados y eliminados en la campaña final; otros dos creados por la campaña fallida inicial también eliminados. La limpieza apunta solo a identificadores propios y al documento de fallo identificado por campos ficticios exactos/tiempo de ejecución; no modifica registros ajenos.
- T048:45/45 pruebas publicadas:42 celdas (7 anchos ×100/200% ×3 motores) más3 sinJavaScript. Se miden tamaños/foco/ausencia de overflow/axe, labels, readonly, casilla obligatoria y enlace a privacidad. Sin peticiones de envío en esta matriz ni red de terceros. Typecheck estricto conforme; Astro check95 archivos,0 errores/advertencias,1hint previo. Build:demo de7 páginas conforme en predeploy; despliegue Hosting completado y SHA256 de los7 HTML públicos iguales al build. El build del producto completo conserva guards009/010, sin calificarse con la demo.

## Defectos encontrados y corregidos

La primera prueba de reglas recibió200 al enviar person@example.org, fuera del catálogo ficticio. Se restauró firestore.rules mediante firebase deploy --only firestore:rules --project priva-785cb; compilación/publicación conformes. La repetición completa aprobó las15 comprobaciones. El documento inesperadamente aceptado era sintético y fue eliminado por el operador; no se imprimieron credenciales ni se consultaron registros reales.

La primera matriz detectó selectores WebKit de26px de alto. Se ajustó únicamente el estilo de los selectores de demo/src/pages/contacto.astro para appearance:none con flecha SVG local y tamaño/padding existentes. Resultado publicado a390px/100%:47 y68px. Captura .test-output/contact-demo-webkit-fixed.png inspeccionada, contenido legible y sin recortes. Los fallos adicionales de navegación tras validación nativa se resolvieron en el test: cerrar el globo de validación con Escape y activar el enlace con teclado; no se atribuyen a enlaces rotos. Matriz final45/45.

## Reproducción y límites

PRIVA_DEMO_URL=https://priva-785cb.web.app, PRIVA_CHROMIUM_EXECUTABLE apuntando a Chrome del sistema; Playwright con playwright.contact.demo.config.ts. Para tests/demo-contact-live.mjs se requiere FIREBASE_TOOLS_LIB y sesión autorizada del operador:15 condiciones y3 navegadores, con limpieza propia. Ahora no admite URL implícita de fixture, registra fecha America/Bogota y registra objetivos de limpieza antes de probar valores inválidos. Node24.22.1, Playwright1.64.1, macOSARM64, Firefox157/WebKit27.2. Reportes/logs locales ignorados bajo .test-output/contact-demo-*.

Reintento demo conserva UUID/create-only sin garantizar recuperación verificable de acuse perdido; no equivale a ledger/replay del contrato completo. No hay consultas reales, correo, borrado automático, protección antispam completa ni panel. Retención90d/copias/restauración/acceso administrativo/identidad legal y operación productivas siguen pendientes009/010/006/008. Sin commit/push en esta ejecución. Las pruebas históricas SQLite/UI del producto conservan su alcance y no se vuelven a sumar como Firebase.
