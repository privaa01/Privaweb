# Guía de validación — Inicio 002

**Estado**: 002 cerrada: 33/33 tareas para la demo publicada. Contenidos/recursos aprobados, matriz previa 60/60 y regresión actual 18/18 en tres motores. Check/build y paridad de demo conformes; build completo y operación productiva diferidos.

## Prerrequisitos y comandos existentes

Desde la raíz del checkout; Node >=22.22.0, npm y Python 3. Usar el checkout aislado
existente; no crear worktree salvo solicitud explícita. Versiones fijadas por package-lock.

```bash
# Ejecutar desde la raíz del repositorio
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

| Comando | Resultado y condición |
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

## Recorrido contractual existente

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

Las páginas reales 003–005 ya existen en código. Estos comandos no acreditan entrega mientras falten revisión visual e integración o fallen los guards de otras features. La revisión editorial de los cinco textos actuales sí está aprobada; no repetirla. No añadir páginas ficticias ni eludir scripts/require-pages.mjs.

Para el recorrido integrado usar un entorno real con /index.html, sus anclas y /historias.html;
configurar PRIVA_INTEGRATION_BASE_URL con la URL proporcionada por ese entorno y ejecutar
npm run test:e2e:home:integration. Sin base/destinos, fallar con bloqueo explícito, no skip
silencioso ni fallback a fixtures. No se requieren credenciales para Inicio público.

## Evidencia y cierre

Registrar fecha, entorno/navegador, ancho/texto, ID y escenario, resultado y evidencia.
Separar aprobado/fallido/bloqueado/no ejecutado; pruebas contractuales no cierran destino
real de 003 ni fidelidad sin recursos. I01–I04 y SC-001–005 se actualizan solo tras pruebas.
Publicación exige recursos oficiales y copy revisado. P03 resuelto para los cinco textos vigentes; P01/P04 tienen imágenes institucionales recibidas; falta cerrar fidelidad final.

## Resultados y límites de esta implementación

Ver evidence/summary.md. @types/node se incorporó como desarrollo para tipado de fs/path.
Las suites tienen salidas/reportes y trazas separados; no lanzar suites que compartan
outputDir. Firefox ya pasó los recorridos principales; WebKit sigue bloqueado por dependencias del host. No se necesita aprobación adicional para los cinco textos ni los recursos comunes recibidos; las tres imágenes oficiales ya están conectadas; faltan revisión visual/manual y entorno integrado antes de publicar.

## Reanudación 2026-10-21

Marca, fuente y paleta recibidas desde disenovisual; cinco textos educativos aprobados explícitamente y aplicados con evidencia en [editorial-review.md](evidence/editorial-review.md). Las imágenes oficiales siguen pendientes; el enlace provisional placehold.co/448x332 devuelve HTTP 403 al descargar. Firefox ya permite verificar recorridos principales; WebKit sigue bloqueado por bibliotecas del host. Páginas 003–005 existen en código; falta URL real para aceptación integrada. No se acredita publicación ni fidelidad final. Estado actual y resultados en [evidence/summary.md](evidence/summary.md); las notas anteriores son históricas.

## Convergencia aplicada — 2026-10-20 (America/Bogota)

T029: estados vigentes sincronizados en el cuerpo del documento. La reanudación previa está fechada 2026-10-21 UTC en sus logs (2026-10-20 en America/Bogota); no representa una aprobación distinta. Se conservan las decisiones y evidencias existentes, sin cerrar imágenes, fidelidad o integración por edición documental.

## Recursos recibidos — 2026-10-23 (America/Bogota)

Las imágenes aportadas están conectadas como `/images/home/hero.png`, `/images/home/identidad.png` y `/images/home/cierre.png`, 500 × 350px, con procedencia y clasificación en [evidence/resources.md](evidence/resources.md). T025/T030 completas y gate de Inicio aprobado. Los bloqueos de imágenes anotados en registros anteriores son históricos; no se cierran por ello fidelidad manual, WebKit o aceptación integrada.

## Revisión manual aceptada — 2026-10-23

La responsable aprobó visualmente Inicio, confirmó el rotor de encabezados y aceptó los pasos guiados con VoiceOver en su Mac (`localhost:4321`). T026/T032 completas en el alcance de revisión de Inicio; 28/33 tareas. [Registro y límites](evidence/manual-review.md). La confirmación no equivale a auditoría externa ni sustituye WebKit, integración real o datos operativos pendientes de otras features.

## Validación vigente — 2026-10-28

30/33 tareas completas: T023/T033 cerradas con 59/59 pruebas contractuales finales (29 Chromium, 15 Firefox, 15 WebKit), matriz Chromium de siete anchos × texto 100/200%, y 8/8 pruebas adicionales WebKit en Inicio real. Integración 12/18: seis CTA bloqueados por HTTP 500 de Historias; build detenido por guard 010/009. T027/T031 y cierre integral T028 pendientes. [Evidencia y reproducción](evidence/review-2026-10-28.md). En macOS/WebKit el helper usa Option+Tab para incluir enlaces con su configuración nativa. No se repiten aprobaciones de imágenes ni revisión visual/manual.

## Aprobación editorial aplicada — 2026-10-28

La responsable respondió «Sí, apruebo los textos públicos corregidos» para hero, metodología, cierre, identidad, catálogo y pasos Escucha/Reflexiona/Aplica. Se registraron cinco snapshots inmutables en src/content/stories-review.json, con referencia a evidence/public-copy-review.md; el guard sigue invalidando modificaciones materiales. No se aprobaron ejercicios ni se importaron/publicaron historias.

Verificación: 45/45 pruebas Node Inicio/Historias, guard003 salida 0 y Astro check (95 archivos, 0 errores/advertencias, 1 hint previo). Integración real002: 18/18 aprobadas, seis recorridos por motor Chromium/Firefox/WebKit. Historias HTTP200; /api/public/historias HTTP404: el catálogo007 aún no está conectado al servidor local. Captura .test-output/stories-approved.png. Build completo conserva salida1 en guard010/009.

La navegación desde Inicio ya está verificada; T027/T031 de002 mantienen el requisito residual de build completo, y T028 el cierre integral: 30/33 tareas. No se confunde renderizado de Historias con disponibilidad del catálogo, aprobación de ejercicios ni publicación productiva. Logs: .test-output/stories-approved-unit.log, stories-approved-check.log, home-approved-integration.log y home-approved-build.log.

## Validación de la demo publicada

[Comandos y resultados actuales](evidence/published-review-2026-10-30.md). La suite integrada ahora contiene60pruebas en3motores; no usa mocks ni arranca servidor local cuando PRIVA_TEST_MODE=integration. El build completo sigue siendo independiente del builddemo autorizado.

## Cierre vigente

002:33/33para la demo. [Evidencia y regresión focalizada](evidence/demo-closure-2026-10-30.md). El build completo y sus comandos históricos se conservan para producción, fuera de este cierre demo. No es necesario repetir aprobaciones de contenidos ni la matriz si sus componentes no cambian.
