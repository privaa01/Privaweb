# Cierre de la 001 para la demo publicada

Fecha: 2026-10-30, America/Bogota. Alcance aprobado explícitamente por la responsable en [demo-scope-approval-2026-10-30.md](../demo-scope-approval-2026-10-30.md). Resultado: **28/28 tareas del alcance demo cerradas**. La administración y los requisitos de producción se conservan diferidos; este cierre no acredita autenticación productiva ni documentos finales del producto completo.

## Evidencia por tarea

| Tarea | Evidencia y resultado |
| --- | --- |
| T023 | Build real build:demo con siete páginas; cuatro páginas principales con header/menú/CTA/footer aprobados. Casos, Descarga y Escribir presentes. Paridad SHA256 de siete HTML entre build, copia de pruebas y Firebase publicado. |
| T025 | Matriz exhaustiva de siete anchos al 100 %, puntero/teclado:16 pares de menú,4 logos,4 CTA y12 destinos del footer por celda/método. Página activa, títulos, foco, tamaños y overflow conformes. Recorridos reales en Chromium/Firefox/WebKit. |
| T026 | Misma matriz al 200 % real (raíz 32 px); revisión reportada por la responsable con teclado y VoiceOver en cuatro páginas. Axe de header/footer sin violaciones y contraste de foco medido. Corrección visual comprobada y publicada. |
| T027 | Chequeo Astro:95 archivos,0 errores/advertencias,1 hint previo returnValue. Build de demo conforme. Pruebas publicadas sin APIs simuladas, navegación sin JS, Escape/resize/foco y ausencia de rutas administrativas. El404 no se cuenta como autorización 006. |
| T028 | Spec, contrato, modelo, plan, tareas, quickstart, manual/evidencia y TRACEABILITY sincronizados con el alcance aprobado. Requisitos de producción conservados explícitamente. |

## Pruebas finales

- Matriz:14/14 pruebas Chromium,0 fallos/omitidos, siete anchos 360/390/430/768/1024/1280/1440 × texto 100/200 %. Cada celda repite ambos métodos y las 36 activaciones aprobadas:1008 activaciones entre todas las celdas, sin contar las navegaciones preparatorias. Se sirve una copia aislada de .demo-dist real, no una fixture con destinos inventados.
- Sitio público:15/15 pruebas, cinco por Chromium/Firefox/WebKit. Recorridos completos por teclado/puntero, menú compacto/Escape/retorno de foco/resize en las cuatro páginas, navegación sin JavaScript y frontera sin administración pública.
- Sin cookies/localStorage/sessionStorage ni solicitudes del navegador a otros orígenes durante los recorridos. No se envía Contacto ni se ejecuta correo. Esto no declara ausencia de procesamiento técnico por Firebase.
- Tipado estricto de configuración y tests conforme. git diff --check conforme.

Resultados estructurados: [demo-closure-results-2026-10-30.json](demo-closure-results-2026-10-30.json). Playwright 1.64.1 / Node 24.22.1 / macOS ARM64, Chrome instalado, Firefox 157.0 y WebKit 27.2. Checklist documental 16/16, sin editar marcadores. Sin .specify/extensions.yml ni hooks registrados.

## Defecto corregido y revisión humana

El footer de demo heredaba el foco verde #047857 sobre #102e23: 2,66465:1. Se añadió .demo-footer :focus-visible con --primary-lightest, color ya aprobado. La prueba nueva reprodujo el fallo antes del cambio. La medición publicada posterior es 11,12:1 y todos los enlaces activados con teclado se contrastan contra su fondo; mínimo 3:1. Captura de verificación inspeccionada: .test-output/navigation-demo-footer-focus.png. No se cambiaron textos ni semántica por esta corrección.

A la pregunta que enumeró las cuatro páginas actuales, menú, página activa, CTA y tres enlaces de footer, la responsable respondió: **«Revisé con teclado y VoiceOver: todo funciona»**. Es evidencia humana reportada, no una escucha simulada por el agente. Las versiones del lector/navegador no fueron proporcionadas. La aceptación del alcance ya estaba registrada por separado.

La primera matriz y la primera campaña pública pasaron 14/14 y 15/15 antes de añadir la medida de contraste; no sustituyen la campaña final con esa aserción. Una repetición posterior tuvo 13/14 por un 404 transitorio cuando el predeploy reconstruyó la misma carpeta que servía el banco. Se aisló una copia estable del build y se repitió la matriz completa:14/14. Los intentos previos no se suman como casos aprobados. Las cancelaciones de transferencias de medios al navegar se silencian únicamente para BrokenPipe/ConnectionReset en el servidor de pruebas; otros errores no se ocultan.

## Reproducción

Desde la raíz, con Node/npm del entorno en PATH:

```sh
PRIVA_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node node_modules/@playwright/test/cli.js test --config playwright.navigation.demo.config.ts
PRIVA_NAVIGATION_TARGET=published PRIVA_INTEGRATION_BASE_URL=https://priva-785cb.web.app PRIVA_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node node_modules/@playwright/test/cli.js test --config playwright.navigation.demo.config.ts
```

La primera orden compila la demo y sirve una copia estable en 4340; la segunda no inicia servidor ni usa mocks. Artefactos separados por campaña. Publicación correctiva mediante firebase deploy --only hosting --project priva-785cb, predeploy build:demo conforme. No se modificaron las reglas de Firestore.

Logs locales bajo .test-output/: navigation-demo-matrix-stable-2026-10-30.log, navigation-demo-published-final-2026-10-30.log, navigation-demo-check-final-2026-10-30.log y navigation-demo-deploy-2026-10-30.log. El build completo mantiene sus guards; queda fuera del cierre demo expresamente aprobado. No se edita el PDF de diseño ni se cambian estados de 009/010 o de las demás features por este cierre.
