# Feature Specification: Bandeja privada y respuestas por correo

**Feature Directory**: `specs/008-bandeja-respuestas`
**Feature Branch**: `main` (directorio independiente de la rama; no se crea una nueva).
**Created**: 2026-10-16
**Updated**: 2026-10-19
**Status**: Implementación y verificación local; cierre integrado pendiente. Ver [evidence.md](evidence.md).
**Input**: `/speckit-specify 008`: desarrollar la funcionalidad existente sin ampliar su alcance.
**Fuente**: [SPEC original R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), AD07, AD08, AD09, AD11 y CT01; [constitución](../../.specify/memory/constitution.md).

## Alcance

El equipo autorizado consulta los mensajes recibidos exclusivamente por Contacto, redacta una
respuesta al correo guardado y conserva la asociación e historial privados. La consulta cambia de
Pendiente a Respondido únicamente al comprobar aceptación real del servicio de correo.
Aceptación, recepción en buzón y lectura son hechos distintos.

**Incluye**: filtros Pendiente/Respondido, listado y detalle privados, contadores reales,
composición, validación, confirmación del envío, conservación del texto ante fallo y resolución de
resultados inciertos sin duplicados; integración con acceso 006, recepción 005 y conservación 009.

**Fuera de alcance**: comentarios públicos, Aprobar/Aprobados, asociación a historias o casos,
formularios de comentarios en Historias, estadísticas de ejercicios, registro de visitantes,
nuevos roles, destinatarios editables, copias a terceros, adjuntos, campañas, conversaciones
entrantes por correo y garantías de respuesta en 24 horas, entrega o lectura. No crea una
consola de eliminación ni sustituye la operación transversal de 009.

La captura administrativa conserva jerarquía y estilo. La sustitución de comentarios públicos por
Contacto privado es la diferencia aprobada C28. Los detalles de composición no dibujados son
diseño derivado P04 y deberán identificarse así, sin atribuirlos al wireframe.

## Clarifications

### Session 2026-10-19

- Q: ¿Una consulta que ya está Respondida debe permitir enviar otra respuesta desde el panel? → A: Sí (opción A). Permitir otra respuesta tras revisar el historial vigente y resolver cualquier envío pendiente de confirmación; cada respuesta aceptada se conserva asociada a la misma consulta.

## User Scenarios & Testing

### User Story 1 — Consultar y filtrar consultas privadas (Priority: P1)

Como persona administradora autorizada, quiero ver las consultas de Contacto y su estado para
identificar a quién responder sin publicar datos personales.

**Why this priority**: Hace utilizable la recepción 005 y es requisito para responder al registro correcto.

**Independent Test**: Preparar consultas sintéticas Pendiente/Respondido mediante recepción 005 y
comprobar listado, detalle, filtros y denegación sin sesión, sin necesitar un proveedor de correo.

**Acceptance Scenarios**:

1. **Dado** un mensaje guardado desde Contacto, **cuando** abro Pendiente con sesión válida,
   **entonces** encuentro una única consulta con alias, correo, mensaje y estado correspondientes. (AD07/AD11)
2. **Dado** consultas de ambos estados, **cuando** cambio de filtro y abro un detalle,
   **entonces** el listado corresponde al filtro y el detalle mantiene identidad y datos del registro elegido. (AD07)
3. **Dado** cero consultas o un filtro sin coincidencias, **cuando** termina la carga,
   **entonces** veo un estado vacío y contadores cero reales; un fallo de carga se comunica como error,
   con reintento, sin presentarse como cero ni mostrar cifras de la captura. (AD07)
4. **Dado** nuevas consultas o cambios confirmados de estado, **cuando** actualizo la bandeja,
   **entonces** sus totales corresponden a consultas conservadas: responder mueve una entre estados,
   sin aumentar el total; el resumen compartido 007 coincide con ese total. (AD07; AD03 de007)
5. **Dado** acceso directo sin sesión, expirada, cerrada o revocada, **cuando** solicito listado,
   detalle, historial o envío, **entonces** se deniega sin revelar datos ni ejecutar una nueva respuesta. (AD07/AD09; 006)
