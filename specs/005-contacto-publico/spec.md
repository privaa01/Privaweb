# Feature Specification: Contacto y recepción privada de consultas

**Feature Directory**: `specs/005-contacto-publico`
**Created**: 2026-10-16
**Updated**: 2026-10-17
**Status**: Implementación local parcial verificada (44/49 tareas); entrega productiva pendiente de T044–T048. Véase [evidence.md](evidence.md).
**Input**: `/speckit-specify 005`: desarrollar la feature existente, sin ampliar el alcance.
**Fuentes**: [SPEC R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), C01–C07, PDF 4 y
[constitución 1.0.0](../../.specify/memory/constitution.md), especialmente CONST-05/06/08–10.

## Clarifications

### Session 2026-10-17

- Q: Si se pierde la confirmación de un envío y no sabemos si quedó guardado, ¿cómo debe permitir el formulario continuar? → A: Mantener los datos originales sin editar mientras se reintenta. Para escribir otra consulta, usar una acción explícita que advierta que la anterior podría estar guardada (opción A).

## User Scenarios & Testing

### User Story 1 — Encontrar cómo contactar y entender el uso de los datos (Priority: P1)

Como visitante, quiero encontrar el canal de Contacto y comprender qué ocurrirá con mis datos
para decidir qué compartir sin confundir una consulta privada con una publicación.

**Why this priority**: El formulario solicita datos personales; sus condiciones y el canal
alternativo deben ser claros antes de enviar información.

**Independent Test**: Recorrer hero, Instagram y aviso con materiales de prueba identificados,
sin enviar consultas; comprobar los textos aprobados, el destino #escribir y las condiciones
para mostrar las afirmaciones de privacidad.

**Acceptance Scenarios**:

1. **Dado** Contacto abierto, **cuando** consulto el hero, **entonces** encuentro ESTAMOS AQUÍ
   PARA TI, título Contáctanos, invitación e imagen según PDF 4, con Respuesta por correo
   electrónico y Deja tu consulta en el formulario como indicadores informativos. No se
   promete respuesta en menos de 24 horas ni se presentan indicadores como canales activos. (C01/C02)
2. **Dado** la tarjeta Instagram y su URL oficial verificada, **cuando** consulto sus temas o
   activo Ir a Instagram, **entonces** encuentro anti-phishing, contraseñas, móviles y brechas,
   y llego a la misma cuenta oficial enlazada desde Historias; no una cuenta inventada ni un #. (C03)
3. **Dado** Contacto Seguro del footer o /contacto.html#escribir, **cuando** activo el enlace,
   entro directamente o recargo, **entonces** llego al formulario con su encabezado visible
   y foco de destino coherente con la navegación compartida. (C04; integración 001)
4. **Dado** el formulario antes del envío, **cuando** leo su aviso, **entonces** conozco que
   nombre/alias, correo y mensaje se guardan para consulta privada del equipo autorizado;
   la respuesta por correo y su registro corresponden al flujo privado, no a publicación web.
   Se explica conservación de 90 días desde última actividad y solicitud anticipada de
   eliminación por un canal real verificado, sin promesa de borrado inmediato de copias. (C07)
5. **Dado** cualquier envío posible, **cuando** reviso la advertencia previa, **entonces**
   veo que no debo incluir contraseñas, códigos, datos bancarios ni información sensible
   o de otras personas; usar alias no exige nombre legal ni significa anonimato del correo. (C04/C07)
6. **Dado** el bloque final, **cuando** lo consulto, **entonces** encuentro Respondemos al correo
   que indiques y Puedes usar un alias. Cero rastreo publicitario y Sin cookies de rastreo
   solo se muestran con verificación vigente de la web y sus proveedores; no se extiende
   esa afirmación al servicio externo de Instagram. (C02/C07)

### User Story 2 — Enviar una consulta que quede guardada en privado (Priority: P1)

Como visitante, quiero enviar una consulta con mi alias y correo para que el equipo pueda
consultarla en privado y responderme por el canal indicado.

