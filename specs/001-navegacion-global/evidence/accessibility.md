# Estado vigente — cierre demo 2026-10-30

001 cerrada: 28/28 tareas para el alcance demo aprobado el 2026-10-30. Matriz 14/14 y sitio publicado 15/15 en tres motores; revisión humana con teclado/VoiceOver reportada por la responsable. Foco del footer corregido y publicado. Administración y producción conservadas como alcance diferido. [Evidencia completa](demo-closure-2026-10-30.md). Los registros siguientes son históricos.

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

2026-10-20 — Reanudación:45casosChromium pasan con14celdas100%/200%;31recorridos
principalesFirefox pasan (sin ejecutar allí la matriz exhaustiva). Corrección compartida
de foco tras reactivar la misma ancla ykeyupEnter: fallo inicial documentado, regresión
con puntero/teclado conforme y sin historial añadido. WebKit no arranca por bibliotecas
delhost, incluidalibGLESv2.so.2; no se desactivan protecciones ni se cuenta éxito.
Lector de pantalla y fidelidad/recursos finales siguen pendientes. Evidencia en summary.md.

2026-10-20 — Recursos comunes recibidos: capturas390/1440 con logo oficial sin
alterar104×40, PlusJakartaSans local y paleta aprobada inspeccionadas. MatrizChromium
repetida con recursos reales:46casos pasan;32recorridos/recursosFirefox pasan. Datos fuente
y hashes en resources.md/official-assets.json. Contraste sRGB actual: texto#153226 sobre
#F6F9F6=13.06:1; blanco sobrefooter#0D2219=16.67:1; foco#047857 sobre#F6F9F6=5.17:1;
focofooter#D7E4D8 sobre#0D2219=12.68:1. El soporte blanco dellogo preserva el PNG oscuro.
No hay certificación de comparación final conwireframes o lector de pantalla; T026 permanece parcial.

## Revalidación — 2026-10-23

46Chromium y32Firefox aprobados con marca/fuente/paleta oficiales. La matriz100/200 permanece conforme;4 comprobaciones adicionales de controles de Inicio real (390/1440px×100/200) verifican activo, Enter/Tab/Escape/foco, menú/footer, controles≥44px, axe y overflow. La revisión manual específica001 fue solicitada en Mac/VoiceOver; la confirmación anterior002 no se reutiliza como pase de estos controles. WebKit sigue bloqueado. T025/T026 permanecen parciales por sus dependencias de aceptación final. Ver [closure-status.md](closure-status.md).

## Respuesta manual recibida — 2026-10-23

La usuaria confirmó que menú/activo, apertura y Escape con retorno de foco y nombres del footer funcionan correctamente en Mac con VoiceOver. Evidencia: manual-navigation-review.md. Esta confirmación cubre los controles compartidos de Inicio anteriores al cambio solicitado de Contacto Seguro; el nuevo destino se valida automáticamente con teclado/puntero. Revisión final de las otras páginas e integración siguen pendientes, sin cambiar casillas de tareas.

2026-10-26 — WebKit27.2 pasa32recorridos principales, incluido Contacto Seguro a la página sin ancla. El bloqueo de biblioteca quedó resuelto por entorno aislado con caché privada, sin desactivar validaciones. Matriz exhaustiva Chromium y revisión manual de controles ya registrada se mantienen como evidencias separadas. T025/T026 siguen esperando aceptación final con las cuatro páginas. Ver webkit-runtime.md.