6. **Dado** cambio rápido de consulta/filtro o pérdida de sesión, **cuando** llega una carga antigua,
   **entonces** no reemplaza el registro actual ni vuelve a mostrar datos privados tras perder acceso. (AD07; 006)

### User Story 2 — Redactar y enviar una respuesta asociada (Priority: P1)

Como persona administradora autorizada, quiero responder al correo de una consulta desde el panel
para atenderla y conservar lo que se envió con un estado verificable.

**Why this priority**: Completa el servicio prometido en Contacto y evita confundir guardado con envío.

**Independent Test**: Abrir una consulta sintética y usar un servicio de prueba identificado con
aceptación/rechazo controlados; verificar destinatario, contenido, historial y estado persistidos.
La recepción en un buzón real se comprueba por separado en US4.

**Acceptance Scenarios**:

1. **Dado** una consulta seleccionada, **cuando** inicio la composición, **entonces** veo el alias,
   mensaje y correo destinatario guardados; no puedo sustituir ese correo ni elegir una historia. (AD09/AD11)
2. **Dado** una respuesta vacía o solo espacios, **cuando** intento enviarla,
   **entonces** el envío no se ejecuta y el error queda asociado al campo conservando lo escrito. (AD09)
3. **Dado** un texto válido, **cuando** solicito el envío, **entonces** se informa de la operación
   en curso y no se afirma Respondido por redactar, pulsar Enviar o guardar un intento. (AD08/AD09)
4. **Dado** aceptación real comprobada, **cuando** consulto el resultado y recargo,
   **entonces** la respuesta exacta queda asociada a su consulta, con fecha de aceptación,
   y esta figura como Respondido; no se etiqueta Entregado ni Leído. (AD08/AD09)
5. **Dado** una consulta respondida y su historial, **cuando** lo abro desde otra sesión autorizada,
   **entonces** veo las respuestas aceptadas sin alterarlas ni mezclarlas con otra consulta;
   el destinatario corresponde al correo almacenado. Puedo enviar otra respuesta deliberada solo
   tras revisar ese historial y resolver cualquier envío pendiente de confirmación; se añade al
   mismo historial sin reemplazar respuestas anteriores y la consulta sigue Respondida. (AD09; Q1)
6. **Dado** contenido con signos o apariencia de instrucciones, **cuando** se visualiza o envía,
   **entonces** se trata como texto, sin ejecutar acciones ni introducir destinatarios adicionales. (AD09; 009)

### User Story 3 — Resolver fallos y resultados inciertos sin duplicar (Priority: P1)

Como persona administradora autorizada, quiero conservar mi respuesta y conocer el resultado
real de un intento para recuperarme de fallos sin mandar correos repetidos.

**Why this priority**: Un falso éxito o un reenvío involuntario afecta datos personales y confianza.

**Independent Test**: Provocar rechazo, pérdida de confirmación, reinicio y concurrencia en consultas
sintéticas; contar aceptaciones del servicio y verificar resultados durables desde otra sesión.

**Acceptance Scenarios**:

1. **Dado** una consulta Pendiente, **cuando** el servicio rechaza definitivamente el envío,
   **entonces** permanece Pendiente, se informa del fallo y el texto se conserva para corregir o reintentar. (AD08/AD09)
2. **Dado** doble clic o solicitudes concurrentes del mismo intento, **cuando** se procesan,
   **entonces** generan como máximo una aceptación y una respuesta asociada, sin dos correos. (AD08/CT01)
3. **Dado** desconexión o espera agotada sin resultado comprobado, **cuando** consulto el intento,
   **entonces** aparece como resultado pendiente de confirmar, conserva su texto y no afirma éxito
   ni permite reenviar a ciegas el mismo intento. (AD08/AD09)
4. **Dado** aceptación del servicio seguida de pérdida de confirmación o fallo de guardado local,
   **cuando** se recupera el proceso, **entonces** se reconcilia esa misma respuesta sin reenviarla;
   hasta comprobar y conservar el resultado no se presenta un Respondido confirmado. (AD08/AD09/CT01)
5. **Dado** un fallo demostrado sin aceptación previa, **cuando** reintento explícitamente,
   **entonces** se usa el texto conservado y solo una aceptación permite confirmar Respondido. (AD08)
