# Accesibilidad — banco contractual 001

Fecha: 2026-10-16 (America/Bogota). Entorno Linux/Chromium del sistema 154.0.8037.57.
La matriz utiliza los siete anchos del spec y texto 100%/200%; el método de ampliación
cambia font-size real de la raíz a 32px desde 16px, sin alterar deviceScaleFactor.
No es una certificación de funcionamiento con todos los mecanismos de zoom del navegador.

Cada celda prueba 16 recorridos de menú, cuatro retornos por logo, cuatro CTA y 16 enlaces
de footer mediante puntero y teclado: 80 recorridos por celda, 1120 en 14 celdas.
Axe complementa pruebas de foco/disclosure sin JS; las opciones ocultas no son tabulables.
Capturas navigation-390.png y navigation-1440.png muestran fixtures, no el sitio final.

Contraste calculado con luminancia sRGB WCAG para los colores provisionales del componente:

| Primer plano | Fondo | Contraste |
|---|---|---|
| #153c2d | #f7faf7 | 11.64:1 |
| #ffffff | #153c2d | 12.24:1 |
| #126a4e | #f7faf7 | 6.25:1 |
| #b2f7ca | #153c2d | 9.94:1 |

No se certifican colores oficiales, aún ausentes. Foco del footer usa borde claro propio.
Controles del CSS tienen min-height:44px; el texto crece y las filas se adaptan.
Revisión visual de captura móvil: menú y footer legibles sin recorte al tamaño capturado.
Falta revisión manual con lector de pantalla y fidelidad con recursos finales: T026 parcial.
El resultado automatizado definitivo se registra en summary.md y contract-results.json.
