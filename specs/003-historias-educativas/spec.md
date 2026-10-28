# Feature Specification: Historias, audio y reflexión educativa

**Feature Directory**: `specs/003-historias-educativas`
**Created**: 2026-10-16
**Updated**: 2026-10-17
**Status**: Textos públicos aprobados explícitamente el 2026-10-28; guard editorial y render HTTP200. Cuatro historias publicadas/activas localmente con mandato de la responsable; revisión manual final y cierre productivo pendientes.
**Input**: `/speckit-specify 003`: desarrollar el spec existente sin ampliar alcance.
**Fuentes**: [SPEC R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), H01–H12, PDF 2 y
[constitución 1.0.0](../../.specify/memory/constitution.md), en particular CONST-03/05/07–10.

## User Scenarios & Testing

### User Story 1 — Encontrar historias disponibles (Priority: P1)

Como visitante, quiero encontrar los casos publicados para elegir una historia y reconocer
el riesgo digital que aborda.

**Why this priority**: Es la entrada a todos los recorridos educativos de la página.

**Independent Test**: Abrir Historias con un catálogo de prueba que incluya los tres casos
iniciales, una nueva historia publicada activa, un borrador y una inactiva; comprobar contenido
visible y recorrido de Ver todas sin requerir comentarios, sesión ni interacción educativa.

**Acceptance Scenarios**:

1. **Dado** Historias abierto, **cuando** consulto el hero, **entonces** veo etiqueta
   RECREACIONES EDUCATIVAS, título “Aprende con recreaciones educativas sobre riesgos digitales.”, descripción,
   imagen y Explorar episodios con la composición del PDF 2. No se añade un caso principal
   de María entre el hero y Casos destacados. (H01)
2. **Dado** Explorar episodios, **cuando** lo activo con teclado o puntero, **entonces**
   llego a #casos con su encabezado visible; la misma sección admite visita directa/recarga. (H01)
3. **Dado** los tres casos iniciales publicados y activos con recursos válidos, **cuando**
   consulto Casos destacados, **entonces** identifico cada caso por imagen, categoría, título
   y descripción coherentes con sus materiales; no se inventan personas ni historias adicionales. (H02–H05)
4. **Dado** nuevas historias publicadas activas además de los tres casos iniciales,
   **cuando** activo Ver más historias, **entonces** veo el listado completo en esta
   misma página, sin duplicados, borradores o desactivadas, sin abrir un catálogo separado. (H02)
5. **Dado** una historia desactivada o un borrador en la fuente de contenidos,
   **cuando** se obtiene/renderiza el catálogo público actualizado, **entonces** no aparecen
   su contenido ni recursos privados en la página pública. Desactivar no borra el registro. (H02, integración 007)

### User Story 2 — Escuchar y leer un caso (Priority: P1)

Como visitante, quiero controlar el audio y consultar su transcripción para comprender
el relato según mis necesidades de acceso.

**Why this priority**: El relato es el material base de la reflexión educativa.

**Independent Test**: Utilizar un caso identificado con audio reproducible y transcripción
equivalente, probar controles, carga/error y tiempos reales; no exige completar ejercicios.

**Acceptance Scenarios**:

1. **Dado** cualquier caso con audio válido, **cuando** abro Historias, **entonces** el audio
   no comienza solo; puedo reproducir, pausar y avanzar con controles accesibles y tiempos reales. (H03–H06)
2. **Dado** audio aún cargando o con fallo de acceso/decodificación, **cuando** intento
   escucharlo, **entonces** veo el estado correspondiente sin fingir reproducción ni duración;
   el relato en texto equivalente sigue consultable si está disponible. (H06)
3. **Dado** una transcripción equivalente al archivo aportado, **cuando** la consulto,
   **entonces** puedo leer el contenido completo sin depender de escuchar el audio. (H06)
