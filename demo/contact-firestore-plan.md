# Contacto demo directo a Firestore

2026-10-28. Petición expresa: «es modo demo conectalo sin backend». Alcance: navegador→API REST de Firestore, sin servidor propio, SDK administrativo, credenciales privadas, Functions, correo o cambios al backendSQLite del producto completo.

Formulario exclusivo para datos ficticios: alias y mensajes predefinidos, correo fijo prueba@example.test, confirmación de modo demo sin preselección. No admite texto libre ni consultas reales. Se avisa que los registros se guardan realmente en la colección demo_contact de la base(default) del proyecto priva-785cb, regiónnam5. Se administran y eliminan por la responsable en la consola de Firebase; no se promete borrado automático aún no implementado.

Contrato: documento con UUID, mode=demo, revision=demo-contact-v1, alias permitido, email fijo, mensaje permitido, consent=true y createdAt con transformación REQUEST_TIME. Crear solamente; lectura/listado/actualización/borrado del cliente denegados. Sin cambios de reglas en colecciones de producto usadas por SQLite. Las reglas previas eran la apertura temporal inicial para todo documento; se conserva copia local en .test-output/firestore-rules-before.json antes de sustituirlas por acceso limitado a demo_contact y denegación del resto. No se leen ni migran registros existentes.

Interfaz: no persistir entradas en cookies/localStorage/sessionStorage, bloquear doble envío, reutilizar UUID en reintento ante error y avisar que un fallo de red podría haber guardado el registro. Confirmar éxito solo al recibir respuesta válida de commit. No afirmar exactamente-una-vez tras respuesta perdida, protección antispam completa o calificación de producción009/010.

Aceptación: build demo, envío real desde el navegador en3motores y verificación administrativa de los documentos de prueba creados; pruebas REST sin credenciales de lectura/listado, cambios/borrado, esquema adicional, correo no ficticio, mensaje libre, confirmación ausente, timestamp falso y escritura fuera de colección rechazadas; limpiar únicamente documentos generados por las pruebas. Redesplegar la demo manteniendo historias/rangos. Documentar las pruebas y límites.
