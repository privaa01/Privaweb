# Revisión de documentos y recuperación de la demo — 2026-11-03

Alcance autorizado: continuar010 en la demo pública y el panel local ya aprobados, sin publicar cambios ni habilitar consultas reales/correo. La recuperación de010 se refiere a una ruta pública inexistente404; recuperación de contraseña pertenece006. La guía Word aportada sigue inventariada en009/received-guide-review-2026-10-28.md; no se requiere aportarla nuevamente. Checklist010:16/16 documental, marcadores intactos.

## Actualización del borrador interno

src/config/documents.ts conservaba que Firebase y la publicación estaban pendientes. Se actualizaron proveedor, ubicación y estadoMVP, revisión010-mvp-draft-2026-11-03: demo publicada en FirebaseHosting; pruebas ficticias en Firestore; panel funcional localNode/SQLite separado; bandeja local sin conexiónFirestore ni envío; cookies necesarias administrativas. No se completan por inferencia copias, políticas finales de otras categorías, permisos, vigencia o evidencia/revisiones. El contenido general de la versión completa sigue siendo borrador, no una promesa de operación de la demo.

FirestoreCLI autenticado, consulta de solo lectura: base(default), locationId nam5. No se cambiaron configuración, reglas ni datos. Respuesta privada de comprobación ignorada:.test-output/documents-firestore-check-2026-11-03.json. La información de Hosting sobre uso de IP/retención de algunos meses se cotejó con la fuente oficial, secciónFirebaseHosting: https://firebase.google.com/support/privacy (consultada2026-11-03). Es una declaración del proveedor, no una auditoría de sus sistemas.

## Comprobación del sitio publicado

Origen:https://priva-785cb.web.app. Términos/Privacidad:GET200,HEAD200sin cuerpo, Cache-Control:no-store y Referrer-Policy:no-referrer. Rutas inexistentes simples/anidadas:GET404con cuerpo español y salidaInicio,HEAD404sin cuerpo; consulta sintética no reflejada. La ruta pública/api/admin/sesion responde404estático: confirma ausencia de API administrativa en esta demo, no autenticación401. Las fronteras del servicio administrativo completo siguen pendientes para una integración productiva.

playwright.documents.demo.config.ts y tests/e2e/documents-demo.spec.ts ejecutan solo lectura contra el sitio existente: sin formularios, provisión, credenciales, correo, HAR/trazas/vídeo ni cambios deFirebase.

- Accesos directos, ocho enlaces de documentos desde los cuatro footers, retornoContacto,404/HEAD/Inicio y referrer:1/1conforme.
- Lectura de Términos/Privacidad/404 a360/390/430/768/1024/1280/1440px y fuente200%:21celdas, teclado y axe por página, sin overflow; sin nuevas cookies, local/sessionStorage ni solicitudes externas observadas en este recorrido:1/1conforme. No acredita el resto del sitio/CDN ni borrado externo.
- Campaña inicial:1aprobada/1timeout al recargar repetidamente404durante la matriz. Revisión del banco: cargar una vez cada documento, esperarDOMContentLoaded y encabezado visible, después cambiar anchos. Repetición solo del caso afectado:1/1conforme; dos casos únicos aprobados, sin afirmar una campaña final2/2única. ChromiumGoogleChrome; no nueva campañaFirefox/WebKit por ejecutables ausentes en este host.
- 27/27Node010conformes. Primer intento de las dos pruebasHTTP bloqueado por permiso del puerto; repetición autorizada27/27. Astrocheck97archivos:0errores/0warnings/1hint existente. Diff conforme.
- Gate010 conserva salida1 por operación/revisión/009 pendientes. No se ejecutó despliegue ni build general con gates relajados.

Logs ignorados:.test-output/documents-demo-2026-11-03.log, documents-demo-recheck-2026-11-03.log, documents-current-2026-11-03.log, documents-current-check-2026-11-03.log y documents-current-gate-2026-11-03.log.

## Estado y revisión pendiente

Avance parcialT035/T037/T040/T041/T043 y regresiónT036. Se mantiene35/44 porque no se ha redefinido el cierre productivo de las nueve tareas abiertas. T034 requiere revisión manual real/lector; la aceptación previa de menú o panel no la sustituye. T038 requiere revisión humana de textos finales; T039 y producción dependen de009. No se atribuye aprobación legal a la guía ni a estas pruebas. El documento público de privacidad quedó abierto para la responsable; su aprobación no se presupone.

## Confirmación posterior de la responsable

2026-11-03: confirmó títulos, enlaces y retornoInicio/Contacto de las tres páginas con teclado y VoiceOver. T034 completada para la demo actual;36/44. La descripción de revisión pendiente del apartado anterior conserva el estado previo a esta respuesta. No aprueba T038/revisión editorial ni producción.
