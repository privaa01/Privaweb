# Feature Specification: Navegación y estructura común

**Feature Directory**: `specs/001-navegacion-global`
**Created**: 2026-10-16
**Updated**: 2026-10-30
**Status**: 001 cerrada: 28/28 tareas para el alcance demo aprobado el 2026-10-30. Matriz 14/14 y sitio publicado 15/15 en tres motores; revisión humana con teclado/VoiceOver reportada por la responsable. Foco del footer corregido y publicado. Administración y producción conservadas como alcance diferido.
**Input**: `$speckit-specify 001`: desarrollar la feature existente sin crear otra ni ampliar alcance.
**Fuentes**: [SPEC R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), requisitos G01–G06; [constitución 1.0.0](../../.specify/memory/constitution.md), CONST-01–04 y CONST-08–12.

## Alcance vigente de aceptación de la demo

La responsable aprobó cerrar001sobre la demo publicada, con cuatro páginas, footer de demo y build:demo; el panel administrativo y la operación de producción quedan diferidos. [Decisión exacta y requisitos diferidos](demo-scope-approval-2026-10-30.md). Esta sección y los criterios demo siguientes sustituyen los criterios productivos del footer para este cierre; no alteran los guards del producto completo.

## User Scenarios & Testing

### User Story 1 — Ubicarse y recorrer las páginas (Priority: P1)

Como visitante, quiero reconocer dónde estoy y acceder a las cuatro páginas principales
para explorar Priva sin perder mi orientación.

**Why this priority**: El encabezado permite acceder al contenido principal desde cualquier página.

**Independent Test**: Abrir cada una de las cuatro páginas y comprobar logo, orden del menú,
destinos y estado activo, primero con navegación visible y después con menú compacto.

**Acceptance Scenarios**:

1. **Dado** cualquiera de las cuatro páginas públicas, **cuando** consulto el encabezado,
   **entonces** encuentro Inicio, Historias, Priva App y Contáctanos en ese orden y solo
   el elemento correspondiente a mi página está marcado como actual. (G01)
2. **Dado** cualquiera de esas páginas, **cuando** activo el logo,
   **entonces** llego a Inicio y este aparece como página actual. (G01)
3. **Dado** cada opción del menú, **cuando** la activo desde cualquiera de las cuatro páginas,
   **entonces** llego a la página que identifica su etiqueta, sin destinos vacíos. (G01)
4. **Dado** un menú compacto cerrado, **cuando** lo abro y recorro con teclado,
   **entonces** accedo a las mismas cuatro opciones, con foco visible; al cerrarlo con Escape
   el foco vuelve al control de apertura y no queda atrapado. (G01, X01 compartido)
5. **Dado** un enlace del menú con foco, **cuando** lo activo con teclado,
   **entonces** puedo completar el mismo recorrido que con un puntero. (G01)

### User Story 2 — Llegar a los casos y a la descarga (Priority: P2)

Como visitante, quiero que el CTA del encabezado me lleve directamente al contenido
anunciado para explorar historias o consultar la disponibilidad de la app.

**Why this priority**: Reduce la búsqueda del contenido destacado en cada página.

**Independent Test**: Activar el CTA desde las cuatro páginas y comprobar la página y sección
de llegada tanto con teclado como con puntero, aunque no haya historias o descargas disponibles.

**Acceptance Scenarios**:

1. **Dado** Inicio, **cuando** activo PROTÉGETE HOY, **entonces** llego a la sección Casos
   de Historias y su encabezado permanece visible. (G02)
2. **Dado** Historias, **cuando** activo PROTÉGETE HOY, **entonces** llego a su propia
   sección Casos, sin abrir una página diferente. (G02)
3. **Dado** Priva App o Contáctanos, **cuando** activo DESCARGAR APP, **entonces** llego
   al bloque de descarga de Priva App, con su encabezado visible. No inicio una descarga
   automáticamente ni afirmo disponibilidad de una plataforma. (G03)
4. **Dado** un CTA enfocado, **cuando** lo activo con teclado, **entonces** alcanzo la
   misma sección y puedo continuar navegando sin quedar atrapado. (G02, G03)

### User Story 3 — Consultar información de la demo (Priority: P2)

Como visitante, quiero un footer consistente que me permita consultar los términos, la privacidad y el Contacto de prueba de la demostración.

**Independent Test**: desde las cuatro páginas, activar los tres destinos con teclado y puntero y comprobar sus títulos reales. El panel administrativo queda diferido por decisión explícita.

**Acceptance Scenarios**:

