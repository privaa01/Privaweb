# Contacto demo en Firestore

2026-10-28. Cambio expresamente solicitado por la responsable: conexión directa sin backend propio y publicación de la demo.

## Resultado verificado

Formulario publicado:https://priva-785cb.web.app/contacto.html. Guarda datos ficticios predefinidos en demo_contact de priva-785cb/(default),nam5 mediante APIREST. Sin credenciales administrativas, SDKprivado, correo ni consultas reales en el cliente.

Reglas:firestore.rules compiladas y publicadas con FirebaseCLI. Las reglas anteriores eran el acceso temporal de prueba para toda la base y se respaldaron localmente antes del cambio. Las nuevas permiten únicamente creación de documentos conUUID y los siete campos exactos/valores ficticios autorizados, confirmacióntrue y fechaREQUEST_TIME; deniegan lecturas/listados/actualizaciones/borrados del público y cualquier acceso público a otras colecciones. No se leyeron ni migraron registros ajenos a las pruebas de esta tarea.

15comprobaciones reales de reglas aprobadas: creación y lectura administrativa para comprobar persistencia; rechazo de correo/alias/mensaje ajenos al catálogo ficticio, campo adicional, confirmaciónfalse, modo/revisión incorrectos, fecha falsificada, otra colección, IDinválido, lectura pública, listado, borrado y actualización. El operador verificó y eliminó exclusivamente el documento sintético de esta comprobación y los tres documentos creados por los navegadores.

Chromium/Firefox/WebKit sobre la URLpublicada: envíoHTTP200y persistencia comprobada, confirmación requerida, doble submit sin segundo request, éxito solo tras commit, reset sin confirmación preseleccionada, sin cookies/localStorage/sessionStorage, axe0violaciones y móvil390px/texto200% sin overflow. Tipado estricto conforme y build demo de7páginas conforme. Resultados estructurados en contact-firestore-results.json. Suite reproducible en tests/demo-contact-live.mjs; requiere sesión del operador y FIREBASE_TOOLS_LIB para comprobar y limpiar sus propios registros de prueba. También se comprobó antes sobre el emulador deHosting conectado a la base real.

Se actualizaron la identificación de demo, términos y privacidad para describir los datos ficticios efectivamente guardados. Contacto del producto completo y su backendSQLite conservan su estado previo; no se califican009/010por esta demostración ni se habilitan datos personales reales. Sin promesa de borrado automático, protección antispam completa o recuperación productiva.

Publicación:firebase deploy --only hosting --project priva-785cb, con predeploy build:demo. Publicación de reglas separada:--only firestore:rules. Cada despliegue mantiene los guards del build completo sin alterarlos.
