# Guía de validación — 001

**Estado**: actualizado2026-10-27. Corrección de foco al ampliar el menú y regresión en Mac en [evidence/review-2026-10-27.md](evidence/review-2026-10-27.md). Componentes y páginas públicas existen; contrato006 recibido. La baseURL local ya es accesible desde el runner del Mac, pero los destinos finales, servicios privados y build/entrega integrada siguen bloqueados por revisión editorial y operación009/010. Las imágenes de Historias/App ya están recibidas.

## Prerrequisitos

- Checkout existente; en este Mac `/Users/samanthabolivar/Documents/proyectoPriva`. No crear worktree salvo petición explícita.
- Node 24+ para los servicios administrativos; terminal con npm y caché escribible. Revisión actual ejecutada con Node 24.22.1.
- Implementación de tooling y pruebas según [plan](plan.md).
- Para aceptación integrada: páginas/secciones 002–005, acceso protegido 006,
  documentos revisados 010 y recursos oficiales para fidelidad.

## Estado documental comprobable ahora

```bash
cd /Users/samanthabolivar/Documents/proyectoPriva
SPECIFY_FEATURE_DIRECTORY="$PWD/specs/001-navegacion-global" bash .specify/scripts/bash/check-prerequisites.sh --paths-only --json
```

Debe resolver FEATURE_DIR a specs/001-navegacion-global y plan.md a este directorio.
No ejecuta ni prueba la aplicación.

## Instalación en la fase de implementación

`package.json` y `package-lock.json` ya fijan las versiones de research.md. Usar instalación reproducible:

```bash
cd /Users/samanthabolivar/Documents/proyectoPriva
export npm_config_cache=/tmp/priva-npm-cache
npm ci
npm exec playwright install chromium firefox webkit
npm run check:contract
npm run build:contract
```

Si faltan bibliotecas Linux del navegador, instalarlas por el mecanismo autorizado del
entorno y repetir; no desactivar verificaciones TLS ni saltar navegadores silenciosamente.
En T007 se exige únicamente el build contractual: los cuatro archivos .html de prueba
se generan en `.test-output/navigation/`, nunca en `dist/`; hay además tres destinos ficticios de prueba. `check:contract` comprueba
el proyecto de fixtures y componentes importados; `build:contract` lo construye.
No ejecutar check/build de aplicación como prerrequisito de T007: sus páginas aún no existen.
T007 valida arranque del entorno; ejecutar la suite solo después de escribir sus casos desde T008.

La descarga Playwright recibió403 durante el primer setup. Actualmente hay Chromium y Firefox; WebKit también está verificado con el entorno aislado descrito en evidence/webkit-runtime.md. Para Chromium:

```bash
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contract -- --project=chromium
```

Para la regresiónFirefox de recorridos principales:

```bash
PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:contract -- --project=firefox --grep-invert="Matriz:"
npm run test:navigation:service
```

Firefox requiere autorización del ejecutor fuera del sandbox exterior en este entorno, sin desactivar sus protecciones. La matriz exhaustiva sigue en Chromium. WebKit no se considera aprobado por otros motores. Ejecutar suites de navegador001 en secuencia para no compartir servidor/reportes simultáneamente.

### Ejecución nativa en macOS

Los comandos con `/usr/bin/chromium`, `/workspace/.cache` y el wrapper de bibliotecas al final de esta guía corresponden al entorno Linux histórico. En Mac, usar los navegadores oficiales instalados por Playwright o Chrome instalado:

```bash
PRIVA_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:e2e:contract -- --project=chromium
npm run test:e2e:contract -- --project=firefox --project=webkit --grep-invert="Matriz:"
TMPDIR=/private/tmp npm run test:navigation:service
```

WebKit/macOS puede requerir Option+Tab para incluir enlaces; las pruebas de recorrido de foco usan esa combinación de forma explícita, sin modificar preferencias del usuario. Las demás plataformas conservan Tab. El TMPDIR canónico evita que la validación de directorios privados rechace el alias `/var` del Mac. Ejecutar las suites contractuales e integradas en secuencia o usar directorios `outputDir` distintos para no borrar trazas de otra ejecución.

Para comprobar los bloqueos actuales del servidor Astro público:

```bash
PRIVA_TEST_MODE=integration PRIVA_INTEGRATION_BASE_URL=http://127.0.0.1:4321 PRIVA_CHROMIUM_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:e2e:integration -- --project=chromium --grep="Destino integrado real|G05 API"
```