1. En las cuatro páginas se muestra la identidad «Priva · Demostración educativa» y los mismos tres enlaces, en el mismo orden. (G04 demo)
2. Términos de la demo abre /terminos.html y Privacidad de la demo abre /manifiesto-datos.html, con información que describe la demo actual. (G06 demo)
3. Contacto abre /contacto.html desde su inicio; el modo de prueba se identifica sin aparentar recepción de consultas reales. (G06 demo)
4. No se ofrecen enlaces de administración. La ausencia de rutas privadas en el sitio estático se verifica como frontera demo, sin presentarla como autenticación006. (G05 diferido)

### Edge Cases

- Una visita directa o recarga de cualquiera de las cuatro páginas debe conservar el activo
  correcto; no debe depender de haber usado antes el menú.
- Activar una opción de la página actual no debe llevar a otra sección o página inesperada.
- Un encabezado fijo no debe ocultar el título de una sección al seguir un ancla.
- Si no hay historias activas, PROTÉGETE HOY sigue llegando a Casos; el estado vacío pertenece a 003.
- Si no hay descargas habilitadas, DESCARGAR APP sigue llegando al bloque informativo;
  su estado Próximamente pertenece a 004.
- Un cambio de ancho no debe dejar opciones invisibles con foco ni impedir cerrar el menú.
- Una ruta de información demo o sección pendiente impide cerrar su recorrido integrado: no se sustituye
  por `#`, URL vacía, contenido inventado o un falso éxito.
- Para la futura producción, abrir el acceso administrativo sin sesión nunca debe exponer información privada;
  la protección efectiva se verifica junto con 006.

## Requirements

### Functional Requirements

- **FR-001 / G01 — Encabezado y navegación**: El sitio DEBE mostrar el logo enlazado a Inicio
  y el menú Inicio → Historias → Priva App → Contáctanos, con las mismas etiquetas y orden
  en escritorio y móvil. DEBE identificar la página actual de forma visible y perceptible
  con tecnologías de asistencia. Todo enlace DEBE tener destino real y ser operable con teclado.
  El menú compacto DEBE permitir abrir, cerrar con Escape y devolver foco al control de apertura,
  sin atrapar a la persona. Fuente: C06 y accesibilidad transversal X01.
- **FR-002 / G02 — CTA PROTÉGETE HOY**: Inicio e Historias DEBEN mostrar PROTÉGETE HOY en el
  encabezado. Desde Inicio conduce a Casos de Historias; desde Historias conduce a sus propios
  casos. El título de destino DEBE quedar visible y el recorrido ser utilizable con teclado.
  Fuente: C10.
- **FR-003 / G03 — CTA DESCARGAR APP**: Priva App y Contáctanos DEBEN mostrar DESCARGAR APP en
  el encabezado. El destino DEBE ser la sección de descarga de Priva App, sin activar descargas
  por plataforma ni aparentar disponibilidad. DEBE funcionar con teclado.
- **FR-004 / G04 demo — Footer**: las cuatro páginas comparten «Priva · Demostración educativa» y los tres enlaces complementarios aprobados, con estructura y foco accesibles.
- **FR-005 / G05 — Administración diferida**: el acceso administrativo queda fuera del cierre demo. No se publica un login estático ni se atribuye autorización a un404. Se conserva el contrato006 para producción.
- **FR-006 / G06 demo — Destinos complementarios**: Términos de la demo, Privacidad de la demo y Contacto abren /terminos.html, /manifiesto-datos.html y /contacto.html sin fragmento, con páginas reales y alcance demo explícito.

### Contrato de destinos

Las rutas del encabezado se conservan. Las etiquetas del footer se adaptan por la aprobación demo; la ruta administrativa de la tabla histórica queda diferida, no es un destino de aceptación demo. Las rutas originales proceden de R35.
Son la referencia de planificación; un cambio debe conservar el destino funcional y registrarse
conforme a CONST-01/04. No se requiere decidir tecnología para especificar estos recorridos.

| Control o destino | Referencia de ruta | Responsable del contenido |
|---|---|---|
| Logo / Inicio | `/index.html` | 002 |
| Historias | `/historias.html` | 003 |
| Priva App | `/app.html` | 004 |
| Contáctanos | `/contacto.html` | 005 |
| PROTÉGETE HOY desde Inicio | `/historias.html#casos` | 003 |
| PROTÉGETE HOY desde Historias | `#casos` | 003 |
| DESCARGAR APP desde App | `#descarga` | 004 |
| DESCARGAR APP desde Contacto | `/app.html#descarga` | 004 |
| panel administrador | `/admin/login` | 006 |
| Términos de Servicio | `/terminos.html` | 010 |
| Manifiesto de Datos | `/manifiesto-datos.html` | 010 |
| Contacto Seguro | `/contacto.html` | 005 |

