# Revisión publicada de Priva App — 2026-10-30

Alcance: [demo](../demo-scope-2026-10-30.md), https://priva-785cb.web.app/app.html. Se conserva contenido y recursos aprobados; no se modifica producto ni se habilitan tiendas.

32/32 tareas demo: T029 y T030 completas. [Resultados estructurados](demo-review-2026-10-30.json).

## Verificación

- 48/48 comprobaciones publicadas:42 celdas de siete anchos × texto100/200% ×3 motores, más fallo inducido del mockup y navegación sinJavaScript en cada motor. Imágenes oficiales, anclas por teclado/directas/recarga, foco y controles≥44px, ausencia de overflow, axe sin infracciones, sin cookies/storage ni peticiones externas. Solo el caso de fallo de imagen intercepta una petición; las demás usan recursos reales.
- 53/53 pruebas Node de resolver y guard, sin omitidas. Las cuatro combinaciones y el cambio/retiro independiente se prueban como contrato, no como tiendas publicadas.
- Guard editorial de App: salida0, sin excepciones. Tipado estricto de configuración/pruebas conforme.
- 9/9 recorridos publicados: configuración real00, Contacto→App#descarga y anclas directas/recarga, plataformas pendientes válidas en Chromium/Firefox/WebKit. No hay destinos oficiales habilitados que puedan comprobarse.
- Paridad SHA256 del HTML publicado contra .demo-dist/app.html y de la imagen oficial1024×1536 contra public/images/app/asistente-zyro.png: conforme, HTTP200/no-store. SHA de imagen e408675e13081afeea83cc5b53e4c39e9e9817d3599bacde165b3867c54df60a.
- Build:demo de siete páginas y check95 archivos/0 errores/0 advertencias/1 hint ya comprobados en el cierre001 de este mismo snapshot. No hubo cambios de producto después. No se repite el build completo productivo ni se alteran guards009/010.

Se corrigió la configuración de pruebas, que solo incluía la matriz completa en Chromium y suponía localhost como único origen propio. Ahora exige URL real explícita, mide los tres motores y compara orígenes con baseURL. No permite fixtures de sustitución.

Entorno: macOS ARM64, Node24.22.1, Playwright1.64.1, Chrome instalado, Firefox157.0/WebKit27.2 oficiales. Captura pública app-approved.png inspeccionada: hero en dos columnas, mockup oficial y aviso explícito de prototipo visibles. No se afirma cotejo nuevo contra PDF3 ausente. La aceptación visual previa de la responsable se conserva en approval-2026-10-28.md.

Revisión humana específica de App: la responsable confirmó el30 de octubre «Sí, todo funciona con teclado y VoiceOver» para Descargar app, Ver cómo funciona, secciones de destino, alternativas de imágenes y avisos Próximamente. Es una comprobación reportada por la responsable; no se simula escucha del lector por el agente. Versiones de navegador/VoiceOver no proporcionadas. T029 completa para la demo; se conserva la aceptación visual previa y el cotejo nuevo de PDF3 diferido a producción.

Reproducción: PRIVA_INTEGRATION_BASE_URL=https://priva-785cb.web.app y PRIVA_CHROMIUM_EXECUTABLE con Chrome del sistema; ejecutar Playwright con playwright.app.real.config.ts. Para integración usar PRIVA_TEST_MODE=integration y playwright.app.config.ts. Logs bajo .test-output/app-demo-{real,integration,unit}-2026-10-30.log.

Producción diferida: cotejo PDF3 original, futuras tiendas verificadas/transiciones publicadas y build completo009/010. No se declara aplicación móvil disponible ni instalación. Sin despliegue, commit o push nuevos.
