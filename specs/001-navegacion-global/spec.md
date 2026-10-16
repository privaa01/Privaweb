# Feature Specification: Navegación y estructura común

**Feature Directory**: `specs/001-navegacion-global`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: G01, G02, G03, G04, G05, G06.

## Alcance

Permitir que cualquier visitante se ubique y recorra las páginas públicas y sus destinos comunes.

**Fuera de alcance**: Contenido particular de cada página; autenticación del panel; redacción legal.

## User Scenarios & Testing

### User Story 1 — Recorrer el sitio (Priority: P1)

Como persona usuaria o responsable de Priva, quiero recorrer el sitio para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una página pública abierta, **cuando** la persona usa el logo o un elemento del menú, **entonces** llega al destino correcto y el elemento activo coincide con la página.

### User Story 2 — Usar llamadas a la acción (Priority: P2)

Como persona usuaria o responsable de Priva, quiero usar llamadas a la acción para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** Inicio, Historias, App o Contacto abiertos, **cuando** la persona activa el CTA del encabezado, **entonces** PROTÉGETE HOY lleva a los casos y DESCARGAR APP lleva a la sección de descarga.

### User Story 3 — Consultar el footer (Priority: P2)

Como persona usuaria o responsable de Priva, quiero consultar el footer para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** cualquiera de las cuatro páginas, **cuando** la persona usa sus enlaces, **entonces** accede a documentos, Contacto o login sin exponer contenido privado.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / G01 — Encabezado y navegación**: Logo a Inicio; menú idéntico en orden Inicio, Historias, Priva App, Contáctanos; activo correcto en escritorio y móvil (C06).
- **FR-002 / G02 — CTA PROTÉGETE HOY**: PROTÉGETE HOY lleva a /historias.html#casos desde Inicio y a #casos desde Historias; comprobar encabezado visible y teclado (C10)
- **FR-003 / G03 — CTA DESCARGAR APP**: Abre app y sección de descarga; ancla accesible con teclado
- **FR-004 / G04 — Footer: logo, lema y copyright**: Texto exacto © 2026 Priva. Todos los derechos reservados. Navega con dignidad.; idéntico en las cuatro páginas. El PDF requiere 2025 → 2026 en sus cuatro footers (C34).
- **FR-005 / G05 — Footer: panel administrador**: Enlace visible abre acceso administrativo; rutas protegidas no muestran datos sin sesión
- **FR-006 / G06 — Footer: Términos, Manifiesto, Contacto Seguro**: Cada enlace abre contenido aprobado; Contacto Seguro conduce al formulario

### Reglas y contenido complementario

Navegación única: Inicio → Historias → Priva App → Contáctanos. Logo a Inicio. Rutas propuestas: /index.html, /historias.html, /app.html, /contacto.html. Anclas: #somos-priva, #que-hacemos, #casos, #como-funciona, #descarga y #escribir; no usar #maria. Footer: “Defendiendo la soberanía digital individual.” y “© 2026 Priva. Todos los derechos reservados. Navega con dignidad.”. Contacto Seguro lleva al formulario. Los destinos legales pertenecen a 010; los controles accesibles, a 011.

### Key Entities

Página pública; elemento de navegación; destino de CTA.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 3 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 6 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: No exige otra feature para redactar o planificar; su validación final depende de los recorridos que afecta.
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

Los destinos pueden prepararse antes que sus contenidos, pero no se acepta un recorrido final con enlaces rotos. Las rutas son propuestas del spec, no URLs existentes.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| G01 | FR-001 | PDF 1–4 | No ejecutado |
| G02 | FR-002 | PDF 1–2 | No ejecutado |
| G03 | FR-003 | PDF 3–4 | No ejecutado |
| G04 | FR-004 | PDF 1–4 | No ejecutado |
| G05 | FR-005 | PDF 1–4 + imágenes | No ejecutado |
| G06 | FR-006 | PDF 1–4 | No ejecutado |
