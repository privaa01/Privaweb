# Accesibilidad y presentación contractual — 002

La matriz valida 360/390/430/768/1024/1280/1440 px con texto 100%/200%.
La ampliación usa font-size de raíz 16px/32px, no deviceScaleFactor ni escala de captura.
Por celda: orden de cuatro bloques/tarjetas, Conocer más por teclado/puntero, ambas anclas
directas/recargadas, CTA final, título/foco visible y ausencia de overflow.
Axe sin violaciones en las 14 celdas; preferencias de movimiento reducido activadas.
Sin cookies/storage ni tráfico a terceros observado durante esos recorridos de fixtures.

Hay casos separados para fallo de las tres imágenes institucionales y navegación sin JS;
texto y controles permanecen. Layout de Inicio ocupa ancho completo sin alterar default de
001, cuya regresión pasó 44 pruebas. Los controles de contenido tienen min-height 44px.

Contraste calculado con luminancia sRGB sobre colores provisionales del CSS:

| Primer plano | Fondo | Contraste |
|---|---|---|
| #193c2f | #f7faf7 | 11.55:1 |
| #ffffff | #193c2f | 12.15:1 |
| #b4f1cd | #193c2f | 9.49:1 |
| #193c2f | #edf3ec | 10.78:1 |

Se inspeccionó captura escritorio home-1440.png; conserva composición de los cuatro bloques,
cuadrícula y cierre oscuro. home-390.png conserva evidencia móvil. Ambas son del banco, con
recursos ficticios visibles y aviso de prueba; no se certifican fuente ni colores oficiales.
Pendientes: revisión manual con lector de pantalla y comparación final con recursos aprobados.
T026 permanece parcial; axe y capturas no acreditan accesibilidad integral del sitio publicado.

## Actualización 2026-10-21

Los valores provisionales y capturas anteriores son históricos. La nueva matriz Chromium completa pasa con fuente local Plus Jakarta Sans y paleta recibida; Firefox pasa 11 recorridos principales. No hay nuevas capturas certificadas ni revisión manual final.

Contraste calculado con luminancia sRGB del CSS actualizado:

| Texto | Fondo | Razón |
|---|---|---|
| #153226 | #F6F9F6 | 13.06:1 |
| #FFFFFF | #153226 | 13.85:1 |
| #FFFFFF | #0D2219 | 16.67:1 |
| #D7E4D8 | #0D2219 | 12.68:1 |
| #153226 | #D7E4D8 | 10.54:1 |

Las 14 celdas repiten axe y texto 200%; no sustituyen lector de pantalla ni fidelidad contra PDF con imágenes finales. T026 permanece parcial; WebKit no inicia por bibliotecas ausentes.

## Revisión preliminar de convergencia — 2026-10-20 (America/Bogota)

PDF aportado disponible en el entorno: `wireframes web (2).pdf`, página 1 renderizada con pdftoppm a 1440px y vista como imagen. Se compararon capturas actuales del banco a 1440 y 390px con logo/fuente/paleta recibidos e imágenes institucionales sintéticas claramente identificadas. La revisión observó números decorativos en tarjetas donde el PDF usa libro, sobre, marcador y comunidad; `HomeAreas.astro` los sustituye por SVG decorativos ocultos a tecnología de asistencia y sin foco/acciones. Capturas `convergence-home-1440.png` y `convergence-home-390.png`.

Se conserva la secuencia hero → identidad → áreas → cierre y el apilado de tarjetas. Esta comparación preliminar no certifica espaciados/fidelidad final de los recursos ausentes. No hay lector de pantalla instalado identificado (orca/NVDA ausentes); axe y foco automatizado no lo sustituyen. T026/T032 permanecen parciales. Las diferencias aprobadas de texto y año se conservan.

## Actualización — 2026-10-23

Imágenes institucionales recibidas y conectadas; el guard de Inicio pasa con los datos reales. Ver [received-images.md](received-images.md) para pruebas y límites actuales. Los bloqueos de material anteriores son históricos; esto no acredita integración real ni revisión completa con lector de pantalla.
