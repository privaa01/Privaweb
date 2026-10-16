# PRIVA — Specs por funcionalidad para SDD

Separación del SPEC R35, sin implementación ni cambios de alcance. La fuente original se conserva íntegra en [reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md](reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). El PDF de cuatro páginas y las dos capturas aportan composición y estilo; las diferencias funcionales y de copy expresadas por el R35 siguen documentadas. No se modificó el PDF.

## Catálogo

| Feature | Funcionalidad | IDs originales | Dependencias principales |
|---|---|---|---|
| [001-navegacion-global](001-navegacion-global/spec.md) | Navegación y estructura común | G01 G02 G03 G04 G05 G06 | Transversal / independiente |
| [002-inicio-institucional](002-inicio-institucional/spec.md) | Inicio e identidad de Priva | I01 I02 I03 I04 | 001-navegacion-global |
| [003-historias-educativas](003-historias-educativas/spec.md) | Historias, audio y reflexión educativa | H01 H02 H03 H04 H05 H06 H07 H08 H09 H10 H11 H12 | 001-navegacion-global |
| [004-presentacion-app](004-presentacion-app/spec.md) | Presentación y disponibilidad de Priva App | A01 A02 A03 A04 A05 A06 A07 | 001-navegacion-global |
| [005-contacto-publico](005-contacto-publico/spec.md) | Contacto y recepción privada de consultas | C01 C02 C03 C04 C05 C06 C07 | 001-navegacion-global, 009-privacidad-conservacion |
| [006-acceso-administrativo](006-acceso-administrativo/spec.md) | Acceso individual y sesiones administrativas | AD01 AD02 | 001-navegacion-global |
| [007-gestion-historias](007-gestion-historias/spec.md) | Gestión y publicación de historias | AD03 AD04 AD05 AD06 AD10 | 006-acceso-administrativo |
| [008-bandeja-respuestas](008-bandeja-respuestas/spec.md) | Bandeja privada y respuestas por correo | AD07 AD08 AD09 AD11 CT01 | 005-contacto-publico, 006-acceso-administrativo, 009-privacidad-conservacion |
| [009-privacidad-conservacion](009-privacidad-conservacion/spec.md) | Privacidad y ciclo de vida de datos | X02 | Transversal / independiente |
| [010-documentos-recuperacion](010-documentos-recuperacion/spec.md) | Documentos informativos y recuperación 404 | X03 | 001-navegacion-global, 009-privacidad-conservacion |
| [011-accesibilidad-fidelidad](011-accesibilidad-fidelidad/spec.md) | Accesibilidad, recursos y coherencia de entrega | X01 X04 X05 | Transversal / independiente |

## Cómo trabajar con Spec Kit

Esta división usa la estructura de la plantilla instalada. No ejecuta `$speckit-specify` once veces ni activa una feature arbitrariamente. No se crearon ramas, planes técnicos ni tareas de implementación.

1. Completar `$speckit-constitution` con los principios del proyecto: la constitución instalada sigue siendo una plantilla.
2. Elegir una sola feature y pedir a Codex que trabaje en su directorio existente, sin regenerarla desde cero. Por ejemplo:

   ```text
   Usa $speckit-clarify sobre specs/005-contacto-publico/spec.md.
   Conserva sus IDs originales y no amplíes el alcance.
   ```

3. Antes de `$speckit-plan`, seleccionar expresamente el directorio para que Spec Kit no dependa de la rama `main`:

   ```bash
   cd /workspace/Privaweb
   export PATH="/workspace/.tools/bin:$PATH"
   export SPECIFY_FEATURE_DIRECTORY="/workspace/Privaweb/specs/005-contacto-publico"
   ```

   Si se usa otro proceso o sesión, volver a indicar la ruta. Puede persistirse la selección en `.specify/feature.json` con `{"feature_directory":"specs/005-contacto-publico"}`; cambiarla al trabajar otra feature. No se guarda una selección global en esta entrega.

4. Aclarar solo los pendientes relevantes; ejecutar `$speckit-plan`, `$speckit-tasks`, `$speckit-analyze`, `$speckit-implement` y `$speckit-converge` por feature. Indicar siempre la ruta elegida en el mensaje al agente.
5. Registrar decisiones, evidencia y trazabilidad al cambiar requisitos. La aceptación de una feature no cierra las otras.

Las prioridades y secuencia siguientes son propuestas de trabajo, no decisiones históricas aprobadas. Iniciar los requisitos transversales 009/011 y la revisión legal 010 desde el principio; preparar 001/002/004; seguir con 006/007/003 y 005/008. Finalizar con pruebas integradas de publicación, consulta/respuesta, conservación, acceso y adaptación. 003 puede diseñarse antes de 007 con contenido de prueba; su integración final debe usar las mismas historias.

## Reglas compartidas

- Sin registro de visitantes, comentarios públicos, seguimiento de ejercicios, chat IA web ni diagnóstico implementado.
- App como prototipo; enlaces y recursos pendientes no se inventan. Footer fijo en 2026.
- Solo historias publicadas y activas son públicas; sin borrado definitivo de historias.
- Contacto y respuestas privados; conservar 90 días conforme a la política y resolver sus pendientes operativos.
- Mantener la estética y orden de wireframes, con las diferencias del R35; teclado, móvil, audio real y transcripciones forman parte de aceptación.
- No publicar promesas de privacidad o capacidades sin evidencia.

## Cobertura y límites

Los 53 IDs originales tienen exactamente una feature responsable en [TRACEABILITY.md](TRACEABILITY.md); las dependencias permiten compartir contratos sin duplicar propiedad. Los escenarios añadidos son una descomposición de trabajo, no una reproducción de los 195 criterios del documento 07, que no fue aportado. También faltan los documentos 03, 05 y 06 referenciados por R35.

Los borradores de aviso, Manifiesto y Términos se conservan completos en la fuente original y pertenecen funcionalmente a 010. Los pendientes P01–P05 permanecen vigentes, distribuidos en cada spec. Un borrador organizado permite trabajar aclaraciones y planificación, pero no certifica preparación para publicar.
