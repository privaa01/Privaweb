# Accesibilidad — resultados y límites

2026-10-17, Chromium sistema. Matriz14:360/390/430/768/1024/1280/1440px×texto100/200%.
Todas aprobadas: axe sin violaciones, contraste, controles medidos>=43px con objetivo44,
operación por teclado, radios/transcript/feedback, ancla#casos enfocada/visible y sin overflow
horizontal. Prueba sinJS aprobada: mensaje honesto, contenidos/enlaces estáticos; sin botones
que simulen catálogo o actividades disponibles.

Primera matriz tuvo4 fallos de viewport a200%: el test cambiaba fuente después de navegar al
fragmento. Se corrigió para aplicar fuente antes de load, verificando la visita directa a200%,
y se repitió suite completa:29/29. No se cambió navegación compartida ni se eliminó la aserción.
Foco de radios y semántica live verificados; anuncio efectivo con lector de pantalla pendiente.

Intento de smokeFirefox1555 y WebKit2370: ambos fallaron antes de ejecutar escenario.
Firefox: Could not find profile folder. WebKit: faltan libgtk-4, libgraphene, libharfbuzz-icu,
libmanette, libhyphen y libGLESv2. No se desactivaron protecciones ni se declara cobertura.
Artefactos locales .test-output/stories-browser-artifacts. Intento inicial concurrente fue
rechazado por puerto ocupado; se repitió secuencialmente y solo este intento fundamenta límites.

Teclado manual de controles nativos, lector de pantalla, fuentes/paleta/activos oficiales y
fidelidad final pendientesT030/T031/T032. Capturasfixture no acreditan aceptación visual.

2026-10-26 — Recorridos principales Firefox disponibles:15aprobados,0fallos/omitidos;14casos de matriz excluidos por diseño con `--grep-invert="stories [0-9]+px text"`. Ver resume-2026-10-26-firefox.txt. Esto supera el bloqueo histórico de arranque Firefox para003. WebKit no se reejecutó en esta reanudación: conserva dependencia host pendiente según última evidencia de001; T030 sigue parcial.
