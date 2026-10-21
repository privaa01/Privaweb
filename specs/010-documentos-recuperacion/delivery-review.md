# Entrega y destinos010

**Fecha**: 2026-10-20 (America/Bogota). Verificación local con datos sintéticos, no calificación de alojamiento.

| Destino | Fuente real comprobada | Resultado local | Pendiente |
| --- | --- | --- | --- |
| `/historias.html#casos` | `StoriesCatalog.astro`, h2 casos | Fixture y mapa de código conformes | Render integrado real |
| `/app.html#como-funciona` | `app.ts` + `AppSteps.astro`, ID de contenido | Fixture y mapa de código conformes | Render integrado real |
| `/app.html#descarga` | `app.ts` + `AppDownloads.astro`, ID de contenido | Fixture y mapa de código conformes | Render integrado real |
| `/contacto.html#escribir` | `ContactForm.astro`, sección y encabezado | Encabezado visible/foco conformes en fixture | Integración con operación real |

No se creó QR ni destino. Debe verificarse material final y, si incluye QR, aprobar URL y probar lectura; no declarar no aplicable por falta de materiales.

GET/HEAD local:404 con cuerpo propio en rutas simples/anidadas/query; salidaInicio200, recursos con MIME correcto, errores no son redirect/200. Se rechazan traversal, archivos fuera de raíz por symlink, listado de directorios y rutas reservadas. Los prefijos privados devuelven error genérico del banco; no se atribuye a ello prueba de autorización de producción. API/admin existentes permanecen sin modificación de sus handlers.

404 no refleja la URL. Respuesta no-referrer y meta temprano evitan reenviar ruta al volver; sentinelas sintéticos no aparecen en DOM. Auditoría local en documentos/error: ninguna petición externa, localStorage/sessionStorage vacíos, sin cookies nuevas. Aviso/regreso comprobado sin datos persistidos. El servidor010 no registra peticiones ni query. El host real sí recibe la URL y necesita política y configuración revisadas.

T028/T035/T040/T041 siguen parciales/bloqueadas: alojamiento/CDN, cache/proxy, rutas privadas, cinco recorridos009 y proveedores reales pendientes. No son sustituidos por pruebas de fixture. No despliegue ni envío de correo real.
