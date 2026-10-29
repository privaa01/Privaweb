# Demo pública de Priva

La responsable autorizó publicar una demostración educativa y, el2026-10-28, solicitó conectar Contacto a Firestore directamente, sin backend propio. URL:https://priva-785cb.web.app.

La demo reutiliza componentes/textos aprobados de Inicio, Historias y Priva App. Las cuatro historias se generan desde las fichas y audios aprobados, verificando hashes. Su catálogo es estático: cambios y retiros requieren nuevo despliegue. No incluye administración pública ni funciones operativas de Priva App.

Contacto conecta el navegador a Firestore mediante la APIREST. Solo admite alias y mensajes ficticios predefinidos y prueba@example.test. Guarda confirmación del modo demo, versión y fecha del servidor en demo_contact. Las reglas permiten crear ese esquema exclusivamente y deniegan lectura/listado/actualización/borrado al público; otros documentos tampoco tienen acceso público. No se usa SDKadministrativo ni secretos en el navegador, no se envían correos y no se habilitan consultas reales. La responsable revisa/elimina los registros en la consola de Firebase. Sin borrado automático ni afirmación de protección antispam completa.

El build del producto completo conserva sus guards y pendientes009/010. Este despliegue solo califica el alcance explícito de la demo; no acredita esos requisitos productivos.

## Construcción y despliegue

- `npm run build:demo`: preflight de textos/recursos aprobados, genera demo/public/ y .demo-dist/ con siete páginas.
- `firebase deploy --only firestore:rules --project priva-785cb`: compila/aplica firestore.rules.
- `firebase deploy --only hosting --project priva-785cb`: ejecuta build:demo y publica solo .demo-dist/.
- Páginas/catálogo:no-store. Audios estáticos identificados porSHA256:cache pública1hora para Range en elCDN. Referrer-Policy:no-referrer y nosniff.

## Verificación

La publicación inicial se verificó en vista previa y sitio principal: siete páginas, cuatro historias/audios, expansión, transcripciones y ejercicios. Chromium/Firefox/WebKit reprodujeron, pausaron y buscaron a10s. ElCDN responde206con100bytes exactos aRange. Python/http.server y el emulador no calificaron rangos; la vista previa inicial conno-store en audio devolvía200. Se ajustó caché solo en audio y la prueba final pasó. Historial inicial:deployment-report.json.

Contacto:plan en contact-firestore-plan.md, informe en contact-firestore-review.md. Pruebas en tests/demo-contact-live.mjs verifican15condiciones de reglas con solicitudes sin credenciales y3recorridos reales de navegador; el operador autenticado comprueba y elimina únicamente los documentos sintéticos creados en esa ejecución. Requiere FIREBASE_TOOLS_LIB apuntando al directorio lib de firebase-tools del operador y PRIVA_DEMO_URL con la URL a probar. No imprimir tokens ni compartir credenciales. No es una suite apta para ejecutar sin sesión de operador porque necesita comprobar persistencia y limpiar sus registros.

`PRIVA_DEMO_URL=https://priva-785cb.web.app node tests/demo-smoke.mjs` comprueba páginas/historias sin enviar Contacto. Los tests usan navegadores Playwright y Chrome del entorno. Datos de respuestas solo en memoria; no se añaden cookies ni almacenamiento local.

Fuente para la descripción del procesamiento técnico de Hosting:https://firebase.google.com/support/privacy (consulta2026-10-28).
