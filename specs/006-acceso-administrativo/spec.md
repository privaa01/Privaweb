# Feature Specification: Acceso individual y sesiones administrativas

**Feature Directory**: `specs/006-acceso-administrativo`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: AD01, AD02.

## Alcance

Permitir que personas autorizadas accedan al panel con cuentas individuales y cierren o recuperen su acceso.

**Fuera de alcance**: Registro público, cuentas de visitantes, rol de editor y tipos adicionales de administrador.

## User Scenarios & Testing

### User Story 1 — Acceder de forma autorizada (Priority: P1)

Como administrador autorizado, quiero acceder de forma autorizada para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una cuenta individual autorizada, **cuando** la persona introduce correo y contraseña válidos, **entonces** accede a historias y bandeja con los mismos permisos que los demás administradores.

### User Story 2 — Cerrar sesión (Priority: P2)

Como administrador autorizado, quiero cerrar sesión para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una sesión válida, **cuando** la persona cierra sesión e intenta volver a una ruta privada, **entonces** los datos quedan inaccesibles y se requiere autenticación.

### User Story 3 — Recuperar acceso (Priority: P2)

Como administrador autorizado, quiero recuperar acceso para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una solicitud para un correo existente o inexistente, **cuando** se solicita recuperación, **entonces** la respuesta no revela existencia de cuenta y la recuperación exige verificación por correo.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / AD01 — Acceso, recuperación y cierre de sesión**: Correo/contraseña por cuenta individual, sin registro público; recuperación verificada por correo sin revelar existencia de cuenta; sesión cerrada impide acceso; provisión restringida por definir (C26).
- **FR-002 / AD02 — Panel y permisos**: Un tipo de administrador con acceso a historias y comentarios de Contacto; todas las cuentas autorizadas con mismos permisos; navegación privada legible y coherente; sin rol editor adicional (C26).

### Reglas y contenido complementario

Adaptar la captura de login: usar correo en lugar de Usuario, contraseña con control accesible de visibilidad y acceso a recuperación. Todas las cuentas tienen un único tipo de administrador. Verificar autorización en cada operación privada, no solo ocultar controles. Sesiones seguras; estados de credenciales inválidas y sesión expirada sin exposición de datos. Cuenta y políticas de seguridad no heredan automáticamente el plazo de 90 días de Contacto.

### Key Entities

Cuenta administrativa individual; sesión; solicitud de recuperación verificada.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 3 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 2 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: [001-navegacion-global](../001-navegacion-global/spec.md)
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P02: mecanismo restringido de provisión de cuentas y servicio de recuperación. Política de conservación de cuentas y registros aún no definida.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| AD01 | FR-001 | Imagen sin (1) | No ejecutado |
| AD02 | FR-002 | Imagen (1) | No ejecutado |
