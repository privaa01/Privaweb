# Anclas y corrección compartida — evidencia contractual

2026-10-17. A01/A04/A06, SC-002; integración contractual deG03 de001.
Hero#descarga/#como-funciona, headerApp, headerContacto de fixture, entrada directa y recarga
con encabezado enfocado/visible comprobados. No descargas desde CTAhero ni dependencia de URLs.
Sin JS navegación nativa y secciones visibles; foco mejorado se comprueba con JS activo.

Hallazgo real: pulsar CTA cuando URL ya contenía#descarga no emitía hashchange; foco quedaba
en enlace. Primera suite004 tuvo1fallo/6 aciertos; regresión específica añadida a001 también falló.
Corrección en src/scripts/navigation.ts: para click normal al fragmento local ya vigente,
restaurar contrato de foco en requestAnimationFrame sin preventDefault ni cambios de historia.
Ignorar modificadores, otros botones, target externo y download. No duplicar lógica en004.

Prueba específica verifica click, Enter, heading visible y misma longitud de history.
Tras corrección:31 pruebas004,45 regresión001 (incluida nueva),23Inicio y29Historias aprobadas.
OrigenContacto del banco es fixture identificado; el recorrido005 real sigue pendiente.
