# Feature Specification: Documentos informativos y recuperación 404

**Feature Directory**: `specs/010-documentos-recuperacion`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: X03.

## Alcance

Permitir conocer las condiciones y el tratamiento de datos y recuperarse de una ruta inexistente.

**Fuera de alcance**: Inventar identidad, jurisdicción, licencias, proveedores o publicar marcadores de borrador.

## User Scenarios & Testing

### User Story 1 — Consultar información del servicio (Priority: P1)

Como persona usuaria o responsable de Priva, quiero consultar información del servicio para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** documentos completos y revisados, **cuando** la persona abre Términos o Manifiesto desde el footer, **entonces** lee condiciones consistentes con las funciones y tratamiento reales.

### User Story 2 — Entender el formulario (Priority: P2)

Como persona usuaria o responsable de Priva, quiero entender el formulario para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** la persona está por enviar una consulta, **cuando** consulta el aviso, **entonces** comprende qué se guarda, quién responde, el carácter privado y el plazo aplicable.

### User Story 3 — Recuperarse de una ruta inválida (Priority: P2)

Como persona usuaria o responsable de Priva, quiero recuperarse de una ruta inválida para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una dirección inexistente, **cuando** la persona abre la página, **entonces** ve una 404 recuperable con una salida a contenido válido.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / X03 — Auxiliares y documentos informativos**: Términos/Manifiesto/aviso completos y revisados antes de publicar, 404 recuperable y anclas #casos/#como-funciona/#descarga/#escribir; sin #maria; QR solo con destino aprobado (C32).

### Reglas y contenido complementario

Rutas propuestas: /terminos.html, /manifiesto-datos.html y /404.html. Aviso junto a Contacto: alias/correo/mensaje obligatorios, guardado, respuesta privada asociada, 90 días y solicitud anticipada, advertencia sobre datos sensibles. Manifiesto: datos, usos, proveedores, responsable, ubicación verificada, copias, derechos/canal, ejercicios locales sin persistencia y cookies necesarias comprobadas. Términos: contenido educativo sin garantías, app como prototipo, ausencia de registro público y enlaces externos. Usar como base los tres borradores C32 conservados en la referencia; no tratarlos como textos finales. Anclas de recuperación válidas; QR solo con destino aprobado.

### Key Entities

Documento informativo; aviso de Contacto; destino de recuperación.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 3 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 1 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: [001-navegacion-global](../001-navegacion-global/spec.md), [009-privacidad-conservacion](../009-privacidad-conservacion/spec.md)
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P02/P03: completar datos operativos, vigencia, titularidad/permisos y revisar los textos. El texto final debe describir la operación comprobada, sin publicar marcadores entre corchetes.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| X03 | FR-001 | Derivado técnico | No ejecutado |