4. **Dado** un caso sin archivo final o sin transcripción equivalente,
   **cuando** se revisa su aceptación/publicación, **entonces** queda bloqueado para cierre;
   no se añade un reproductor simulado o duración copiada del dibujo para ocultar el faltante. (H03–H06)

### User Story 3 — Reflexionar sin calificación ni seguimiento (Priority: P2)

Como visitante, quiero elegir una opción y leer su explicación para reconocer riesgos y
prevención sin rendir un examen ni registrar mis selecciones.

**Why this priority**: Convierte la escucha en aprendizaje sin añadir evaluación o rastreo.

**Independent Test**: Seleccionar y cambiar las tres opciones de cada caso, comprobar nueve
explicaciones específicas, independencia entre casos y reinicio al recargar; observar solicitudes
y almacenamiento para comprobar que las selecciones no salen de la interacción local.

**Acceptance Scenarios**:

1. **Dado** un caso sin selección, **cuando** consulto ¿QUÉ ERROR SE COMETIÓ?, **entonces**
   veo sus tres opciones y todavía ninguna explicación presentada como opción elegida. (H07–H09)
2. **Dado** cualquiera de las nueve opciones iniciales, **cuando** la selecciono con teclado
   o puntero, **entonces** aparece inmediatamente su explicación específica de riesgo y prevención,
   perceptible mediante tecnología de asistencia, sin botón extra ni correcta/incorrecta/puntuación. (H07–H09)
3. **Dado** una opción ya seleccionada, **cuando** elijo otra del mismo caso, **entonces**
   cambia la explicación a la nueva opción, sin acumular un resultado de examen. (H07–H09)
4. **Dado** selecciones en dos casos distintos, **cuando** cambio una opción de uno,
   **entonces** el otro caso conserva su propia selección/explicación. (H08, H09)
5. **Dado** selecciones realizadas, **cuando** recargo la página, **entonces** todos los
   casos vuelven al estado sin selección. No se enviaron selecciones ni se guardaron
   persistentemente; no se generan estadísticas educativas ni comentarios. (H07–H09)
6. **Dado** una explicación sin validar contra el relato,
   **cuando** se revisa para entrega, **entonces** se mantiene pendiente y no se publican
   hechos inventados para justificar una opción. (H07–H09)

### User Story 4 — Entender el método y seguir aprendiendo (Priority: P2)

Como visitante, quiero conocer la metodología y acceder a los destinos relacionados para
continuar aprendiendo sobre el cuidado de mis datos.

**Why this priority**: Da contexto a los ejercicios y conecta la página con contenido institucional.

**Independent Test**: Revisar metodología y los dos bloques institucionales, activar Saber más
y el CTA final; comprobar destinos contra Inicio y la URL oficial compartida con Contacto.

**Acceptance Scenarios**:

1. **Dado** la metodología, **cuando** la consulto, **entonces** encuentro imagen,
   “Identifica el error y aprende” y los pasos 1 Escucha, 2 Reflexiona, 3 Aplica en ese orden. (H10)
2. **Dado** los recordatorios Somos Priva y Qué hacemos, **cuando** activo cada Saber más,
   **entonces** llego a su sección correspondiente de Inicio, con título visible. (H11)
3. **Dado** el cierre de Historias, **cuando** lo consulto, **entonces** conserva título e imagen
   de referencia y usa exactamente “Aprende a reconocer riesgos y toma decisiones más
   informadas sobre tus datos personales.”, sin el párrafo anterior de miles de personas. (H12)
4. **Dado** la URL oficial de Instagram verificada, **cuando** activo EXPLORAR MÁS CONTENIDOS,
   **entonces** llego a esa misma cuenta oficial enlazada desde Contacto. Si falta la URL,
   el recorrido no se declara completo ni se sustituye por un enlace vacío/inventado. (H12)

### Edge Cases

- Si no existen historias publicadas activas, mostrar un estado vacío legible en #casos,
  sin tarjetas ficticias ni reproducciones simuladas; no exponer borradores para llenar la lista.
