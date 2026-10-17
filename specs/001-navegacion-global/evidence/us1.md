# Evidencia US1 — 001

Fecha: 2026-10-16 (America/Bogota). Chromium del sistema en Linux.
Menú, 16 recorridos, logo, activo, recarga, disclosure/Escape/resize/foco y navegación sin JS.

Pruebas escritas antes del comportamiento. El caso representativo inicial falló por
funcionalidad ausente; ver us1-red.txt. Después, suite contractual acumulada:
**22 aprobadas**, exit 0; ver us1-green.txt.
El primer arranque de preview fallido se corrigió antes de obtener el fallo funcional;
no se contabiliza como evidencia negativa de comportamiento.

La matriz final amplía estos recorridos: ver contract-results.json y summary.md.
Esto valida componentes contra fixtures identificados, no contenidos reales ni seguridad
de un backend inexistente. Se conservan los bloqueos de recursos y otras features.
