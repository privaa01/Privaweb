# Feature Specification: Presentación y disponibilidad de Priva App

**Feature Directory**: `specs/004-presentacion-app`
**Created**: 2026-10-16
**Updated**: 2026-10-28
**Status**: 30/32 tareas; recursos y textos aprobados, página real habilitada y recorridos integrados conformes. Revisión manual/fidelidad y build/calificaciónintegrada pendientes.
**Input**: `/speckit-specify 004`: desarrollar la feature existente sin ampliar el alcance.
**Fuentes**: [SPEC R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), A01–A07, PDF 3 y
[constitución 1.0.0](../../.specify/memory/constitution.md), especialmente CONST-03/08–10.

## User Scenarios & Testing

### User Story 1 — Comprender qué propone el prototipo (Priority: P1)

Como visitante, quiero conocer Priva App y sus funciones previstas para entender su propósito
sin confundir una presentación con un servicio disponible.

**Why this priority**: La página debe explicar el producto con claridad sin prometer un chat,
un diagnóstico o capacidades que la web no ofrece.

**Independent Test**: Recorrer el contenido con los recursos de muestra identificados y textos
revisados para el escenario de prueba, sin descargas disponibles; comprobar que prototipo,
beneficios y pasos se entienden sin abrir un chat, formulario o evaluación.

**Acceptance Scenarios**:

1. **Dado** la página Priva App, **cuando** consulto el hero y la explicación Qué es Priva App,
   **entonces** encuentro imagen, descripción y una indicación visible de que es un prototipo,
   con funciones previstas, sin afirmación de funcionamiento o disponibilidad actual. (A01/A02)
2. **Dado** el teléfono de muestra, **cuando** lo observo o recorro la página con teclado,
   **entonces** Conversar forma parte de una imagen informativa; no es enlace, botón web,
   campo de entrada ni punto de foco que abra una conversación. (A02)
3. **Dado** los beneficios, **cuando** los leo, **entonces** encuentro Guía paso a paso,
   Privacidad digital y Ayuda clara y rápida como beneficios previstos, sin promesa de
   asesoramiento inmediato, personalización operativa o protección garantizada. (A03)
4. **Dado** Cómo se usa, **cuando** consulto el recorrido, **entonces** encuentro en orden
   1 Escribe tu duda, 2 Recibe instrucciones, 3 Aplica los cambios y 4 Mantente seguro;
   se explica como flujo previsto del prototipo, sin pedir que escriba datos en la web. (A04)
5. **Dado** Para qué sirve, **cuando** reviso sus tres bloques, **entonces** encuentro Tips,
   Asistente IA y Diagnóstico de Seguridad como funciones previstas; no se abre chat,
   cuestionario, resultado diagnóstico ni herramienta de eliminación de datos. (A05)
6. **Dado** un texto o recurso que afirma operación, disponibilidad o garantías no verificadas,
   **cuando** se revisa para publicación, **entonces** queda pendiente de corrección y revisión;
   conservar el wireframe no autoriza publicar sus promesas literales. (A01–A05/A07)

### User Story 2 — Llegar a la explicación o las descargas (Priority: P1)

Como visitante, quiero encontrar cómo se usaría Priva App y su disponibilidad para recorrer
la página sin perderme ni activar una descarga inexistente.

**Why this priority**: Los dos CTA del hero y el encabezado conectan la presentación con sus
secciones, incluso cuando ninguna plataforma está disponible.

**Independent Test**: Con ambas plataformas pendientes, activar Descargar app y Ver cómo
funciona con teclado y puntero, visitar directamente ambas anclas y comprobar encabezados
visibles y foco de destino sin requerir enlace a una tienda.

**Acceptance Scenarios**:

1. **Dado** el hero, **cuando** activo Descargar app, **entonces** llego a #descarga en esta
   página; ese CTA navega a la sección y no inicia por sí solo una descarga. (A01/A06)
2. **Dado** el hero, **cuando** activo Ver cómo funciona, **entonces** llego a #como-funciona,
   donde encuentro los cuatro pasos previstos con el encabezado visible. (A01/A04)
3. **Dado** el CTA DESCARGAR APP del encabezado compartido, **cuando** lo activo desde Priva
   App o desde Contacto, **entonces** llego a la sección #descarga de Priva App con su título
   visible y foco de destino coherente con la navegación de 001. (A06; integración 001/005)
