# Feature Specification: Contacto y recepción privada de consultas

**Feature Directory**: `specs/005-contacto-publico`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: C01, C02, C03, C04, C05, C06, C07.

## Alcance

Permitir enviar una consulta privada con alias y recibir confirmación solo cuando esté guardada.

**Fuera de alcance**: Publicación de mensajes, respuestas automáticas garantizadas, comentarios por historia y registro público.

## User Scenarios & Testing

### User Story 1 — Enviar una consulta (Priority: P1)

Como persona usuaria o responsable de Priva, quiero enviar una consulta para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** nombre o alias, correo y mensaje válidos, **cuando** la persona envía una vez, **entonces** el mensaje se guarda como Pendiente y solo entonces se muestra éxito.

### User Story 2 — Corregir entradas (Priority: P2)

Como persona usuaria o responsable de Priva, quiero corregir entradas para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** valores vacíos, solo espacios o fuera de límites, **cuando** la persona intenta enviar, **entonces** recibe errores asociados a campos y no se guarda un mensaje inválido.

### User Story 3 — Recuperarse de un fallo (Priority: P2)

Como persona usuaria o responsable de Priva, quiero recuperarse de un fallo para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** el guardado falla o se desconoce su resultado, **cuando** la persona reintenta, **entonces** conserva los valores y no crea duplicados.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / C01 — Hero Contacto e imagen**: Etiqueta Estamos aquí para ti, título e invitación conservados
- **FR-002 / C02 — Indicadores del hero de Contacto**: Respuesta por correo electrónico y Deja tu consulta en el formulario como indicadores informativos; Cero rastreo publicitario solo tras verificación técnica de web y proveedores (C18/C21/C22).
- **FR-003 / C03 — Tarjeta Instagram**: Descripción, cuatro temas: anti-phishing, contraseñas, móviles, brechas; Ir a Instagram abre URL oficial
- **FR-004 / C04 — Formulario de Contacto**: Nombre o alias, correo y mensaje obligatorios; aceptar seudónimo sin exigir nombre real; alias 1–60 y mensaje 1–1500 tras recortar extremos; etiquetas visibles (C24/C25).
- **FR-005 / C05 — Validación y carga de Contacto**: Cliente/servidor: rechazar vacíos/solo espacios, correo inválido, alias mayor de 60 y mensaje mayor de 1500; errores asociados; bloquear doble envío; probar fronteras 0/1/60/61 y 0/1/1500/1501.
- **FR-006 / C06 — Guardado y estados de Contacto**: Persistir nombre/alias, correo y comentario; confirmar éxito solo con guardado real; nuevo comentario Pendiente en bandeja privada; fallo conserva valores y reintento sin duplicados (C02/C03/C28).
- **FR-007 / C07 — Bloque final y aviso de Contacto**: Respondemos al correo que indiques y Puedes usar un alias; Sin cookies de rastreo solo tras verificación; aviso explica almacenamiento, respuesta privada por correo y 90 días; borrador pendiente de completar/revisar (C19/C20/C22/C29/C32).

### Reglas y contenido complementario

Orden PDF 4: hero con imagen e indicadores; Instagram a izquierda y formulario a derecha en escritorio; bloque final; footer. En móvil Instagram precede al formulario. Alias obligatorio: 1–60 caracteres; mensaje obligatorio: 1–1500; correo obligatorio con formato válido. Recortar extremos, conservar espacios internos, permitir seudónimo y rechazar solo espacios. Validación cliente y servidor; probar alias 0/1/60/61 y mensaje 0/1/1500/1501. Bloquear doble envío; estados inválido/enviando/guardado/error. Advertir antes de enviar que no incluya contraseñas, códigos, datos bancarios ni información sensible/de terceros. Indicadores revisados: “Respuesta por correo electrónico” y “Deja tu consulta en el formulario”. Cierre: “Respondemos al correo que indiques” y “Puedes usar un alias”. Las afirmaciones sobre rastreo requieren verificación de 009. Instagram muestra temas anti-phishing, contraseñas, móviles y brechas y comparte URL oficial con Historias. El aviso debe explicar guardado privado, respuesta por correo y conservación; texto legal en 010.

### Key Entities

Consulta: nombre o alias, correo, mensaje, recepción y estado Pendiente.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 3 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 7 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: [001-navegacion-global](../001-navegacion-global/spec.md), [009-privacidad-conservacion](../009-privacidad-conservacion/spec.md)
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P01: Instagram e imágenes. P02: servicio de persistencia y datos operativos. P03: aviso revisado. Las dependencias 008 y 009 completan el recorrido de respuesta y eliminación; esta feature acepta recibir y guardar sin requerir una respuesta ya enviada.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| C01 | FR-001 | PDF 4 | No ejecutado |
| C02 | FR-002 | PDF 4 | No ejecutado |
| C03 | FR-003 | PDF 4 | No ejecutado |
| C04 | FR-004 | PDF 4 | No ejecutado |
| C05 | FR-005 | PDF 4 | No ejecutado |
| C06 | FR-006 | PDF 4 | No ejecutado |
| C07 | FR-007 | PDF 4 | No ejecutado |
