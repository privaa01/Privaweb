# Feature Specification: Presentación y disponibilidad de Priva App

**Feature Directory**: `specs/004-presentacion-app`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: A01, A02, A03, A04, A05, A06, A07.

## Alcance

Explicar el prototipo de Priva App y mostrar de forma veraz su disponibilidad por plataforma.

**Fuera de alcance**: Chat con IA, diagnóstico funcional, app móvil, lista de espera y captura de registros.

## User Scenarios & Testing

### User Story 1 — Conocer el prototipo (Priority: P1)

Como persona usuaria o responsable de Priva, quiero conocer el prototipo para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** la página App abierta, **cuando** la persona consulta beneficios y pasos, **entonces** entiende que son funciones previstas y no servicios operativos.

### User Story 2 — Consultar disponibilidad (Priority: P2)

Como persona usuaria o responsable de Priva, quiero consultar disponibilidad para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** Android e iPhone sin enlaces oficiales, **cuando** la persona llega a #descarga, **entonces** ve Próximamente para ambas sin una descarga accionable.

### User Story 3 — Habilitar una plataforma (Priority: P2)

Como persona usuaria o responsable de Priva, quiero habilitar una plataforma para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** solo una plataforma tiene URL oficial verificada, **cuando** la persona consulta descargas, **entonces** solo esa plataforma permite descargar; la otra conserva Próximamente.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / A01 — Hero de Priva App**: Mantener estructura, imagen y CTA a #descarga/#como-funciona; identificar claramente prototipo y funciones previstas, sin afirmar operación actual; copy final para revisión (C31).
- **FR-002 / A02 — Qué es Priva App y mockup Conversar**: Descripción y teléfono conservados; Conversar es parte de la imagen, sin enlace, clic, foco ni rol de botón web (C13)
- **FR-003 / A03 — Tres beneficios del prototipo**: Guía paso a paso, Privacidad digital, Ayuda clara y rápida presentados como previstos; no certificar funcionamiento.
- **FR-004 / A04 — Cómo se usa el prototipo**: Escribe tu duda, Recibe instrucciones, Aplica los cambios, Mantente seguro, en orden 1–4; explicar como flujo previsto, sin promesa de funcionamiento actual.
- **FR-005 / A05 — Para qué serviría Priva App**: Tips, Asistente IA y Diagnóstico de Seguridad como funciones previstas del prototipo; no implementarlas en la web; revisar copy final/errata de referencia.
- **FR-006 / A06 — Descarga por plataforma**: Android/iPhone identificados; Próximamente sin acción hasta URL oficial verificada; habilitar independientemente; probar ambas pendientes, mixto y ambas disponibles; CTA mantiene #descarga; mockup no afirma disponibilidad inexistente (C14).
- **FR-007 / A07 — Texto bajo descargas**: Usar Orientación para cuidar tus datos personales; retirar Gratis y versiones mínimas Android 10+/iOS 15+ hasta datos oficiales; sin garantía del 100% (C17/C23).

### Reglas y contenido complementario

Orden PDF 3: hero MANEJA TU PRIVACIDAD y CTA Descargar app / Ver cómo funciona; Qué es Priva App con teléfono y beneficios; Cómo se usa en cuatro pasos; Para qué sirve; descarga y mockup; footer. Beneficios previstos: Guía paso a paso, Privacidad digital, Ayuda clara y rápida. Pasos: Escribe tu duda → Recibe instrucciones → Aplica los cambios → Mantente seguro. Funciones previstas: Tips, Asistente IA y Diagnóstico de Seguridad. Conversar es imagen, sin acción ni foco de botón. Mantener anclas #descarga y #como-funciona. Texto de descarga: “Orientación para cuidar tus datos personales”. Retirar Gratis, Android 10+, iOS 15+ y garantías del 100%; no afirmar Listo para descargar sin disponibilidad. Probar ambas plataformas pendientes, disponibilidad mixta y ambas disponibles.

### Key Entities

Plataforma de descarga; enlace oficial verificado; beneficio previsto; mockup informativo.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 3 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 7 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: [001-navegacion-global](../001-navegacion-global/spec.md)
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P01: recursos originales y enlaces oficiales por plataforma. P03: redacción final que explicite prototipo y revisión de erratas.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| A01 | FR-001 | PDF 3 | No ejecutado |
| A02 | FR-002 | PDF 3 | No ejecutado |
| A03 | FR-003 | PDF 3 | No ejecutado |
| A04 | FR-004 | PDF 3 | No ejecutado |
| A05 | FR-005 | PDF 3 | No ejecutado |
| A06 | FR-006 | PDF 3 | No ejecutado |
| A07 | FR-007 | PDF 3 | No ejecutado |
