# Feature Specification: Accesibilidad, recursos y coherencia de entrega

**Feature Directory**: `specs/011-accesibilidad-fidelidad`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: X01, X04, X05.

## Alcance

Garantizar recorridos accesibles y fidelidad a la referencia, con recursos reales y evidencia de cierre.

**Fuera de alcance**: Inventar imágenes, duraciones, enlaces o marcar requisitos implementados por estar documentados.

## User Scenarios & Testing

### User Story 1 — Usar el sitio en distintos tamaños (Priority: P1)

Como persona usuaria o responsable de Priva, quiero usar el sitio en distintos tamaños para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** las pantallas públicas y privadas implementadas, **cuando** se recorren a 360/390/430/768/1024/1280/1440 px y texto al 200%, **entonces** se conserva el orden de contenido sin recortes ni scroll horizontal.

### User Story 2 — Navegar con teclado (Priority: P2)

Como persona usuaria o responsable de Priva, quiero navegar con teclado para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** un menú compacto cerrado, **cuando** la persona lo abre, recorre y cierra con Escape, **entonces** puede operar los controles con foco visible y recupera el foco al cerrar.

### User Story 3 — Cerrar fidelidad con evidencia (Priority: P2)

Como persona usuaria o responsable de Priva, quiero cerrar fidelidad con evidencia para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** recursos y pantallas candidatos a entrega, **cuando** se comparan con las referencias y requisitos vigentes, **entonces** se registran faltantes y diferencias sin dar por completos los casos pendientes.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / X01 — Adaptación y accesibilidad**: Respetar orden de wireframes al apilar; Instagram antes del formulario en móvil; probar 360/390/430/768/1024/1280/1440, teclado/foco, texto 200%, sin recortes, alternativa de imágenes/transcripciones (C33).
- **FR-002 / X04 — Recursos y fidelidad**: Usuaria aporta logo/imágenes/audios/enlaces; inventario recibido/pendiente sin inventar archivos; cero placeholders finales; verificación visual pendiente; PDF solo cambiar año 2025 a 2026 (C30/C33/C34).
- **FR-003 / X05 — Sincronización y cierre**: Cada cambio actualiza spec, plan, tareas, matriz e historial; aprobación documentada antes de cerrar decisiones; ninguna implementación aprobada sin evidencia

### Reglas y contenido complementario

Orden de bloques del PDF y capturas, aplicando las diferencias funcionales del spec. Instagram antes del formulario al apilar. Teclado, foco visible, anuncio de feedback, errores textuales asociados, imágenes informativas con alternativas y decorativas adecuadas, transcripciones equivalentes y controles cómodos. Objetivos técnicos originales: contraste 4.5:1 en texto normal y 3:1 en texto grande/componentes; controles de aproximadamente 44 px, sin afirmar que sean mediciones del PDF. Inventario de logo/imágenes/audios/enlaces recibido/pendiente; cero placeholders finales. Fuente y colores exactos pendientes. La entrega del PDF solo autoriza cambiar 2025 a 2026; no redibujar referencias por diferencias aprobadas de implementación. Mantener spec, plan, tareas, matriz e historial sincronizados; evidencia separada de decisión y resultado de pruebas.

### Key Entities

Recurso oficial; pantalla de referencia; evidencia de prueba; requisito trazable; decisión documentada.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 3 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 3 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: No exige otra feature para redactar o planificar; su validación final depende de los recorridos que afecta.
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P01: recursos originales. P04: fuente y colores exactos. P05: revisión visual completa, modificación exclusiva del año del PDF y entrega material aún no realizadas. No se incluyen aquí cambios al PDF ni se afirma haberlos realizado. Faltan documentos 03/05/06/07 citados por el spec; no es posible validar sus 195 criterios.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| X01 | FR-001 | Derivado UX | No ejecutado |
| X04 | FR-002 | Derivado QA | No ejecutado |
| X05 | FR-003 | Derivado gestión | No ejecutado |
