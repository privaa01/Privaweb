# Feature Specification: Documentos informativos y recuperación 404

**Feature Directory**: `specs/010-documentos-recuperacion`
**Created**: 2026-10-16
**Updated**: 2026-10-27
**Status**: Implementado/verificado localmente de forma parcial (33/44 tareas); cierre integrado, revisión de textos y operación pendientes. Véase `evidence.md`; no acredita publicación o aprobación legal.
**Input**: `/speckit-specify 010`, desarrollando la feature existente sin ampliar su alcance.
**Fuente**: [SPEC original R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), X03/C32; [constitución](../../.specify/memory/constitution.md), CONST-01–10/12; decisiones vigentes de [009](../009-privacidad-conservacion/spec.md).

## Alcance

Permitir consultar las condiciones del servicio y el tratamiento real de datos antes de enviar una consulta, y continuar la navegación al encontrar una dirección pública inexistente. Incluye Términos de Servicio, Manifiesto de Datos, aviso junto al formulario, recuperación 404 y comprobación de los destinos y anclas de X03.

**Fuera de alcance**: inventar responsable, jurisdicción, licencias, proveedores o textos aprobados; crear registro público, casilla obligatoria de aceptación, pantalla de autoservicio de eliminación, gestor editorial de documentos o nuevo procedimiento de recuperación de contraseña. La recuperación aquí es de navegación, no la recuperación de cuentas de 006 ni la restauración de datos de 009. No sustituye la implementación de retención, correo, autorización o accesibilidad transversal de sus features responsables.

## Clarifications

### Session 2026-10-20

Revisión mediante `$speckit-clarify 010`: no se detectaron ambigüedades críticas que requieran nuevas decisiones de producto; cero preguntas formuladas y cero respuestas atribuidas a la usuaria. Se mantienen las decisiones ya aprobadas de 009, las rutas de 001 y los límites de C32.

Se revisaron alcance, entidades y estados, recorridos, accesibilidad, privacidad, dependencias, errores, restricciones, terminología y criterios de cierre. P02/P03 son datos y evidencias pendientes expresamente identificados, no valores que puedan deducirse de esta revisión. Su ausencia bloquea las partes dependientes y la publicación; no impide planificar el trabajo independiente. Las elecciones de alojamiento y mecanismo de entrega de 404 corresponden al plan, conservando el resultado público exigido en R-06.

## User Scenarios & Testing

### User Story 1 — Consultar información del servicio (Priority: P1)

Como visitante, quiero consultar Términos y Manifiesto sin iniciar sesión, para entender qué ofrece Priva y cómo trata mis datos.

**Why this priority**: Evita decisiones basadas en condiciones incompletas o promesas que la operación no respalda.

**Independent Test**: Abrir ambos documentos por dirección directa y desde el footer de las cuatro páginas públicas; cotejar su contenido con la fuente y con la operación revisada. El material sintético permite revisar el recorrido, pero no aprobar contenido oficial.

**Acceptance Scenarios**:

1. **Dado** documentos revisados, **cuando** se abren desde cada footer o por dirección directa, **entonces** se accede sin cuenta al documento identificado y a una salida a Inicio.
2. **Dado** Términos, **cuando** se leen las condiciones, **entonces** explican el fin educativo sin garantías de evitar incidentes, la App como prototipo, las funciones previstas, las descargas condicionadas a enlaces oficiales y la ausencia de registro público.
3. **Dado** Manifiesto, **cuando** se consulta el tratamiento, **entonces** identifica datos, finalidades, acceso del equipo autorizado, proveedores y destinatarios, ubicación comprobada, responsable, contacto y canal de solicitudes; distingue las políticas de Contacto de las de otras categorías.
4. **Dado** las decisiones de 009, **cuando** se revisan conservación y eliminación, **entonces** el texto explica última actividad, vencimiento, solicitud anticipada y copias según R-04/R-05, sin equiparar aceptación de correo con recepción o lectura.
5. **Dado** ejercicios educativos y servicios externos, **cuando** se consulta el Manifiesto, **entonces** distingue ejercicios locales sin envío ni persistencia, cookies necesarias comprobadas y tratamiento externo; las afirmaciones de ausencia de rastreo requieren evidencia integrada.
6. **Dado** un dato operativo pendiente o una discrepancia con la operación, **cuando** se evalúa la publicación, **entonces** el texto queda sin aprobación para publicar y el faltante se registra; no se reemplaza por identidad, fecha, licencia o promesa inventadas.

