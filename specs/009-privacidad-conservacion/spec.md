# Feature Specification: Privacidad y ciclo de vida de datos

**Feature Directory**: `specs/009-privacidad-conservacion`
**Created**: 2026-10-16
**Updated**: 2026-10-27
**Status**: Implementación y verificación local; cierre productivo pendienteP02/010/011. Evidencia en [evidence.md](evidence.md).
**Input**: `/speckit-specify 009` sobre la feature existente.
**Fuente**: [SPEC original R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), X02 y decisiones C22/C26/C29; [constitución](../../.specify/memory/constitution.md), CONST-02–06/09–11.

## Alcance

Proteger los datos de Contacto y sus respuestas, aplicar los 90 días desde última actividad y permitir eliminación anticipada. Comprobar acceso privado, ausencia de rastreo publicitario y veracidad de los avisos. Incluye datos operativos, copias bajo control de Priva, proveedores y recuperación del servicio.

**Fuera de alcance**: registro público, nuevos roles, publicación de mensajes, estadísticas educativas, nueva pantalla de autoservicio de eliminación o eliminación definitiva de historias. No extender automáticamente los 90 días a cuentas, historias o registros de seguridad. No prometer borrado inmediato total, retirada de correos ya enviados, ausencia de toda cookie ni certificación legal. No fijar proveedor o canal oficial desconocidos.

## Clarifications

### Session 2026-10-20

- Q: ¿Qué debe reiniciar el plazo de conservación de 90 días de una consulta? → A: Opción A, elegida por la usuaria: contar desde la recepción inicial o la última aceptación de una nueva respuesta por el servicio de correo, lo que ocurra después. Leer, guardar borradores, fallar al enviar o repetir una confirmación no reinicia el plazo; usar la fecha original de aceptación.

- Q: Al cumplirse los 90 días, ¿qué margen máximo permitimos para borrar físicamente los datos operativos de Contacto? → A: Opción A, elegida por la usuaria: revisar vencimientos al menos cada hora y completar el borrado operativo como máximo una hora después del vencimiento. El acceso y los nuevos envíos se bloquean desde el vencimiento; respaldos y proveedores tienen ciclos separados por verificar.

- Q: ¿Cómo debe comprobar Priva que quien solicita una eliminación controla el correo asociado a la consulta? → A: Opción A, elegida por la usuaria: enviar al correo guardado un enlace o código de un solo uso para confirmar la solicitud, sin exigir documentos de identidad.

- Q: ¿En qué plazo máximo deben borrarse los datos operativos después de que la persona confirme su solicitud de eliminación? → A: Opción A, elegida por la usuaria: completar el borrado operativo en un máximo de 24 horas desde la confirmación válida. Los ciclos de respaldos y proveedores se documentan y verifican por separado.

## User Scenarios & Testing

### User Story 1 — Aplicar conservación sin prolongaciones indebidas (Priority: P1)

Como persona que consulta a Priva, quiero que mi conversación deje de conservarse al vencer su plazo, para limitar el uso de mis datos.

**Why this priority**: Es el compromiso de conservación ya aprobado.

**Independent Test**: Preparar consultas sintéticas pendientes y respondidas con actividad conocida y comprobar fronteras temporales, lecturas y envíos.

**Acceptance Scenarios**:

1. **Dado** una consulta sin respuestas, **cuando** se calcula su vencimiento, **entonces** se toma la recepción como actividad inicial y se aplica el plazo de 90 días.
2. **Dado** una consulta pendiente o respondida, **cuando** alcanza su vencimiento, **entonces** deja de estar disponible en consultas, historial y contadores privados y no admite nuevos despachos.
3. **Dado** una consulta vigente, **cuando** se lee, busca o cuenta, se guarda un texto sin enviar, falla un envío o sigue sin confirmación, **entonces** ninguna de esas acciones amplía su plazo.
4. **Dado** una nueva respuesta con aceptación comprobada, **cuando** se confirma su aceptación, **entonces** se actualiza la última actividad con la fecha más reciente entre recepción y aceptación de una nueva respuesta, conservando el momento original de aceptación aunque se compruebe posteriormente.
5. **Dado** una confirmación ya registrada, **cuando** se repite o se recupera tras un fallo, **entonces** no se duplica la respuesta ni se amplía de nuevo el plazo.
6. **Dado** una consulta vencida y una vigente, **cuando** se ejecuta el borrado, **entonces** se eliminan los datos operativos de Contacto, respuestas y datos asociados recuperables de la vencida como máximo una hora después del vencimiento, con revisión al menos horaria, y se conserva la vigente; un fallo queda pendiente y nunca se declara completado.

