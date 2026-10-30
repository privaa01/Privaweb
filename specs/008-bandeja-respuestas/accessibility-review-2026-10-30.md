# Accesibilidad de la bandeja administrativa

Fecha: 2026-10-30, America/Bogota. Avance de T060/SC-006. Checklist de requisitos 008:16/16 revisados, marcadores intactos. Prerrequisitos y plan/tareas/contrato existentes consultados; sin hooks de extensión configurados. El total de 008 permanece en 60/66 hasta completar revisión manual y dependencias externas.

## Alcance automatizado

Se amplía tests/e2e/inbox-mock.spec.ts con14 combinaciones por motor (360,390,430,768,1024,1280,1440px × texto100/200%), sobre AdminShell/InboxManager reales y respuestasAPIcontroladas explícitas. Se comprueba tamaño raíz real mínimo16/32 px; listado y detalle, contenido largo con palabra de 120 caracteres, Enter para abrir/foco del encabezado, Space sobre revisión, validación de respuesta vacía/foco en editor/error asociado y expuesto, axe de documento completo antes/después y ausencia de overflow global/interno de controles.

Objetivo de 44 px con tolerancia de 1 px en botones, editor y etiqueta que activa la casilla. El rótulo del editor no se trata como control táctil independiente: su control asociado es el textarea. La casilla usa un tamaño compacto y su etiqueta completa mantiene44 px mínimos de objetivo. No se atribuye a la medida del checkbox aislado el tamaño de su etiqueta.

El envío inválido no produce POST/respuestas. Las lecturas de listado/historial usanPOSTpor contrato, por lo que no se cuentan como envío de correo ni mutación de respuesta. La prueba no llama a un proveedor real, no califica almacenamiento ni autenticación y no utiliza cuentas/consultas reales.

## Resultado final

**57/57 pruebas aprobadas**, 19 por motor: 42 celdas de accesibilidad y 15 casos existentes de estados/error/concurrencia. Sin fallos ni casos omitidos; duración: 43.8 s. Los casos existentes cubren error frente a vacío/reintento, detalle antiguo, operación incierta, concurrencia y reintento explícito tras rechazo. Resumen saneado: [accessibility-results-2026-10-30.json](accessibility-results-2026-10-30.json).

## Corrección aplicada

La casilla[data-reviewed] heredaba input{width:100%;padding:.8rem;min-height:46px} de los campos de texto. Su margen nativo hacía desbordar la etiqueta (232 px de ancho/239 px de contenido en 360 px). Se limita el checkbox a 1.25 em, sin padding/márgenes, con etiqueta flex y espacio entre casilla/texto; la etiqueta mantiene44 px de altura y ajuste de palabras. Reglas nuevas acotadas a .inbox en src/styles/admin.css; no cambia el diseño de login u otras páginas.

También se corrige el arranque del banco a python3 en playwright.inbox.config.ts; se conserva el servidor estándar de Python con conexiones concurrentes. La instalación inicial de este entorno no incluía los binarios requeridos por Playwright: se instalaron Firefox 157.0 / revisión 1555 y WebKit 27.2 / revisión 2370 desde el CDN oficial, sin cambiar el lock ni desactivar controles. Node 24.22.1 / macOS ARM64, Playwright 1.64.1; Chromium usa Google Chrome instalado.

## Historial y reproducibilidad

Primera campaña de 57 casos: 5 aprobados y 52 fallos (14 del desbordamiento detectado en Chromium y 38 por ausencia de Firefox/WebKit). Después de corregir CSS, el ensayo móvil detectó una expectativa incorrecta del test: contabaPOST/listado como envío; se acotó al endpoint/respuestas. Una segunda matriz tuvo 45 aprobados y 12 fallos por medir el rótulo del editor como un control44 px; se corrigió la selección de objetivos sin quitar medidas del textarea, botones o etiqueta de la casilla. Los intentos y repeticiones no se suman como casos aprobados.

Comando desde la raíz, con PATH de Node/npm del entorno:

```sh
PRIVA_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ASTRO_TELEMETRY_DISABLED=1 node node_modules/@playwright/test/cli.js test --config playwright.inbox.config.ts
```

Reporte local:.test-output/inbox-ui-results.json; log final:.test-output/inbox-accessibility-final-2026-10-30.log. Tipado estricto de tests/config conforme; git diff --check conforme. Traces/vídeo/capturas automáticas desactivados como en el banco existente.

## Pendiente específico

T060 requiere además lector de pantalla y comparación/revisión manual con diseñoP04/011. La automatización de regiones/error/foco no acredita anuncios efectivamente escuchados. No se ejecuta ni despliega administración productiva, correo o la integración privada009/010. No se repiten regresiones de006/007 sin cambios en sus comportamientos: el cambio deCSS afecta únicamente.inbox. La demo pública de Firebase conserva su publicación previa.
