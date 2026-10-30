# Inicio publicado en Firebase

Fecha: 2026-10-30, America/Bogota. Alcance: T027/T031 y sincronización parcial T028 sobre https://priva-785cb.web.app. No se cambian contenido, aprobaciones o requisitos del producto completo.

## Resultado

60/60 pruebas aprobadas, sin fallos ni casos omitidos, duración112.1s. Son20por motor Chromium/Firefox/WebKit: los seis recorridos integrados existentes (18totales) y14combinaciones de ancho/texto por motor (42celdas). No hay interceptación deAPI ni fallback a fixtures; se navega al sitio público real.

Se verifican I01–I04/SC-001–005: cuatro secciones en orden, título y tarjetas aprobados, anclasSomos Priva/Qué hacemos mediante entrada directa y recarga, foco y continuidad al siguiente enlace, Conocer más y Explora nuestras historias con teclado/puntero y destinoHistorias real. Siete anchos360/390/430/768/1024/1280/1440px y tamaño raíz16/32px (100/200%), movimiento reducido, axe sin violaciones, ausencia de overflow, objetivos de enlaces de Inicio≥44px y foco visible. Sin cookies/localStorage/sessionStorage ni solicitudes a otros orígenes durante esos recorridos. No se envían pruebas de Contacto ni se accede a administración.

Las tres imágenes oficiales publicadas de Inicio coinciden porSHA256 con public/images/home/hero.png, identidad.png y cierre.png; HTTP200en los tres casos. La imagenhero carga correctamente en cada celda. Resultados saneados en published-results-2026-10-30.json.

Capturas locales de Chromium inspeccionadas: .test-output/home-published-1440-100.png y home-published-390-200.png. La segunda muestra texto aumentado y distribución apilada sin desbordamiento; el contenido continúa mediante scroll normal. No se atribuye una sesión nueva de lector de pantalla a esta automatización ni se vuelve a solicitar la aprobación visual/manual ya registrada enT026.

## Ajuste de la prueba

La primera campaña se interrumpió al observar que openRealHome buscaba el menúPrincipal únicamente si estaba visible. En móvil cerrado, el enlace activo existe, pero el árbol de roles por defecto excluye elnavoculto. Se usa includeHidden:true para verificar suaria-current sin abrir/cambiar el estado del menú. Se mantiene el texto exactoInicio y las demás aserciones. No era un fallo del menú publicado ni se cambió código del producto. Campaña final completa60/60; intentos previos no se suman como resultados aprobados.

## Chequeos y builds

- Tipado estricto del test integrado conforme.
- Astro check:95archivos,0errores,0advertencias y1hint previo de returnValue en admin-inbox.ts.
- Build de la demo autorizada:7páginas, salida0; ejecuta guards de contenidos aprobados de Inicio/Historias/App y no modifica el build completo.
- Build completo:salida1 antes de compilar, detenido por guard010 y evidencias operativas009 pendientes. No se quita ningún guard ni se cambia readiness.

El último resultado no es un fallo de Inicio: el build completo exige condiciones de Documentos/Privacidad para los servicios del producto, distintas de la demo ya publicada. T027/T031 conservan ese requisito residual; T028 conserva cierre integral. Total:30/33. No se marca el producto completo como aceptado por aprobar la demo.

## Reproducción

Con Node/npm del entorno enPATH, desde la raíz:

```sh
PRIVA_TEST_MODE=integration PRIVA_INTEGRATION_BASE_URL=https://priva-785cb.web.app PRIVA_CHROMIUM_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node node_modules/@playwright/test/cli.js test --config playwright.home.config.ts
ASTRO_TELEMETRY_DISABLED=1 node node_modules/astro/bin/astro.mjs check
node scripts/build-demo.mjs
npm run build
```

Logs locales:home-published-final-2026-10-30.log, home-check-2026-10-30.log, home-demo-build-2026-10-30.log y home-full-build-2026-10-30.log bajo.test-output/. Reporte completo:home-integration-results.json. Node24.22.1/macOSARM64, Playwright1.64.1, Chrome instalado, Firefox157.0/revisión1555 y WebKit27.2/revisión2370. Checklist documental002:16/16, sin editar sus marcadores; sin hooks de extensión configurados. No se repiten suites contractuales verdes ni pruebas ajenas a002.