### User Story 2 — Solicitar eliminación anticipada (Priority: P1)

Como persona que dejó una consulta, quiero solicitar su eliminación antes de los 90 días, para controlar la conservación de mi conversación.

**Why this priority**: El derecho de solicitud forma parte del alcance aprobado.

**Independent Test**: Con consultas sintéticas, seguir el procedimiento de solicitud hasta la verificación, eliminación o rechazo seguro sin crear cuentas de visitantes.

**Acceptance Scenarios**:

1. **Dado** una persona que busca eliminar su consulta, **cuando** consulta el aviso publicado, **entonces** encuentra un canal verificado y las instrucciones correspondientes al procedimiento real.
2. **Dado** una solicitud recibida, **cuando** el equipo autorizado la examina, **entonces** comprueba el control del correo guardado mediante un enlace o código de un solo uso enviado a esa dirección, vinculado al alcance solicitado, antes de eliminar y sin exigir documentos de identidad.
3. **Dado** una solicitud no verificada o ambigua, **cuando** se procesa, **entonces** no se elimina una consulta ajena ni se revela su existencia o contenido a una persona no autorizada.
4. **Dado** una solicitud confirmada válidamente, **cuando** se ejecuta la eliminación, **entonces** se completa el borrado de la consulta, respuestas y datos operativos asociados como máximo 24 horas después de la confirmación; al eliminar, dejan de estar accesibles y no admiten nuevos envíos, y se registra el resultado sin conservar una copia de su contenido.
5. **Dado** una eliminación con copias externas pendientes, **cuando** se comunica su estado, **entonces** se distingue el borrado operativo de las actuaciones pendientes y no se confirma eliminación total.
6. **Dado** la misma solicitud ya resuelta, **cuando** se recibe de nuevo, **entonces** no recrea datos ni provoca acciones duplicadas.

### User Story 3 — Impedir reaparición de datos y coordinar copias (Priority: P1)

Como responsable de Priva, quiero que la eliminación siga siendo efectiva al recuperar el servicio, para no reactivar conversaciones que debían haber desaparecido.

**Why this priority**: Una recuperación no debe anular la política de privacidad.

**Independent Test**: Restaurar una copia sintética con registros vigentes, vencidos y eliminados anticipadamente y comprobar acceso y envío antes de habilitar el servicio.

**Acceptance Scenarios**:

1. **Dado** una copia que contiene consultas vencidas, **cuando** se restaura, **entonces** se excluyen y eliminan antes de permitir consultas privadas o despachos.
2. **Dado** una consulta eliminada anticipadamente que aparece en una copia anterior, **cuando** se recupera el servicio, **entonces** no vuelve a estar disponible ni habilitada para enviar respuestas.
3. **Dado** una eliminación concurrente con una respuesta todavía no iniciada, **cuando** se ejecuta, **entonces** se impide iniciar el envío y se eliminan sus datos asociados.
4. **Dado** un envío autorizado que ya había iniciado su despacho, **cuando** se elimina la consulta, **entonces** no se prometen cancelación o retirada del correo; las confirmaciones tardías no recrean la consulta ni sus respuestas.
5. **Dado** copias en proveedores, buzones y respaldos, **cuando** se verifica el procedimiento, **entonces** cada ubicación tiene responsable, ciclo real, límite temporal y evidencia de eliminación o de restricción hasta su vencimiento.
6. **Dado** una recuperación cuya comprobación de conservación falla, **cuando** se intenta habilitar el servicio, **entonces** se mantiene bloqueado el acceso a los datos afectados y el despacho hasta resolverla.

### User Story 4 — Mantener acceso privado y verificar las afirmaciones (Priority: P1)

Como visitante y persona que consulta, quiero que mis datos permanezcan privados y que los avisos describan el funcionamiento real, para decidir con información comprobable.

**Why this priority**: La conservación no protege si hay filtraciones o promesas falsas.