**Why this priority**: Guardar la consulta es la operación principal; un éxito visual sin
persistencia dejaría a la persona esperando una respuesta a un mensaje inexistente.

**Independent Test**: Enviar datos de prueba válidos a persistencia real de un entorno de prueba,
comprobar lectura autorizada del registro y su estado Pendiente, y contrastar la confirmación.
No requiere haber enviado una respuesta por correo ni completar la UI administrativa de 008.

**Acceptance Scenarios**:

1. **Dado** alias, correo y mensaje válidos, **cuando** envío, **entonces** se guardan los tres
   valores y la recepción como una nueva consulta Pendiente para el equipo autorizado;
   solo después de guardado confirmado veo el éxito. (C04/C06)
2. **Dado** un seudónimo válido, **cuando** envío sin mi nombre legal, **entonces** se acepta
   con las mismas reglas, sin registro de cuenta, prueba de identidad ni campos extra. (C04)
3. **Dado** un envío en curso, **cuando** pulso de nuevo Enviar mensaje o repito Enter,
   **entonces** no inicio consultas duplicadas; el estado Enviando es visible y anunciado,
   y no muestra éxito mientras se desconoce el guardado. (C05/C06)
4. **Dado** una consulta guardada, **cuando** se confirma al visitante, **entonces** no se
   afirma que el equipo ya respondió ni que se entregó o leyó un correo; el estado privado
   sigue Pendiente hasta la respuesta real del flujo 008. (C06/C07)
5. **Dado** consultas existentes, **cuando** una persona sin autorización intenta consultarlas
   desde páginas, recursos o accesos públicos, **entonces** no obtiene mensajes, correos,
   alias ni respuestas ajenas. El formulario público permite recepción, no lectura pública. (C06)

### User Story 3 — Corregir los datos antes de enviar (Priority: P2)

Como visitante, quiero saber qué dato debo corregir para enviar mi consulta sin perder lo
que ya escribí ni aportar información innecesaria.

**Why this priority**: Los límites deben ser consistentes y accesibles, incluso si alguien
omite la validación de la página.

**Independent Test**: Probar las fronteras de alias y mensaje, formatos de correo y envío
inválido directo; comprobar errores de campo sin guardar registros inválidos.

**Acceptance Scenarios**:

1. **Dado** cualquiera de los tres campos vacío o con solo espacios, **cuando** intento enviar,
   **entonces** se rechaza el valor, aparece un error asociado al campo y no se guarda una
   consulta inválida. Nombre o alias también es obligatorio aunque el PDF no lo marque con *. (C04/C05)
2. **Dado** alias con 0/1/60/61 caracteres tras recortar extremos, **cuando** valido, **entonces**
   solo 1 y 60 pasan el límite; el mensaje análogamente acepta 1 y 1500, rechaza 0 y 1501.
   Espacios internos se conservan y no se corrige silenciosamente el contenido para hacerlo válido. (C04/C05)
3. **Dado** correo vacío o con formato inválido, **cuando** envío, **entonces** se muestra
   error asociado y no se guarda; un formato válido no se presenta como prueba de que el
   buzón existe, de identidad legal ni de recepción garantizada de futuras respuestas. (C05)
4. **Dado** errores en uno o más campos, **cuando** se informa del rechazo, **entonces**
   etiquetas y mensajes son visibles, la persona puede localizar el primer campo inválido
   con teclado/tecnología de asistencia y conserva los valores para corregirlos; el color
   o el placeholder no son la única indicación. (C04/C05)
5. **Dado** datos inválidos enviados sin pasar por la validación de la página, **cuando**
   llegan al punto de recepción, **entonces** se aplican de nuevo las mismas reglas y no
   se persisten; ocultar o deshabilitar un control no reemplaza la validación del servidor. (C05/C06)
6. **Dado** una corrección de campos, **cuando** vuelvo a enviar valores válidos, **entonces**
   se evalúan los valores actuales sin reutilizar mensajes de error o éxitos que correspondan
   a datos anteriores. (C05/C06)

