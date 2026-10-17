# Disponibilidad y privacidad — evidencia contractual

2026-10-17. A06/A07, SC-003/004.27 unitarias del resolver y cuatro estadosUI aprobados.
Android/iPhone independientes; href exacto de URL verificada, incluida conservación dequery/
fragment revisados en unitarias. Candidata ausente/inválida/sin revisión, fecha inválida/futura,
evidencia de otra URL/plataforma, retiro/cambio, duplicados y registrosmalformados nunca habilitan.
Una plataforma inválida no deshabilita la otra válida. Fechas por defecto usan America/Bogota;
reloj inyectado en pruebas para no depender del día de ejecución. No caducidad arbitraria.

Próximamente como texto, sin href/handler/tabindex/rol de control, nombreAndroid/iPhone legible.
Candidatas/revisión no aparecen en HTML; solo estados efectivos recibidos por componentes.
DestinosHTTPS.test interceptados porPlaywright: navegación va aAndroid/iPhone correcto, sin
salir a tienda real. Sin download/prefetch ni confirmación de instalación. Pruebas sin JS cubren
las cuatro combinaciones y navegación nativa a destino interceptado.

Observación del caso pendiente: requests solo locales; cookies/localStorage/sessionStorage vacíos.
Sin SDK, fetch, script propio o analítica. Click saliente legítimo se distingue de seguimiento.
27/27 unitarias: el stub inicial falló27 antes del resolver. Pruebas no certifican oficialidad
ni accesibilidad real de una URL futura. Configuración de entrega conserva ambas pendientes.
