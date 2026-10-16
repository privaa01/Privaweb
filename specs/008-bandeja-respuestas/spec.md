# Feature Specification: Bandeja privada y respuestas por correo

**Feature Directory**: `specs/008-bandeja-respuestas`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: AD07, AD08, AD09, AD11, CT01.

## Alcance

Permitir consultar mensajes privados de Contacto, responder por correo y conservar el historial asociado.

**Fuera de alcance**: Moderación pública, botones Aprobar/Aprobados, comentarios por historia y deducir entrega o lectura de una aceptación de envío.

## User Scenarios & Testing

### User Story 1 — Consultar mensajes privados (Priority: P1)

Como administrador autorizado, quiero consultar mensajes privados para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una consulta guardada desde Contacto, **cuando** una persona administradora abre Pendiente, **entonces** ve alias, correo y mensaje correctos sin que sean públicos.

### User Story 2 — Responder una consulta (Priority: P2)

Como administrador autorizado, quiero responder una consulta para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una respuesta redactada para el correo almacenado, **cuando** el servicio acepta el envío, **entonces** se conserva la respuesta asociada y la consulta pasa a Respondido.

### User Story 3 — Reintentar sin duplicados (Priority: P2)

Como administrador autorizado, quiero reintentar sin duplicados para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** el servicio falla o el resultado es incierto, **cuando** la persona reintenta la respuesta, **entonces** se conserva el texto, no hay falso Respondido por fallo y no se duplican envíos.

### User Story 4 — Comprobar el recorrido completo (Priority: P2)

Como administrador autorizado, quiero comprobar el recorrido completo para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una nueva consulta pública y un buzón de prueba controlado, **cuando** se guarda, consulta y responde desde el panel, **entonces** se verifica por separado la aceptación del servicio, la asociación guardada y la recepción real del mensaje.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / AD07 — Bandeja privada de Contacto**: Consultar comentarios Pendiente/Respondido con nombre/alias, correo y mensaje; sin comentarios públicos ni aprobación para publicar; filtros/listado privados, contadores reales (C28).
- **FR-002 / AD08 — Estado Pendiente → Respondido**: Transición solo tras aceptación real del servicio de correo; fallo conserva Pendiente y texto para reintento; sin duplicados. Sustituye acción de aprobación pública de captura (C28).
- **FR-003 / AD09 — Redactar y conservar respuesta**: Administrador responde desde panel al correo almacenado correcto; conservar respuesta enviada asociada al comentario; acceso privado y error/reintento; no prometer entrega/lectura por mera aceptación (C04/C28).
- **FR-004 / AD11 — Origen de comentarios y alcance público**: Comentarios entran únicamente por Contacto y son privados; sin formulario de comentarios en Historias; sus ejercicios son locales sin guardado. Captura con comentarios por caso queda registrada como diferencia aprobada (C28).
- **FR-005 / CT01 — Flujo completo de Contacto**: Enviar comentario → guardado → consulta privada → respuesta por correo guardada → Respondido tras aceptación de servicio; verificar recepción aparte, errores y reintento sin duplicados; aplicar retención y eliminación.

### Reglas y contenido complementario

Sustituir la sección Comentarios de la captura por bandeja privada de Contacto. Filtros Pendiente/Respondido; todas las consultas proceden exclusivamente de Contacto. Guardar respuesta vinculada al mensaje y enviarla al correo proporcionado. Marcar Respondido solo tras aceptación real del servicio, con entrega/lectura diferenciadas. Fallo mantiene Pendiente y texto para reintentar. Aplicar privacidad y conservación de 009 a consultas y respuestas. Probar el flujo CT01 de extremo a extremo, incluyendo errores y eliminación. Los ejercicios de Historias no envían datos a esta bandeja.

### Key Entities

Consulta privada; respuesta asociada; aceptación de envío; estado Pendiente/Respondido.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 4 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 5 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: [005-contacto-publico](../005-contacto-publico/spec.md), [006-acceso-administrativo](../006-acceso-administrativo/spec.md), [009-privacidad-conservacion](../009-privacidad-conservacion/spec.md)
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P02: proveedor de correo, remitente y configuración operativa. P04: diseño detallado de bandeja y composición de respuesta. El mecanismo para evitar duplicados ante resultados inciertos se definirá en el plan técnico.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| AD07 | FR-001 | Imagen (1) | No ejecutado |
| AD08 | FR-002 | Imagen (1) | No ejecutado |
| AD09 | FR-003 | Imagen (1) | No ejecutado |
| AD11 | FR-004 | Imagen (1) + PDF 2 | No ejecutado |
| CT01 | FR-005 | Instrucciones de la usuaria C02–C04/C28/C29 | No ejecutado |