### User Story 4 — Recuperarse de errores y resultados desconocidos (Priority: P2)

Como visitante, quiero reintentar una consulta cuando falla la conexión o el guardado para
no perder mi mensaje ni generar copias involuntarias.

**Why this priority**: Una respuesta perdida puede ocurrir después de guardar; la interfaz y
la persistencia deben distinguir ese caso de un fallo confirmado sin simular éxito.

**Independent Test**: Provocar rechazo antes de guardar, fallo de persistencia y pérdida de
respuesta después de guardar; reintentar el mismo envío y comprobar los registros reales.

**Acceptance Scenarios**:

1. **Dado** un fallo confirmado de guardado, **cuando** termina el intento, **entonces** veo
   un error comprensible, conservo alias/correo/mensaje en el formulario y puedo reintentar,
   sin indicación de mensaje guardado ni borrado anticipado de campos. (C05/C06)
2. **Dado** que no llega una confirmación fiable, **cuando** el resultado es desconocido,
   **entonces** se comunica la incertidumbre sin afirmar guardado ni fallo definitivo;
   se conservan los datos originales sin edición y el reintento usa esa misma solicitud,
   sin crear consultas adicionales. (C06)
3. **Dado** que el primer intento sí guardó pero su respuesta se perdió, **cuando** reintento
   esa misma solicitud, **entonces** se confirma el registro existente y hay una sola consulta
   Pendiente, no dos mensajes iguales. (C06)
4. **Dado** respuestas demoradas o envíos repetidos concurrentes de la misma solicitud,
   **cuando** se resuelve el guardado, **entonces** no se crean duplicados ni se aplica una
   confirmación antigua a una nueva consulta. Mientras el resultado sea desconocido, los
   datos del intento original no se editan. (C05/C06)
5. **Dado** que falla el servicio de recepción o todavía no está configurado, **cuando** se
   intenta enviar, **entonces** no hay éxito de demostración, guardado solo visual o mensaje
   descartado en silencio; se informa indisponibilidad/error y se preservan los valores. (C06)
6. **Dado** un envío con resultado desconocido, **cuando** decido escribir otra consulta,
   **entonces** debo usar una acción explícita y se me advierte que la anterior podría estar
   guardada. La nueva consulta es independiente; no se presenta la anterior como cancelada
   ni se aplica su confirmación tardía al nuevo formulario. (C05/C06)

### Edge Cases

- Una consulta con alias de prueba y un mensaje de un carácter puede ser válida si cumple
  los otros campos; no inventar longitud mínima de contenido, nombre legal ni preguntas extra.
- Alias con tildes y otros caracteres de un seudónimo no se rechazan por no parecer un nombre
  real. Probar límites también con texto no ASCII, sin confundir caracteres con tamaño en bytes.
- Texto que parezca código se trata como contenido, nunca se ejecuta ni se usa como marcado
  en confirmaciones o futuras vistas privadas. No copiar mensajes crudos del servicio a errores públicos.
- Reintentar una misma solicitud es distinto de enviar deliberadamente una consulta nueva;
  no descartar para siempre mensajes legítimos solo porque compartan correo o contenido.
- Mientras el resultado sea desconocido, mantener los datos originales sin edición para
  reintentar esa misma solicitud. Para redactar otra consulta, ofrecer una acción explícita
  con advertencia de que la anterior podría estar guardada; no tratarla como cancelación.
  Aislar confirmaciones tardías del intento anterior. El plan define la correlación técnica,
  sin convertirla en seguimiento del visitante.
- Un fallo mantiene valores mientras el formulario sigue abierto; no añadir guardado persistente
  de borradores en el navegador, URL o enlaces de recuperación pública como función nueva.
- Si falta Instagram oficial, imagen, aviso revisado o canal real de eliminación, el bloque o
  cierre correspondiente sigue pendiente. No usar #, políticas ficticias ni capturas como aprobación.
