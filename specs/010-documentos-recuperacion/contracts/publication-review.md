# Contrato de revisión y entrega010

Diseño del 2026-10-20; X03/R-08, US1.6/US2.5, SC-002/007.

## Controles y orden

1. Validador editorial puro recibe bundle/revisiones y devuelve problemas estables o conformidad: campos/secciones/rutas, huellas SHA-256 canónicas, revisión humana y concordancia entre los tres textos. No depende de `requirePrivacy()` ni hace operaciones de correo/borrado.
2. Expediente humano: fecha/revisor/alcance/resultado, versión y huella del conjunto, referencias de evidencia por afirmación. No basta presencia de palabras o ausencia de corchetes para certificar significado, permisos o condiciones legales.
3. Evidencia009 `notices`: identifica huella del bundle y revisión de entrega, conforme al formato009 (`kind:production`, `synthetic:false`, pass, fechas/archivo/hash verificables). Comprobar además los otros scopes009. No basta marcar un objeto como productivo para convertir una prueba local en calificación real.
4. `require-documents-publication.mjs` combina validación010 y verificación009 en build normal. Flujo acíclico: contenido→revisión editorial→evidencia integrada→gate de entrega. Adaptar005 para compartir aviso y validación pura, manteniendo sus controles existentes.

## Rechazo obligatorio

Campos P02/P03 ausentes, marcadores, contenido sin revisar, huellas alteradas o desactualizadas, `testOnly`, referencias inexistentes o evidencia caducada/futura/sintética/de otra revisión, contradicciones de política/canal/copias y afirmaciones de rastreo sin evidencia. El gate devuelve exit no cero sin secretos y no corrige valores automáticamente.

La aprobación editorial se invalida tras cambiar contenido/datos; la evidencia `notices` se revalida contra el conjunto exacto. El build requiere auxiliares y todos los gates existentes sin bypass productivo. Fixtures con casos positivos/negativos permiten probar validadores, pero nunca satisfacen publicación real. No se añade CMS ni firma legal de identidad.