- Si solo existen los tres casos iniciales, Ver todas no los duplica ni abre otra página;
  el listado completo coincide con el visible. Un nuevo caso activo se incorpora al catálogo público.
- Un fallo al obtener el catálogo no equivale a un listado vacío confirmado: comunicar el error
  sin mostrar éxito ficticio ni datos privados. El mecanismo de actualización se definirá con 007.
- Una descripción o imagen que no coincide con el relato requiere corrección editorial;
  no se resuelve añadiendo hechos no narrados a la explicación.
- Audio que no ha informado metadatos no recibe una duración inventada; fallo de una imagen
  no debe quitar el texto, los ejercicios o la transcripción disponibles.
- Cambiar opción con teclado anuncia el nuevo feedback sin desplazar el foco de forma inesperada.
- Un encabezado fijo no oculta #casos ni las secciones de destino. Se mantiene foco visible
  y orden legible al apilar tarjetas y ampliar texto al 200%.
- La ausencia de recursos, explicación validada, Instagram o destino institucional real bloquea
  el cierre afectado; los fixtures identificados sirven solo para pruebas independientes.

## Requirements

### Functional Requirements

- **FR-001 / H01 — Hero Historias**: Etiqueta, título, descripción e imagen; Explorar episodios lleva a #casos, sin insertar María
- **FR-002 / H02 — Casos destacados: encabezado y Ver más historias**: Tres casos iniciales y control visibles; Ver todas muestra el listado completo de activas en esta página, incluidas nuevas publicaciones; sin borradores, desactivadas ni duplicados (C11)
- **FR-003 / H03 — Caso 1: Enlace falso / Ingeniería social**: recreación de Carolina sobre una falsa campaña de adopción; portada, audio, transcripción y ejercicio corresponden a la ficha aportada y autorizada. Duración obtenida del archivo real.
- **FR-004 / H04 — Caso 2: La llamada sospechosa / Suplantación de identidad**: recreación de Juliana sobre compartir un código con quien dice llamar de WhatsApp; recursos y ejercicio corresponden a la ficha aportada y autorizada. Duración obtenida del archivo real.
- **FR-005 / H05 — Caso 3: La contraseña compartida / Contraseñas**: recreación de Luisa sobre una tienda falsa y reutilización de una contraseña; recursos y ejercicio corresponden a la ficha aportada y autorizada. Duración obtenida del archivo real.
- **FR-006 / H06 — Audio de cada caso**: Reproducir/pausar, avance, duración real y estado de carga/error; sin autoplay; transcripción equivalente; sin audio bloquea cierre de caso
- **FR-007 / H07 — Ejercicio Caso 1**: Tres opciones de la ficha aportada y autorizada para publicar; explicación específica de riesgo y prevención inmediata al seleccionar/cambiar, sin calificación, puntuación ni botón extra; teclado y anuncio accesible; sin envío/persistencia; recarga reinicia (C05/C08/C09).
- **FR-008 / H08 — Ejercicio Caso 2**: Tres opciones de la ficha aportada y autorizada para publicar; misma interacción educativa de H07, selección independiente por caso; explicación por opción validada contra el material aportado.
- **FR-009 / H09 — Ejercicio Caso 3**: Tres opciones de la ficha aportada y autorizada para publicar; misma interacción educativa de H07, selección independiente por caso; nueve explicaciones en total, publicadas por mandato de la responsable; no se inventa cotejo independiente no ejecutado.
- **FR-010 / H10 — Metodología con imagen**: Identifica el error y aprende; 1 Escucha, 2 Reflexiona, 3 Aplica en ese orden
- **FR-011 / H11 — Identidad en dos bloques y SABER MÁS**: Somos Priva y Qué hacemos; cada enlace lleva a su sección de Inicio
- **FR-012 / H12 — CTA final de Historias**: Conservar título/imagen; párrafo exacto C16: Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales. EXPLORAR MÁS CONTENIDOS abre Instagram oficial, misma URL que Contacto: https://www.instagram.com/priva_inc/, identificada por la responsable el2026-10-26.