- No mostrar rastreo cero como hecho si su verificación falta o queda invalidada por cambios.
  Conservar los indicadores aprobados sin reinstalar las promesas retiradas del PDF.
- Si falla una imagen, el formulario, avisos y texto disponible siguen accesibles; falta de
  recurso oficial impide cerrar fidelidad, no justifica inventar o eliminar el bloque.
- En móvil Instagram precede al formulario. Anclas, campos, errores y mensajes de estado
  siguen utilizables con teclado y texto al 200%, sin recortes ni desbordamiento impeditivo.

## Requirements

### Functional Requirements

- **FR-001 / C01 — Hero Contacto e imagen**: Etiqueta Estamos aquí para ti, título e invitación conservados
- **FR-002 / C02 — Indicadores del hero de Contacto**: Respuesta por correo electrónico y Deja tu consulta en el formulario como indicadores informativos; Cero rastreo publicitario solo tras verificación técnica de web y proveedores (C18/C21/C22).
- **FR-003 / C03 — Tarjeta Instagram**: Descripción, cuatro temas: anti-phishing, contraseñas, móviles, brechas; Ir a Instagram abre URL oficial
- **FR-004 / C04 — Formulario de Contacto**: Nombre o alias, correo y mensaje obligatorios; aceptar seudónimo sin exigir nombre real; alias 1–60 y mensaje 1–1500 tras recortar extremos; etiquetas visibles (C24/C25).
- **FR-005 / C05 — Validación y carga de Contacto**: Cliente/servidor: rechazar vacíos/solo espacios, correo inválido, alias mayor de 60 y mensaje mayor de 1500; errores asociados; bloquear doble envío; probar fronteras 0/1/60/61 y 0/1/1500/1501.
- **FR-006 / C06 — Guardado y estados de Contacto**: Persistir nombre/alias, correo y comentario; confirmar éxito solo con guardado real; nuevo comentario Pendiente en bandeja privada; fallo conserva valores y reintento sin duplicados (C02/C03/C28).
- **FR-007 / C07 — Bloque final y aviso de Contacto**: Respondemos al correo que indiques y Puedes usar un alias; Sin cookies de rastreo solo tras verificación; aviso explica almacenamiento, respuesta privada por correo y 90 días; borrador pendiente de completar/revisar (C19/C20/C22/C29/C32).

### Reglas que precisan los requisitos

**Composición PDF 4**: encabezado compartido → hero con imagen/indicadores → tarjeta Instagram
izquierda y formulario derecha → bloque final y aviso correspondiente → footer compartido.
En móvil se apilan manteniendo Instagram antes del formulario. El aviso y la advertencia
sobre datos sensibles son accesibles antes de activar Enviar mensaje, no solo después del éxito.

**Campos y normalización**:

| Campo | Obligatorio | Condición de aceptación |
|---|---|---|
| Nombre o alias | Sí | 1–60 caracteres tras recortar extremos; se acepta seudónimo |
| Correo electrónico | Sí | No vacío/solo espacios y formato válido tras recortar extremos |
| Mensaje | Sí | 1–1500 caracteres tras recortar extremos |

Conservar espacios internos; no truncar silenciosamente alias/mensaje ni reemplazar datos.
Las mismas reglas rigen en la página y en servidor. No se pide identidad legal, contraseña,
cuenta, documento, archivo adjunto, consentimiento adicional inventado ni registro de visitantes.
La forma de contabilizar caracteres consistentemente y la validación técnica del correo se
concretan en el plan; deben conservar las fronteras y la aceptación de seudónimos no ASCII.

