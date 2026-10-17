# Resultados de contrato — 002

Fecha: 2026-10-16 (America/Bogota). Entorno Linux, Node 24.19.0 y Chromium 154.0.8037.57.

| Ejecución | Resultado |
|---|---|
| npm ci final | Correcto, lockfile actualizado reproducible |
| npm run check:home:contract | 0 errores, 0 advertencias |
| node --test tests/home-publication.test.ts | 23 aprobadas, 0 fallidas/omitidas |
| test:e2e:home:contract --project=chromium con PRIVA_CHROMIUM_EXECUTABLE | 23 aprobadas, 0 fallidas/omitidas, ~47s |
| test:e2e:contract --project=chromium (regresión 001) | 44 aprobadas, 0 fallidas/omitidas, ~3.4min |

Las suites construyen y sirven salida .html real, con fixtures inequívocos que importan
componentes de src. Salidas home/navigation, cachés/reportes y trazas separados.
La primera ejecución concurrente de home tuvo dos errores al escribir trazas por colisión
de outputDir; se corrigió config y se repitieron los 23 casos sin errores. No se presentan
esos fallos de infraestructura como errores de producto ni se ignoran en conteos históricos.

home-results.json contiene cada prueba y navigation-regression.json las estadísticas de
esta regresión. No incluyen volcados de entorno o credenciales. No hay pruebas de integración
real ejecutadas; ver integration.md. Build de aplicación sigue bloqueado, sin dist de entrega.