### Reglas que precisan los requisitos

**Composición**: encabezado de 001 → hero → Casos destacados → metodología → recordatorios
Somos Priva/Qué hacemos → cierre con imagen → footer de 001. Mantener el orden del PDF 2
al adaptar. No añadir cuarta historia principal de suplantación ni bloque #maria.
Los audios son recreaciones educativas según decisión de la responsable del 2026-10-28; no se presentan como testimonios reales.

**Tres casos iniciales**, sujetos a materiales oficiales y condición publicada/activa:

| Caso | Categoría | Contenido de referencia |
|---|---|---|
| Enlace falso | Ingeniería social | Carolina sigue un anuncio de adopción, entrega datos y transfiere dinero a quienes suplantan una campaña. |
| La llamada sospechosa | Suplantación de identidad | Juliana comparte un código con alguien que dice llamar de WhatsApp y pierde el acceso a su cuenta. |
| La contraseña compartida | Contraseñas | Luisa se registra en una tienda falsa usando una contraseña que también utiliza en otras cuentas. |

Las fichas y transcripciones aportadas sustituyen los personajes/escenas preliminares del dibujo, por decisión de publicación de la responsable del2026-10-28. Mostrar duración derivada de los archivos; las duraciones de referencia del wireframe no son metadatos reales. No inventar audios, guiones o recursos.

**Opciones vigentes de las fichas autorizadas** (sin clave única de corrección):

| Caso | Opción1 | Opción2 | Opción3 |
|---|---|---|---|
| 1 | Confiar en logos y perfiles sin verificar la organización | Entregar datos personales y de cuenta a un contacto sin verificar | Transferir dinero por la presión de una supuesta urgencia |
| 2 | Compartir el código de verificación durante la llamada | Confiar en quien afirma llamar de WhatsApp | Actuar para resolver un supuesto problema sin comprobarlo |
| 3 | Reutilizar la misma contraseña en varias cuentas | Confiar en la apariencia de una tienda y en su publicidad | Registrarse sin verificar la oferta y la página |

Cada opción tiene una explicación distinta de riesgo y prevención validada contra el relato.
Ninguna se etiqueta correcta/incorrecta. Se elige una opción por caso y puede cambiarse;
no se envía respuesta, no hay puntuación, historial persistente, formulario de comentarios,
clasificación de visitantes ni seguimiento estadístico de ejercicios.

**Destinos públicos de referencia**:

| Control/destino | Referencia | Responsable |
|---|---|---|
| Página Historias | /historias.html | 003 |
| Explorar episodios y CTA PROTÉGETE HOY de 001 | #casos | 003 ofrece la sección; 001 controla su CTA |
| Ver más historias | Listado completo en esta página | 003 |
| Saber más de Somos Priva | /index.html#somos-priva | 002 ofrece destino |
| Saber más de Qué hacemos | /index.html#que-hacemos | 002 ofrece destino |
| EXPLORAR MÁS CONTENIDOS | https://www.instagram.com/priva_inc/ | Misma URL que 005; referencia en evidence/social-reference.md |

Las rutas provienen de R35 y son contratos propuestos, no prueba de implementación.
No reemplazar una URL pendiente por `#` aislado. El guardado/publicación/activación corresponde
a 007; 003 consume únicamente el catálogo público válido. La entrega integrada debe verificar
que las modificaciones de estado llegan a la web; no se asume que un build antiguo prueba
los estados actuales, ni se decide aquí tecnología, proveedor o intervalo de actualización.

### Key Entities

- **Historia pública**: identificador estable, título, categoría, descripción, imagen, audio,
  transcripción, pregunta, tres opciones y explicaciones. Solo publicada y activa es visible.
