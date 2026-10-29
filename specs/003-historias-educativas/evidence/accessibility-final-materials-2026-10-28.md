# Matriz de accesibilidad con materiales oficiales

Fecha: 2026-10-28. Alcance parcial de T032, entorno local real en http://127.0.0.1:4321; catálogo007 con cuatro publicaciones aprobadas, sin interceptar/responder rutas con fixtures. Checklist de requisitos:16/16 satisfechos, sin cambios de marcadores. Sin hooks de extensión configurados.

## Resultado

42/42 pruebas aprobadas: Chromium (Google Chrome instalado), Firefox y WebKit;14 combinaciones por motor (360,390,430,768,1024,1280,1440px × texto100/200%). La primera matriz terminó en48.1s; se repitió tras la corrección visual descrita abajo. El test comprueba tamaño raíz real mínimo16/32px, HTTP200, tres historias iniciales, expansión a cuatro por Enter y foco en el título nuevo, radios operados con Space, feedback presente, transcripciones operadas con Enter, controles audio nativos presentes sin autoplay, axe sin violaciones (incluido contraste) y ausencia de desbordamiento horizontal tras expandir transcripciones. Controles personalizados: altura mínima43px con tolerancia de1px sobre objetivo44; no se presenta como medición de los subcontroles internos del reproductor nativo.

Archivos: tests/e2e/stories-real-accessibility.spec.ts y playwright.stories.real.config.ts. Resultado JSON local: .test-output/stories-real-results.json. Log: .test-output/stories-real-run.log. Captura escritorio expandido: .test-output/stories-real-1440-100.png. Captura móvil con texto200%: .test-output/stories-real-390-200.png. Se repitió únicamente esa celda Chromium para guardar una captura de viewport legible en lugar de la imagen completa de60857px; no se repitió toda la matriz.

Comando (PATH debe incluir el Node del entorno):

```sh
PRIVA_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node node_modules/@playwright/test/cli.js test --config playwright.stories.real.config.ts --workers 2
```

Tipado estricto de los dos archivos conforme con TypeScript, NodeNext, allowImportingTsExtensions y noEmit. El primer intento de tipado señaló la extensión ausente del import de configuración; se corrigió antes del resultado final. La inspección móvil encontró texto del summary fuera de su recuadro a200% aunque no excedía el viewport: se añadió overflow-wrap:anywhere a .story-audio summary y una aserción de scrollWidth/clientWidth por control. Matriz posterior a la corrección:42/42 aprobada en36.8s. Captura móvil de viewport revisada: el texto permanece dentro del recuadro.

## Límites y pendiente concreto

La inspección de escritorio conserva hero, catálogo, metodología, identidad, cierre y footer, con las imágenes oficiales y cuarta portada reutilizada por autorización. La matriz automatizada no equivale a escucha comparada de los audios ni a operación manual de los subcontroles nativos o anuncios efectivos de VoiceOver. El PDF2 de diseño no está disponible como archivo en este checkout; las referencias transcritas de la especificación no sustituyen una comparación renderizada del original. T032 sigue parcial y el total permanece32/35. La aprobación general de la responsable ya quedó registrada; no se pide nuevamente aprobación editorial.