Esta selección ejecutó cinco casos, todos fallidos por destinos no calificados/integrados. No usar el servidor público de Astro como sustituto del servicio privado006 ni aceptar documentos en borrador como cumplimiento de G06.
El servidor contractual es `tests/fixtures/navigation/serve.py` (Python 3), usado por webServer,
con salida Astro real en `.test-output/navigation/`. El preview de Astro no inició en este
entorno; se eligió servir los archivos estáticos directamente para validar sus rutas.
Versiones exactas en lockfile.

## Scripts implementados

| Script | Acción |
|---|---|
| npm run dev -- --host 0.0.0.0 | Desarrollo con Astro |
| npm run check:contract | Astro check del proyecto tests/fixtures/navigation y componentes importados |
| npm run build:contract | Astro build de tests/fixtures/navigation hacia .test-output/navigation |
| npm run check | Astro check de aplicación; disponible para validar páginas reales desde T023 |
| npm run build | Build de aplicación a dist; requiere páginas reales de T023 |
| npm run preview -- --host 127.0.0.1 --port 4321 | Servir build para validación interna |
| npm run test:e2e:contract | Playwright navegación y accesibilidad con fixtures de prueba |
| npm run test:e2e:integration | Playwright contra destinos reales y controles de acceso |

Los tests contractuales construyen y sirven `.test-output/navigation/` mediante Playwright webServer;
los fixtures de destinos no se incluyen en dist de entrega. La suite integrada recibe
PRIVA_INTEGRATION_BASE_URL del entorno de prueba real, no una URL inventada ni un secreto.
Si falta esa base o sus servicios, la ejecución debe informar bloqueo/error explícito;
no registrar éxito mediante una ejecución vacía o un skip silencioso.

## Comprobación del build de aplicación — desde T023

Solo después de integrar las páginas reales de 002–005 en T023, ejecutar:

