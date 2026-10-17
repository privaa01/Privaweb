# Guía de validación futura — 001

**Estado**: tooling, componentes y banco contractual implementados. Instalación, check y
build contractual verificados; páginas de aplicación e integración real pendientes.
Los comandos de build/preview de aplicación siguen bloqueados hasta T023.

## Prerrequisitos

- Checkout existente en /workspace/Privaweb; no crear worktree salvo petición explícita.
- Node 24.19.0/npm 11.9.0; terminal con npm y caché escribible.
- Implementación de tooling y pruebas según [plan](plan.md).
- Para aceptación integrada: páginas/secciones 002–005, acceso protegido 006,
  documentos revisados 010 y recursos oficiales para fidelidad.

## Estado documental comprobable ahora

```bash
cd /workspace/Privaweb
.specify/scripts/bash/check-prerequisites.sh --paths-only --json
```

Debe resolver FEATURE_DIR a specs/001-navegacion-global y plan.md a este directorio.
No ejecuta ni prueba la aplicación.

## Instalación en la fase de implementación

`package.json` y `package-lock.json` ya fijan las versiones de research.md. Usar instalación reproducible:

```bash
cd /workspace/Privaweb
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

En este entorno la descarga Playwright recibió 403. Para usar Chromium instalado:

```bash
PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contract -- --project=chromium
```

Firefox/WebKit requieren sus binarios oficiales; no se consideran probados por Chromium.
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

Antes de ejecutar la parte administrativa, usar el contrato pendiente con 006 descrito en
[contracts/navigation.md](contracts/navigation.md). La ausencia del inventario de rutas
privadas bloquea esa parte de T021/T027; no inventar endpoints ni aceptar un 404 como protección.

Chromium cubre matriz completa; Firefox/WebKit cubren menú, CTA, anclas y foco como
regresión. Documentar navegador/versión y resultados; no afirmar auditoría total por axe.
Prueba manual con lector de pantalla para orden, página actual y disclosure.

## Evidencia y cierre

Guardar por requisito: fecha, entorno, navegador/ancho, escenario, resultado y evidencia.
Separar aprobado/fallido/bloqueado/no ejecutado y suites contractuales/integradas.
No usar mocks de login o documentos para aprobar G05/G06. El logo original y demás
recursos pendientes bloquean fidelidad final. La evidencia de ejecución contractual y los bloqueos integrados están en `evidence/`; esta guía no acredita cierre de la feature.