**Independent Test**: Recorrer navegación, audio, ejercicios, Contacto y administración con datos sintéticos e inspeccionar accesos, contenido, conexiones y almacenamiento.

**Acceptance Scenarios**:

1. **Dado** una operación privada de lectura o modificación, **cuando** se intenta sin autorización vigente o directamente fuera de la interfaz, **entonces** se rechaza sin revelar datos privados.
2. **Dado** datos introducidos por visitantes o administradores, **cuando** se reciben y muestran, **entonces** se validan y presentan como contenido sin ejecutar instrucciones; secretos y datos privados no aparecen en páginas públicas ni evidencias.
3. **Dado** una sesión administrativa y una operación privada, **cuando** se revisa su protección, **entonces** se verifica sesión segura, autorización por operación y transporte seguro, conforme al alcance de 006.
4. **Dado** los recorridos públicos y privados completos, **cuando** se revisan recursos, conexiones, cookies, almacenamiento y servicios integrados, **entonces** no hay rastreo publicitario ni cookies de rastreo; las cookies necesarias tienen finalidad y duración documentadas.
5. **Dado** una afirmación como Cero rastreo publicitario o Sin cookies de rastreo, **cuando** se prepara su publicación, **entonces** solo se autoriza con evidencia vigente que incluya las integraciones; una revisión incompleta mantiene bloqueada la afirmación.
6. **Dado** el enlace externo de Instagram, **cuando** se revisa el aviso, **entonces** se distingue salir hacia una plataforma externa de cargar sus recursos dentro de Priva y no se atribuye a Instagram la política de Priva.
7. **Dado** una selección de un ejercicio educativo, **cuando** se elige y se recarga la página, **entonces** no se envía ni se conserva persistentemente y no genera consultas ni estadísticas.

### Edge Cases

- Justo antes, exactamente al alcanzar y después de 90 días; cambio de fecha y aceptación confirmada tardíamente. Usar instantes comparables, sin depender de la fecha mostrada o del horario del navegador.
- Consulta Respondida con varias respuestas: cada aceptación nueva actualiza actividad si es posterior a la actividad vigente; un intento adicional fallido conserva el estado anterior sin reiniciar conservación.
- Borrado concurrente con lectura, reintento, despacho o confirmación tardía; ningún resultado reconstruye datos eliminados.
- Solicitud confirmada cerca del vencimiento de conservación: se aplica el límite de borrado que ocurra antes; repetir la solicitud o reintentar un fallo no prolonga ningún límite.
- Servicio detenido durante el vencimiento, ejecución repetida o fallida del borrado, copia antigua y proveedores temporalmente inaccesibles: recuperación segura y estado pendiente explícito.
- Solicitud sobre varias consultas con el mismo correo: verificar y delimitar alcance, sin borrar otras por coincidencia de alias.
- Recurso de terceros que empieza a rastrear después de un cambio: retirar la afirmación afectada y bloquear su nueva aprobación hasta verificar la corrección.

## Requirements

### Functional Requirements

- **FR-001 / X02 — Seguridad, rastreo y conservación**: Autorización servidor, sesión segura, validación y salida segura; verificar red/scripts/cookies/proveedores sin rastreo publicitario; borrar datos de Contacto y respuestas a 90 días de última actividad, solicitud anticipada y tratamiento documentado de copias/respaldos (C22/C26/C29).

### Reglas y contenido complementario

Estas reglas R-01–R-09 desarrollan FR-001; no añaden requisitos originales al inventario de 53.