6. **Dado** otra persona administradora respondiendo la misma consulta, **cuando** intento enviar
   desde una vista anterior, **entonces** se detecta el cambio y debo revisar el estado vigente antes
   de enviar otra respuesta; no se despacha automáticamente una respuesta desactualizada. (AD08/AD09)
7. **Dado** sesión perdida durante la composición o con envío iniciado, **cuando** vuelvo a entrar,
   **entonces** no se envía automáticamente el texto anterior; cualquier intento ya iniciado se
   comprueba sin duplicarlo y no se expone el texto en la pantalla pública de acceso. (AD09; 006)
8. **Dado** que no se puede comprobar una aceptación incierta, **cuando** persiste el problema,
   **entonces** se mantiene la incertidumbre explícita sin reenvío automático ni botón que eluda
   la protección; el caso queda bloqueado hasta una resolución verificable. (AD08/CT01)

### User Story 4 — Verificar el recorrido completo y su privacidad (Priority: P2)

Como responsable de Priva, quiero comprobar desde el formulario hasta el buzón y la eliminación
para saber qué parte del servicio funciona realmente antes de darlo por entregado.

**Why this priority**: La integración y el correo real requieren evidencia distinta a una demostración local.

**Independent Test**: Enviar una consulta sintética a un buzón controlado, consultarla con una cuenta
individual, responder y verificar cada hito, además de la política009 mediante fechas controladas.
No exige materiales oficiales de historias y nunca utiliza mensajes reales en evidencias.

**Acceptance Scenarios**:

1. **Dado** una consulta nueva enviada por Contacto, **cuando** se confirma su guardado,
   **entonces** aparece una vez como Pendiente en la bandeja y no se afirma que se haya enviado un correo. (AD11/CT01)
2. **Dado** la consulta y un buzón de prueba controlado, **cuando** respondo,
   **entonces** registro por separado aceptación del servicio, asociación persistida, cambio de estado
   y recepción efectiva en el buzón correcto; la aceptación sola no acredita recepción ni lectura. (CT01)
3. **Dado** operaciones de Historias o ejercicios locales, **cuando** las uso y recargo,
   **entonces** no crean consultas, respuestas ni contadores de actividad educativa en esta bandeja. (AD11)
4. **Dado** una consulta vencida o una eliminación anticipada autorizada conforme 009,
   **cuando** se aplica el procedimiento, **entonces** consulta, datos y respuestas dejan de estar
   disponibles en bandeja, detalle y contadores, sin que un intento antiguo los recree o envíe de nuevo. (CT01; 009)
5. **Dado** lectura, intento fallido o reintento del mismo resultado ya aceptado, **cuando** se
   calcula conservación, **entonces** esas acciones no prolongan el plazo; se aplica la política009
   con recepción inicial o nueva aceptación, sin usar el momento de relectura como nueva actividad. (CT01; 009)
6. **Dado** una restauración o un envío en curso durante una eliminación, **cuando** se recupera
   el sistema, **entonces** no reaparecen registros vencidos ni se programan nuevos envíos de registros
   eliminados; se documentan por separado aceptaciones previas y límites reales de buzones/copias. (CT01; 009)

### Edge Cases

- Mensajes con alias seudónimo, límites válidos de 005, saltos de línea, acentos y contenido que
  parece código: conservar texto y asociación, sin interpretarlo como instrucciones.
- Una consulta eliminada mientras se abre o responde: no mostrar una consulta vacía como éxito
  ni reutilizar su identificación para otro destinatario; informar indisponibilidad y actualizar totales.
- Error de listado, detalle o contadores: no confundir error con vacío/cero; reintento explícito.
- Correo ya aceptado que después rebota: Respondido describe la aceptación, no recepción;
  no reenviar automáticamente ni afirmar lectura. Gestión de rebotes entrantes queda fuera de alcance.
- Repetir o recibir tarde una confirmación: no duplicar historial, cambiar otra consulta o reiniciar retención.
- Intento desconocido: no tratarlo como fallo seguro. Sin reconciliación verificable no se permite
  repetirlo como una respuesta nueva para sortear la prevención de duplicados.
