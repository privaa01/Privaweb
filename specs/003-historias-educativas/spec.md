# Feature Specification: Historias, audio y reflexión educativa

**Feature Directory**: `specs/003-historias-educativas`
**Created**: 2026-10-16
**Status**: Borrador derivado de R35; implementación y pruebas no ejecutadas.
**Input**: Separación funcional del SPEC PRIVA R35 aportado por la usuaria.
**Fuente**: [SPEC original](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md). Requisitos originales: H01, H02, H03, H04, H05, H06, H07, H08, H09, H10, H11, H12.

## Alcance

Permitir escuchar historias publicadas y aprender de cada opción de reflexión sin calificación ni seguimiento personal.

**Fuera de alcance**: Comentarios públicos, cuentas de visitantes, puntuaciones, estadísticas o persistencia de selecciones; editor administrativo.

## User Scenarios & Testing

### User Story 1 — Escuchar un caso (Priority: P1)

Como persona usuaria o responsable de Priva, quiero escuchar un caso para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Es el resultado principal de esta funcionalidad.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** una historia publicada y activa con audio y transcripción, **cuando** la persona reproduce, pausa o avanza, **entonces** controla audio real, ve tiempos reales y puede consultar contenido equivalente en texto.

### User Story 2 — Reflexionar sin examen (Priority: P2)

Como persona usuaria o responsable de Priva, quiero reflexionar sin examen para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** un caso sin selección, **cuando** la persona elige una opción y luego otra, **entonces** ve inmediatamente la explicación específica de cada opción, sin botón extra ni calificación.

### User Story 3 — Mantener selecciones independientes (Priority: P2)

Como persona usuaria o responsable de Priva, quiero mantener selecciones independientes para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** dos casos con opciones seleccionadas, **cuando** la persona cambia uno y después recarga, **entonces** el otro no cambia por la selección y la recarga reinicia ambos.

### User Story 4 — Consultar historias disponibles (Priority: P2)

Como persona usuaria o responsable de Priva, quiero consultar historias disponibles para completar el recorrido descrito sin incumplir el alcance.

**Why this priority**: Completa el recorrido y evita resultados incorrectos en sus alternativas.

**Independent Test**: Preparar el estado indicado y comprobar el resultado observable; puede usarse contenido de prueba identificado sin declararlo material oficial.

**Acceptance Scenarios**:

1. **Dado** existen borradores, publicadas activas e inactivas, **cuando** la persona abre Ver todas las historias, **entonces** solo ve publicadas activas, incluidas las nuevas, sin duplicados.

### Edge Cases

- Comprobar los límites, fallos y estados pendientes expresados en los requisitos de esta feature.
- Si falta un recurso o dato operativo indicado en Pendientes, mantenerlo identificado y no confirmar disponibilidad ni éxito sin evidencia.
- Aplicar los estados de error y accesibilidad pertinentes de 011, sin exponer información privada.

## Requirements

### Functional Requirements

- **FR-001 / H01 — Hero Historias**: Etiqueta, título, descripción e imagen; Explorar episodios lleva a #casos, sin insertar María
- **FR-002 / H02 — Casos destacados: encabezado y Ver todas las historias**: Tres casos iniciales y control visibles; Ver todas muestra el listado completo de activas en esta página, incluidas nuevas publicaciones; sin borradores, desactivadas ni duplicados (C11)
- **FR-003 / H03 — Caso 1: Enlace Falso / Phishing**: María, mensaje bancario y enlace; imagen y relato coinciden; duración 04:15 es referencia, verificar audio real
- **FR-004 / H04 — Caso 2: La llamada sospechosa / Ingeniería Social**: Juan y código de autenticación; imagen y relato coinciden; 06:40 sujeto a archivo; corrección Confiada pendiente de revisión editorial (P03)
- **FR-005 / H05 — Caso 3: La contraseña compartida / Contraseñas**: Luis, streaming y correo corporativo; imagen y relato coinciden; 05:20 sujeto a archivo
- **FR-006 / H06 — Audio de cada caso**: Reproducir/pausar, avance, duración real y estado de carga/error; sin autoplay; transcripción equivalente; sin audio bloquea cierre de caso
- **FR-007 / H07 — Ejercicio Caso 1**: Tres opciones de referencia; explicación específica de riesgo y prevención inmediata al seleccionar/cambiar, sin calificación, puntuación ni botón extra; teclado y anuncio accesible; sin envío/persistencia; recarga reinicia (C05/C08/C09).
- **FR-008 / H08 — Ejercicio Caso 2**: Tres opciones de referencia; misma interacción educativa de H07, selección independiente por caso; explicación por opción validada contra el material aportado.
- **FR-009 / H09 — Ejercicio Caso 3**: Tres opciones de referencia; misma interacción educativa de H07, selección independiente por caso; nueve explicaciones en total, pendientes de contenido validado.
- **FR-010 / H10 — Metodología con imagen**: Identifica el error y aprende; 1 Escucha, 2 Reflexiona, 3 Aplica en ese orden
- **FR-011 / H11 — Identidad en dos bloques y SABER MÁS**: Somos Priva y Qué hacemos; cada enlace lleva a su sección de Inicio
- **FR-012 / H12 — CTA final de Historias**: Conservar título/imagen; párrafo exacto C16: Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales. EXPLORAR MÁS CONTENIDOS abre Instagram oficial, misma URL que Contacto; URL pendiente.

