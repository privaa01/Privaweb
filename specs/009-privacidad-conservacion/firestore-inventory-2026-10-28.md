# Base Firestore creada por la responsable

2026-10-28. La responsable informó que ya configuró la base de datos en Firebase. Consulta de metadatos mediante `firebase firestore:databases:list --project priva-785cb --json` conforme, sin lectura de documentos ni cambios de permisos.

- Proyecto:priva-785cb.
- Base:(default).
- Tipo:FIRESTORE_NATIVE; ediciónSTANDARD.
- Ubicación:nam5.
- Creación:2026-10-28T23:56:11.319675Z (18:56:11 America/Bogota).
- Recuperación a un punto en el tiempo:deshabilitada según metadatos.
- Protección contra eliminación:deshabilitada según metadatos.

La retención de versiones informada por la API no se interpreta como calendario de conservación de consultas ni prueba de copia/restauración. No se auditaron reglas, permisosIAM, colecciones, contenido o políticas de respaldo en esta consulta.

El repositorio todavía usa SQLite para servicios locales y la demo pública únicamente Hosting/archivos aprobados. La existencia de Firestore no constituye integración del backend. Siguiente trabajo: planificar el adaptador y el servicio de acceso, manteniendo contratos, permisos, autorización, conservación/borrado y pruebas existentes; no conectar el navegador directamente a una colección abierta ni migrar registros sin alcance definido. La demo conserva Contacto deshabilitado y no se redespliega por esta consulta.

## Actualización posterior de la demo

Por petición expresa de conectar sin backend propio, Contacto demo ahora accede directamente a Firestore con datos ficticios predefinidos y reglas de creación exclusivamente. Es una integración limitada de demostración; el backend del producto completo sigue usandoSQLite local. Las reglas temporales abiertas se sustituyeron por el esquema cerrado descrito en [informe de la demo](../../demo/contact-firestore-review.md). Pruebas de persistencia/rechazo y limpieza documentadas; no se acredita calendario de retención, restauración o recepción real por esta integración.
