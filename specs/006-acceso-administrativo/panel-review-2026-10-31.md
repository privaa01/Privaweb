# Estructura del panel administrativo —2026-10-31

Referencia: panel-administrativo.jpeg recibido en006/references. Se continúa por petición de la responsable «seguimos con el panel administrativo?». Reutiliza marca/fuente oficiales y los componentes reales, sin publicar administración en Firebase.

## Cambios

Sidebar con Historias/Contacto privado, iconos y página activa; identidad y cierre en tarjeta inferior; cabecera Consola administrativa; área de trabajo con jerarquía única. /admin presenta ahora el gestor de historias, al igual que /admin/historias. Tres tarjetas de resumen, buscador/filtro, tabla, nota de conservación y cierre con enlace público. Se conservan los hooks/API y semántica de guardado/publicación/activación; el resumen sigue leyéndose del servidor. No se copian128 consultas, avatar, cuentas o duraciones de ejemplo del wireframe. La columna Publicación y el acceso a Contacto privado respetan decisiones anteriores, sin respuestas educativas almacenadas.

La bandeja privada completa pertenece008; no se añade un listado comunitario ni aprobación pública para imitar la imagen. El panel no se declara terminado ni calificado para producción.

## Verificación

La matriz inicial detectó overflow a360/1024px con texto200%; se corrigieron anchuras de botones, tarjetas y apilado. Después axe detectó tabla horizontal sin foco: se añadió región etiquetada/tabindex y foco visible, conservando desplazamiento horizontal. Campaña final general89/90 aprobada; una celdaChromium1024/100 agotó30s durante axe sin informar infracción. Repetición focalizada1/1 aprobada. Son90 casos únicos verificados, no91 y no una campaña única90/90 verde. Log admin-panel-ui-verified-2026-10-31.log y admin-panel-timeout-recheck-2026-10-31.log.

Gestión007 con autenticación/SQLite reales aisladas y materiales sintéticos de banco:14/14 combinaciones Chromium (7anchos×100/200%) conformes tras corregir overflow. Editor/teclado/contraste/axe/contadores/tablas comprobados. No acredita inspección de medios ni producción; Firefox/WebKit007 de servicio no se declaran aprobados. Logs admin-panel-management-final-2026-10-31.log. CheckAstro97 archivos:0errores/advertencias,1hint previo. Diff conforme.

## Vista para revisión

http://127.0.0.1:4353/ muestra una instantánea de diseño de solo lectura, preparada desde componentes reales con respuestas deAPI simuladas para la revisión visual. Usa las cuatro historias del catálogo público aprobado como muestras;0borradores es valor de maqueta, no consulta al repositorio privado. Consultas recibidas y duraciones se muestran No disponible; cuenta vista@example.test es sintética. No se obtuvieron registros privados ni se sembraron cuentas reales.

Se eliminaron scripts y se deshabilitaron controles/enlaces de esta instantánea antes de servirla, sin crear endpoints de autorización de prueba o quitar guards del producto. La identidad/cifras de maqueta no se usan en producción. El estado para lector identifica Vista de diseño, solo lectura, no una sesión real. Los botones de la instantánea no ejecutan operaciones; los del componente fueron probados en banco real aislado. Capturas manuales de muestra sin credenciales: admin-panel-1440.png y admin-panel-390.png.

006 permanece59/63, revisión visual/manual T059 y producciónT060–T062 pendientes.007 permanece59/63 con verificaciones parciales deT056/T057; operación/build continúan pendientes. No commit, push o despliegue público en esta petición.