- **Catálogo público**: conjunto sin duplicados de historias elegibles; distingue carga/error,
  vacío confirmado, destacados y listado completo dentro de la misma página.
- **Audio/transcripción**: archivo reproducible, tiempos/metadatos reales, carga/error y texto
  equivalente; no contiene duraciones acreditadas por dibujos.
- **Opción/explicación**: tres por caso; cada explicación aporta riesgo y prevención coherentes
  con el relato, con estado de validación editorial pendiente hasta recibir respaldo.
- **Selección temporal**: cero o una opción por caso, local e independiente; reiniciada al recargar,
  sin envío ni almacenamiento persistente.
- **Destino relacionado**: anclas de Inicio y cuenta Instagram oficial compartida con Contacto.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El catálogo público actualizado muestra solo historias publicadas activas; con
  tres iniciales, una nueva, un borrador y una desactivada de prueba, Ver todas presenta las
  cuatro elegibles una sola vez en esta página y nunca las dos excluidas.
- **SC-002**: Cada uno de los tres audios iniciales reales permite reproducir, pausar y avanzar;
  tiempos coinciden con el archivo. No hay autoplay. Carga/error y transcripción equivalente
  son verificables; un caso sin archivo o transcripción no se declara aceptado.
- **SC-003**: Seleccionar/cambiar cada una de las nueve opciones iniciales muestra su explicación
  correspondiente inmediatamente, con teclado y puntero y anuncio accesible, sin calificación
  ni envío adicional; todas las explicaciones tienen respaldo del material.
- **SC-004**: Las selecciones de los tres casos son independientes, se reinician al recargar y
  no generan solicitudes de envío, almacenamiento persistente ni estadísticas educativas.
- **SC-005**: Explorar episodios, Ver todas, los dos Saber más y el CTA final completan sus
  destinos definidos con encabezados visibles donde corresponda; metodología conserva sus
  tres pasos y cierre conserva copy C16 exacto. Instagram coincide con Contacto.
- **SC-006**: A cada ancho 360/390/430/768/1024/1280/1440 px con texto 100%/200%, se pueden
  recorrer catálogo, controles de audio, opciones/feedback y enlaces sin recortes, scroll
  horizontal ni trampas de foco; se verifica contraste, alternativas y transcripciones según 011.
- **SC-007**: En entrega no hay recursos ficticios, duraciones inventadas, URLs pendientes
  presentadas como funcionales ni testimonios/capacidades no respaldados. La comparación
  visual y los materiales se verifican por separado de las pruebas con fixtures.

Son criterios de aceptación; resultados contractuales y bloqueos en [evidence/summary.md](evidence/summary.md).

## Assumptions

- La invocación original de specify seleccionó el directorio003 conservando H01–H12 y FR-001–FR-012; la implementación posterior fue solicitada con `$speckit-implement 003`.
- Las prioridades de historias organizan el trabajo, sin ampliar el alcance de producto.
- Los tres casos iniciales siguen sujetos a materiales y publicación; el estado vacío no es
  una excepción para entregar sin los materiales previstos ni para inventarlos.
- No se fija aquí cómo obtener/actualizar el catálogo, almacenar audios o desplegar contenido:
  esa integración técnica pertenece al plan y a 007, manteniendo solo publicadas/activas.
- Sin comentarios públicos, cuentas de visitantes, puntuación, persistencia de selecciones,
  estadísticas educativas, editor administrativo, chat IA o diagnóstico dentro de 003.
- Los escenarios locales no reconstruyen los 195 criterios del documento 07 no aportado.

## Dependencias y condiciones de cierre

- **001**: navegación, footer y CTA de encabezado; 003 proporciona #casos sin duplicar su lógica.
- **002**: secciones reales de Inicio. Sus componentes existen, pero sus recursos/revisión siguen
  pendientes; un fixture no acredita integración institucional final.
- **007**: catálogo y estados de publicación/activación, identificadores y recursos válidos;
  verificar propagación hacia web pública sin exponer borradores ni datos de administración.