4. **Dado** /app.html#descarga o /app.html#como-funciona, **cuando** entro directamente o
   recargo, **entonces** la sección existe y su encabezado no queda oculto; no se requiere
   disponibilidad de plataformas para que las anclas funcionen. (A01/A04/A06)
5. **Dado** móvil o ampliación de texto, **cuando** recorro los bloques y enlaces,
   **entonces** conservo el orden del PDF 3, el acceso por teclado y las etiquetas legibles,
   sin recortes ni elementos falsamente interactivos en los mockups. (A01–A07)

### User Story 3 — Consultar disponibilidad por plataforma (Priority: P2)

Como visitante, quiero distinguir si Android o iPhone tienen una descarga oficial disponible
para usar únicamente un destino verificado de mi plataforma.

**Why this priority**: La disponibilidad debe ser independiente y honesta; una URL pendiente
no puede presentarse como descarga funcional.

**Independent Test**: Probar las cuatro combinaciones de disponibilidad con destinos de prueba
identificados; comprobar etiquetas, acciones y coherencia del mockup, sin construir una app móvil.
Los destinos de prueba no acreditan enlaces oficiales ni instalación real.

**Acceptance Scenarios**:

1. **Dado** Android e iPhone sin URL oficial verificada, **cuando** consulto #descarga,
   **entonces** identifico ambas plataformas y veo Próximamente en ambas, sin enlace de
   descarga accionable, destino vacío ni sustitución por registro o lista de espera. (A06)
2. **Dado** solo Android con URL oficial verificada, **cuando** consulto la sección,
   **entonces** solo su control lleva a esa URL; iPhone conserva Próximamente sin acción. (A06)
3. **Dado** solo iPhone con URL oficial verificada, **cuando** consulto la sección,
   **entonces** solo su control lleva a esa URL; Android conserva Próximamente sin acción. (A06)
4. **Dado** ambas URL oficiales verificadas, **cuando** activo cada control con teclado o
   puntero, **entonces** cada uno abre el destino verificado de su plataforma, sin intercambiar
   enlaces ni afirmar que la persona ya instaló la aplicación. (A06)
5. **Dado** una URL recibida pero no verificada, inválida o detectada como inaccesible durante
   su revisión, **cuando** se decide habilitar la plataforma, **entonces** permanece pendiente,
   con Próximamente sin acción; recibir una dirección no acredita su disponibilidad. (A06)
6. **Dado** cualquier combinación de estados, **cuando** consulto el texto bajo descargas y
   el mockup, **entonces** leo exactamente “Orientación para cuidar tus datos personales”; no
   veo Gratis, Android 10+, iOS 15+, garantías del 100% ni disponibilidad general contradicha
   por una plataforma pendiente. (A06/A07)

### Edge Cases

- Ambas plataformas pendientes es un estado válido de la presentación; no obliga a inventar
  enlaces ni bloquea por sí solo la página completa. Sí impide declarar esas descargas disponibles.
- Cambiar la disponibilidad de una plataforma no habilita ni deshabilita la otra. Probar también
  la vuelta a pendiente si la revisión retira la verificación de un enlace.
- Un control pendiente no lleva a #, no navega a otra sección para aparentar descarga, ni se
  activa con Enter/Space; su estado es legible sin depender solo del color.
- Si una tienda o destino falla después de la visita, la web no confirma instalación ni éxito.
  No se añade un servicio de vigilancia de tiendas ni un instalador como parte de esta feature.
- Si un mockup contiene Listo para descargar o texto incompatible con la disponibilidad real,
  requiere recurso/copy coherente y revisado antes de cerrar el bloque; no se publica la
  contradicción ni se elimina el bloque para ocultar un recurso faltante.
- Si falla una imagen, el texto explicativo y los enlaces disponibles siguen consultables.
  El recurso oficial ausente sigue pendiente; un fixture no certifica fidelidad.
- La descripción accesible del teléfono comunica que es una representación del prototipo;
  no añade un control Conversar ni sugiere que el lector de pantalla puede abrir un chat web.
- Las erratas de la referencia, incluida “majenar”, se revisan editorialmente; no se toman
  como permiso para agregar herramientas, promesas o funciones nuevas.
