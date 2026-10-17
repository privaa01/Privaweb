# Guía de validación futura — Inicio 002

**Estado**: componentes, scripts y banco contractual implementados. Pruebas de Chromium
y publicación ejecutadas; aceptación integrada, recursos y revisión editorial pendientes.

## Prerrequisitos y comandos existentes

Checkout /workspace/Privaweb; Node >=22.22.0, npm y Python 3. Usar el checkout aislado
existente; no crear worktree salvo solicitud explícita. Versiones fijadas por package-lock.

```bash
cd /workspace/Privaweb
export npm_config_cache=/tmp/priva-npm-cache
npm ci
.specify/scripts/bash/check-prerequisites.sh --paths-only --json
```

La resolución debe seleccionar specs/002-inicio-institucional. Como referencia, las pruebas
existentes de 001 se ejecutan con:

```bash
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contract -- --project=chromium
```

Repetir la regresión de 001 cuando se implementen cambios que
puedan afectarlas. Si se usan navegadores oficiales, instalar binarios de Playwright por
canales autorizados. No desactivar TLS ni considerar probado Firefox/WebKit por usar Chromium.

## Scripts implementados

| Comando previsto | Resultado y condición |
|---|---|
| npm run check:home:contract | Astro check del banco tests/fixtures/home y componentes importados |
| npm run build:home:contract | Build .html del banco en .test-output/home, caché separada |
| npm run test:e2e:home:contract | Playwright home contractual con servidor propio de salida estática |
| npm run test:e2e:home:integration | Pruebas contra entorno real; requiere PRIVA_INTEGRATION_BASE_URL |

Config: playwright.home.config.ts; tests home.spec.ts/home-accessibility.spec.ts o
home-integration.spec.ts según modo. El servidor contractual arranca/parará mediante
webServer, Python sobre .test-output/home en 127.0.0.1:4323, sin reutilizar el puerto 4322.
Fixtures incluyen página Inicio con HomeContent real y destino Historias identificado como
ficticio. No contienen servicios privados, documentación aprobada ni assets oficiales inventados.
No crear enlaces de preview de localhost en la UI de onboarding.

## Recorrido contractual después de crear el banco y sus pruebas

```bash
npm run check:home:contract
npm run build:home:contract
node --test tests/home-publication.test.ts
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:home:contract -- --project=chromium
```

No ejecutar la suite antes de escribir casos; una ejecución de cero pruebas no valida nada.
Probar componentes reales, no una réplica dentro de fixtures. Salidas y reportes home no
sobrescriben .test-output/navigation ni los resultados de regresión de 001.

## Matriz de aceptación

| Requisitos | Procedimiento | Resultado exigido |
|---|---|---|
| I01/I02 | Leer hero e identidad y activar Conocer más con teclado/puntero | Textos/orden de referencia, #somos-priva visible, sin historia adicional |
| I02/I03 | Abrir y recargar URLs con #somos-priva/#que-hacemos | Título correcto visible y navegación/foco utilizables |
| I03 | Consultar áreas y revisar descripciones con su evidencia | Cuatro tarjetas en orden, sin acciones inventadas ni promesas no comprobadas |
| I04 | Leer cierre y activar Explora nuestras historias | Copy exacto C16; llega a Historias, sin Instagram/descarga/#maria |
| SC-004 | Repetir lectura, controles y anclas por cada ancho 360/390/430/768/1024/1280/1440 | Sin recortes/overflow y con orden conservado |
| SC-004 | Repetir matriz con texto 100% y 200% | Cambiar tamaño de texto real, no deviceScaleFactor ni solo captura |
| SC-005 | Interrumpir carga de cada imagen institucional | Texto/controles conservados, alternativa adecuada, sin falso cierre visual |
| Publicación | Intentar entrega con recurso o revisión pendiente | Bloqueo explícito, no omisión de bloques ni éxito fingido |
| Compartidos 001 | Ejecutar regresión de navegación después de integrar Inicio | Sin pérdida de activo, footer, menú/foco o contratos existentes |

Axe y medición de contraste complementan, no sustituyen, revisión manual de foco, lector de
pantalla y comparación visual de recursos finales. Chromium cubre matriz completa; regresión
principal en Firefox/WebKit cuando estén disponibles, con resultados separados.

## Build de aplicación y validación integrada

La página real index.astro ya incluye publicación protegida: si faltan recursos o
copy revisado, su render de entrega falla explícitamente. Los fixtures prueban componentes
independientemente, sin saltar esta verificación en la página real.

```bash
npm run check
npm run build
```

Estos comandos no acreditan entrega de 002 mientras falten recursos/revisión y el build
seguirá bloqueado si faltan las demás páginas reales de 003–005. No añadir páginas ficticias
para superar scripts/require-pages.mjs.

Para el recorrido integrado usar un entorno real con /index.html, sus anclas y /historias.html;
configurar PRIVA_INTEGRATION_BASE_URL con la URL proporcionada por ese entorno y ejecutar
npm run test:e2e:home:integration. Sin base/destinos, fallar con bloqueo explícito, no skip
silencioso ni fallback a fixtures. No se requieren credenciales para Inicio público.

## Evidencia y cierre

Registrar fecha, entorno/navegador, ancho/texto, ID y escenario, resultado y evidencia.
Separar aprobado/fallido/bloqueado/no ejecutado; pruebas contractuales no cierran destino
real de 003 ni fidelidad sin recursos. I01–I04 y SC-001–005 se actualizan solo tras pruebas.
Publicación exige recursos oficiales y copy revisado; faltantes P01/P03/P04 permanecen abiertos.

## Resultados y límites de esta implementación

Ver evidence/summary.md. @types/node se incorporó como desarrollo para tipado de fs/path.
Las suites tienen salidas/reportes y trazas separados; no lanzar suites que compartan
outputDir. Firefox/WebKit se descargaron, pero su arranque/regresión sigue bloqueado
por perfil de Firefox y bibliotecas de WebKit ausentes. No se necesita aprobación adicional
para decisiones ya registradas; sí resolver recursos/copy pendientes antes de publicar.