```bash
npm run check
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

Exigir `dist/index.html`, `dist/historias.html`, `dist/app.html` y `dist/contacto.html`.
Si faltan esas páginas, registrar esta fase bloqueada; no sustituirlas por fixtures.
Preview no proporciona por sí mismo el servicio protegido de 006.
En otra terminal, comprobar los archivos del build real:

```bash
curl --fail --silent --show-error http://127.0.0.1:4321/index.html
curl --fail --silent --show-error http://127.0.0.1:4321/historias.html
curl --fail --silent --show-error http://127.0.0.1:4321/app.html
curl --fail --silent --show-error http://127.0.0.1:4321/contacto.html
```

Una respuesta HTTP 200 no basta: comprobar título, menú actual y anclas reales.
No crear enlaces de preview para localhost en la UI de onboarding.

## Escenarios de aceptación

| Área | Procedimiento y resultado exigido | Referencia |
|---|---|---|
| Menú | 16 pares origen/destino; logo desde cuatro páginas; visita directa y recarga; un solo actual | G01 / SC-001 |
| CTA | Cuatro orígenes; teclado y puntero; título visible sin descarga automática | G02/G03 / SC-002 |
| Footer | Identidad fija en cuatro páginas y 16 enlaces complementarios reales | G04–G06 / SC-003 |
| Seguridad | Abrir acceso sin sesión; probar rutas privadas de 006 sin datos expuestos | G05 / US3.2 |
| Responsive | Siete anchos definidos; no overflow ni enlaces cortados; resize abierto/cerrado | SC-004 |
| Teclado | Tab/Shift+Tab, Enter, Escape y devolución de foco; ningún control oculto enfocable | SC-005 |
| Sin JS | Menú/enlaces visibles y operables, estado actual y footer disponibles | G01 |
| Accesibilidad | axe sin incidencias relevantes no resueltas; medir contraste y revisar nombres/foco manualmente | X01 compartido |
| Texto 200% | Ampliar texto realmente, no solo deviceScaleFactor o escalado de captura; repetir recorridos y revisar recortes | SC-004 |

Para SC-004, repetir en Chromium a **cada** ancho 360/390/430/768/1024/1280/1440 px,
tanto a texto 100% como 200%: 16 recorridos de menú, cuatro retornos por logo, cuatro CTA
y 16 enlaces del footer. Usar teclado y puntero; abrir menú compacto cuando corresponda.
Verificar destino, título visible, foco, ausencia de recortes y scroll horizontal en cada
combinación. Registrar celdas bloqueadas individualmente por recursos o destinos faltantes,
sin contarlas como aprobadas. Los fixtures solo acreditan contrato, no integración real.
T025 automatiza los siete anchos con texto 100%; T026 completa la misma matriz con texto
real al 200% mediante revisión manual o herramienta cuyo método se documente.

Antes de ejecutar la parte administrativa, usar el contrato006 recibido y su inventario consumidor descritos en
[contracts/navigation.md](contracts/navigation.md). El inventario está en `tests/helpers/navigation-private-contract.ts`; los casos locales usan el handler006 real con SQLite aislado, no simulan autorización. La ejecución de T027 necesita origen integrado real; no aceptar404 como protección.

Chromium cubre matriz completa; Firefox/WebKit cubren menú, CTA, anclas y foco como
regresión. Documentar navegador/versión y resultados; no afirmar auditoría total por axe.
Prueba manual con lector de pantalla para orden, página actual y disclosure.

## Evidencia y cierre

Guardar por requisito: fecha, entorno, navegador/ancho, escenario, resultado y evidencia.
Separar aprobado/fallido/bloqueado/no ejecutado y suites contractuales/integradas.
No usar mocks de login o documentos para aprobar G05/G06. El logo original y demás
recursos pendientes bloquean fidelidad final. La evidencia de ejecución contractual y los bloqueos integrados están en `evidence/`; esta guía no acredita cierre de la feature.

## Reanudación2026-10-20

T021 completa: pruebas integradas preparadas desde contrato006 C1/C2/C3, sin la excepción histórica de inventario ausente. `npm run test:navigation:service` verifica GET/HEAD privados401 y sesión401/403 reales; no envía correo ni crea cuentas. El fixture solo aporta templates sintéticos que no se entregan antes de autorizar; no acredita diseño del login ni operación productiva.

Las cuatro páginas002–005 consumen PublicLayout; todavía no se aprueban dist, anclas integradas o recursos por leer sus archivos. Build normal bloqueado por gates010/009 y pendientes de otras features. No usar Astro directo o fixtures para saltar aprobaciones. Ausencia de `PRIVA_INTEGRATION_BASE_URL` falla explícitamente; `--list` comprueba definición, no ejecuta ni califica un sitio.

## Recursos oficiales incorporados

`disenovisual/Link-PrivaHome.png` y `referencias.txt` recibidos y aplicados a001; T024 completa.
PNG sin cambios enpublic/brand; PlusJakartaSans normal/italic conOFL enpublic/fonts y variables
CSS de la referencia englobal.css. No cargar hojas remotasGoogleFonts. El banco001 sirvepublic
real; bancoshome/stories/app/contact/documents copian brand/fonts compartidos albuild manteniendo
materiales sintéticos de cada uno. Comprobar licencia, hashes, imagen104×40 y carga de fuente
con `navigation-brand.spec.ts`; no publicar los bancos como sitio final. El cierre sigue requiriendo
lectura asistida/fidelidad y contenido/operación real de otrasfeatures.

## Revisión de cierre — 2026-10-23

Navegación001 revalidada en Chromium/Firefox y guard006; pruebas adicionales de controles en Inicio real conformes.23/28 tareas, sin casillas nuevas cerradas: faltan build/destinos finales, WebKit, revisión manual específica y entorno integrado. Las imágenes de Inicio ya no son un bloqueo; continúan las dependencias de003/004/005/006/009/010. Evidencia actual y siguiente paso por cada tarea en [evidence/closure-status.md](evidence/closure-status.md).

2026-10-23 — Contacto Seguro del footer abre `/contacto.html` sin ancla, por instrucción explícita de la usuaria. Se conserva `#escribir` para los consumidores del formulario ajenos al footer. La revisión manual guiada de controles de Inicio con VoiceOver fue confirmada; aceptación integrada de destinos sigue pendiente.

## WebKit local en este entorno Linux

```bash
npm run test:e2e:contract:webkit
```

32casos aprobados el2026-10-26. El wrapper genera una caché privada real y usa bwrap rootless; no modifica el sistema ni omite verificación de dependencias. Requiere bibliotecas Debian verificadas disponibles y permiso de namespaces del ejecutor. Configurables PRIVA_WEBKIT_LIB_DIR y PLAYWRIGHT_BROWSERS_PATH. En Mac usar el runner Playwright nativo. No mezclar este resultado contractual con aceptación de destinos reales; ver evidence/webkit-runtime.md.