### User Story 2 — Entender el formulario antes de enviar (Priority: P1)

Como persona que quiere enviar una consulta, quiero leer un aviso junto al formulario y acceder al Manifiesto, para decidir qué compartir y conocer su conservación.

**Why this priority**: La información debe estar disponible antes de que la persona entregue sus datos.

**Independent Test**: Visitar Contacto sin enviar datos; leer el aviso y seguir su enlace al Manifiesto utilizando teclado. Comparar los compromisos de los tres textos sin depender de un envío real.

**Acceptance Scenarios**:

1. **Dado** el formulario sin completar, **cuando** se consulta el aviso antes de enviar, **entonces** se informa que alias o nombre, correo y mensaje son obligatorios, se admite seudónimo y no se exige identidad legal.
2. **Dado** el aviso, **cuando** se lee el destino de los datos, **entonces** explica su guardado para consulta privada del equipo y respuesta por correo, la conservación de respuestas asociadas y que mensajes y respuestas no se publican; no niega acceso técnico de proveedores cuando exista.
3. **Dado** el aviso, **cuando** se leen conservación y precauciones, **entonces** aparecen 90 días desde última actividad, posibilidad de eliminación anticipada por canal verificado y advertencia de no enviar contraseñas, códigos, datos bancarios, documentos ni información sensible o de terceros.
4. **Dado** el aviso y Manifiesto revisados, **cuando** se abre el enlace informativo, **entonces** lleva al Manifiesto completo, permite volver a Contacto y no obliga a aceptar una casilla nueva, registrarse o enviar el formulario para leerlo.
5. **Dado** cambios en la política o en la operación, **cuando** se revisan aviso, Términos y Manifiesto, **entonces** los tres mantienen los mismos compromisos aplicables; una contradicción impide aprobar la publicación.

### User Story 3 — Recuperarse de una ruta pública inexistente (Priority: P2)

Como visitante que abre una dirección inexistente, quiero reconocer el error y encontrar una salida válida, para continuar en Priva sin quedar bloqueado.

**Why this priority**: Recupera el recorrido cuando un enlace está incompleto, escrito incorrectamente o ya no existe.

**Independent Test**: Abrir direcciones públicas inexistentes de un nivel y anidadas, reconocer el error y volver a Inicio mediante teclado; comprobar por separado los cuatro destinos con ancla.

**Acceptance Scenarios**:

1. **Dado** una ruta pública inexistente, **cuando** se solicita directamente o se recarga, **entonces** se muestra un mensaje identificable de página no encontrada con estado de respuesta 404, sin presentar una página válida ni un éxito ficticio.
2. **Dado** la página de error, **cuando** se activa su salida a Inicio, **entonces** se llega a `/index.html` sin bucles; visitar `/404.html` permite el mismo recorrido visual de recuperación.
3. **Dado** los destinos de X03, **cuando** se siguen, **entonces** se alcanza la sección identificada de Historias, App o Contacto según la tabla R-07, con encabezado visible y navegación por teclado utilizable.
4. **Dado** una dirección que contiene texto sensible o caracteres especiales, **cuando** se muestra el error, **entonces** no se reproduce la dirección completa ni información privada en el mensaje y el texto recibido no se interpreta como contenido ejecutable.
5. **Dado** una lectura o acción privada sin autorización, **cuando** falla el acceso, **entonces** se conservan las reglas de 006/008/009; esta recuperación pública no revela registros ni sustituye sus respuestas de seguridad.

### Edge Cases

