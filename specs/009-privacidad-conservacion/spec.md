# Feature Specification: Privacidad y ciclo de vida de datos

**Feature Directory**: `specs/009-privacidad-conservacion`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: X02.

## Alcance

Proteger los datos y aplicar el plazo de conservación acordado sin publicar promesas que no se hayan comprobado.

**Fuera de alcance**: Extender 90 días automáticamente a historias, cuentas o registros; prometer eliminación inmediata total sin comprobar respaldos.

## User Scenarios & Testing

### User Story 1 — Eliminar consultas vencidas (Priority: P1)

Como persona usuaria o responsable de Priva, quiero eliminar consultas vencidas para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una consulta pendiente o respondida con 90 días desde la última actividad aplicable, **cuando** se ejecuta la política de conservación, **entonces** se eliminan sus datos de Contacto y respuestas según el procedimiento documentado.

### User Story 2 — Calcular actividad sin prolongación indebida (Priority: P2)

Como persona usuaria o responsable de Priva, quiero calcular actividad sin prolongación indebida para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una consulta existente, **cuando** alguien la lee o falla un envío, **entonces** su plazo no se reinicia por esas acciones.

### User Story 3 — Respetar vencimientos tras restauración (Priority: P2)

Como persona usuaria o responsable de Priva, quiero respetar vencimientos tras restauración para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una copia con registros ya vencidos, **cuando** se restaura el sistema, **entonces** los registros vencidos no se reactivan.

### User Story 4 — Verificar promesas de privacidad (Priority: P2)

Como persona usuaria o responsable de Priva, quiero verificar promesas de privacidad para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** los flujos públicos, audio, formulario y administración operativos, **cuando** se examinan scripts, tráfico, almacenamiento y proveedores, **entonces** solo se publican afirmaciones de ausencia de rastreo respaldadas por evidencia.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / X02 — Seguridad, rastreo y conservación**: Autorización servidor, sesión segura, validación y salida segura; verificar red/scripts/cookies/proveedores sin rastreo publicitario; borrar datos de Contacto y respuestas a 90 días de última actividad, solicitud anticipada y tratamiento documentado de copias/respaldos (C22/C26/C29).

### Reglas y contenido complementario

Acceso privado del equipo autorizado; autorización del servidor en cada operación; sesiones seguras; secretos fuera del cliente; validación y salida segura; transporte seguro. Política aprobada: 90 días desde última actividad y solicitud anticipada de eliminación. Criterio operativo propuesto, aún por configurar: recepción inicial o nueva respuesta aceptada por el servicio, lo posterior; leer o fallar al enviar no reinicia. Documentar borrado en datos operativos, buzones y respaldos. Verificar ausencia de rastreo publicitario/cookies de rastreo y documentar cookies necesarias; no extender la promesa a Instagram externo. No inferir políticas de cuentas, historias y registros.

### Key Entities

Registro de Contacto; respuesta; última actividad; vencimiento; solicitud de eliminación; copia de respaldo.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 4 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 1 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: No exige otra feature para redactar o planificar; su validación final depende de los recorridos que afecta.
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P02: responsable, proveedores, procedimiento/canal y verificación de solicitudes de eliminación, tratamiento de buzones y respaldos. Confirmar criterio operativo de última actividad y periodicidad real del borrado. Políticas de cuentas, historias y registros siguen pendientes. Estos puntos impiden cerrar la feature, aunque puede planificarse el trabajo independiente.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| X02 | FR-001 | Derivado técnico | No ejecutado |
