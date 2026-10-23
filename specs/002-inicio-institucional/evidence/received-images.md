# Imágenes oficiales conectadas — Inicio 002

Fecha: 2026-10-23 (America/Bogota).

Tres PNG aportados por la usuaria y recibidos desde GitHub en 10e683a. Se inspeccionaron visualmente y se renombraron sin modificar bytes: candado 2.0.png → hero.png, mano2.0.png → identidad.png, teclas 2.0.png → cierre.png. Rutas locales en public/images/home; dimensiones reales 500 × 350 leídas de los encabezados PNG, también comprobadas al cargarlas en Chromium. Inventario y SHA-256 en [resources.md](resources.md).

`src/content/home.ts` configura las tres imágenes como verificadas, con procedencia identificable, dimensiones reservadas y propósito decorativo (alt vacío). Los textos completos adyacentes transmiten el contenido; las ilustraciones son metáforas complementarias. Hero eager; identidad/cierre lazy. El guard existente no se modifica ni se omite.

## Verificación

| Comprobación | Resultado |
|---|---|
| node scripts/require-home-publication.mjs | Salida 0; bloqueo de imágenes de 002 resuelto |
| node --experimental-strip-types --test tests/home-publication.test.ts | 24 aprobadas; también comprueba archivos reales, dimensiones y aceptación del contenido real |
| npm run check:home:contract | 0 errores/advertencias; 1 hint previo returnValue en administración |
| test:e2e:home:contract --project=chromium, Chromium /usr/bin/chromium, caché /workspace/.cache/ms-playwright | 29 aprobadas; 0 fallidas/omitidas, 27.5s. Suite contractual conserva sus imágenes ficticias para casos negativos; no cuenta como integración real |
| Build aislado de la entrada real src/pages/index.astro | 1 página construida con su guard intacto y publicDir real; sin usar HomeContent con datos sintéticos |
| Chromium en esa página real a 1440 y 390 px | Las tres imágenes decodifican desde rutas /images/home/, naturalWidth 500/naturalHeight 350; capturas received-images-1440.png y received-images-390.png |

El build aislado se generó en `.test-output/home-official-render` mediante un root temporal ignorado `.test-output/home-official-entry` cuya única página importa `src/pages/index.astro`; no sustituye el build del sitio completo ni sus gates. Comando: `ASTRO_TELEMETRY_DISABLED=1 npx astro build --root .test-output/home-official-entry`. Logs en received-images-render-build.txt. El render de escritorio fue inspeccionado visualmente con las tres imágenes aportadas. Se mantuvo el servidor temporal en 127.0.0.1:4327 solo para esta comprobación.

T025/T030 cerradas: 26/33 tareas completas. Se mantienen abiertas revisión final con lector/fidelidad, WebKit y aceptación integrada con Historias real; el build completo conserva los guards de otras features, incluida la 010. Sin commit, push ni despliegue en esta fase.
