# Validación con imágenes finales — Inicio 002

Fecha local: 2026-10-23 (America/Bogota); JSON y logs del entorno fechados en UTC. Resultado: revisión visual aprobada por la usuaria; recorridos automatizados de la entrada real pasan en Chromium y Firefox. Revisión manual guiada aceptada posteriormente por la usuaria; WebKit e integración completa pendientes. Estado actual: 28/33 tareas completas.

## Resultados de esta ejecución

| Verificación | Resultado | Evidencia |
|---|---|---|
| Guard de publicación de Inicio | Salida 0, recursos oficiales y editorial válidos | require-home-publication.mjs |
| Pruebas de publicación | 24 aprobadas, 0 fallidas/omitidas | final-review-publication.txt |
| Astro check de Inicio | 96 archivos, 0 errores/advertencias, 1 hint previo de administración | final-review-check.txt |
| Build aislado de la entrada real | 1 página construida con su guard intacto y publicDir real | final-review-build.txt |
| Chromium | 18 recorridos aprobados, 0 fallidos: 14 celdas (7 anchos × texto 100%/200%), 3 fallos de imágenes oficiales y 1 recorrido sin JS | final-review-chromium.json |
| Firefox | 8 recorridos aprobados, 0 fallidos: 4 celdas (390/1440 × texto 100%/200%), 3 fallos de imágenes oficiales y 1 recorrido sin JS | final-review-firefox.json |
| WebKit | Bloqueado antes de abrir navegador; detección host de libGLESv2.so.2 pendiente | final-review-webkit.json |
| Revisión visual de responsable | «Sí, apruebo el resultado visual» | visual-approval.md |
| VoiceOver | Aceptación manual reportada por la usuaria en Mac, localhost:4321, tras guía de encabezados y Conocer más | manual-review.md; versiones no proporcionadas |

No se suman ejecuciones previas o reintentos. No hay mocks de contenido en esta revisión: el root aislado importa src/pages/index.astro, que valida homeContent real. No se usa la suite contractual de imágenes ficticias para acreditar las imágenes finales.

## Cobertura y límites

Cada celda comprueba orden de los cuatro bloques y tarjetas, un h1, dimensiones naturales 500 × 350 de cada PNG, ausencia de overflow horizontal, texto real 16px/32px, axe sin violaciones, Conocer más por puntero/Enter, títulos visibles/en foco, Tab al siguiente enlace, ambas anclas en entrada directa y recarga, controles de contenido con mínimo 44px y outline visible. Movimiento reducido activado; sin cookies, localStorage/sessionStorage o peticiones fuera del origen local observadas. Los tres fallos de imagen conservan texto y enlaces; el contenido también funciona sin JS.

Se comprueba href/foco del CTA final hacia /historias.html, pero no se acredita su navegación a Historias real en este banco de una página. Esa aceptación pertenece a T027/T031, con URL integrada real y suite home-integration.spec.ts, que no se ha ejecutado aquí. Tampoco se acredita build completo, despliegue o accesibilidad integral por pasar axe.

Las capturas final-review-1440.png y final-review-390.png se generan desde la página con imágenes oficiales. La aprobación visual registrada corresponde a las capturas received-images-* identificadas por SHA-256 en visual-approval.md. No autoriza variaciones adicionales de diseño.

## Correcciones del procedimiento de prueba

Las primeras ejecuciones detectaron defectos del propio procedimiento, no del código de la web: tratar como entrada directa una navegación programática al fragmento ya activo después de mover el foco con Tab; y llamar decode() antes de que Firefox iniciara una imagen lazy. El reproducer ahora abre un documento nuevo para la entrada directa y espera complete/naturalWidth antes de decodificar. En el contexto sin JS se comprueba carga sin esperar promesas de decode(), que no terminaban en Firefox. Se interrumpieron los intentos anteriores y se conservan sus logs/JSON como iniciales; solo los JSON finales cuentan como resultado. No se modificó código de producto.

## Reproducción local

Preparar el root aislado descrito en received-images.md, importar la página real y construir con:

```bash
ASTRO_TELEMETRY_DISABLED=1 npx astro build --root .test-output/home-official-entry
python3 -m http.server 4327 --bind 127.0.0.1 --directory .test-output/home-official-render
```

Desde otra terminal en el repositorio, ejecutar:

```bash
node specs/002-inicio-institucional/evidence/final-review.cjs chromium
PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright node specs/002-inicio-institucional/evidence/final-review.cjs firefox
LD_LIBRARY_PATH=/workspace/.tools/webkit-libs/usr/lib/x86_64-linux-gnu PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright node specs/002-inicio-institucional/evidence/final-review.cjs webkit
```

El reproducer requiere el build real servido en 127.0.0.1:4327, usa los paquetes del lockfile y escribe sus propios JSON y capturas. Firefox requiere el permiso de ejecución del entorno disponible en esta sesión; no se desactivó sandbox/TLS. WebKit conserva su verificación de dependencias; no se omite.

## Procedimiento guiado de VoiceOver en Mac

Antes de empezar, confirmar la URL real que la usuaria puede abrir en Safari. No usar una captura como página de prueba ni asumir que localhost de este entorno está disponible en su Mac. Una vez abierta Inicio:

1. Activar VoiceOver con Command + F5 (o Fn + Command + F5 según el teclado).
2. Recorrer encabezados con Control + Option + Command + H; verificar un h1 y los títulos de secciones en el orden esperado. También puede usarse el rotor con Control + Option + U, categoría Encabezados.
3. Usar el rotor para localizar «Conocer más» y activarlo con Control + Option + Espacio. Comprobar que se anuncia «Somos Priva» y se puede continuar sin quedar atrapada.
4. Localizar «Explora nuestras historias», comprobar su nombre y destino. Activarlo solo en un entorno con Historias real disponible; registrar cualquier bloqueo, sin inventar un pase.
5. Registrar sistema/navegador/VoiceOver, anuncios escuchados y cualquier problema. Las imágenes decorativas no deberían anunciar nombres de archivo ni duplicar los textos.

Actualización: la usuaria informó que los encabezados están bien y aceptó los pasos propuestos. T026/T032 se cierran para el alcance manual de Inicio mediante esa confirmación; ver manual-review.md. No se inventan resultados de WebKit ni integración, que conservan bloqueos independientes. Sin commit, push o despliegue en esta fase.
