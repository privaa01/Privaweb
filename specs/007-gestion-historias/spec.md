# Feature Specification: Gestión y publicación de historias

**Feature Directory**: `specs/007-gestion-historias`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: AD03, AD04, AD05, AD06, AD10.

## Alcance

Permitir preparar historias, guardarlas como borrador y controlar qué contenido se publica.

**Fuera de alcance**: Borrado definitivo, comentarios por caso y cifras de demostración.

## User Scenarios & Testing

### User Story 1 — Preparar un borrador (Priority: P1)

Como administrador autorizado, quiero preparar un borrador para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una persona administradora autenticada, **cuando** crea una historia incompleta y guarda, **entonces** se conserva como borrador sin aparecer en la web.

### User Story 2 — Publicar contenido completo (Priority: P2)

Como administrador autorizado, quiero publicar contenido completo para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una historia con todos sus campos completos, **cuando** la persona publica y activa, **entonces** queda visible en Historias y conserva sus identificadores y enlaces.

### User Story 3 — Impedir publicación incompleta (Priority: P2)

Como administrador autorizado, quiero impedir publicación incompleta para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** faltan audio, transcripción, opciones u otro campo obligatorio, **cuando** la persona intenta publicar, **entonces** se impide la publicación y se explican los datos faltantes.

### User Story 4 — Desactivar sin perder contenido (Priority: P2)

Como administrador autorizado, quiero desactivar sin perder contenido para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una historia publicada activa, **cuando** la persona la desactiva y después reactiva, **entonces** desaparece y regresa a la lista pública sin perder contenido.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / AD03 — Resumen y contadores**: Contadores derivados de historias activas/borradores y comentarios de Contacto reales; sin cifras de demostración; coherentes al guardar/publicar/responder.
- **FR-002 / AD04 — Tabla de historias**: Título, categoría, estado y acciones de gestión aprobadas; registros reales conectados con contenido público; sin borrado definitivo (C27).
- **FR-003 / AD05 — Activar/desactivar historia**: Solo publicada y activa visible; desactivar conserva contenido; activar la devuelve a lista; borrador nunca público; errores sin cambio confirmado ni pérdida de contenido (C27).
- **FR-004 / AD06 — Crear, editar, borrador y publicar**: Campos: título, categoría, imagen, descripción, audio, transcripción, pregunta, tres opciones y sus explicaciones; borrador incompleto permitido; bloquear publicación incompleta; guardar/publicar diferenciados; sin eliminar definitivamente (C27).
- **FR-005 / AD10 — Ver historias en la web**: Abre Historias pública; refleja solo historias activas; no expone borradores ni correos

### Reglas y contenido complementario

Editor con título, categoría, imagen, descripción, audio, transcripción, pregunta, tres opciones y sus explicaciones. Guardar y publicar son acciones distintas. Solo publicada y activa se ve en público; un borrador activo por error nunca debe exponerse. Edición mantiene identificadores/enlaces. Fallos de guardado o publicación no muestran éxito ni pierden contenido. Tabla con título, categoría, estado y acciones. Resumen con contadores reales de historias activas/borradores y consultas; el contador de consultas usa la bandeja 008, no respuestas educativas. Ver historias en la web abre el listado público sin borradores ni correos. La captura aporta estilo, no aprobación para conservar respuestas por caso.

### Key Entities

Historia administrada; estado de publicación; estado de activación; recursos; contador derivado.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 4 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 5 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: [006-acceso-administrativo](../006-acceso-administrativo/spec.md)
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P04: diseño preciso del editor, formatos/tamaños/límites de archivos y política de edición de historias publicadas. P01: recursos y explicaciones. Resolver estas decisiones antes de cerrar publicación y subida de archivos.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| AD03 | FR-001 | Imagen (1) | No ejecutado |
| AD04 | FR-002 | Imagen (1) | No ejecutado |
| AD05 | FR-003 | Imagen (1) | No ejecutado |
| AD06 | FR-004 | Imagen (1) | No ejecutado |
| AD10 | FR-005 | Imagen (1) | No ejecutado |