**Estados de envío**: preparado/inválido → enviando → guardado confirmado, error confirmado
sin guardado o resultado desconocido. Invalidación no persiste; Enviando impide doble envío;
confirmado exige persistencia real. Error/desconocido preservan valores y permiten recuperación.
Un resultado desconocido no se renombra éxito por recibir una respuesta genérica o simular una espera.
No descartar campos antes de confirmación ni revelar contenido privado en errores.
Ante resultado desconocido, los datos originales no se editan; Reintentar conserva el envío.
Redactar otra consulta requiere una acción explícita con aviso de posible guardado anterior,
sin confirmación falsa de cancelación. Tras error confirmado sin guardado se permite corregir
los valores y volver a validar antes de enviar.

**Solicitud y consulta**: cada envío lógico aceptado genera una consulta privada Pendiente.
Doble clic, concurrencia o reintento del mismo intento no la duplican. El mecanismo técnico,
correlación con los valores enviados y recuperación ante respuesta perdida corresponden al plan.
No confundir la deduplicación de reintentos con prohibir nuevas consultas de igual contenido.
La prueba de guardado requiere lectura autorizada de persistencia real, no solo un cambio visual.

**Privacidad y límites de responsabilidad**: 005 recibe y guarda; 006/008 restringen lectura y
respuesta administrativa; 009 define/verifica conservación, eliminación y ausencia de rastreo;
010 completa/revisa documentos informativos. Recepción guarda fecha y estado inicial necesarios
para esos flujos, sin asignar aquí proveedor, esquema o periodicidad de borrado. Nadie accede a
una bandeja pública por usar el formulario; las respuestas y los datos nunca se publican.

La conservación aprobada es 90 días desde última actividad, con eliminación anticipada.
El criterio operativo propuesto de recepción/respuesta aceptada, canal/verificación de solicitudes,
proveedores y tratamiento de buzones/respaldos siguen pendientes de 009/P02. Leer o un envío
fallido no justifican ampliar el plazo. No se aplica este plazo a cuentas, historias o logs.
La recepción puede probarse sin haber enviado una respuesta por correo; el cierre de las
promesas de tratamiento exige operación/aviso verificados con 009/010. Un formulario con aviso
ficticio no se presenta listo para recoger datos reales.

**Textos y afirmaciones**: hero conserva Respuesta por correo electrónico y Deja tu consulta
en el formulario; cierre conserva Respondemos al correo que indiques y Puedes usar un alias.
Respuesta en menos de 24h, Canales cifrados como indicador, 100% Confidencial y Servidores en
jurisdicción estricta no se reintroducen. Esto no elimina el requisito de transporte seguro.

Cero rastreo publicitario y Sin cookies de rastreo solo aparecen tras verificación técnica
vigente de navegación, audio, formulario, administración y proveedores aplicables. Documentar
cookies necesarias si existen; no prometer que Instagram carezca de rastreo. El párrafo
absoluto “Nunca vendemos, rastreamos ni compartimos…” del dibujo no se aprueba por conservar
la composición: contenido final y avisos requieren P03, sin declaraciones no comprobadas.

**Destinos**:

| Control/destino | Referencia | Responsable |
|---|---|---|
| Contacto | /contacto.html | 005 |
| Formulario / Contacto Seguro | /contacto.html#escribir | 005 ofrece sección; 001 enlaza |
| DESCARGAR APP del encabezado | /app.html#descarga | Integración 001/004 |
| Ir a Instagram | URL oficial compartida con Historias | 005/P01; configuración única ya prevista en 003 |
| Manifiesto de Datos desde aviso | /manifiesto-datos.html | 010 |
| Solicitud de eliminación anticipada | Canal real pendiente de definir/verificar | 009/P02 |

Rutas son contratos, no prueba de disponibilidad. No seleccionar una cuenta Instagram, dirección
de eliminación ni URL de servicio por inferencia. No se fija en este spec endpoint o proveedor.

### Key Entities

- **Consulta privada**: identificador estable, nombre/alias, correo, mensaje, recepción y estado
  inicial Pendiente; solo el equipo autorizado consulta el contenido. Respondido depende de 008.
- **Datos de formulario**: tres campos obligatorios, valores actuales, errores asociados y estado
  de envío; se preservan ante fallo, sin borrador persistente nuevo ni cuenta de visitante.
