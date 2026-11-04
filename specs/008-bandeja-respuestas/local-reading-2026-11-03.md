# Bandeja de lectura local — 2026-11-03

La responsable confirmó el acceso006 y aprobó el gestor007 local antes de pedir continuar con008. Se conserva la decisión vigente de no usar proveedor de correo. T067 conecta lectura privada persistente, filtros, detalle, historial y conteo007, sin envío de respuestas.

server/inbox/local.ts abre contact.sqlite en el directorio privado del perfil administrativo, fuera del checkout y las raíces servidas. Reutiliza esquema005/008, autorización006, repositorio008 y claves separadas. Inicializa una base vacía; no importa Firestore ni inserta ejemplos en la base de la responsable. No crea proveedor ni worker de correo. El remitente reservado no entregable exigido por el repositorio compartido es interno y nunca se usa para envío.

El router compartido incorpora repliesEnabled=false en esta composición. Tras comprobar sesión, origen, CSRF y formato, un intento de responder recibe503/mail_unavailable sin registrar intención. La UI local presenta este límite y deshabilita editor, confirmación y envío. Las vistas productivas y fixtures ordinarias conservan el comportamiento de respuesta; sus gates siguen pendientes.

Antes de habilitar lecturas se retiran registros locales vencidos; mantenimiento cada minuto. Esto no acredita eliminación de copias ni operación009 productiva. Cerrar el servidor cierra la conexión008. Se corrigió un error de sintaxis preexistente del comando de parada y se verificó su ejecución real antes de reiniciar, manteniendo comprobación HTTPS/instance y retirada de confianza por el supervisor.

## Verificación

- Checklist documental requirements.md:16/16 satisfechos; no equivale a pruebas de aplicación.
- tests/admin-local-runtime.test.ts:1/1 conforme en HTTPS real con base/certificados temporales. Consulta ficticia mediante repositorio005 real: vacío inicial, filtros, destinatario/detalle, historial, conteo007, persistencia tras reinicio, respuesta bloqueada sin cambio de revisión/historial, sesión ausente/cerrada, origen ajeno, CSRF y rutas privadas no expuestas. Incluye regresión006/007. Log ignorado:.test-output/inbox-local-runtime-2026-11-03.log.
- HTTP/lectura/resumen008:7/7 conformes; bases temporales, doble de correo aislado únicamente en el banco existente. Incluye deadline30s y comportamiento ordinario de respuestas. Log:.test-output/inbox-local-regression-2026-11-03.log.
- UI:20/20 Chromium conformes (14 celdas de accesibilidad360–1440px a100/200%, cinco casos existentes y uno nuevo de lectura sin envío). Las otras40 pruebas no ejecutaron comportamiento por falta de ejecutables Firefox/WebKit: campaña global20 aprobadas/40 errores de lanzamiento. No se cuentan como aprobadas. MockUI explícito, sin correo real. Log:.test-output/inbox-local-ui-2026-11-03.log.
- Typecheck008 conforme; build local de vistas conforme; Astrocheck privado:103 archivos,0errores/0warnings/1hint existente.
- Navegador integrado de la responsable en /admin/contacto: sesión verificada, aviso de lectura local, resumen real0/0/0 y vacío explícito. Vista dejada abierta sin crear consultas ni automatizar contraseñas.

T067 completa. T056/T057/T060/T062/T063/T064 continúan abiertas: proveedor/recepción, operación de privacidad y producción, revisión manual/lector y regresión completa. Sin despliegue, commit/push, correo ni conexión a mensajes de Firebase.
