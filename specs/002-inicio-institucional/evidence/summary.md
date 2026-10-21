# Resultado de implementación — Inicio 002

Actualización: 2026-10-21 (UTC). Componentes implementados y probados; publicación e integración sin cierre integral.

## Cambios

- Hero, Somos Priva, cuatro tarjetas y cierre conservan estructura, anclas y texto C16.
- Marca oficial, fuente local Plus Jakarta Sans y paleta recibidas desde disenovisual; verificadas en el banco. Estilos de Inicio usan la paleta compartida.
- Cinco textos educativos aprobados explícitamente por la usuaria y aplicados con revisión vinculada al texto exacto. Ver [decisión editorial](editorial-review.md).
- Pruebas adicionales de recursos reales y foco al repetir Conocer más. El gate sigue rechazando imágenes institucionales pendientes.

## Verificación

24 pruebas de publicación aprobadas; check Astro contractual: 0 errores, 0 advertencias y 1 hint previo de returnValue en administración. La matriz Chromium cubre siete anchos × texto 100%/200%; regresión principal Firefox disponible. Resultados finales y comandos en [contract.md](contract.md). WebKit intentado: no inicia por bibliotecas del host; no se cuenta como aprobado.

## Tareas y pendientes

23/28 completas (T001–T022 y T024). Se conservan sin marcar:

- T023 parcial: matriz Chromium y recorridos Firefox verificados; WebKit bloqueado por dependencias.
- T025 parcial: marca/fuente/paleta y cinco revisiones recibidas; faltan tres imágenes oficiales. El enlace provisional suministrado devuelve HTTP 403; ver [inventario](resources.md).
- T026 parcial: pruebas automáticas y adaptación; faltan lector de pantalla y comparación final con imágenes oficiales/PDF.
- T027 parcial: casos preparados; sin PRIVA_INTEGRATION_BASE_URL real. Las páginas 003–005 ya existen en código, sin acreditar por ello aceptación integrada.
- T028 parcial: documentación actualizada; cierre total depende de los anteriores.

Checklist de requisitos 16/16, sin modificar sus marcadores. Sin despliegue, commit ni push en esta fase. Los cambios previos de 001 se conservaron.
