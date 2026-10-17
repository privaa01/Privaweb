# Resultado de implementación — 001 Navegación global

Fecha: 2026-10-16 (America/Bogota). Estado: trabajo independiente implementado;
feature sin cierre integral por dependencias externas y validaciones pendientes.

## Implementado

- Configuración central tipada, Header/Footer/Layout reutilizables y CSS adaptable.
- Menú nativo y página activa, disclosure accesible, Escape/resize/foco y degradación sin JS.
- CTA a casos/descarga y navegación por anclas; copyright fijo 2026 y footer común.
- Build contractual aislado que importa componentes reales; ninguna página de relleno
  en src/pages ni publicación de fixtures como sitio final.
- Lockfile y scripts repetibles, telemetría Astro desactivada, pruebas contractuales/integradas separadas.

## Evidencia ejecutada

`PRIVA_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e:contract -- --project=chromium`
terminó con exit 0: **44 aprobadas, 0 fallidas, 0 omitidas**, duración aproximada 2.4 minutos.
Resultados de cada caso y stats en [contract-results.json](contract-results.json).

14 celdas de matriz = siete anchos (360/390/430/768/1024/1280/1440) × texto 100%/200%.
Cada celda prueba 80 recorridos con teclado/puntero; total 1120 recorridos contractuales,
además de los 30 casos básicos. La ampliación cambia tamaños CSS reales, no píxeles de captura.
Axe sin violaciones en las 14 celdas, sin cookies/storage ni solicitudes a servicios externos
observadas en esos recorridos. Esto no certifica proveedores ni toda la futura aplicación.

`npm run check:contract`: sin errores/advertencias. Build contractual de siete páginas
(incluye tres destinos ficticios) completado, excluido del build de entrega.
Tras ajustar el color de foco del footer se repitieron check/build y regresión focalizada.
Ver [accessibility.md](accessibility.md), capturas y evidencias por historia.

## Bloqueos y límites

- T021: casos privados pendientes del inventario/servicio de 006.
- T023: páginas reales y secciones de 002–005 ausentes; build de aplicación sale con bloqueo explícito.
- T024: logo, tipografía y colores oficiales ausentes; no se certifica fidelidad.
- T025: regresión Firefox/WebKit no ejecutada por binarios ausentes y descarga 403.
- T026: revisión con lector de pantalla y fidelidad final pendientes.
- T027: sin entorno integrado ni documentos aprobados 010/formulario real 005; cero pruebas integradas ejecutadas.
- T028: documentación de progreso actualizada; cierre integral pendiente.

21/28 tareas completadas; las siete anteriores permanecen abiertas total o parcialmente.
No se modificó el checklist de calidad ni se certificó G01–G06 integrado por pruebas de fixtures.

## Configuración del entorno

Se guardaron install_script/start_skill actualizados y la adición de cdn.playwright.dev
al borrador de red, preservando Spec Kit y presets existentes. Guardar el borrador no lo
aplica ni publica: la descarga de Firefox/WebKit sigue sin validar. El usuario puede revisar,
guardar y publicar desde configuración del entorno. No se hizo commit ni push en esta fase.

2026-10-17 — Corrección compartida durante004 (G03): repetir CTA con mismo hash
restaura foco de encabezado sin alterar navegación nativa ni historia; prueba regresión
falló antes y pasó después. Suite001 completa:45 aprobadas; suites002:23 y003:29
aprobadas. Detalle en [evidencia004](../../004-presentacion-app/evidence/navigation.md).
No acredita nuevos cierres integrados ni sustituye los resultados históricos anteriores.