- Navegar con texto sin enviar: advertir antes de descartarlo. No prometer recuperación tras cerrar
  pestaña ni guardar mensajes privados en almacenamiento persistente del navegador.
- Cierre de sesión tiene prioridad sobre conservar texto en pantalla. No se conserva texto privado
  de una cuenta para mostrarlo a otra ni se repite el envío al volver a autenticarse.
- Operación por teclado, mensajes de error/estado anunciados y ampliación al 200%: sin pérdida
  de contenido, foco o acceso al destinatario, editor y acción de envío.

## Requirements

### Functional Requirements

- **FR-001 / AD07 — Bandeja privada de Contacto**: Consultar comentarios Pendiente/Respondido con nombre/alias, correo y mensaje; sin comentarios públicos ni aprobación para publicar; filtros/listado privados, contadores reales (C28).
- **FR-002 / AD08 — Estado Pendiente → Respondido**: Transición solo tras aceptación real del servicio de correo; fallo conserva Pendiente y texto para reintento; sin duplicados. Sustituye acción de aprobación pública de captura (C28).
- **FR-003 / AD09 — Redactar y conservar respuesta**: Administrador responde desde panel al correo almacenado correcto; conservar respuesta enviada asociada al comentario; acceso privado y error/reintento; no prometer entrega/lectura por mera aceptación (C04/C28).
- **FR-004 / AD11 — Origen de comentarios y alcance público**: Comentarios entran únicamente por Contacto y son privados; sin formulario de comentarios en Historias; sus ejercicios son locales sin guardado. Captura con comentarios por caso queda registrada como diferencia aprobada (C28).
- **FR-005 / CT01 — Flujo completo de Contacto**: Enviar comentario → guardado → consulta privada → respuesta por correo guardada → Respondido tras aceptación de servicio; verificar recepción aparte, errores y reintento sin duplicados; aplicar retención y eliminación.

### Reglas y contenido complementario

**R-01 — Consulta y filtros (FR-001/FR-004)**: El listado y detalle solo incluyen consultas
persistidas de Contacto y sus respuestas. Se ofrecen Pendiente y Respondido; no hace falta un
filtro adicional para cumplir el alcance. Orden propuesto: recepción más reciente primero,
desempate estable. Totales cuentan consultas, no envíos ni intentos. Una consulta no respondida
es Pendiente; una consulta con al menos una respuesta aceptada es Respondido. Carga, vacío,
error e indisponibilidad son estados diferenciados. Leer no cambia el estado.

**R-02 — Destinatario y composición (FR-003)**: Destinatario fijado al correo guardado por 005,
visible antes de enviar, sin copias/adjuntos. Texto no vacío tras recortar extremos, preservando
saltos y espacios internos. El [plan](plan.md) fija el límite técnico de respuesta en 5000 puntos de código Unicode
tras recortar extremos, con pruebas de fronteras pendientes;
no reutilizar silenciosamente el límite del mensaje público como requisito de respuesta.
El texto pendiente se mantiene ante error mientras la sesión siga autorizada. No se incorpora
un sistema nuevo de borradores sincronizados entre dispositivos.

**R-03 — Estados y evidencias (FR-002/FR-003)**: Separar estado de consulta y resultado del
intento: en curso, fallo confirmado, incierto y aceptado. Solo una aceptación comprobada y su
respuesta guardada permiten confirmar Respondido. Ningún estado visual, simulación o ausencia
de error constituye aceptación. Fecha registrada corresponde a la aceptación real, no a su
reconciliación tardía. Un fallo de una respuesta adicional no borra respuestas previas ni devuelve
una consulta Respondida a Pendiente.

**R-04 — Reintentos y concurrencia (FR-002/FR-005)**: Una misma intención repetida conserva
su identidad y contenido y no genera otro envío. No basta bloquear el botón: también se verifica
ante concurrencia, reinicio y pérdida de confirmación. La incertidumbre no habilita un nuevo
intento equivalente. Conforme a Q1, una consulta Respondida permite otra respuesta deliberada
solo tras resolver todos los envíos pendientes de confirmación y revisar explícitamente el historial vigente; la detección de cambios evita dos respuestas inadvertidas desde vistas antiguas.
La capacidad de comprobar envíos inciertos sin duplicarlos es condición de elección del servicio;
su mecanismo y la recuperación durable corresponden al plan, sin prometer una garantía inexistente.

