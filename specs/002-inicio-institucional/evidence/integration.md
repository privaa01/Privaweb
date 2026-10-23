# Integración y navegadores — 002

Actualización: 2026-10-20 (America/Bogota).

`npm run test:e2e:home:integration` termina con salida 1: falta PRIVA_INTEGRATION_BASE_URL real. Ninguna prueba integrada ejecutada, sin fallback a fixtures. Las páginas 003–005 ya existen en código; su presencia no acredita un entorno publicado ni recorridos reales.

Firefox: recorridos principales ejecutados con el motor disponible, manteniendo las protecciones del navegador. Ver resultados en contract.md. Sustituye el bloqueo histórico de perfil de la ejecución del 2026-10-16.

WebKit: intento de `base: layout` falla antes de abrir navegador por libgtk-4, libgraphene, libharfbuzz-icu, libmanette, libhyphen y libGLESv2 ausentes en el primer intento. En la convergencia se reutilizaron bibliotecas Debian verificadas de `/workspace/.tools/webkit-libs` con LD_LIBRARY_PATH; permanece bloqueada la detección de libGLESv2.so.2 en la caché del sistema. Sin sudo para provisionarla, no se omite el validador. Una prueba intentada, ninguna aprobada. No se desactivaron comprobaciones de dependencias.

El gate propio de Inicio continúa con salida 1 por tres imágenes institucionales; las cinco revisiones editoriales y referencias comunes ya están resueltas. Publicación/fidelidad y aceptación integrada siguen pendientes.

Suite ampliada por T031: seis escenarios por motor (18 definiciones) verifican entrada y recarga de cada ancla, ambos controles con teclado/puntero, foco visible, título accesible y siguiente enlace de contenido. Los helpers se ejecutan en el banco contractual con datos inequívocos; la suite integrada mantiene guard de URL real y rechaza marcadores del banco. El listado con https://example.invalid no hace peticiones ni acredita integración. Resultado actual en [convergence.md](convergence.md).

## Actualización — 2026-10-23

Imágenes institucionales recibidas y conectadas; el guard de Inicio pasa con los datos reales. Ver [received-images.md](received-images.md) para pruebas y límites actuales. Los bloqueos de material anteriores son históricos; esto no acredita integración real ni revisión completa con lector de pantalla.