- **005 / P01**: Instagram oficial compartido y verificado.
- **P01**: imágenes, audios, guiones/transcripciones y nueve explicaciones recibidas/validadas.
- **P03**: identificación explícita de recreaciones educativas, revisión del relato de Juan y de todos los textos
  sensibles a hechos/capacidades; no redactar hechos nuevos para dar por validado un ejercicio.
- **009/011/P04**: privacidad, accesibilidad, recursos de marca/fuente/colores y fidelidad.
  Contraste objetivo 4.5:1 normal y 3:1 grande/componentes; controles aproximadamente 44 px.
- Pendientes de material y otros destinos no impiden diseño/pruebas independientes con fixtures
  inequívocos; sí impiden certificar publicación, fidelidad o recorridos integrados afectados.

## Trazabilidad y verificación

| ID original | Requisito local | Escenarios | Fuente | Estado de aplicación |
|---|---|---|---|---|
| H01 | FR-001 | US1.1, US1.2 | PDF 2 | Contrato verificado; cierre integrado pendiente |
| H02 | FR-002 | US1.3–US1.5 | PDF 2 / C11 | Contrato verificado; cierre integrado pendiente |
| H03 | FR-003 | US1.3, US2.1/4 | PDF 2 | Contrato verificado; cierre integrado pendiente |
| H04 | FR-004 | US1.3, US2.1/4 | PDF 2 / P03 | Contrato verificado; cierre integrado pendiente |
| H05 | FR-005 | US1.3, US2.1/4 | PDF 2 | Contrato verificado; cierre integrado pendiente |
| H06 | FR-006 | US2.1–US2.4 | PDF 2 | Contrato verificado; cierre integrado pendiente |
| H07 | FR-007 | US3.1–US3.3/5/6 | PDF 2 / C05/C08/C09 | Contrato verificado; cierre integrado pendiente |
| H08 | FR-008 | US3.1–US3.6 | PDF 2 | Contrato verificado; cierre integrado pendiente |
| H09 | FR-009 | US3.1–US3.6 | PDF 2 | Contrato verificado; cierre integrado pendiente |
| H10 | FR-010 | US4.1 | PDF 2 | Contrato verificado; cierre integrado pendiente |
| H11 | FR-011 | US4.2 | PDF 2 | Contrato verificado; cierre integrado pendiente |
| H12 | FR-012 | US4.3, US4.4 | PDF 2 / C16 | Contrato verificado; cierre integrado pendiente |

### Registro documental

2026-10-16 — `/speckit-specify 003`: escenarios concretos para catálogo, audio, reflexión
local y continuación de aprendizaje; H01–H12 conservados. No se aprobaron materiales,
explicaciones o URLs pendientes ni se implementó código. Ver checklists/requirements.md.

2026-10-16 — `$speckit-clarify 003`: revisión de alcance, entidades y estados, recorridos,
accesibilidad/privacidad, dependencias, errores, restricciones, terminología y aceptación.
No se detectaron ambigüedades críticas que requieran preguntas (0 formuladas/0 respondidas).
Los materiales y nueve explicaciones, Instagram oficial y validación editorial siguen
pendientes; la obtención/actualización del catálogo de 007 se resolverá en planificación.
Checklist revalidado: 16/16 → 16/16, sin cambios de estado. Solo se actualizó este registro;
no se aprobaron recursos ni se ejecutaron pruebas de aplicación. Lista para planificación
independiente, con los bloqueos de publicación e integración ya documentados.

2026-10-17 — `$speckit-implement 003`: componentes, consumidor de catálogo y banco
contractual verificados; 30/35 tareas completas. Evidencia en evidence/summary.md.
Recursos oficiales, revisión editorial, navegadores adicionales y aceptación integrada
permanecen pendientes. Sin backend007, promesas de publicación ni cambios de alcance.

## Reanudación — 2026-10-26