- **R-01 — Ámbito y minimización**: incluir alias, correo, mensaje, respuestas y sus datos asociados recuperables. Mantener privados estos datos y evitar copiarlos en registros de errores, comprobantes o evidencias. Los ejercicios permanecen locales y sin persistencia.
- **R-02 — Plazo y actividad**: aplicar 90 días a Pendiente y Respondido. Registrar recepción y aceptación verificable de respuestas; lecturas, fallos, incertidumbre y repetición de confirmaciones no amplían el plazo. Última actividad es la fecha más reciente entre recepción inicial y aceptación comprobada de una nueva respuesta, usando el momento original de aceptación. Esta regla fue confirmada por la usuaria en Q1.
- **R-03 — Vencimiento**: desde el vencimiento, impedir acceso ordinario, inclusión en contadores y nuevos despachos. El procedimiento debe eliminar los datos operativos y sus dependencias sin afectar consultas vigentes. Revisar vencimientos al menos cada hora y completar la eliminación física de los datos operativos como máximo una hora después del vencimiento (Q2). Comprobar en el entorno real el cumplimiento de estos límites y la recuperación tras interrupciones; sincronizar el aviso con esta política. Una interrupción no desplaza el vencimiento ni el límite: superar el plazo es un incumplimiento que debe registrarse y corregirse, sin declarar éxito. No sustituir eliminación por ocultación permanente.
- **R-04 — Solicitud anticipada**: disponer de canal oficial verificado y procedimiento que identifique responsable, comprobación proporcionada, alcance, plazo de respuesta y ejecución, resultado y tratamiento de copias. Verificar control del correo asociado mediante un enlace o código de un solo uso enviado exclusivamente al correo guardado (Q3), vinculado a la solicitud y su alcance. Una confirmación válida solo autoriza ese alcance; un comprobante inválido, vencido o ya utilizado no autoriza nuevas eliminaciones. No exigir cuenta pública ni documentos de identidad. No divulgar existencia o contenido antes de verificar legitimidad. Completar el borrado operativo como máximo 24 horas después de la confirmación válida (Q4); una repetición o fallo no reinicia ese plazo. Si el vencimiento por conservación exige un borrado anterior, cumplir el límite anterior. Superar el límite queda registrado como incumplimiento, sin declarar éxito. El canal oficial, el plazo de atención previo a la confirmación y la ejecución real se califican con P02 antes de activar este recorrido; el máximo de 24 horas no se extiende a copias externas no verificadas.
- **R-05 — Eliminación coherente**: impedir nuevas acciones sobre datos eliminados, cancelar envíos no iniciados y evitar recreación por reintento o confirmación tardía. Diferenciar un despacho ya iniciado, que puede completar su envío, de una nueva autorización prohibida. Repetir el borrado no recrea datos ni produce efectos duplicados.
- **R-06 — Copias y recuperación**: inventariar datos operativos, servicios de correo, buzones y respaldos bajo control de Priva o sus proveedores; documentar responsable, acceso, ciclo, máximo de conservación y evidencia por ubicación. No reactivar vencidos ni eliminados anticipadamente al restaurar. No exigir control sobre copias independientes del destinatario ni prometerlo. Un fallo mantiene pendiente la parte afectada y bloquea el cierre global.
- **R-07 — Seguridad transversal**: exigir autorización vigente en cada operación privada, sesiones y transporte seguros, validación de entrada y salida segura, secretos fuera del cliente. Reutilizar el alcance de acceso de 006 sin añadir roles. Las comprobaciones deben cubrir acceso directo y pérdida de autorización, además de interfaz.
- **R-08 — Ausencia de rastreo**: revisar scripts, conexiones, cookies, almacenamiento y proveedores en navegación, audio, ejercicios, formulario y administración. Prohibir rastreo publicitario y cookies de rastreo; documentar cookies necesarias, su finalidad y duración. No persistir respuestas educativas ni generar estadísticas. Un servicio integrado forma parte de la revisión; una plataforma externa enlazada requiere delimitar la salida, sin promesas sobre ella.
- **R-09 — Avisos y evidencia**: mantener sincronizados formulario, Manifiesto y demás afirmaciones con políticas y operación comprobadas, en coordinación con 010. No publicar canal ficticio ni promesas pendientes. Conservar evidencia mínima sin contenido privado, identificando fecha, entorno, regla, resultado y límites; una dependencia sin verificar es bloqueo y nunca éxito.

### Key Entities