Contacto Seguro abre `/contacto.html` también desde Contacto; no utiliza `#escribir`. El ancla del formulario se conserva para otros enlaces que sí la requieran.
Las anclas de contenido #somos-priva/#que-hacemos pertenecen a 002 y #como-funciona a 004.
No se introduce #maria. Las otras CTA internas y enlaces externos quedan en sus respectivas features.

### Key Entities

- **Página pública**: nombre, destino y condición de página actual; cuatro páginas principales.
- **Elemento de navegación**: etiqueta, orden y destino compartidos en distintas presentaciones.
- **CTA de encabezado**: etiqueta y sección de destino según la página de origen.
- **Footer demo**: identidad educativa y tres enlaces complementarios; footer productivo conservado para una etapa posterior.

## Success Criteria

### Measurable Outcomes

- **SC-001**: En los 16 recorridos posibles entre cuatro páginas mediante el menú, el visitante
  llega al destino anunciado y reconoce exactamente una página actual; el logo vuelve a Inicio
  desde las cuatro páginas.
- **SC-002**: Los cuatro CTA de encabezado llegan a la sección correcta con el título visible,
  usando teclado y puntero, sin iniciar descargas automáticamente.
- **SC-003 demo**: las cuatro páginas muestran el mismo footer y sus doce recorridos complementarios abren los destinos reales aprobados. No se ofrece acceso administrativo.
- **SC-004**: Los recorridos anteriores pueden completarse a 360/390/430/768/1024/1280/1440 px
  y con texto al 200%, sin contenido cortado, scroll horizontal ni controles inaccesibles.
- **SC-005**: Una persona que usa solo teclado puede abrir el menú compacto, elegir cada destino
  y cerrarlo con Escape recuperando el foco; ningún recorrido presenta una trampa de foco.

Los resultados contractuales se registran en evidence/summary.md; no equivalen a aceptación integrada de aplicación.

## Assumptions

- El argumento “001” selecciona el directorio existente; no crea una feature adicional ni cambia alcance.
- Se conservan G01–G06 y sus IDs locales FR-001–006. La descomposición de escenarios no reconstruye
  el catálogo histórico 07 ausente.
- La navegación pública no exige cuenta ni utiliza datos de Contacto o selecciones educativas.
- Las prioridades organizan el trabajo y no añaden compromisos de producto.
- La presentación del menú puede variar según el ancho disponible; no se fija un breakpoint,
  framework, proveedor o método de implementación en esta especificación.
- El footer definido aquí es común a las cuatro páginas principales; no se impone un diseño nuevo
  para páginas auxiliares ni para el panel privado.

## Dependencias y condiciones de cierre

- 002/003/004/005 proporcionan los contenidos y anclas públicas; 006, el acceso protegido;
  010, documentos aprobados; 011, validación transversal de accesibilidad y fidelidad.
- 009 aplica a cualquier tratamiento de datos o servicio integrado, sin que esta feature añada captura.
- Logo original y referencia de tipografía/paleta recibidos e incorporados en2026-10-20; revisión final de fidelidad y lector de pantalla siguen pendientes.
- Estos pendientes no impiden planificar el encabezado y footer; sí impiden cerrar fidelidad o
  recorridos integrados que dependan de recursos, secciones o documentos ausentes.
- No hay una decisión material de alcance sin resolver propia de 001. La redacción legal y
  autenticación se resuelven en sus features sin inventarlas en esta.

## Trazabilidad y verificación

Los números de escenario son locales a esta feature, no IDs históricos del catálogo 07.

| ID original | Requisito local | Escenarios | Fuente | Estado de aplicación |
|---|---|---|---|---|
| G01 | FR-001 | US1.1–US1.5 | PDF 1–4 / C06 | Contrato y recursos comunes validados; aceptación de destinos e integración pendientes |
| G02 | FR-002 | US2.1, US2.2, US2.4 | PDF 1–2 / C10 | Contrato y recursos comunes validados; aceptación de destinos e integración pendientes |
| G03 | FR-003 | US2.3, US2.4 | PDF 3–4 | Contrato y recursos comunes validados; aceptación de destinos e integración pendientes |
| G04 | FR-004 | US3.1 | PDF 1–4 / C34 | Contrato y recursos comunes validados; aceptación de destinos e integración pendientes |
| G05 | FR-005 | US3.2 | PDF 1–4 + captura de acceso | Contrato y recursos comunes validados; aceptación de destinos e integración pendientes |
| G06 | FR-006 | US3.3, US3.4 | PDF 1–4 | Contrato y recursos comunes validados; aceptación de destinos e integración pendientes |

### Registro documental