- Ningún encabezado fijo oculta los destinos; imágenes, tarjetas y controles se adaptan al
  texto al 200% sin desbordamiento que impida leer o activar los enlaces.

## Requirements

### Functional Requirements

- **FR-001 / A01 — Hero de Priva App**: Mantener estructura, imagen y CTA a #descarga/#como-funciona; identificar claramente prototipo y funciones previstas, sin afirmar operación actual; copy final para revisión (C31).
- **FR-002 / A02 — Qué es Priva App y mockup Conversar**: Descripción y teléfono conservados; Conversar es parte de la imagen, sin enlace, clic, foco ni rol de botón web (C13)
- **FR-003 / A03 — Tres beneficios del prototipo**: Guía paso a paso, Privacidad digital, Ayuda clara y rápida presentados como previstos; no certificar funcionamiento.
- **FR-004 / A04 — Cómo se usa el prototipo**: Escribe tu duda, Recibe instrucciones, Aplica los cambios, Mantente seguro, en orden 1–4; explicar como flujo previsto, sin promesa de funcionamiento actual.
- **FR-005 / A05 — Para qué serviría Priva App**: Tips, Asistente IA y Diagnóstico de Seguridad como funciones previstas del prototipo; no implementarlas en la web; revisar copy final/errata de referencia.
- **FR-006 / A06 — Descarga por plataforma**: Android/iPhone identificados; Próximamente sin acción hasta URL oficial verificada; habilitar independientemente; probar ambas pendientes, mixto y ambas disponibles; CTA mantiene #descarga; mockup no afirma disponibilidad inexistente (C14).
- **FR-007 / A07 — Texto bajo descargas**: Usar Orientación para cuidar tus datos personales; retirar Gratis y versiones mínimas Android 10+/iOS 15+ hasta datos oficiales; sin garantía del 100% (C17/C23).

### Reglas que precisan los requisitos

**Composición del PDF 3**: encabezado compartido → hero MANEJA TU PRIVACIDAD con imagen y
Descargar app/Ver cómo funciona → Qué es Priva App, teléfono y tres beneficios → Cómo se usa
con cuatro pasos → Para qué sirve con tres funciones → descarga por plataforma y mockup →
footer compartido. En móvil se mantiene el orden de lectura, apilando los bloques.
No se crea una aplicación móvil, conversación web, evaluación ni flujo de alta pública.

**Presentación editorial**: la indicación de prototipo y funciones previstas debe ser visible
junto a su presentación, no relegada a documentos legales. El texto final de hero, descripción,
beneficios, pasos y funciones requiere revisión P03: el PDF aporta composición y referencias,
pero sus frases en presente no acreditan operación. “Ayuda clara y rápida” es un beneficio
previsto, no un compromiso de respuesta. IA, personalización, eliminación de datos, diagnóstico
instantáneo o seguridad no se anuncian como servicios actuales sin respaldo.

**Mockups informativos**: teléfono Conversar y teléfono de descarga conservan su función
visual; no tienen acción propia ni foco de control web. Las imágenes tienen alternativa según
su propósito y no pueden contradecir los estados de disponibilidad ni simular un chat operativo.
Los recursos oficiales y sus variantes coherentes quedan sujetos a P01/P03/P04.

**Disponibilidad independiente**:

| Android | iPhone | Resultado de los controles por plataforma |
|---|---|---|
| Pendiente | Pendiente | Ambos Próximamente, sin acción |
| Verificada | Pendiente | Solo Android enlaza; iPhone Próximamente |
| Pendiente | Verificada | Solo iPhone enlaza; Android Próximamente |
| Verificada | Verificada | Cada plataforma enlaza a su URL oficial |

“Verificada” requiere URL oficial válida y comprobación documentada de su correspondencia con
Priva App y la plataforma. No se presume tienda, proveedor, fecha de lanzamiento, precio,
versión mínima o disponibilidad por tener un mockup o una dirección sin revisar.
La forma técnica de configurar y verificar enlaces corresponde al plan; no se exige un
servicio nuevo de monitorización ni una consulta continua a tiendas en esta especificación.

**Texto de descarga aprobado**: “Orientación para cuidar tus datos personales”. Se retiran
Gratis, Android 10+, iOS 15+ y garantías del 100%. Sin información oficial nueva no se
restablecen esos datos ni se inventan sustitutos. El estado pendiente no solicita correo ni
activa lista de espera. Una descarga enlazada no demuestra instalación ni uso de la app.