- **Conversación de Contacto**: consulta privada y respuestas asociadas; recepción, estado, última actividad y vencimiento.
- **Evento de actividad**: recepción o nueva aceptación comprobada; su fecha original permite distinguir nueva actividad de lectura, fallo o comprobación repetida.
- **Solicitud de eliminación**: petición, alcance verificado, responsable de ejecución y resultado; recopila solo lo necesario para tramitarla.
- **Ubicación de datos o copia**: sistema operativo, proveedor, buzón o respaldo con ciclo y responsabilidad identificados.
- **Política operativa**: definición de actividad, frecuencia y límite de borrado, procedimiento anticipado y reglas de recuperación aprobadas antes de su uso productivo.
- **Evidencia de privacidad**: comprobación sin contenido sensible, vinculada a política, entorno y fecha; distingue cumplimiento, fallo y bloqueo.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El 100% de los casos antes/en/después de 90 días para Pendiente y Respondido respeta la disponibilidad y el vencimiento definidos; cero lecturas, fallos o confirmaciones repetidas amplían el plazo.
- **SC-002**: El 100% de las consultas vencidas del conjunto de prueba pierde acceso y posibilidad de nuevo despacho al vencer, y sus datos operativos se eliminan como máximo una hora después del vencimiento, con revisión al menos horaria; ninguna consulta vigente se elimina por ese proceso. La política está decidida en Q2; su cumplimiento productivo requiere evidencia real y los fallos o interrupciones que excedan el límite no se cuentan como éxito.
- **SC-003**: El 100% de las solicitudes sintéticas verificadas elimina solo el alcance autorizado en un máximo de 24 horas desde la confirmación válida, o antes si lo exige el límite de conservación; cero solicitudes sin confirmación válida de control del correo guardado revelan o eliminan consultas ajenas, y cero comprobantes inválidos, vencidos o reutilizados autorizan nuevas eliminaciones. Sin canal y verificación calificados y evidencia real de cumplimiento del plazo, queda bloqueado; ningún fallo o reintento reinicia las 24 horas.
- **SC-004**: En todas las restauraciones de prueba, cero consultas vencidas o eliminadas anticipadamente reaparecen disponibles o autorizadas para enviar; ninguna confirmación tardía las reconstruye.
- **SC-005**: El 100% de las ubicaciones identificadas de datos y copias tiene ciclo, responsable, límite temporal y evidencia real antes del cierre; cero fallos parciales se comunican como eliminación total.
- **SC-006**: Cero accesos privados sin autorización, exposiciones públicas de datos de Contacto o ejecuciones de contenido introducido por usuarios en los casos de seguridad previstos.
- **SC-007**: Los cinco recorridos de revisión —navegación, audio, ejercicios, Contacto y administración— presentan cero mecanismos de rastreo publicitario o cookies de rastreo; el 100% de las cookies necesarias y proveedores integrados está documentado. Los ejercicios no envían ni conservan sus selecciones tras recargar.
- **SC-008**: El 100% de las afirmaciones públicas de privacidad y conservación tiene evidencia vigente y correspondencia con la operación real; cero canales ficticios, compromisos no verificados o datos privados en las evidencias de cierre.

## Assumptions

- **A1 — Criterio operativo confirmado (Q1)**: última actividad = la más reciente entre recepción inicial y aceptación comprobada de una nueva respuesta. Usar el momento original de aceptación, no el de comprobación posterior; guardar borradores, leer, fallar al enviar y repetir confirmaciones no reinicia el plazo. Decisión expresa de la usuaria del 2026-10-20, independiente de la implementación local de 008.
- **A2 — Frecuencia y margen operativo confirmados (Q2)**: revisión de vencimientos al menos cada hora y borrado físico operativo en un máximo de una hora desde el vencimiento, manteniendo bloqueo de acceso y nuevos envíos desde el vencimiento. Decisión de la usuaria del 2026-10-20; los ciclos de proveedores, buzones y respaldos se verifican por separado y no quedan aprobados por esta decisión.
- **A3 — Proceso de eliminación**: se describe un procedimiento gestionado por el equipo autorizado; la verificación usa un enlace o código de un solo uso enviado al correo guardado (Q3), sin exigir documentos de identidad. No se presupone nueva pantalla pública de autoservicio, proveedor ni dirección oficial; la forma concreta de confirmación y su vigencia se definirán en el plan sin permitir reutilización ni ampliar el alcance solicitado. El borrado operativo debe completarse en un máximo de 24 horas desde la confirmación válida (Q4); se respeta cualquier límite anterior por vencimiento de conservación.
- **A4 — Datos ajenos a Contacto**: inventariar su existencia y dependencias no fija nuevas políticas de cuentas, historias ni registros de seguridad. Sus plazos deben resolverse en su ámbito y reflejarse en 010 cuando corresponda.
- **A5 — Estado de evidencia**: las pruebas locales de 005/006/008 aportan antecedentes de integración, sin acreditar operación productiva, buzones, respaldos ni ausencia global de rastreo. Esta fase solo cambia documentación.

