# Feature Specification: Inicio e identidad de Priva

**Feature Directory**: `specs/002-inicio-institucional`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: I01, I02, I03, I04.

## Alcance

Presentar qué es Priva, qué ofrece y cómo acceder a sus contenidos educativos.

**Fuera de alcance**: Historia adicional de María; servicios nuevos no acreditados.

## User Scenarios & Testing

### User Story 1 — Conocer Priva (Priority: P1)

Como persona usuaria o responsable de Priva, quiero conocer priva para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** Inicio abierto, **cuando** la persona activa Conocer más, **entonces** alcanza Somos Priva con el encabezado visible.

### User Story 2 — Explorar contenidos (Priority: P2)

Como persona usuaria o responsable de Priva, quiero explorar contenidos para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** la persona termina de leer Inicio, **cuando** activa Explora nuestras historias, **entonces** llega a Historias.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / I01 — Hero Inicio: etiqueta, título, texto, imagen, Conocer más**: Mantiene composición y contenido de referencia; Conocer más desplaza a Quiénes somos
- **FR-002 / I02 — Quiénes somos**: Imagen, etiqueta y Somos Priva en orden de referencia; sin historia principal adicional de María ni enlace #maria (C07).
- **FR-003 / I03 — Qué hacemos: introducción y cuatro tarjetas**: Educación Digital, Historias reales, Herramientas Seguras y Acompañamiento presentes; capacidades y promesas pendientes de revisión de contenido/capacidades (P03)
- **FR-004 / I04 — CTA final de Inicio**: Conservar título/imagen y botón a Historias; párrafo exacto: Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales. (C16).

### Reglas y contenido complementario

Orden: encabezado; hero con etiqueta TUS DATOS, TU DERECHO y título “La privacidad también es una forma de libertad.”; Quiénes somos / Somos Priva; Qué hacemos / Informamos para que estés en control.; cuatro tarjetas Educación Digital, Historias reales, Herramientas Seguras y Acompañamiento; CTA final con imagen; footer. Mantener títulos, imágenes y composición del PDF 1. Párrafo final exacto: “Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.”.

### Key Entities

Bloque institucional; tarjeta de capacidad; recurso visual.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 2 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 4 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: [001-navegacion-global](../001-navegacion-global/spec.md)
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P01: imágenes y logo originales. P03: comprobar curaduría, acompañamiento y otras capacidades anunciadas antes de publicarlas.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| I01 | FR-001 | PDF 1 | No ejecutado |
| I02 | FR-002 | PDF 1 | No ejecutado |
| I03 | FR-003 | PDF 1 | No ejecutado |
| I04 | FR-004 | PDF 1 | No ejecutado |