2026-10-16 — `$speckit-specify 001`: reemplazada la descomposición inicial genérica por
escenarios concretos, destinos, casos límite y resultados medibles, conservando G01–G06.
Constitución 1.0.0 aplicada; revisión de requisitos en `checklists/requirements.md`.
Sin implementación, cambios al PDF, nuevas decisiones de alcance ni pruebas de aplicación.

2026-10-16 — `$speckit-plan 001`: enfoque técnico y validación documentados en
[plan.md](plan.md), sin alterar requisitos ni resultados de aplicación.

2026-10-16 — `$speckit-clarify`: revisión del alcance activo G01–G06 sin preguntas:
no se detectaron ambigüedades críticas propias de 001. Se mantienen los requisitos y
el plan existentes. Los recursos oficiales y destinos de otras features son dependencias
abiertas ya identificadas, no decisiones resueltas en esta revisión. Checklist documental
revalidado: 16/16 antes y después; implementación y pruebas de aplicación no ejecutadas.

2026-10-16 — `$speckit-tasks 001`: generadas [28 tareas](tasks.md) con dependencia y
trazabilidad; ningún requisito ni prueba de aplicación se marca completado.

2026-10-16 — Correcciones autorizadas I1/U1/U2 sincronizadas en plan, contrato,
tareas y guía. Sin cambios de alcance: separación de builds; dependencia explícita de
contrato 006; precisión de cobertura de SC-004 a cada ancho y texto 100%/200%.

2026-10-16 — `$speckit-implement 001`: componentes Header/Footer/Layout y tooling
implementados; banco aislado y evidencia en [summary.md](evidence/summary.md).
Se conservan requisitos y bloqueos de recursos y otras features. La validación de fixtures
no acredita documentos legales aprobados ni autorización del servidor.

2026-10-20 — Reanudación `$speckit-implement 001`: inventario privado006 C1/C2/C3 recibido,
casosG05 definidos y guard real probado localmente con SQLite, sin mocks de autorización.
Se corrige foco al reactivar el mismo fragmento con puntero/Enter enFirefox; no se altera
URL/historial ni clic modificado. T021 completa;22/28 tareas cerradas, T023–T028 parciales
o bloqueadas por entrega/recursos/operación/validación. Los archivos públicos existen;
su aprobación y build integrado siguen pendientes. Ver evidencia vigente en evidence/summary.md.

2026-10-20 — La usuaria identifica `disenovisual/Link-PrivaHome.png` y
`disenovisual/referencias.txt` como recursos oficiales. T024 completada con copia intacta
104×40, variables de paleta y PlusJakartaSans local200–800/OFL. Header/footer comparten
recurso y geometría correctos, sin tráfico aGoogleFonts.23/28 tareas; T023/T025/T026/T027/T028
siguen parciales/bloqueadas, sin aprobar imágenes/textos de002 ni cierre integrado.

## Revisión de cierre — 2026-10-23

Navegación001 revalidada en Chromium/Firefox y guard006; pruebas adicionales de controles en Inicio real conformes.23/28 tareas, sin casillas nuevas cerradas: faltan build/destinos finales, WebKit, revisión manual específica y entorno integrado. Las imágenes de Inicio ya no son un bloqueo; continúan las dependencias de003/004/005/006/009/010. Evidencia actual y siguiente paso por cada tarea en [evidence/closure-status.md](evidence/closure-status.md).

## Decisión de navegación — 2026-10-23

La usuaria confirmó que menú, activo, Escape/foco y enlaces anunciados del footer funcionan correctamente en su revisión guiada con VoiceOver. Solicitó que Contacto Seguro abra directamente la página de Contacto. Se actualizan G06/FR-006, US3.4 y contrato a `/contacto.html` sin fragmento. La confirmación de controles no acredita los destinos integrados todavía bloqueados.

2026-10-26 — WebKit27.2 disponible y32recorridos principales aprobados con caché de bibliotecas privada/namespace rootless. Sin cambios de alcance, fuente del sitio o validación de seguridad. [Reproducción y límites](evidence/webkit-runtime.md). Persisten dependencias de aceptación final de cuatro páginas y build integrado.

2026-10-27 — Revisión solicitada de 001 en el Mac: reproducida y corregida la pérdida de foco al pasar de menú compacto a expandido con el botón enfocado (G01/SC-004/SC-005). La navegación recibe foco en el enlace de la página actual antes de ocultar el botón. Se añade regresión con menú abierto/cerrado y continuación por teclado; WebKit/macOS usa Option+Tab nativo en las pruebas. Los destinos reales siguen bloqueados por 003/004/005/006/009/010, aunque localhost ya es accesible desde el runner. Se mantienen 23/28 tareas y todos los criterios de aceptación. [Resultados actuales](evidence/review-2026-10-27.md).