- Acceso directo y recarga de documentos; error público anidado y enlaces desde las cuatro páginas. Una página existente con ancla ausente es un destino roto, no un recorrido aprobado.
- Falta de responsable, canal, vigencia, permisos, ubicación o ciclos externos: dependencia editorial abierta, sin publicar corchetes, correos ficticios o borradores como finales.
- Nueva aceptación de respuesta cerca del vencimiento, aceptación comprobada tarde y comprobante repetido: los textos siguen la fecha original y no prometen prolongaciones por lectura, fallo o repetición.
- Solicitud anticipada cerca del vencimiento: rige el límite anterior; la promesa operativa no se extiende automáticamente a buzones, proveedores o respaldos.
- Cookies necesarias frente a rastreo; enlace externo a Instagram frente a contenido alojado por Priva; prototipo frente a una descarga realmente habilitada.
- QR sin destino aprobado, enlace vacío, `#` aislado o `#maria`: no aprobar como destino funcional ni sustituirlo por una URL inventada.
- Textos largos, teclado, foco visible, lector de pantalla y texto al 200%: mantener legibilidad y salida utilizable sin pérdida de contenido.

## Requirements

### Functional Requirements

- **FR-001 / X03 — Auxiliares y documentos informativos**: Términos/Manifiesto/aviso completos y revisados antes de publicar, 404 recuperable y anclas #casos/#como-funciona/#descarga/#escribir; sin #maria; QR solo con destino aprobado (C32).

### Reglas y contenido complementario

Las reglas siguientes desarrollan X03; no crean IDs originales nuevos ni reasignan responsabilidades de otras features.

- **R-01 — Acceso y orientación**: ofrecer Términos en `/terminos.html` y Manifiesto en `/manifiesto-datos.html`, coherentes con 001. Identificar cada documento por título, usar secciones comprensibles y permitir volver a Inicio. El aviso de Contacto debe estar junto al formulario y disponible antes de enviar, con enlace al Manifiesto y regreso a Contacto.
- **R-02 — Términos**: desarrollar el borrador C32 con finalidad educativa, límites sin garantías, condiciones reales del prototipo y descargas, ejercicios sin persistencia, Contacto privado sin plazo de respuesta garantizado, administración restringida sin registro público y enlaces externos identificados. Completar responsable/contacto, fecha de vigencia y titularidad/permisos y condiciones aplicables mediante revisión; no deducirlos del nombre del proyecto o de la fecha del spec.
- **R-03 — Manifiesto y aviso**: cubrir datos obligatorios de Contacto, finalidad, guardado, acceso autorizado, respuesta privada asociada, ausencia de publicación, precauciones, responsable, canal, proveedores/destinatarios, ubicación y condiciones comprobadas. Explicar ejercicios locales sin envío ni persistencia y las cookies necesarias verificadas. Cuentas administrativas, historias y registros de seguridad requieren su descripción y política propia revisada; no heredan los 90 días de Contacto.
- **R-04 — Conservación fiel a 009**: explicar 90 días desde la recepción inicial o la aceptación original comprobada de una nueva respuesta por el servicio de correo, lo que ocurra después. Lecturas, borradores, fallos, resultado desconocido, repetición de confirmaciones y correo de verificación de eliminación no reinician el plazo. Al vencer se bloquean acceso ordinario y nuevos envíos; se revisan vencimientos al menos cada hora y se completa el borrado operativo como máximo una hora después del vencimiento. Publicar esos compromisos exige su calificación real en 009; el objetivo técnico interno de 15 minutos no es una promesa pública nueva.
- **R-05 — Solicitud y copias**: explicar el canal oficial verificado y la comprobación de control del correo guardado mediante enlace o código de un solo uso, sin pedir documentos de identidad. El borrado operativo se completa como máximo 24 horas después de confirmación válida, o antes si lo exige el límite de conservación; no prometer ese plazo desde la primera solicitud ni como plazo general de respuesta de Contacto. Distinguir datos operativos, proveedores, buzones y respaldos con sus ciclos y límites comprobados; no prometer retirada de correos enviados, eliminación inmediata total ni éxito cuando existen fallos o actuaciones pendientes.
- **R-06 — Recuperación pública**: mostrar página no encontrada ante una ruta pública inexistente, con estado de respuesta 404 y salida visible a Inicio. `/404.html` es la ruta auxiliar de presentación; su acceso directo no reemplaza la comprobación de rutas inexistentes. No redirigir silenciosamente errores a una página de éxito, generar bucles, reflejar direcciones completas potencialmente sensibles ni exponer datos o detalles privados. Preservar autorización y errores privados de sus features responsables.
- **R-07 — Destinos comprobados**: comprobar los destinos de la tabla, también por teclado y con el encabezado de destino visible. No crear `#maria`, enlaces vacíos o `#` como sustitutos. Si un QR forma parte del material aprobado, su destino requiere aprobación y comprobación del enlace y de su lectura antes de publicarse; esta feature no obliga a crear un QR ni decide su URL.