- **Intento de envío**: solicitud lógica con datos asociados y resultado confirmado/error/desconocido;
  permite correlacionar respuestas/reintentos sin duplicar registros ni rastrear a la persona.
- **Aviso revisado**: datos/usos/acceso privado/respuesta/conservación/eliminación/advertencia,
  referencia de aprobación y destinos reales; no equivale a certificación legal.
- **Afirmación de privacidad**: texto condicionado a evidencia técnica vigente y ámbito comprobado.
- **Contenido/recursos de Contacto**: hero, imagen, indicadores, temasInstagram, bloque final,
  marca y enlaces oficiales; recepción/revisión pendientes se distinguen de recursos finales.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Hero, tarjeta Instagram, formulario, aviso y cierre conservan composición/orden del
  PDF 4 con los cuatro reemplazos editoriales aprobados. #escribir admite enlace de footer,
  visita directa/recarga con título visible; CTA a App e Instagram cumplen sus destinos reales.
- **SC-002**: Pruebas de alias 0/1/60/61 y mensaje 0/1/1500/1501 tras recortar extremos, vacíos/
  solo espacios y correos válidos/inválidos producen los mismos resultados en página y servidor;
  ningún dato inválido se guarda. Se conserva texto interno y se acepta alias sin identidad legal.
- **SC-003**: Una consulta válida crea exactamente un registro Pendiente con alias/correo/mensaje
  y recepción correctos, comprobado con lectura autorizada; éxito solo tras guardado real.
  Acceso público no obtiene mensajes, datos personales ni respuestas de la bandeja privada.
- **SC-004**: Doble envío/concurrencia/reintento de una misma solicitud, incluido guardado con
  respuesta perdida, producen como máximo una consulta; error/desconocido preservan campos y
  no muestran éxito ficticio ni confirman datos distintos con una respuesta antigua. En estado
  desconocido no se editan datos originales; iniciar otra consulta requiere acción explícita
  con advertencia de posible guardado previo y aislamiento de confirmaciones tardías.
- **SC-005**: Aviso y advertencia se encuentran antes del envío; describen consulta/guardado
  privado, respuesta por correo y su registro, 90 días desde última actividad y eliminación
  anticipada con canal verificado. No se publican garantías de respuesta, rastreo o borrado
  no comprobadas; la confirmación no equivale a correo entregado/leído.
- **SC-006**: En 360/390/430/768/1024/1280/1440 px y texto 100%/200%, Instagram precede al
  formulario en móvil; campos, errores y estados son legibles/anunciados y operables con teclado,
  sin recortes, scroll horizontal o trampas de foco. Contraste 4.5:1 normal/3:1 grande/componentes
  y controles de aproximadamente 44 px, conforme a 011.
- **SC-007**: Recursos, URLs, avisos y afirmaciones finales cuentan con revisión/evidencia real.
  Pruebas de recepción/persistencia, lectura privada y fallos usan un servicio real de prueba;
  mocks solo acreditan contrato de interfaz, sin certificar guardado, seguridad o conservación.

Son criterios para la implementación; no representan pruebas ejecutadas ahora.

## Assumptions

- “005” selecciona el directorio existente y conserva C01–C07/FR-001–FR-007. Este comando
  especifica sin código, nuevas features o cambios de rama Git.
- Prioridades organizan los recorridos sin excluir requisitos aprobados.
- Correo válido se refiere a formato, no a verificación del buzón ni identidad; no se añade
  un flujo de verificación de correo, cuenta, CAPTCHA externo o servicio de respuesta automática.
- Los reintentos no deben duplicar consultas; la estrategia técnica y sus límites operativos
  se resolverán en el plan manteniendo los resultados observables, sin elegir proveedor aquí.
- No hay publicación comunitaria, comentarios por historia, puntuaciones, respuesta garantizada,
  chat, bandeja pública ni formularios de registro/lista de espera.
- Los escenarios locales no reconstruyen los 195 criterios históricos del documento 07 ausente.