### Reglas y contenido complementario

Orden del PDF 2: hero; Casos destacados; metodología; recordatorios Somos Priva y Qué hacemos; CTA final; footer. Tres casos iniciales: Enlace falso / Phishing / María y mensaje bancario; La llamada sospechosa / Ingeniería social / Juan y código; La contraseña compartida / Contraseñas / Luis y clave reutilizada. Cada caso conserva imagen, categoría, título, descripción, audio, transcripción y tres opciones. Opciones: caso 1 enlace desconocido / compartir datos bancarios / no verificar remitente; caso 2 compartir código en llamada / ceder ante urgencia / no colgar y verificar con app oficial; caso 3 reutilizar claves / anotarlas en chats sin cifrado / no activar 2FA. Son nueve explicaciones de riesgo y prevención, sin inventar hechos del relato. Duraciones 04:15/06:40/05:20 son referencias gráficas, no metadatos comprobados. Audio sin autoplay y con carga/error; si falta archivo, no simular reproductor. Metodología: Escucha → Reflexiona → Aplica. Saber más enlaza a las secciones de Inicio. Explorar más contenidos lleva a Instagram oficial. Párrafo del CTA: “Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.”.

### Key Entities

Historia pública; recurso de audio; transcripción; opción educativa; explicación; selección temporal por caso.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Se demuestra el resultado esperado de los 4 escenarios anteriores; ningún fallo se registra como éxito.
- **SC-002**: El 100% de los 12 requisitos originales asignados a esta feature cuenta con evidencia de aceptación o bloqueo explícito antes de cerrar; un bloqueo no equivale a cumplimiento.
- **SC-003**: No se publica ningún recurso, enlace, dato o promesa pendiente como si estuviera verificado.

## Assumptions

- Se conserva el alcance del R35; la prioridad de estas historias y la división son una propuesta de organización, no decisiones nuevas de producto.
- La documentación no equivale a implementación. No hay pruebas de aplicación ejecutadas por esta separación.
- Dependencias de trabajo: [001-navegacion-global](../001-navegacion-global/spec.md)
- Las restricciones transversales de 009 y 011 aplican donde corresponda, aunque cada ID original tenga un único responsable.

## Pendientes y condiciones de cierre

P01: audios, transcripciones, imágenes, nueve explicaciones e Instagram oficial. P03: respaldo de “historias reales” y corrección editorial de “Confiada” para Juan. La gestión de contenidos corresponde a 007; puede validarse esta vista con contenido de prueba identificado como tal.

## Trazabilidad y verificación

| ID original | Requisito local | Fuente original | Estado |
|---|---|---|---|
| H01 | FR-001 | PDF 2 | No ejecutado |
| H02 | FR-002 | PDF 2 | No ejecutado |
| H03 | FR-003 | PDF 2 | No ejecutado |
| H04 | FR-004 | PDF 2 | No ejecutado |
| H05 | FR-005 | PDF 2 | No ejecutado |
| H06 | FR-006 | PDF 2 | No ejecutado |
| H07 | FR-007 | PDF 2 | No ejecutado |
| H08 | FR-008 | PDF 2 | No ejecutado |
| H09 | FR-009 | PDF 2 | No ejecutado |
| H10 | FR-010 | PDF 2 | No ejecutado |
| H11 | FR-011 | PDF 2 | No ejecutado |
| H12 | FR-012 | PDF 2 | No ejecutado |
