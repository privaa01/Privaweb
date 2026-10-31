# Estado vigente — 2026-10-30

32/32 tareas de la demo. T029/T030 cerradas; revisión específica de teclado/VoiceOver confirmada por la responsable.48/48 pruebas de presentación,9/9 integración publicada y53/53 Node. Recursos/textos oficiales aprobados; comparación nueva contra PDF3 y producción diferidas. [Resultados y límites](demo-review-2026-10-30.md). Registros siguientes históricos.

# Estado vigente tras aprobación editorial — 2026-10-28

30/32tareas. Recursos/copy aprobados; guard pasa y App real200.53/53Node,9/9integración y20/20adaptación/render. T029manual/fidelidad y T030build/calificaciónintegrada pendientes. [Evidencia actual](approval-2026-10-28.md). Los registros siguientes son históricos.

# Estado vigente — 2026-10-28

29/32tareas: T027 cerrada con22/22 pruebas principalesFirefox/WebKit;52/52Node. Recursos oficiales ya recibidos/revisados; copyApp pendiente de aprobación. Pruebas contractuales no acreditan revisión manual/fidelidad final. [Detalle](review-2026-10-28.md). Los registros siguientes son históricos.

# Resumen de implementación — 004

Fecha:2026-10-17 (America/Bogota). Componentes y pruebas contractuales implementados;
recursos oficiales, revisión editorial y aceptación integrada pendientes. Sin commit/push en esta fase.

## Implementado

- Página estática del prototipo: hero, explicación/teléfono/tresbeneficios, cuatropasos,
  tresfunciones previstas y descarga/mockup. Conversar no tiene acción/foco de control.
- Config/resolver puro por Android/iPhone, cuatroestados y candidatas fuera de HTML;
  verificación vinculada a URL/plataforma/fecha/identidad/accesibilidad, sin SDK ni consultas a tiendas.
- HTML nativo con o sin JS, anclas reutilizando001; notaA07 exacta y ambos Próximamente válidos.
- Gate de copy/recursos/revisiones/mockup/disponibilidad en prebuild y entrada real, sin bypass.
- Banco aislado con destinos HTTPS.test interceptados e imágenes sintéticas identificadas.

## Verificado

| Validación | Resultado |
|---|---|
| Unitariasresolver/publicación |27+25=52 aprobadas |
| UIChromium004 |31 aprobadas;20 matriz,4sin JS,7 recorridos |
| Regresión001/002/003 |45+23+29=97 aprobadas |
| Astrocheck raíz/banco004 |0 errores/advertencias/hints |
| Buildbanco004 | Aprobado en servidorPlaywright |
| Prebuild004/entrada real | Bloquean por recursos/revisión, no por ambas URLs pendientes |
| Buildcompleto | Bloqueado por Contacto; resto de gates conservados |
| Firefox/WebKit | Fallos de arranque; sin cobertura aprobada |
| Integraciónreal | Bloqueada por entorno/Contacto/materiales; no aprobada |

Total180 pruebas aprobadas. No acredita copy, imágenes, URLs oficiales, fidelidad o disponibilidad
real de una app. Ver contract-results.json/unit-results.json/verification.json y evidencias por área.

## Tareas

28/32 completas: T001–T026, T031/T032. Abiertas:

- T027 parcial:Firefox/WebKit fallan antes de los escenarios (perfil/bibliotecas).
- T028 bloqueada:activos y revisiónP01/P03/P04 pendientes; URLs pueden permanecer pendientes.
- T029 bloqueada:lector de pantalla y fidelidad con recursos finales pendientes.
- T030 bloqueada:entorno real, Contacto005, publicación coherente de cambios y revisión aplicable.

## Corrección compartida y alcance

Se reprodujo fallo de CTA a mismo fragmento (no hashchange/foco en enlace); nueva prueba001
falló antes de corregir navigation.ts y pasó después con click/Enter y sin cambiar historia.
Implementación preserva comportamiento nativo/modificadores; no hay script duplicado en004.
Suite001 completa aumentó de44 a45 casos. No se amplió alcance ni se modificaron datos/catálogos
002/003; sus suites se ejecutaron por el riesgo de la dependencia compartida.

Recursos/destinos de prueba no se publican. Ambaspendientes no es bloqueo de disponibilidad;
el bloqueo real de publicación hoy es editorial/materiales. No se implementó chat, diagnóstico,
registro, lista de espera, instalación o app móvil. La documentación mantiene cierres pendientes.
