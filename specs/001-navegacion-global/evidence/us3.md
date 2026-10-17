# Evidencia US3 — 001

Fecha: 2026-10-16 (America/Bogota). Chromium del sistema en Linux.
Se añaden cuatro comprobaciones de footer con identidad exacta y contratos de sus enlaces.

Pruebas escritas antes del comportamiento. El caso representativo inicial falló por
funcionalidad ausente; ver us3-red.txt. Después, suite contractual acumulada:
**30 aprobadas**, exit 0; ver us3-green.txt.
El primer arranque de preview fallido se corrigió antes de obtener el fallo funcional;
no se contabiliza como evidencia negativa de comportamiento.

La matriz final amplía estos recorridos: ver contract-results.json y summary.md.
Esto valida componentes contra fixtures identificados, no contenidos reales ni seguridad
de un backend inexistente. Se conservan los bloqueos de recursos y otras features.
