# Revalidación del acceso administrativo

Fecha2026-10-28, America/Bogota. Trabajo sobreT058, solicitado como siguiente tarea tras aceptar Contacto demo. No se habilitan cuentas reales, administración pública ni correos externos.

## Entrada documental

| Checklist | Total | Revisados | Pendientes | Estado |
| --- | --- | --- | --- | --- |
| requirements.md | 16 | 16 | 0 | Conforme |

Casillas del checklist intactas. Prerrequisitos006 verificados mediante check-prerequisites.sh. Sin .specify/extensions.yml ni hooks registrados. Node24.22.1/macOSARM64, Playwright1.64.1 y los navegadores instalados; Chrome del sistema, Firefox y WebKit. Dependencias/lock conservados.

## Correcciones de los bancos

- Las pruebas de recuperación creaban activation@example.com y lost-reset@example.com para cada motor en la mismaSQLite de la campaña. Tras Chromium, Firefox/WebKit repetían cuentas y el controlador privado rechazaba la creación. Se separan esos dos correos ficticios por browserName; se mantienen credenciales y verificaciones originales del caso. No se modifica provisión ni reglas de negocio del servicio.
- La prueba de teclado usa Alt+Tab en WebKit sobre macOS para recorrer todos los controles conforme a la preferencia nativa; los otros casos mantienenTab. No se cambia la configuración del sistema ni el código de foco del producto.
- El servidor estático de la UI pasa de HTTPServer a ThreadingHTTPServer para atender conexiones concurrentes/preabiertas del navegador. La primera campaña observó esperas próximas a30s en WebKit. Se interrumpió esa campaña después de identificar el problema y se repitió completa tras el cambio. Interrupciones y repeticiones no se suman como pruebas aprobadas.

## Interfaz en tres motores

Campaña final90/90aprobada,0fallos/omitidos,30por Chromium/Firefox/WebKit. Incluye acceso, errores, teclado, recuperación y sesiones; matriz7anchos×100/200% con4escenas por celda y axe/contraste/tamaño/foco/overflow. Duración de la campaña:1.6min. Los datos deAPIde este banco son mocks explícitos; no representan servicio ni correo productivos. Resultado:.test-output/admin-results.json; log:.test-output/admin-revalidation-final-2026-10-28.log. La repetición final ya incluye las tres correcciones del banco.

## Servicio real y límite WebKit

Campaña final:24casos ejecutados,16aprobados (8Chromium+8Firefox),8fallidosWebKit,0omitidos. Verifica SQLite/cookies/CSRF/sesiones/cierre/replay, dos cuentas con mismos permisos, pestañas/historial, recuperación mediante buzón sintético privado, respuestas perdidas, caducidad y reinicio del proceso. El buzón de pruebas no acredita recepción de correo externo.

Diagnóstico mínimo separado, sin valores de cookies: GET /api/admin/contexto devuelve200 y Set-Cookie Secure tanto a Chromium como a WebKit. Chromium conserva __Host-priva_preauth; WebKit no la conserva sobre el origen HTTPdel banco. Eso bloquea los flujos del servicio antes de completar el acceso/recuperación. Se registra el requisito de un banco HTTPSconfiable para calificar WebKit; no se quita Secure/__Host/HttpOnly/SameSite, ni se ignoran errores de certificado, ni se publica el servicio local por un túnel.

Log final:.test-output/admin-service-revalidation-final-2026-10-28.log. Reporte local:.test-output/admin-service-results.json. Diagnóstico saneado incorporado al resumen JSON de esta revisión. Primera campaña de servicio:14aprobadas/10fallidas antes de corregir duplicados; no se cuentan sus casos dos veces.

## Reproducción

Con PATH de Node/npm del entorno:

```sh
PRIVA_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ASTRO_TELEMETRY_DISABLED=1 node node_modules/@playwright/test/cli.js test --config playwright.admin.config.ts
PRIVA_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ASTRO_TELEMETRY_DISABLED=1 node node_modules/@playwright/test/cli.js test --config playwright.admin.service.config.ts
```

BancosUI4328/servicio4329 con roots diferentes. Se detuvo la vista previa Python4329 creada para la demo, confirmando su comando antes de detener únicamente ese proceso. No se detuvo la aplicación4321 ni se cambió Firebase. Traces/vídeo/capturas/snapshots automáticos desactivados por política del banco; no incluir claves, cookies, comprobantes o enlaces de recuperación en evidencia.

Tipado estricto de los dos tests modificados conforme. git diff --check conforme. No se ejecutan unitarias de negocio ni build productivo adicional porque el producto no cambió. T058 sigue parcial por WebKit/HTTPSdel servicio; las revisiones manuales, provisión/correo productivos y calificación009/010 siguen pendientes. Total006:58/63.