| Destino de X03 | Página y ancla | Responsable de la sección |
| --- | --- | --- |
| Casos | `/historias.html#casos` | 003 |
| Cómo funciona | `/app.html#como-funciona` | 004 |
| Descarga | `/app.html#descarga` | 004 |
| Escribir | `/contacto.html#escribir` | 005 |

- **R-08 — Revisión previa a publicación**: contrastar los tres textos con C32, decisiones vigentes, inventario y comprobaciones de 009 y condiciones de las features relacionadas. Registrar fecha, alcance, responsable de revisión, resultado y evidencia para cada texto y afirmación técnica. No aprobar publicación con marcadores, datos operativos ausentes o contradicciones. «Cero rastreo publicitario» y «Sin cookies de rastreo» requieren comprobación de web e integraciones; no equivalen a ausencia de toda cookie o certificación legal.
- **R-09 — Lectura accesible**: mantener jerarquía de encabezados, enlaces descriptivos, foco visible y operación por teclado; identificar la página y el error para tecnologías de asistencia. Comprobar los anchos 360, 390, 430, 768, 1024, 1280 y 1440 px y texto al 200%, sin cortes o desbordamiento que impidan leer o recuperar el recorrido, conforme a 011.

### Key Entities

- **Documento informativo**: Términos o Manifiesto, con título, contenido, vigencia revisada, responsable/contacto verificado y estado de revisión. No implica un nuevo sistema de edición o historial público.
- **Aviso de Contacto**: información previa al envío, compromisos de tratamiento y enlace al Manifiesto; debe concordar con ambos documentos y la operación.
- **Destino de recuperación**: página válida y, cuando corresponda, sección identificada; aprobación adicional si es destino de QR.
- **Revisión editorial y operativa**: fecha, alcance, responsable, resultado y evidencia de los textos y afirmaciones; distingue pendiente, conforme y discrepancia sin incluir datos privados en evidencias.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Los dos documentos se consultan sin cuenta por dirección directa y desde las cuatro páginas públicas: 10 recorridos completados, con salida válida a Inicio y cero enlaces rotos (US1.1, R-01).
- **SC-002**: El 100% de los contenidos obligatorios de R-02–05 figura en el texto correspondiente y coincide entre Términos, Manifiesto y aviso; cero campos pendientes, marcadores o contradicciones en una versión aprobada para publicar (US1.2–6, US2.1–5).
- **SC-003**: Una persona puede leer el aviso y abrir Manifiesto antes de enviar datos, mediante teclado y sin cuenta ni aceptación adicional; completa el recorrido y vuelve a Contacto en todos los casos de aceptación de US2 (R-01/03/09).
- **SC-004**: El 100% de las rutas públicas inexistentes del conjunto de prueba, incluyendo rutas anidadas y recargas, presenta estado 404 y permite llegar a Inicio; cero bucles, falsas páginas de éxito o exposiciones privadas (US3.1/2/4/5, R-06).
- **SC-005**: Los cuatro destinos de la tabla llegan a su sección con encabezado visible y uso por teclado; cero enlaces vacíos o a `#maria`. Todo QR incluido cuenta con destino aprobado y lectura comprobada, o se registra como pendiente sin aprobar su publicación (US3.3, R-07).
- **SC-006**: Los documentos, aviso y recuperación permiten leer y completar sus recorridos en los siete anchos definidos y con texto al 200%, con cero bloqueos de teclado o contenido imprescindible cortado (US1–3, R-09).
- **SC-007**: El 100% de los textos y afirmaciones operativas propuestos para publicación dispone de revisión fechada y evidencia correspondiente; ningún resultado local, dependencia abierta o incumplimiento se presenta como calificación productiva o certificación legal (US1.6/US2.5, R-08).

## Assumptions