**R-05 — Privacidad y autorización (FR-001/FR-003/FR-004)**: Reutilizar cuentas individuales y
único permiso 006; comprobar autorización vigente en cada lectura y modificación. Datos, texto,
historial y resultados no se incluyen en páginas públicas, direcciones compartibles, archivos públicos,
registros de diagnóstico ni evidencias con contenido real. El contenido se muestra como texto;
no se introducen recursos de seguimiento en correos ni nuevos identificadores de visitantes.

**R-06 — Conservación e integración (FR-005)**: Aplicar 90 días desde última actividad y solicitud
anticipada conforme 009. Para diseñar integración se usa recepción inicial o nueva respuesta aceptada,
lo posterior; leer, redactar, fallar o reconocer de nuevo una aceptación no reinicia. La confirmación
operativa de este criterio, frecuencia, canal y copias pertenece a 009/P02 y bloquea el cierre integrado.
La eliminación debe coordinar consulta, respuesta, intentos y 005 para impedir recreación por reintento;
no prometer retirar mensajes ya aceptados por el proveedor ni borrar buzones/copias inmediatamente.

**R-07 — Presentación accesible (FR-001/FR-003)**: Mantener navegación privada y estilo del panel,
con etiquetas visibles, foco, teclado, errores asociados y confirmaciones anunciadas. Probar 360,
390,430,768,1024,1280 y 1440 px y texto 200%. El diseño preciso es derivado P04; no incluye cifras 128,
+12 hoy, categorías por historia ni acciones de aprobación de la captura.

### Key Entities

- **Consulta privada**: identidad estable, nombre/alias, correo y mensaje recibidos por 005,
  fecha de recepción, estado derivado de respuestas aceptadas y última actividad conforme 009.
- **Respuesta asociada**: texto, consulta y destinatario guardado, fecha de aceptación y cuenta
  autorizada responsable; una aceptación es inmutable y no demuestra recepción o lectura.
- **Intento de respuesta**: identidad de una intención, contenido/destino asociados, resultado
  verificable y prueba de aceptación cuando existe; permite reconciliar sin crear otro envío.
- **Resumen privado**: totales de consultas conservadas por estado y total general, derivados de
  los mismos registros que el listado y compartidos con007 sin exponer datos en público.

## Success Criteria

### Measurable Outcomes

- **SC-001**: En 100% de las pruebas de filtros/detalle, cada consulta aparece en el estado
  correspondiente, sin mezcla de registros; totales coinciden con la fuente conservada y 007.
- **SC-002**: En 100% de las pruebas de respuesta, el destinatario y texto aceptados corresponden
  a la consulta elegida y el historial persiste al recargar; cero falsos Respondido y cero afirmaciones
  de entrega/lectura basadas solo en aceptación.
- **SC-003**: Doble acción, concurrencia, reinicio y pérdida de confirmación del mismo intento
  producen como máximo una aceptación y una respuesta guardada; 100% de fallos confirmados
  conservan texto durante la sesión autorizada y 100% de inciertos evitan reenvío a ciegas.
- **SC-004**: Cero lecturas o envíos nuevos autorizados sin sesión vigente en la matriz de
  acceso directo, expiración, revocación, cierre y cambio de cuenta; cero datos privados en público.
- **SC-005**: En un conjunto de 1000 consultas sintéticas, 95% de aperturas de listado/filtro/detalle
  finalizan en 2 segundos o menos en el entorno de referencia documentado. La espera de correo
  muestra estado en curso antes de confirmar y comunica incertidumbre si no conoce el resultado.
- **SC-006**: Los recorridos de consulta, composición, error y recuperación son utilizables con
  teclado y texto 200% en los siete anchos indicados, sin controles inaccesibles ni texto cortado.
- **SC-007**: CT01 tiene evidencia separada de guardado público, lectura privada, aceptación,
  asociación durable, recepción en buzón controlado, error/reintento y eliminación conforme 009.
  Ninguna de esas evidencias se sustituye por una simulación de la otra.
