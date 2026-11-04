# Ejecución completada

Autorización «dale» recibida;24/24 casosHTTPS finales aprobados en3motores. Certificado y confianza temporal retirados al terminar, salidas0. [Evidencia](verification-2026-10-31.md). Los pasos pendientes descritos después son el plan histórico previo a la autorización.

# Banco local HTTPS para verificar006 en WebKit

Fecha:2026-10-31. Implementación de transporte opcional en tests/fixtures/admin-service/transport.ts y playwright.admin.service.config.ts. Solo código de pruebas; sin cambios a servicio productivo ni Firebase. El banco continúa escuchando127.0.0.1:4329. Sus enlaces de recuperación y comprobaciones Origin usan el mismo origen del transporte.

PRIVA_ADMIN_TEST_TLS_CERT y PRIVA_ADMIN_TEST_TLS_KEY deben definirse juntas con rutas absolutas a archivos fuera de raíces servidas. La clave exige permisos privados; se comprueban vigencia, localhost y pareja certificado/clave. TLS mínimo1.2; sin ignoreHTTPSErrors, NODE_TLS_REJECT_UNAUTHORIZED=0 ni retirada de Secure/HttpOnly/SameSite/__Host. El modo HTTP histórico se conserva para regresión, sin contarlo como calificación WebKit.

Se prepararon exclusivamente en .tools/admin-local-tls (ignorada,0700; claves0600) una CA de prueba local30d y un certificado de localhost/127.0.0.1 de7d. No se ha instalado confianza ni modificado llaveros del equipo. Claves nunca se imprimen o agregan al repositorio.

CA:Priva Local Test CA. Huella SHA256:83:AB:A4:D3:30:3A:04:16:2C:71:F8:B6:DE:46:2A:7C:D3:4F:B9:A7:12:FF:DD:94:9E:F9:D7:64:9F:E4:86:66.

Para que Safari/WebKit valide la cadena se necesita confiar explícitamente en esta CA en el llavero del usuario. Este paso queda pendiente de autorización de la responsable porque modifica la confianza de certificados del equipo; no se hace automáticamente ni se sustituye por ignorar errores. Solo se importaría el certificado público ca.pem, nunca su clave. Puede retirarse del llavero una vez completada la campaña.

Tras autorización, usar las rutas absolutas de localhost.pem/localhost-key.pem en las variables anteriores y repetir los24 casos del servicio. Los reportes nunca incluyen passwords/cookies/proofs; los datos y buzón permanecen sintéticos/privados. La recuperación local no prueba entrega de correo externo.

Comprobación previa:2/2 Node del transporte, con certificado efímero propio y limpieza final. Se prueba rechazo del certificado no confiable y aceptación al proporcionar explícitamente la CA al cliente Node; esto no equivale a confianza de navegador ni cierra T058. Typecheck estricto conforme.

Regresión HTTP posterior al cambio:8/8 recorridos Chromium aprobados, sin fallos/omitidos. Se mantienen login, cookies Secure, permisos, cierre/replay, pestañas, recuperación sintética, expiración y reinicio. No se repite la UI90/90 ya verde porque no cambió producto. Log local admin-http-regression-2026-10-31.log.

En el procesoNode que arranca Playwright usar NODE_EXTRA_CA_CERTS con ca.pem para polling/APIRequestContext, conservando validación; los navegadores requieren su propia confianza del emisor. La confianza Node no se presenta como prueba WebKit.
