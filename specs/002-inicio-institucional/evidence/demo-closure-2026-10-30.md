# Cierre de Inicio para la demo publicada

Fecha: 2026-10-30, America/Bogota. La responsable continuó con 002 después de cerrar 001 para la demo publicada. [Alcance de continuidad](../demo-scope-2026-10-30.md). Resultado: **33/33 tareas cerradas para la demo**. El build completo y la operación productiva 009/010 se conservan diferidos, sin modificar sus guards o readiness.

## Tres tareas cerradas

| Tarea | Resultado |
| --- | --- |
| T027 | Integración sobre Firebase público, sin mocks. Check/build/paridad del build demo real reutilizados de001. Las siete páginas existen y los destinos de Inicio responden 200. |
| T031 | Matriz publicada previa 60/60 en tres motores (42 celdas + 18 recorridos), más regresión actual 18/18 después del cambio de foco del footer compartido. Teclado/puntero, dos anclas directas/recargadas, foco/continuidad y destino Historias conformes. |
| T028 | Spec/contrato/plan/tareas/quickstart y evidencia I01–I04/SC-001–005 sincronizados; cierre demo separado de producción diferida. |

## Evidencia aplicable

- [Matriz e imágenes de Inicio publicadas](published-review-2026-10-30.md):60/60 pruebas, siete anchos×100/200%, controles/lectura/axe, imágenes oficiales por SHA256, sin cookies/storage ni solicitudes a otros orígenes en los recorridos.
- Regresión actual de los seis recorridos principales por motor:18/18, 0 fallos/omitidos, 13.9 s. Solo se seleccionaron esos casos con grep; las 42 celdas ya aprobadas no se repitieron. No se suman ambas campañas como 78 casos únicos.
- [Cierre001](../../001-navegacion-global/evidence/demo-closure-2026-10-30.md):14/14 celdas de navegación y 15/15 casos publicados, foco del footer 11,12:1, check de 95 archivos sin errores/advertencias (1 hint previo), build:demo 7 páginas y paridad SHA256 de siete HTML publicados. Abarca el único cambio visual compartido posterior a la matriz 60/60.
- HomeContent, textos, imágenes y estilos propios de Inicio no cambiaron en esta reanudación. Se conservan aprobaciones de T025/T026 y sus límites originales: no se inventa una nueva revisión de copy o sesión de lector de pantalla sobre textos de Inicio.
- [Aprobación editorial previa](editorial-review.md) y [revisión de recursos/entorno](review-2026-10-28.md) permanecen como fuentes con sus fechas.

Resultados saneados actuales: [demo-closure-results-2026-10-30.json](demo-closure-results-2026-10-30.json). La falta de calificación de producción ya no bloquea este cierre demo por el alcance de trabajo vigente; no se elimina ese requisito de la etapa completa.

## Reproducción de la regresión focalizada

```sh
PRIVA_TEST_MODE=integration PRIVA_INTEGRATION_BASE_URL=https://priva-785cb.web.app PRIVA_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node node_modules/@playwright/test/cli.js test --config playwright.home.config.ts --grep 'Inicio real: (entrada|Conocer|CTA)'
```

Log:.test-output/home-demo-closure-2026-10-30.log. Reporte local actual:home-integration-results.json. Para repetir deliberadamente las 60 pruebas completas, omitir grep; no confundir ese comando con el de 18 casos. No se envían formularios ni se accede a administración. No hubo cambios nuevos de producto ni otro despliegue en esta reanudación.

Checklist documental 16/16, sin alterar marcadores. Sin .specify/extensions.yml ni hooks registrados. git diff --check conforme. Los cambios locales pendientes de 001 y sus pruebas se conservaron; no se hizo commit/push automático.