- **SC-008**: Los cinco requisitos originales y 26 escenarios locales se enlazan con pruebas y
  evidencia o bloqueo explícito antes del cierre. Un bloqueo no cuenta como criterio aprobado.

## Assumptions

- Se conserva el alcance R35 y los cinco FR originales literalmente. US1–US4, sus prioridades,
  reglas R y métricas son elaboración local; no inventan IDs del catálogo histórico 07 ausente.
- Consultar una consulta no implica responderla. Por defecto, se propone más reciente primero;
  no se añaden búsqueda, asignación a personas, archivo, edición del correo ni automatización de respuestas.
- Q1 confirma respuestas adicionales deliberadas en consultas Respondidas, condicionadas a
  revisar el historial y resolver envíos inciertos; es una decisión de la usuaria registrada en
  Clarifications, no un supuesto pendiente ni una función dibujada en el wireframe. No añade chat.
- **005** aporta consultas reales Pendiente y protección contra recreación tras eliminar; su acuse
  público no ofrece lectura privada ni información sobre el correo de respuesta.
- **006** aporta acceso individual, sesión y protección por operación. **007** aporta la navegación
  y consume total real; responder no aumenta el número de consultas.
- **009** es responsable de política/canal/procedimiento y tratamiento de copias. **010** informa
  al visitante según operación real. **011** revisa accesibilidad/fidelidad transversal.
- Servicio, remitente y buzón controlado P02 siguen sin elegir. El correo de recuperación006 y
  el correo de respuesta008 tienen finalidades distintas; no se asume que compartirán proveedor.
- La especificación usa el contrato de 005 sin cambiarlo ni hacer público su identificador interno.
  Tests de servicio, diseño de almacenamiento y límites se detallan en el [plan 008](plan.md),
  su [modelo](data-model.md) y [contrato](contracts/inbox.md); su ejecución sigue pendiente.

## Pendientes y condiciones de cierre

- **P02**: proveedor/remitente autorizado, credenciales seguras, comprobación de aceptación e
  incertidumbre, buzón controlado y recepción real. No elegir un proveedor ni inventar una dirección.
- **P04**: diseño de bandeja/composición, estados y límite técnico definidos en el
  [contrato](contracts/inbox.md). Implementación, pruebas y revisión visual/manual pendientes;
  la documentación no acredita fidelidad ni operación real.
- **009/010**: completar procedimiento de conservación/eliminación, última actividad, copias,
  restauración y avisos. No cerrar CT01 sin evidencia conjunta ni prometer eliminación absoluta.
- **P05/011**: entorno de referencia, navegadores, lector de pantalla y revisión visual/manual.
- La implementación y sus pruebas locales están documentadas en [evidence.md](evidence.md);
  no acreditan calificación productiva ni cierre de005/006/007/009/010/011. Materiales,
  configuración externa o comprobaciones no disponibles se registrarán bloqueados, sin éxito ficticio.

## Trazabilidad y verificación

| ID original | Requisito local | Historias y escenarios locales | Criterios de éxito | Estado |
| --- | --- | --- | --- | --- |
| AD07 | FR-001 | US1.1–6 | SC-001/004/005/006/008 | Implementado/verificado local; cierre pendiente |
| AD08 | FR-002 | US2.3–4, US3.1–8 | SC-002/003/008 | Implementado/verificado local; cierre pendiente |
| AD09 | FR-003 | US2.1–6, US3.1/3/4/6/7 | SC-002/003/004/006/008 | Implementado/verificado local; cierre pendiente |
| AD11 | FR-004 | US1.1, US2.1, US4.1/3 | SC-001/004/007/008 | Implementado/verificado local; cierre pendiente |
| CT01 | FR-005 | US3.2/4/8, US4.1–6 | SC-003/007/008 | Parcial local; recepción y operación reales pendientes |

Los escenarios locales desarrollan R35; no sustituyen los 195 criterios del documento 07 ausente.
Los documentos históricos 03/05/06 tampoco se inventan. El [plan](plan.md), sus artefactos de diseño y las [66 tareas locales](tasks.md) están redactados;
el estado de tareas y las evidencias de ejecución local están en [evidence.md](evidence.md); la matriz compartida conserva un único responsable por ID original.
