# Inventario de recursos y revisión — 002

Actualización: 2026-10-23 (America/Bogota).

Las tres imágenes fueron aportadas por la usuaria para Inicio, recibidas en GitHub en el commit `10e683a`, inspeccionadas visualmente y conectadas según el orden indicado. Se renombraron sin modificar sus bytes para usar rutas locales sin espacios, compatibles con el guard existente.

| Bloque | Ruta local | Nombre aportado | Dimensiones PNG verificadas | Identificación |
|---|---|---|---|---|
| Hero | `/images/home/hero.png` | `candado 2.0.png` | 500 × 350 | Candado verde con escudo |
| Somos Priva | `/images/home/identidad.png` | `mano2.0.png` | 500 × 350 | Mano moviendo piezas de ajedrez |
| Cierre | `/images/home/cierre.png` | `teclas 2.0.png` | 500 × 350 | Garra levantando una tecla con escudo |

Las ilustraciones complementan el texto sin aportar información necesaria adicional; se clasifican como decorativas con alt vacío. Los encabezados y párrafos contienen el mensaje completo. Hero conserva carga eager; identidad y cierre conservan lazy. No hay recursos remotos ni imágenes de prueba en la entrada real.

| Recurso común/editorial | Evidencia |
|---|---|
| Marca | disenovisual/Link-PrivaHome.png, copia idéntica public/brand/priva-logo.png, 104 × 40, alt Priva |
| Tipografía | disenovisual/referencias.txt: Plus Jakarta Sans local con licencia OFL, public/fonts |
| Paleta | disenovisual/referencias.txt, variables compartidas |
| Introducción y cuatro descripciones | Cinco textos educativos aprobados explícitamente; ver editorial-review.md |

T025 y T030 completas. `scripts/require-home-publication.mjs` pasa; el antiguo bloqueo por imágenes y el enlace provisional placehold.co quedan superados por los archivos recibidos. Esto no acredita accesibilidad manual, WebKit, integración con Historias o publicación del sitio completo.

## Integridad de los archivos

- `hero.png`: SHA-256 `46a871b3fc5e04b2476ac6c92260dbd942af9517a532d6d8f3881913c55280a7`.
- `identidad.png`: SHA-256 `6a797e643eaffd20f175cd3b0a662aaf818ec0cb4b99da86eab9a50f1ecde0ac`.
- `cierre.png`: SHA-256 `3d83d918c7d9edc355ec04e68af48b4da632a89ddf2d2825b6be7516c5420333`.