- **A1 — Continuidad**: las rutas ya establecidas en 001 y el contenido base C32 se conservan; los textos finales se redactarán y revisarán a partir de esa base, sin considerar aprobado el borrador original.
- **A2 — Presentación mínima revisable**: los documentos serán públicos en español; la 404 ofrecerá al menos salida a Inicio. No se añaden buscador, formulario de error, QR nuevo ni funciones editoriales por inferencia.
- **A3 — Dependencias operativas**: se incorporan las cuatro decisiones de conservación y eliminación ya elegidas en 009. Su implementación local no acredita el canal, proveedores, copias, ausencia de rastreo o ejecución productiva. El contenido público necesita evidencia real antes de aprobarse.
- **A4 — Alcance documental**: esta fase especifica resultados y criterios; no publica textos, aprueba condiciones legales ni ejecuta pruebas de aplicación. La revisión de preparación documental es distinta del cumplimiento de SC-001–007.

## Pendientes y condiciones de cierre

- **P02**: identificar y verificar responsable/contacto, canal y atención previa a confirmar eliminación, proveedores/destinatarios/remitente/buzones, ubicación y condiciones reales, ciclos de copias y políticas de cuentas/historias/registros. No elegir valores ficticios para completar el Manifiesto.
- **P03**: completar y revisar los tres textos finales, vigencia y titularidad/permisos y condiciones aplicables; la fecha de esta especificación no es la fecha de vigencia de los Términos.
- **Integración**: [001](../001-navegacion-global/spec.md) aporta navegación/footer; [003](../003-historias-educativas/spec.md), [004](../004-presentacion-app/spec.md) y [005](../005-contacto-publico/spec.md) aportan contenido y secciones; [006](../006-acceso-administrativo/spec.md)/[008](../008-bandeja-respuestas/spec.md) condicionan cuentas, cookies y respuesta; [009](../009-privacidad-conservacion/spec.md) y su [revisión de avisos](../009-privacidad-conservacion/notices-review.md) condicionan compromisos; [011](../011-accesibilidad-fidelidad/spec.md) verifica calidad transversal. Corregir cualquier discrepancia antes de publicar, sin que el código existente cambie el requisito.
- El trabajo documental y los recorridos independientes pueden avanzar; la publicación y cierre integrado requieren todos los datos, revisión y evidencias aplicables. Registrar cada dependencia o prueba bloqueada como tal, nunca como cumplimiento.

## Trazabilidad y verificación

| ID original | Requisito local | Desarrollo | Escenarios | Resultado esperado | Estado |
| --- | --- | --- | --- | --- | --- |
| X03 (Derivado técnico, C32) | FR-001 | R-01–05/08/09 | US1.1–6, US2.1–5 | SC-001–003/006/007: documentos y aviso completos, coherentes y accesibles | Implementado localmente; revisión final/operación pendientes |
| X03 (Derivado técnico, C32) | FR-001 | R-06/07/09 | US3.1–5 | SC-004–006: recuperación y destinos válidos | Verificado en contrato local; entrega real y WebKit pendientes |

Los IDs US/R/SC son locales de esta feature. Los documentos históricos 02–07 no están aportados: no se inventan HU/CA/TSK ni evidencia de ejecución. Plan, tareas y pruebas completarán la cadena de X03 en sus fases correspondientes.

## Decisiones y borrador del MVP — 2026-10-27

La responsable elige Firebase para alojamiento web, difiere correo productivo y mantiene correo en modo de prueba sin proveedor. La etapa MVP no resuelve acceso ni copias. Se revisan Ley 1581 de 2012/Decreto 1377 de 2013 aportados y su compilación en Decreto1074. Se registran proveedor y estado de pruebas en el borrador; se añade marco colombiano y derechos al Manifiesto. No se aprueban textos/vigencia ni se califica privacidad; X03 mantiene los criterios de cierre. [Decisiones, fuentes y pendientes concretos](mvp-decisions-2026-10-27.md).

2026-10-27 — Confirmación de la responsable: MVP de Contacto solo con datos ficticios de prueba. Se añade esta limitación a Términos y Manifiesto en revisión. Sin proveedor de correo real ni recepción de consultas reales; se mantienen controles y condiciones de cierre productivo para una etapa posterior.
