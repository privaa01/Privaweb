# Integración y navegadores — 002

Actualización: 2026-10-21 (UTC).

`npm run test:e2e:home:integration` termina con salida 1: falta PRIVA_INTEGRATION_BASE_URL real. Ninguna prueba integrada ejecutada, sin fallback a fixtures. Las páginas 003–005 ya existen en código; su presencia no acredita un entorno publicado ni recorridos reales.

Firefox: recorridos principales ejecutados con el motor disponible, manteniendo las protecciones del navegador. Ver resultados en contract.md. Sustituye el bloqueo histórico de perfil de la ejecución del 2026-10-16.

WebKit: intento de `base: layout` falla antes de abrir navegador por libgtk-4, libgraphene, libharfbuzz-icu, libmanette, libhyphen y libGLESv2 ausentes. Una prueba intentada, ninguna aprobada. No se desactivaron comprobaciones de dependencias.

El gate propio de Inicio continúa con salida 1 por tres imágenes institucionales; las cinco revisiones editoriales y referencias comunes ya están resueltas. Publicación/fidelidad y aceptación integrada siguen pendientes.