Marca, fuente y paleta compartidas recibidas desde001 e incorporadas a003. Las seis imágenes aportadas se identifican por nombre/destino en [evidence/materials.md](evidence/materials.md); sus archivos originales todavía no están disponibles en el entorno/GitHub. No se marcan verificadas ni se inventan dimensiones. Se conserva el bloqueo de imágenes propias/editorial/Instagram y aceptación integrada. Carpeta GitHub `public/images/stories/` preparada para recibir los PNG.

2026-10-26 — Archivos de las seis imágenes recibidos en6e7f523 y conectados con dimensiones/procedencia verificadas. Tres ilustraciones de bloques y tres portadas por ID inicial, sin alterar publicación/estados007. Los avisos anteriores de falta de archivos son históricos. Audios: carpeta fuente content/stories/audio/ preparada en GitHub; revisar transcripciones/explicaciones antes de publicar. [Evidencia](evidence/connected-images.md).

Decisión vigente 2026-10-28: audios identificados por la responsable como recreaciones educativas. Ajustar títulos, descripciones y metodología para expresarlo; retirar auditorías y recursos continuos no acreditados, usando el alcance educativo aprobado en Inicio. No aprueba ejercicios ni publicación del catálogo.

## Aprobación editorial aplicada — 2026-10-28

La responsable respondió «Sí, apruebo los textos públicos corregidos» para hero, metodología, cierre, identidad, catálogo y pasos Escucha/Reflexiona/Aplica. Se registraron cinco snapshots inmutables en src/content/stories-review.json, con referencia a evidence/public-copy-review.md; el guard sigue invalidando modificaciones materiales. No se aprobaron ejercicios ni se importaron/publicaron historias.

Verificación: 45/45 pruebas Node Inicio/Historias, guard003 salida 0 y Astro check (95 archivos, 0 errores/advertencias, 1 hint previo). Integración real002: 18/18 aprobadas, seis recorridos por motor Chromium/Firefox/WebKit. Historias HTTP200; /api/public/historias HTTP404: el catálogo007 aún no está conectado al servidor local. Captura .test-output/stories-approved.png. Build completo conserva salida1 en guard010/009.

La navegación desde Inicio ya está verificada; T027/T031 de002 mantienen el requisito residual de build completo, y T028 el cierre integral: 30/33 tareas. No se confunde renderizado de Historias con disponibilidad del catálogo, aprobación de ejercicios ni publicación productiva. Logs: .test-output/stories-approved-unit.log, stories-approved-check.log, home-approved-integration.log y home-approved-build.log.

Conexión007 vigente — 2026-10-28: /api/public/historias ya responde200 con SQLite real en el servidor local. No hay publicaciones activas; la UI muestra vacío confirmado.6/6 pruebas navegador aprobadas. [Detalles y límites](../007-gestion-historias/local-connection.md). Los registros anteriores de catálogo404 son históricos.

## Publicación local vigente — 2026-10-28

Cuatro historias autorizadas/publicadas/activas en catálogo007 real, incluido Número desconocido con portada oficial reutilizada expresamente aprobada. Tres recorridos navegador completos aprobados, audios/transcripciones/doce explicaciones y expansión verificados; no mocks. Publicación local no equivale a despliegueFirebase ni cierra revisión manual/build productivo. [Registro](evidence/local-publication.md). Los estados anteriores de catálogo vacío o fichas sin publicación son históricos.

## Acceso a la cuarta historia — 2026-10-28

La responsable solicita hacer visible el botón para la cuarta historia. Situar el control Ver más historias después de las tres tarjetas iniciales. Al expandir, conservar tarjetas y selecciones existentes, añadir pendientes sin duplicar y enfocar/mostrar el título de la primera historia añadida. Ocultar el control tras añadir todas las adicionales; exponer relación aria-controls/aria-expanded. Con tres o menos se conserva el comportamiento previo sin añadir tarjetas.