## Dependencias y condiciones de cierre

- **001/004**: layout/navegación/footer, #escribir y destino App; componentes existentes no
  sustituyen la prueba de Contacto real integrado.
- **003/P01**: URL oficial Instagram compartida; todavía no verificada, no se inventa para cerrar.
- **P01/P04/011**: imagen, marca, fuente/paleta, alternativas y fidelidad; recursos pendientes no
  se aprueban como placeholders de entrega.
- **P02**: persistencia y datos operativos del servicio; falta impide certificar recepción real,
  aunque el banco de formulario y contrato pueden avanzar con pruebas identificadas.
- **006/008**: acceso autorizado y lectura/respuesta privada. 005 exige demostrar guardado y
  protección de lectura con un medio autorizado de prueba sin exigir completar la UI de bandeja
  o enviar un correo para aceptar la recepción. CT01 integral se verifica en 008.
- **009/P02**: conservación/eliminación, canal/procedimiento y copias/respaldos; afirmaciones de
  ausencia de rastreo requieren revisión de la operación y proveedores reales. Sin esa evidencia
  los reclamos siguen pendientes; no se reinstalan promesas del wireframe.
- **010/P03**: aviso completado/revisado y Manifiesto real; no recoger datos reales con un aviso
  de borrador o destinos pendientes presentados como finales.
- Trabajo independiente con fixtures no acredita backend, entrega de correo, retención,
  seguridad, enlaces oficiales ni fidelidad. Cada parte conserva su bloqueo hasta comprobarse.

## Trazabilidad y verificación

| ID original | Requisito local | Escenarios | Fuente | Estado de aplicación |
|---|---|---|---|---|
| C01 | FR-001 | US1.1 | PDF 4 | No ejecutado |
| C02 | FR-002 | US1.1/6 | PDF 4 / C18/C21/C22 | No ejecutado |
| C03 | FR-003 | US1.2 | PDF 4 | No ejecutado |
| C04 | FR-004 | US1.3/5; US2.1/2; US3.1/2/4 | PDF 4 / C24/C25 | No ejecutado |
| C05 | FR-005 | US2.3; US3.1–US3.6; US4.1/4 | PDF 4 | No ejecutado |
| C06 | FR-006 | US2.1–US2.5; US3.5/6; US4.1–US4.6 | C02/C03/C28 | No ejecutado |
| C07 | FR-007 | US1.4–US1.6; US2.4 | PDF 4 / C19/C20/C22/C29/C32 | No ejecutado |

### Registro documental

2026-10-17 — `/speckit-specify 005`: cuatro historias con recepción privada, validación,
recuperación ante resultado desconocido y privacidad previa al envío. C01–C07 conservados;
backend/datos operativos, aviso, recursos y destinos siguen pendientes. No se implementó código
ni se ejecutaron pruebas de aplicación o aprobaron proveedores/textos/URLs.

2026-10-17 — `$speckit-clarify 005`: una pregunta formulada/respondida, opción A.
Se aclaró el recorrido ante resultado desconocido: datos originales sin edición para reintento,
nueva consulta por acción explícita con advertencia y confirmaciones aisladas. Actualizados
Clarifications, US4, Edge Cases, estados de envío, SC-004 y trazabilidad de C06.
Checklist revalidado: 16/16 → 16/16, sin cambios de estado. P01/P02/P03/P04 y condiciones
operativas/privacidad siguen pendientes; no se implementó código ni se ejecutaron pruebas.


2026-10-17 — `$speckit-implement 005`: página/componentes, validación compartida, receptor Node,
SQLite real y ledger, estados/errores y opción A implementados en bancos locales. 66 pruebas
Node y 43 de navegador de 005 pasan; regresión separada: 115 Node y 128 navegador. Esto no
cierra aceptación integrada: navegadores adicionales, materiales/revisión manual, P02/009/010,
integración y build final siguen pendientes. Detalle y trazabilidad en evidence.md/tasks.md.
