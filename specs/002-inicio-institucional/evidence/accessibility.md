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