**Destinos públicos**:

| Control/destino | Referencia | Responsable |
|---|---|---|
| Página Priva App | /app.html | 004 |
| Descargar app del hero | #descarga | 004 |
| Ver cómo funciona | #como-funciona | 004 |
| DESCARGAR APP del encabezado de App | #descarga | 001 consume sección de 004 |
| DESCARGAR APP del encabezado de Contacto | /app.html#descarga | Integración 001/005 |
| Descarga Android | URL oficial propia verificada o Próximamente | 004 / P01 |
| Descarga iPhone | URL oficial propia verificada o Próximamente | 004 / P01 |
| Conversar del teléfono | Sin destino; parte de la imagen | 004 |

Las rutas son contratos del SPEC; no prueban que las páginas o destinos externos estén
operativos. 004 reutiliza navegación/footer de 001 sin redefinirlos ni duplicar su lógica.

### Key Entities

- **Presentación del prototipo**: hero, descripción, beneficios, pasos y funciones previstas;
  textos con referencia y estado de revisión, sin promesa de operación actual.
- **Beneficio previsto**: uno de los tres títulos de A03 y explicación revisada.
- **Paso previsto**: posición 1–4, título y explicación; orden fijo de A04.
- **Función prevista**: Tips, Asistente IA o Diagnóstico de Seguridad; información, sin acción web.
- **Plataforma de descarga**: Android o iPhone; estado pendiente/verificado, URL oficial cuando
  exista y referencia de verificación. Estado independiente de la otra plataforma.
- **Recurso visual**: imagen del hero, teléfono de explicación o mockup de descarga; alternativa,
  referencia oficial y estado de revisión/recepción. Conversar no es entidad interactiva.
- **Destino de sección**: #como-funciona o #descarga, con título identificable y accesible.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Los cinco grupos de contenido del PDF 3 aparecen en orden, con los tres beneficios,
  cuatro pasos y tres funciones de referencia. La condición de prototipo y de funciones previstas
  es visible al consultar la presentación, sin chat web, diagnóstico o servicio operativo simulado.
- **SC-002**: Los dos CTA del hero, los dos accesos de encabezado App/Contacto y las visitas
  directas/recargas de ambas anclas llegan al destino correcto con título visible y foco
  coherente; Descargar app del hero sigue funcionando como navegación con ambas plataformas pendientes.
- **SC-003**: Las cuatro combinaciones de disponibilidad producen exactamente los controles
  definidos en la tabla; cada plataforma habilitada abre solo su URL verificada. URL ausente,
  inválida o sin verificación mantiene Próximamente sin acción. Retirar una verificación no
  cambia la otra plataforma ni deja una descarga anterior habilitada.
- **SC-004**: En todos los estados, el texto bajo descargas coincide exactamente con A07, sin
  precio, versiones mínimas ni garantías retiradas; ningún texto o mockup contradice los estados
  de Android/iPhone. Conversar no es accionable con teclado o puntero ni tiene rol de control.
- **SC-005**: En 360/390/430/768/1024/1280/1440 px y texto 100%/200%, los bloques conservan
  orden, títulos y controles legibles, sin recortes, scroll horizontal o trampas de foco.
  Se comprueban alternativas, foco, contraste 4.5:1 normal/3:1 grande y componentes, y controles
  de aproximadamente 44 px, conforme a 011.
- **SC-006**: La entrega cuenta con revisión editorial y recursos oficiales comprobados por
  bloque; no presenta fixtures, enlaces pendientes o capacidades no verificadas como finales.
  La fidelidad visual se verifica separadamente de la mecánica con datos de prueba.

Son criterios de aceptación; resultados contractuales y bloqueos en [evidence/summary.md](evidence/summary.md).

## Assumptions

- “004” selecciona el directorio existente; se conservan A01–A07 y FR-001–FR-007. La invocación original
  especificó sin código; la implementación posterior fue solicitada con `$speckit-implement 004`, sin nueva feature ni rama.
- Las prioridades ordenan trabajo; todos los requisitos siguen dentro de la entrega prevista.
- Al no disponer de URLs oficiales verificadas, ambas plataformas empiezan pendientes.
  Su habilitación futura es un estado previsto, no autorización para inventar enlaces.
