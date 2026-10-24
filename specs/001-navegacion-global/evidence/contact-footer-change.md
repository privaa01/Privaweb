# Contacto Seguro abre la página de Contacto

Fecha: 2026-10-23 (America/Bogota). Decisión explícita de la usuaria posterior a confirmar los controles con VoiceOver: «haz que en el footer en el contacto seguro, vaya directamente a la pestaña de contacto».

Cambio: `footer.links` en `src/config/navigation.ts` usa `/contacto.html` sin fragmento. El SiteFooter compartido lo aplica desde Inicio, Historias, App y Contacto, manteniendo la etiqueta Contacto Seguro y navegación nativa en la misma pestaña. No se altera el formulario ni sus validaciones. `#escribir` se conserva para los accesos directos y enlaces de aviso/Manifiesto ajenos al footer.

Se sincronizaron FR-006/US3.4/contrato001 y el consumidor005. Las pruebas contractuales, matriz y suite integrada ahora esperan la página desde su encabezado principal. La aprobación manual de controles se registra aparte en manual-navigation-review.md; no se afirma una prueba manual posterior al cambio.

## Verificación

- Prueba antes del cambio de código: cuatro escenarios de footer fallaron al esperar `/contacto.html` y recibir `/contacto.html#escribir` (contact-footer-red.txt).
- Chromium: cuatro escenarios aprobados; cada uno comprueba el enlace y lo activa con puntero y Enter desde una de las cuatro páginas. URL sin hash, título principal visible y activo Contáctanos correctos (contact-footer-chromium.txt).
- Firefox: los mismos cuatro escenarios aprobados con puntero/Enter (contact-footer-firefox.txt).
- Astro check contractual: 0 errores/advertencias; 1 hint previo de administración (contact-footer-check.txt).

Son cuatro casos por motor con ocho activaciones por motor, no dieciséis casos. Las ejecuciones previas completas de 46/32 constan en closure-status.md; este cambio se valida con la regresión focalizada, sin presentarla como nueva ejecución completa de toda la matriz. Los destinos siguen siendo explícitamente contractuales; la suite integrada real no se ejecutó por falta de entorno y dependencias ya documentadas.

23/28 tareas completas en001; la confirmación manual de controles no cierra aceptación integrada de documentos, Contacto, administración ni WebKit. Sin commit/push/despliegue.