## Dependencias y condiciones de cierre

- [005 Contacto](../005-contacto-publico/spec.md): recepción, datos privados y comprobantes; eliminar sin permitir reaparición por reintentos.
- [006 acceso](../006-acceso-administrativo/spec.md): permisos, sesiones y recuperación; no reemplazar sus contratos ni aplicarles automáticamente 90 días.
- [007 gestión](../007-gestion-historias/spec.md) y [008 bandeja](../008-bandeja-respuestas/spec.md): contadores, respuestas adicionales, incertidumbre y confirmaciones tardías; sincronizar tras eliminación sin aumentar el número de consultas por respuestas.
- [003 ejercicios](../003-historias-educativas/spec.md): no persistencia; [010 documentos](../010-documentos-recuperacion/spec.md): avisos y canal reales; [011 verificación](../011-accesibilidad-fidelidad/spec.md): evidencia integrada y presentación accesible de los avisos.
- **P02**: responsable/contacto oficial, proveedores y remitente, canal oficial y calificación real de la verificación de solicitudes mediante enlace o código de un solo uso al correo guardado (Q3), plazo de atención previo a la confirmación y comprobación real del borrado operativo en un máximo de 24 horas desde la confirmación válida (Q4), verificación real de la revisión al menos horaria y el borrado operativo en un máximo de una hora desde el vencimiento (Q2), ciclos reales de buzones/respaldos y recuperación. Documentar y comprobar antes del cierre y de habilitar la parte productiva correspondiente. No elegir valores ni proveedores por existencia de código local.
- Las decisiones de actividad, frecuencia y margen operativo, verificación del correo y plazo de eliminación anticipada quedan resueltas mediante Q1–Q4. Las dependencias operativas impiden cierre integrado, pero permiten diseñar y comprobar partes independientes con datos sintéticos claramente identificados.

## Trazabilidad y verificación

| ID original | Desarrollo local | Historias y escenarios | Resultado medible | Estado |
|---|---|---|---|---|
| X02 / FR-001 | R-01/R-02/R-03 | US1.1–6 | SC-001/002 | Especificado; operación pendiente |
| X02 / FR-001 | R-04/R-05 | US2.1–6 | SC-003/008 | Especificado; P02 pendiente |
| X02 / FR-001 | R-05/R-06 | US3.1–6 | SC-004/005 | Especificado; copias reales pendientes |
| X02 / FR-001 | R-01/R-07/R-08/R-09 | US4.1–7 | SC-006/007/008 | Especificado; revisión integrada pendiente |

**Revisión 2026-10-20**: se desarrolla el único requisito original X02 sin modificar su texto, con cuatro historias y 25 escenarios. Se preservan los compromisos aprobados y se identifican supuestos y calificaciones externas. No se genera plan, tareas o implementación ni se ejecutan pruebas de aplicación en esta fase. Los catálogos históricos ausentes no se sustituyen con estos identificadores locales.

**Aclaración 2026-10-20**: cuatro preguntas respondidas por la usuaria (A en Q1–Q4), integradas en historias, reglas, métricas y dependencias. El canal y los proveedores reales, ciclos de copias y atención previa a la confirmación requieren calificación operativa; la forma y vigencia del comprobante se resolverán en el plan. No se inventan datos oficiales ni se acredita cumplimiento productivo.

**Implementación 2026-10-20**:57/67 tareas verificadas localmente; [evidence.md](evidence.md) separa43Node,6navegador y225regresiones únicas de la calificación externa pendiente. No se cierra X02 productivo ni se habilitan claims/canal ficticios.

## Decisiones del MVP — 2026-10-27

La responsable elige Firebase para alojar la web y correo solo en modo de prueba sin proveedor por ahora. Confirma etapa MVP; no define ni elimina por ello políticas de acceso/copias. Se incorpora Colombia (Ley 1581/Decreto 1377 y compilación reglamentaria) como marco de revisión de documentos010. La elección no califica canal, recepción, almacenamiento o borrado real ni cambia los 90 días/deadlines aprobados. La responsable confirmó uso exclusivo de datos ficticios de prueba; no se habilitan consultas reales en esta etapa. Detalle en [decisiones del MVP y marco normativo](../010-documentos-recuperacion/mvp-decisions-2026-10-27.md).
