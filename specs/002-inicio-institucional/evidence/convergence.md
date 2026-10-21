# Implementación de convergencia — 002

Fecha: 2026-10-20 (America/Bogota). Los logs del entorno usan 2026-10-21 UTC.
Estado: 24/33 tareas completas; T029 cerrada. Publicación e integración final pendientes.

## Trabajo realizado

- T029: sincronizado el cuerpo vigente de spec, plan y quickstart: P03 aprobado para cinco textos, marca/fuente/paleta recibidas, Firefox contractual comprobado y páginas 003–005 presentes en código. Se mantienen las decisiones y los registros históricos, distinguiendo zona horaria.
- T031/T027: seis escenarios integrados por motor (18 definiciones en total) para ambas anclas directas/recargadas y ambos controles con teclado/puntero. Comprobaciones de foco visible, título dentro del viewport y continuidad mediante Tab al siguiente enlace de contenido. Helpers compartidos ejecutados en el banco; la suite integrada sigue exigiendo URL real y rechazando fixtures.
- T032/T026: página 1 del PDF aportado renderizada e inspeccionada; revisión preliminar de capturas 1440/390 con fuente y marca recibidas. Corregida la sustitución de iconos por números en las tarjetas: ahora libro, sobre, marcador y comunidad, decorativos y sin interacción. Capturas del banco en convergence-home-1440.png y convergence-home-390.png.
- Aviso del banco actualizado para reflejar textos aprobados e imágenes ficticias; sigue sin ser entrega final.

## Verificación final

| Comando | Resultado | Evidencia |
|---|---|---|
| node --experimental-strip-types --test tests/home-publication.test.ts | 24 aprobadas, 0 fallidas/omitidas | convergence-publication.txt |
| npm run check:home:contract | 96 archivos, 0 errores/advertencias; 1 hint previo returnValue en administración | convergence-check.txt |
| npm run check | 93 archivos, 0 errores/advertencias; mismo hint | convergence-app-check.txt |
| PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:home:contract -- --project=chromium | 29 aprobadas, 0 fallidas/omitidas; 34.7s | convergence-chromium.txt |
| PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:home:contract -- --project=firefox --grep-invert='matriz Inicio' | 15 aprobadas, 0 fallidas/omitidas; 10.4s; 14 celdas de matriz excluidas por diseño | convergence-firefox.txt |
| PRIVA_TEST_MODE=integration PRIVA_INTEGRATION_BASE_URL=https://example.invalid npm run test:e2e:home:integration -- --list | 18 definiciones listadas; ninguna prueba integrada ejecutada ni petición a esa URL | convergence-integration-list.txt |
| npm run test:e2e:home:integration | Salida 1: falta PRIVA_INTEGRATION_BASE_URL real | convergence-integration-blocked.txt |
| node scripts/require-home-publication.mjs | Salida 1: tres imágenes institucionales pendientes; sin errores de editorial/marca/fuente/paleta | convergence-publication-blocked.txt |
| npm run build | Salida 1: guard 010 de documentos/revisión/calificación operativa pendiente; no se elude para llegar a Astro | convergence-app-build-blocked.txt |
| LD_LIBRARY_PATH=/workspace/.tools/webkit-libs/usr/lib/x86_64-linux-gnu PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:home:contract -- --project=webkit --grep='base: layout' | 1 intento fallido antes del navegador; validación host no resuelve libGLESv2.so.2 | convergence-webkit.txt |

No se suman ejecuciones anteriores ni reintentos. Se corrigió el helper de pruebas tras dos fallos iniciales: avanzaba con Tab antes de recargar y provocaba restauración nativa al siguiente enlace. Ahora separa la comprobación de entrada/recarga y la continuidad posterior. Se conserva convergence-chromium-before.txt; no se atribuye ese fallo del banco al producto ni se debilita la verificación de foco. Las suites finales se ejecutaron secuencialmente para no colisionar artefactos.

La matriz Chromium final cubre siete anchos × texto 100%/200%, axe, orden/anclas/controles, ausencia de tráfico externo/almacenamiento, fallos de imagen y navegación sin JS. Los 4 casos nuevos por motor ejercitan exactamente las funciones de recorrido que consumirá la suite integrada, sin hacer pasar el banco por un sitio real. No se modificó navegación/layout compartidos de 001; no se repitieron sus regresiones sin cambios que las afecten.

## Bloqueos restantes

| Tareas | Dependencia concreta |
|---|---|
| T025/T030 | Tres imágenes oficiales con archivos, dimensiones reales, propósito y procedencia. El enlace provisional ya aportado falló con HTTP 403; no se inventaron recursos ni nuevas aprobaciones. |
| T026/T032 | Comparación final contra PDF con imágenes oficiales y lector de pantalla identificado. El PDF está disponible; orca/NVDA no están disponibles. Capturas preliminares y axe no certifican fidelidad o accesibilidad integral. |
| T027/T031 | URL integrada real, recursos y revisión final; build de entrega también depende de los gates de otras features. |
| T023/T033 | WebKit: las bibliotecas locales Debian ya verificadas resuelven dependencias enlazadas, pero su comprobación dinámica consulta la caché global de ldconfig. Falta libGLESv2 en esa caché y este usuario no dispone de sudo. No se alteró ldconfig ni se omitió la validación del host. |
| T028 | Cierre total de evidencia y trazabilidad, condicionado a las verificaciones anteriores. |

Checklist de requisitos 16/16, sin modificar marcadores ni notas históricas. Sin extensiones registradas para hooks before/after_implement. Cambios locales, sin commit, push o despliegue.
