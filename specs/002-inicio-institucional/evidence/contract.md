# Resultados contractuales — 002

Actualización: 2026-10-21 (UTC). Resultados finales tras aplicar los cinco textos aprobados. No se suman ejecuciones anteriores ni reintentos.

| Comando | Resultado |
|---|---|
| node --experimental-strip-types --test tests/home-publication.test.ts | 24 aprobadas; 0 fallidas/omitidas |
| npm run check:home:contract | 96 archivos; 0 errores/advertencias; 1 hint previo returnValue en administración |
| PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:home:contract -- --project=chromium | 25 aprobadas; 0 fallidas/omitidas; 25 s |
| PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npm run test:e2e:home:contract -- --project=firefox --grep-invert='matriz Inicio' | 11 aprobadas; 0 fallidas/omitidas; matriz de 14 casos excluida por diseño |
| Mismo comando --project=webkit --grep='base: layout' | 1 intento fallido al arrancar; dependencias host ausentes; 0 aprobadas |
| node scripts/require-home-publication.mjs | Salida 1 esperada; tres imágenes institucionales pendientes |
| npm run test:e2e:home:integration | Salida 1; falta URL real; ninguna prueba integrada ejecutada |

Los logs resume-2026-10-21-* conservan estos resultados. La matriz Chromium recorre siete anchos y texto 100%/200%, axe, ausencia de almacenamiento/tráfico externo y ambas anclas. Casos adicionales verifican carga real de logo/fuente/paleta y repetición de Conocer más sin alterar historial. Las imágenes institucionales y destino Historias siguen siendo fixtures inequívocos.

Se observó fallo de la nueva prueba de metadatos oficiales antes de conectar los recursos. Una ejecución intermedia posterior a la aprobación editorial tuvo dos fallos al guardar trazas por intentar iniciar Firefox mientras Chromium seguía activo; Firefox además rechazó el puerto ocupado. Se repitieron ambas suites secuencialmente: los resultados finales de la tabla no incluyen esos intentos como aprobados.

La regresión compartida 001 ya documentada en esta sesión (46 Chromium y 32 Firefox) pertenece a la incorporación previa de recursos comunes, no a una nueva ejecución de 002. No se modificó el layout compartido en esta reanudación de 002. La build contractual se ejecuta dentro de las suites; no equivale al build publicable de la aplicación.

## Ejecución vigente de convergencia — 2026-10-20 (America/Bogota)

29 Chromium y 15 Firefox aprobadas tras ampliar recorridos y corregir iconos de tarjetas; 24 pruebas de publicación y ambos Astro checks sin errores/advertencias. WebKit sigue bloqueado por detección de libGLESv2 en la caché del host, aun con bibliotecas locales. Ver comandos, resultados y límites en [convergence.md](convergence.md); los conteos anteriores son históricos.

## Actualización — 2026-10-23

Imágenes institucionales recibidas y conectadas; el guard de Inicio pasa con los datos reales. Ver [received-images.md](received-images.md) para pruebas y límites actuales. Los bloqueos de material anteriores son históricos; esto no acredita integración real ni revisión completa con lector de pantalla.