- No se recogen datos de visitantes, dudas o respuestas en esta página. No hay chat, formulario
  de registro, lista de espera, diagnóstico, estadísticas de uso de funciones ni app móvil en 004.
- No se eligen aquí tecnología, tiendas, proveedor de distribución ni sistema de configuración.
- Los escenarios locales no reconstruyen los 195 criterios históricos del documento 07 ausente.

## Dependencias y condiciones de cierre

- **001**: encabezado, navegación/footer, CTA de App/Contacto y acceso a fragmentos; 004 ofrece
  las secciones reales. Los componentes existentes no acreditan integración con 004 todavía.
- **005**: página de origen del CTA compartido hacia App, para la prueba integrada desde Contacto.
- **P01**: recursos oficiales del hero, teléfono Conversar, mockup de descarga y enlaces oficiales
  por plataforma cuando existan. Faltar una URL mantiene pendiente esa plataforma; no impide
  aceptar el comportamiento correcto de Próximamente si el resto de requisitos está verificado.
- **P03**: copy final de prototipo/funciones previstas, erratas y promesas; revisión de los
  mensajes de disponibilidad presentes dentro de imágenes y de sus variantes.
- **009/011/P04**: privacidad de destinos e integraciones, accesibilidad, fuente/paleta,
  recursos de marca y fidelidad visual contra PDF 3 con las diferencias aprobadas.
- Fixtures identificados permiten pruebas independientes sin resolver destinos/recursos finales;
  no acreditan la revisión editorial, las URLs oficiales, la fidelidad o la integración afectada.
  La ausencia de un recurso o revisión bloquea su cierre, sin ocultar el bloque ni declarar éxito.

## Trazabilidad y verificación

| ID original | Requisito local | Escenarios | Fuente | Estado de aplicación |
|---|---|---|---|---|
| A01 | FR-001 | US1.1/6; US2.1/2/4/5 | PDF 3 / C31 | Contrato verificado; cierre integrado pendiente |
| A02 | FR-002 | US1.1/2/6; US2.5 | PDF 3 / C13 | Contrato verificado; cierre integrado pendiente |
| A03 | FR-003 | US1.3/6; US2.5 | PDF 3 | Contrato verificado; cierre integrado pendiente |
| A04 | FR-004 | US1.4/6; US2.2/4/5 | PDF 3 | Contrato verificado; cierre integrado pendiente |
| A05 | FR-005 | US1.5/6; US2.5 | PDF 3 / P03 | Contrato verificado; cierre integrado pendiente |
| A06 | FR-006 | US2.1/3/4; US3.1–US3.6 | PDF 3 / C14 | Contrato verificado; cierre integrado pendiente |
| A07 | FR-007 | US1.6; US3.6 | PDF 3 / C17/C23 | Contrato verificado; cierre integrado pendiente |

### Registro documental

2026-10-17 — `/speckit-specify 004`: tres historias con escenarios de presentación, navegación
por anclas y cuatro estados independientes de descarga. A01–A07 conservados; checklist revisado.
Sin implementación, pruebas de aplicación, textos finales aprobados ni URLs oficiales inventadas.

2026-10-17 — `$speckit-clarify 004`: revisión de alcance/comportamiento, entidades y estados,
recorridos, accesibilidad/privacidad, dependencias, errores, restricciones, terminología,
aceptación y pendientes. No se detectaron ambigüedades críticas que requieran preguntas
(0 formuladas/0 respondidas). Se mantienen las cuatro combinaciones de disponibilidad,
Próximamente como estado válido y Conversar exclusivamente visual.
P01/P03/P04 y la integración desde Contacto siguen pendientes; configuración/verificación técnica
de URLs corresponde al plan, sin inventar tiendas, recursos, copy aprobado o servicios.
Checklist revalidado: 16/16 → 16/16, sin cambios de estado. Solo se actualizó este registro;
no se implementó código ni se ejecutaron pruebas de aplicación. Lista para planificación independiente.

2026-10-17 — `$speckit-implement 004`: componentes estáticos, resolver de descargas y
gate implementados;28/32 tareas completas.52unitarias,31UI004 y97regresiones aprobadas.
Se corrigió foco para CTA repetido a mismo fragmento en001, sin cambiar alcance.
Recursos/P03, otros navegadores, lector/fidelidad e integración siguen pendientes.
