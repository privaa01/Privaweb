# Feature Specification: Acceso individual y sesiones administrativas

**Feature Directory**: `specs/006-acceso-administrativo`
**Created**: 2026-10-16
**Updated**: 2026-10-17
**Status**: Especificación revisada documentalmente; implementación y pruebas de 006 no ejecutadas.
**Input**: `/speckit-specify 006`: desarrollar la feature existente sin ampliar el alcance.
**Fuentes**: [SPEC R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), AD01/AD02 y C26;
[constitución 1.0.0](../../.specify/memory/constitution.md), especialmente CONST-03–06/08–10;
capturas de login y consola administrativa aportadas por la usuaria.

## Alcance

Permitir que cada persona autorizada acceda con su propia cuenta de correo/contraseña,
recupere acceso mediante verificación por correo y cierre su sesión. Ofrecer navegación privada
hacia Historias y la bandeja de Contacto, con un único tipo de administrador y permisos iguales.
El acceso exige una sesión válida y autorización comprobadas en cada lectura y modificación privada.

**Fuera de alcance**: registro público, cuentas de visitantes, credenciales compartidas como diseño,
roles editor/superadministrador, gestión web de cuentas no aprobada, acceso social, recuperación
por preguntas o canales alternativos no acordados, dashboard de estadísticas nuevo, publicación de
comentarios y funciones propias de 007/008. La provisión restringida no crea un rol adicional.

## User Scenarios & Testing

### User Story 1 — Iniciar sesión con una cuenta individual autorizada (Priority: P1)

Como persona administradora autorizada, quiero entrar con mi correo y contraseña para acceder
al trabajo privado sin compartir credenciales ni exponer datos de Contacto a visitantes.

**Why this priority**: Toda operación administrativa depende de identificar y autorizar realmente
la cuenta; una pantalla de bienvenida o un botón visible no sustituyen ese control.

**Independent Test**: Preparar una cuenta individual autorizada de prueba y otra identidad sin
acceso. Comprobar entrada válida, credenciales erróneas, ausencia de sesión y fallo del servicio
contra autorización real; usar datos sintéticos, sin exigir completar los editores 007/008.

**Acceptance Scenarios**:

1. **Dado** el enlace panel administrador del footer, **cuando** lo activo o abro directamente
   /admin/login, **entonces** encuentro el acceso con marca, Bienvenido de nuevo, correo,
   contraseña, control de visibilidad, Entrar y acceso a recuperación; Correo sustituye Usuario
   de la captura y no aparece registro público. (AD01; integración 001)
2. **Dado** una cuenta individual autorizada con credenciales válidas, **cuando** envío el acceso,
   **entonces** se confirma autenticación real antes de mostrar el panel; la sesión corresponde
   a esa cuenta y ofrece acceso a Historias y Contacto con el único permiso administrativo. (AD01/AD02)
3. **Dado** correo o contraseña vacíos, o correo con formato inválido, **cuando** intento entrar,
   **entonces** se asocia un error legible al campo y puedo localizarlo con teclado sin acceder
   a información privada. No se modifica silenciosamente la contraseña para hacerla válida. (AD01)
4. **Dado** un correo desconocido o una contraseña incorrecta, **cuando** intento entrar,
   **entonces** recibo un rechazo genérico sin indicar cuál dato identifica una cuenta existente;
   no se crea sesión válida ni se muestran contenidos privados. (AD01)
5. **Dado** un intento en curso o una respuesta de autenticación fallida/desconocida,
   **cuando** repito Enter, pulso Entrar o se pierde la conexión, **entonces** no aparecen
   sesiones/confirmaciones visuales por simulación; se bloquea el envío repetido en curso,
   se comunica el estado y solo se entra tras comprobar una sesión vigente. (AD01)
6. **Dado** el control de visibilidad de contraseña, **cuando** lo activo con teclado o puntero,
   **entonces** cambia únicamente su presentación, anuncia si está visible/oculta y no cambia
   el valor, envía el formulario ni impide pegar o usar un gestor de contraseñas. (AD01)

### User Story 2 — Navegar con permisos iguales y proteger cada operación (Priority: P1)

Como persona administradora autorizada, quiero encontrar Historias y Contacto en un panel
coherente para trabajar con los mismos permisos que las otras cuentas autorizadas.

**Why this priority**: La navegación y la protección de los datos deben coincidir. Una sesión
no autoriza nuevas funciones, roles ni acceso público a recursos privados.

**Independent Test**: Usar dos cuentas individuales autorizadas distintas y una sesión ausente,
inválida o expirada. Comparar la navegación y autorización de los mismos recursos/operaciones
privados de prueba, sin fabricar contadores ni exigir el contenido completo de 007/008.

**Acceptance Scenarios**:

1. **Dado** una sesión válida, **cuando** abro el panel, **entonces** encuentro navegación legible
   a Historias, bandeja de Contacto e identidad de la cuenta en uso, junto con Cerrar sesión;
   no se muestran datos de Admin Priva u otra identidad de demostración como si fueran reales. (AD02)
2. **Dado** dos cuentas individuales autorizadas, **cuando** cada una accede a Historias y Contacto,
   **entonces** ambas tienen los mismos permisos administrativos sobre las funciones aprobadas;
   no aparece un permiso de editor o superadministrador. (AD02)
3. **Dado** ausencia de sesión, sesión inválida/expirada o cuenta que ya no está autorizada,
   **cuando** intento abrir directamente una vista privada o leer/modificar un recurso privado,
   **entonces** la operación se rechaza antes de revelar datos o producir cambios; no basta
   con ocultar enlaces o redirigir después de entregar el contenido. (AD01/AD02)
4. **Dado** una sesión que deja de ser válida mientras el panel está abierto, **cuando** intento
   otra lectura o modificación, **entonces** no se realiza la operación, se informa que debo
   volver a identificarme y la vista deja de presentar los datos privados como accesibles. (AD01/AD02)
5. **Dado** una petición o navegación que aparenta venir de otra cuenta o altera datos de sesión,
   **cuando** se intenta usar para acceso privado, **entonces** no cambia la identidad ni concede
   autorización por información manipulable de la página; los módulos privados aplican la
   misma protección también por acceso directo. (AD01/AD02)
6. **Dado** una salida hacia otra página, recarga o retorno mediante historial,
   **cuando** la sesión dejó de ser válida, **entonces** no se recupera una vista operativa con
   datos privados por reutilizar una respuesta anterior; se exige nueva autenticación. (AD01/AD02)

### User Story 3 — Cerrar la sesión de este acceso (Priority: P2)

Como persona administradora autorizada, quiero cerrar mi sesión para que el acceso que dejo
abierto no permita consultar o modificar información privada después de salir.

**Why this priority**: La salida forma parte del control de acceso; una redirección local que
mantiene válido el acceso anterior no constituye cierre de sesión.

**Independent Test**: Autenticar una cuenta de prueba, cerrar y reutilizar el acceso anterior
para lectura y modificación directas, recarga e historial. Introducir un fallo de cierre y
comprobar que no se confirma una invalidación que no se haya demostrado.

**Acceptance Scenarios**:

1. **Dado** una sesión válida, **cuando** activo Cerrar sesión, **entonces** se invalida ese
   acceso y se vuelve a la entrada; el acceso anterior ya no permite lecturas ni cambios,
   incluso si alguien conserva su comprobante o intenta volver con el historial. (AD01)
2. **Dado** una sesión ya cerrada o expirada, **cuando** vuelvo a pedir el cierre,
   **entonces** permanezco sin acceso y obtengo un resultado coherente, sin reabrir sesión
   ni mostrar información privada como respuesta al reintento. (AD01)
3. **Dado** un fallo o pérdida de confirmación del cierre, **cuando** termina la espera,
   **entonces** no se afirma que el acceso del servidor ya fue invalidado; la vista local
   no sigue mostrando datos privados, se informa que el cierre no se pudo confirmar y
   se permite reintentar/verificar el estado sin exponer información. (AD01)
4. **Dado** un cierre confirmado y otra persona usando ese navegador, **cuando** intenta
   continuar una acción administrativa, **entonces** necesita autenticarse de nuevo;
   no se ejecuta automáticamente una edición o respuesta privada anterior. (AD01/AD02)

### User Story 4 — Recuperar acceso mediante correo verificado (Priority: P2)

Como persona administradora con acceso al correo de mi cuenta, quiero restablecer la contraseña
mediante una comprobación válida para volver a entrar sin revelar públicamente quién tiene cuenta.

**Why this priority**: Recuperar acceso no puede convertirse en registro público, enumeración de
cuentas ni vía alternativa para entrar sin control de la dirección autorizada.

**Independent Test**: Solicitar recuperación para cuenta autorizada y dirección desconocida,
comparar respuestas públicas y completar el proceso en un buzón de prueba controlado.
Probar comprobaciones alteradas, vencidas, reutilizadas y concurrentes, sin afirmar recepción
por el simple hecho de aceptar una solicitud o entregar un mensaje al servicio de correo.

**Acceptance Scenarios**:

1. **Dado** la entrada administrativa, **cuando** elijo recuperar acceso,
   **entonces** puedo indicar mi correo y volver al login mediante destinos funcionales,
   sin registro público ni una dirección o enlace ficticio de recuperación. (AD01)
2. **Dado** un correo con formato válido, sea conocido o desconocido,
   **cuando** solicito recuperación, **entonces** la respuesta pública no revela existencia,
   autorización ni estado de la cuenta, ni afirma entrega o lectura del correo;
   los errores observables tampoco distinguen cuentas por el fallo del servicio. (AD01)
3. **Dado** una cuenta autorizada y solicitud admitida, **cuando** recibo y uso las instrucciones
   por su correo verificado, **entonces** puedo establecer una contraseña que cumpla la política
   previamente definida y visible; solicitar recuperación por sí solo no cambia la contraseña,
   concede acceso ni crea cuenta nueva. (AD01)
4. **Dado** una comprobación alterada, vencida, ya utilizada o ajena a la cuenta,
   **cuando** intento restablecer, **entonces** se rechaza sin cambiar la contraseña ni revelar
   datos de cuenta, y se ofrece volver a solicitar recuperación. Ver la página no consume
   por sí solo la comprobación: el cambio válido es la acción que la utiliza. (AD01)
5. **Dado** un restablecimiento confirmado, **cuando** intento entrar de nuevo,
   **entonces** la contraseña nueva sirve y la anterior no; se invalidan las sesiones previas
   de esa cuenta y las demás comprobaciones de restablecimiento aún pendientes.
   No se inicia sesión automáticamente como efecto de abrir el correo. (AD01)
6. **Dado** dos envíos simultáneos de un mismo restablecimiento o un fallo/desconocimiento
   al cambiar contraseña, **cuando** se resuelve la operación, **entonces** no hay dos cambios
   exitosos con la misma comprobación ni confirmación falsa; se puede volver al login o
   solicitar instrucciones nuevas sin reutilizar automáticamente la contraseña escrita. (AD01)
7. **Dado** un fallo de configuración, envío o recepción del correo,
   **cuando** se solicita o prueba recuperación, **entonces** no se suplanta por un éxito de
   demostración ni se muestra una comprobación secreta en la respuesta pública. La entrega
   efectiva se comprueba en el buzón controlado para aceptar el recorrido completo. (AD01)

### Edge Cases

- Cuenta con correo correcto pero sin autorización actual, o acceso con una sesión antigua:
  no se convierte en autorizado por conocer la contraseña o pedir recuperación.
- Espacios accidentales en los extremos del correo se pueden recortar; el formato no acredita
  identidad ni existencia del buzón. La contraseña no se recorta ni transforma silenciosamente.
  La normalización de identidad y política de credenciales deben ser coherentes con la provisión.
- Contraseña equivocada y correo desconocido no se distinguen en el rechazo público. Un correo
  con formato inválido sí puede producir un error local de formato sin consultar si existe cuenta.
- Intentos repetidos de acceso/recuperación reciben controles de abuso definidos y verificables;
  no se inventa un bloqueo permanente de cuenta, CAPTCHA externo, nueva identidad de visitante
  ni recopilación de datos no necesarios como solución por defecto.
- Al perder una respuesta de login, no basta para entrar un estado visual optimista. Comprobar
  la sesión real evita duplicar la acción o reutilizar una respuesta de otro intento/cuenta.
- En cierre concurrente y uso de sesión, el cierre confirmado impide operaciones posteriores.
  Una operación ya confirmada antes del cierre no se presenta como deshecha por cerrar sesión.
- Varias pestañas, recarga e historial no eluden expiración/cierre/revocación. Si ya no hay sesión
  vigente, los módulos no muestran respuestas privadas anteriores como datos accesibles actuales.
- Credenciales o comprobantes de recuperación no aparecen en errores, logs, datos públicos,
  evidencias con cuentas reales ni borradores persistentes de la aplicación. El mecanismo de
  recuperación no revela secretos a quien solo conoce una dirección de correo.
- Un destino de regreso tras login no lleva a otro sitio ni ejecuta por sí solo una modificación;
  las acciones pendientes requieren nuevamente autorización y decisión de la persona.
- Recuperación simultánea y cambio de contraseña deben producir un resultado coherente:
  un cambio completado invalida comprobaciones pendientes; una nueva solicitud no crea cuenta
  ni concede permisos. Caducidad y protección de concurrencia se prueban con la política definida.
- Ningún error carga datos de otra cuenta o recupera una sesión antigua del navegador como éxito.
  El servicio no disponible conserva la protección de los recursos privados.
- Marca/colores/copy pendientes no se sustituyen por identidades o sesiones ficticias de entrega.
  Pruebas con recursos/cuentas sintéticos se identifican y nunca certifican operación productiva.

## Requirements

### Functional Requirements

- **FR-001 / AD01 — Acceso, recuperación y cierre de sesión**: Correo/contraseña por cuenta individual, sin registro público; recuperación verificada por correo sin revelar existencia de cuenta; sesión cerrada impide acceso; provisión restringida por definir (C26).
- **FR-002 / AD02 — Panel y permisos**: Un tipo de administrador con acceso a historias y comentarios de Contacto; todas las cuentas autorizadas con mismos permisos; navegación privada legible y coherente; sin rol editor adicional (C26).

### Reglas y contenido complementario

**Presentación**: conservar composición de la captura de login: marca, bienvenida, invitación,
campos y Entrar. Usar Correo en lugar de Usuario, control accesible de visibilidad y acceso
funcional a recuperación. En consola conservar identidad/navegación privada; adaptar la sección
de comentarios comunitarios a bandeja privada de Contacto según el alcance vigente. El texto
sobre gestionar la comunidad no autoriza publicación, aprobación comunitaria o cuentas públicas.
Recursos/copy y estados añadidos requieren revisión, sin afirmar que estaban dibujados en la captura.

**Cuentas y provisión**: cada cuenta identifica a una persona autorizada y recibe el único permiso
administrativo. No hay alta pública ni cuenta inicial con contraseña de demostración. El procedimiento
restringido para crear/habilitar cuentas, responsable y servicio operativo se documentan/verifican
con P02 antes del uso real; no se crea una interfaz de gestión de cuentas como nueva función.
Una cuenta sin autorización vigente no puede iniciar o continuar acceso privado. La forma de
mantener esa autorización pertenece al mecanismo operativo, sin introducir otro rol en el panel.

**Sesión y autorización**: comprobar identidad, vigencia y autorización para cada lectura y cambio
privado, incluyendo acceso directo, recursos y funciones futuras de 007/008. La protección real
no se prueba solo con una redirección de pantalla. El plan definirá vigencia/expiración, protección
ante manipulación y solicitudes no consentidas, transporte, almacenamiento de credenciales y
manejo de accesos previos; nunca admite guardar contraseña en claro o exponer claves internas del servicio o credenciales de otras cuentas al cliente.
Las reglas deben permitir demostrar sesión ausente, inválida, expirada, cerrada y autorización
retirada. Cada cuenta puede usar las mismas funciones aprobadas; identidad no se selecciona
mediante un dato manipulable del formulario.

**Cierre y fallos**: Cerrar sesión invalida el acceso en uso y solo confirma el resultado comprobado.
Con cierre desconocido se oculta el contenido local y se ofrece reintentar/verificar; no se asegura
invalidación remota por redirigir al login. No se presume cierre global de otros dispositivos en
ese botón. El restablecimiento de contraseña sí invalida las sesiones previas de la cuenta.
Las acciones privadas no se reenvían automáticamente al autenticar de nuevo tras expiración.

**Recuperación**: solo por verificación del correo de una cuenta autorizada, con comprobación
acotada en tiempo, ligada a esa cuenta y de un solo uso para cambiar contraseña. Definir y probar
la política de credenciales, caducidad y límites de intentos antes de implementar la parte afectada;
sus valores técnicos y el proveedor se documentan en el plan sin atribuirlos al wireframe.
Solicitud aceptada no acredita envío, entrega ni lectura. El comportamiento público, incluidos
fallos observables, no permite conocer si existe una cuenta. La prueba integral exige correo real
a buzón controlado; los dobles de prueba solo acreditan el contrato que sustituyen.

**Privacidad**: no usar el plazo de 90 días de Contacto para cuentas, sesiones o registros de
seguridad. Su finalidad, conservación, revocación y datos operativos se definen con 009/P02.
No añadir analítica ni rastreo publicitario. Sesiones necesarias y servicios integrados requieren
revisión; no publicar ausencia de cookies o rastreo por mera apariencia del login.

**Accesibilidad**: etiquetas visibles y errores asociados, contraste 4.5:1 en texto normal y
3:1 en grande/componentes, foco visible/orden lógico, controles de aproximadamente 44 px,
anuncio de carga/error y operación completa con teclado. Probar 360/390/430/768/1024/1280/1440 px
y texto al 100%/200%, sin recortes ni desbordamiento impeditivo. Permitir gestores y pegar
credenciales sin confundir esas capacidades con guardar contraseñas como borradores propios.

### Key Entities

- **Cuenta administrativa individual**: identificador estable, correo asociado, autorización vigente
  y credencial protegida; un único permiso administrativo. No es cuenta de visitante ni perfil público.
- **Sesión administrativa**: acceso vinculado a una cuenta, vigencia y estado vigente/expirado/
  cerrado/invalidado; habilita únicamente operaciones cuya autorización se comprueba en cada uso.
- **Solicitud de recuperación**: solicitud para una dirección de correo; su resultado público no
  distingue existencia de cuenta ni confirma entrega. No crea cuenta ni concede acceso.
- **Comprobación de restablecimiento**: prueba limitada, vinculada a una cuenta autorizada,
  con vencimiento y uso único; cambia credencial solo tras validación y confirmación reales.
- **Navegación privada**: accesos a Historias, bandeja de Contacto e identidad/cierre de sesión;
  los contenidos y operaciones específicas siguen siendo responsabilidad de 007/008.
- **Estado de interacción**: entrada, validación, envío en curso, error, resultado desconocido,
  acceso confirmado o sesión no vigente; ningún mensaje de éxito sustituye una operación real.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Cuenta autorizada y credenciales válidas permiten entrar; correo desconocido,
  contraseña incorrecta, datos vacíos/incorrectos y fallo/desconocimiento no conceden acceso
  ficticio. Correo, visibilidad de contraseña, recuperación y estados son operables y comprensibles.
- **SC-002**: En dos cuentas autorizadas distintas se demuestran los mismos permisos de Historias
  y Contacto. El 100% de las lecturas/cambios privados incluidos en el alcance probado verifica
  autorización; la matriz de acceso directo con sesión ausente/inválida/expirada/cerrada y
  autorización retirada no expone datos ni produce cambios prohibidos.
- **SC-003**: Tras cierre confirmado, reutilizar el acceso anterior, recarga, historial y otra pestaña
  no permiten continuar operaciones privadas; reintento de cierre es coherente. Ante fallo o
  resultado desconocido no se afirma cierre remoto y el contenido privado local queda oculto.
- **SC-004**: Recuperación para correo existente/desconocido tiene respuesta pública indistinguible
  dentro de las reglas observables definidas para el servicio; la recuperación válida se completa
  mediante correo recibido en buzón de prueba. Solicitarla no cambia contraseña ni crea cuenta.
- **SC-005**: Restablecimiento alterado/vencido/usado/ajeno no cambia credenciales. Un cambio
  confirmado acepta la contraseña nueva, rechaza la anterior, invalida sesiones previas y otras
  comprobaciones pendientes, sin doble éxito concurrente ni acceso automático por abrir el enlace.
- **SC-006**: En las 14 combinaciones de ancho/texto, entrada, navegación, cierre y recuperación
  conservan etiquetas, foco, feedback y controles utilizables con teclado, sin recortes/trampas;
  contraste y tamaño se miden conforme a 011, sin dar por aprobado material visual pendiente.
- **SC-007**: AD01/AD02 se vinculan a escenarios y evidencia o bloqueo explícito; provisión,
  autorización/sesión y correo integrales se comprueban contra servicios reales de prueba,
  separados de simulaciones de interfaz. Ninguna cuenta, recurso, proveedor o promesa pendiente
  se presenta como operación productiva verificada.

Son criterios para la implementación, no pruebas ejecutadas por este comando.

## Assumptions

- “006” selecciona el directorio existente; no crea una feature nueva, rama Git o código de aplicación.
  AD01/AD02 y sus textos se conservan; las cuatro historias desarrollan los borradores originales,
  sin reconstruir IDs ni los 195 criterios históricos del catálogo 07 ausente.
- No se incorpora autenticación multifactor, registro público, roles nuevos ni otra modalidad de
  acceso por inferir buenas prácticas. Los controles necesarios de sesión/recuperación desarrollan
  el acceso seguro aprobado, sin elegir infraestructura ni añadir pantallas de gestión de cuentas.
- El correo ya definido como identificador sustituye Usuario de la captura. Política de credenciales,
  valores de vigencia, caducidad y controles de abuso son decisiones del diseño técnico que deben
  quedar explícitas/verificables antes de construir; no son datos de operación ya suministrados.
- Como criterio de seguridad derivado, cerrar sesión afecta ese acceso; restablecer contraseña
  invalida las sesiones anteriores y comprobaciones pendientes de esa cuenta, y requiere luego
  iniciar sesión. No añade un botón nuevo de cerrar todos los dispositivos.
- La navegación puede probarse con recursos privados sintéticos autorizados antes de completar
  007/008. Esto no certifica esas features, la lectura de toda la bandeja ni el envío de respuestas.
- No se fija un plazo de entrega de correo ni un rendimiento/capacidad productivos sin información
  operativa. La aceptación se verifica por resultados y matrices de acceso/estados definidas.

## Dependencias y condiciones de cierre

- **001**: contrato del enlace panel administrador a /admin/login. El acceso integrado se prueba;
  una página sintética del banco de navegación no demuestra autenticación real.
- **005/007/008**: datos de Contacto y funciones administrativas deben usar la protección de 006.
  No transformar el receptor público de 005 en lectura pública ni exponer DB/secretos para pruebas.
  Probar primitivas de acceso con datos sintéticos no exige implementar ya editores ni bandeja completa.
- **P02**: provisión restringida, responsable operativo, credenciales iniciales por canal seguro,
  persistencia/servicio de identidad, recuperación, remitente/dominio y entrega de correo. Pendientes
  de configuración/calificación; no inventar proveedor, cuenta inicial o credencial para cerrar.
- **009/P02**: políticas de cuentas/sesiones/registros, revocación y privacidad de proveedores.
  Las cookies necesarias se documentan; el plazo de Contacto no se hereda automáticamente.
- **010/P03**: textos informativos/avisos de tratamiento y mensajes de acceso/recuperación coherentes
  con operación real. No publicar una recuperación ficticia o una política todavía de borrador.
- **011/P01/P04**: marca/identidad, fidelidad de capturas, matriz accesible y revisión visual/manual.
  Fuente/colores exactos pendientes se registran; recursos de prueba no sustituyen los oficiales.
- El plan debe resolver decisiones técnicas de vigencia, política de credenciales y abuso, y dejar
  explícitas las dependencias externas que sigan abiertas. Solo bloquean el trabajo afectado.
  Cierre de 006 exige evidencia real de autorización/sesión/recuperación y entrega a buzón controlado;
  fallos de servicio, navegador o recurso se registran como fallidos/bloqueados, nunca como aprobados.

## Trazabilidad y verificación

| ID original | Requisito local | Escenarios | Fuente | Estado |
|---|---|---|---|---|
| AD01 | FR-001 | US1.1–6; US2.3–6; US3.1–4; US4.1–7 | Captura login / R35 C26 | No ejecutado |
| AD02 | FR-002 | US1.2; US2.1–6; US3.4 | Captura consola / R35 C26 | No ejecutado |

Los escenarios son locales a 006, no IDs de historias/criterios históricos ausentes.
P02 y las revisiones de privacidad/recursos siguen abiertas; este documento no acredita una sesión
real, un correo recibido ni la protección ya desplegada de 007/008.

## Registro

2026-10-17 — `/speckit-specify 006`: AD01/AD02 conservados; cuatro recorridos y siete criterios
medibles de acceso, permisos, cierre y recuperación. Defaults de seguridad derivados identificados;
provisión/correo/políticas/recursos pendientes separados. Sin código, pruebas de aplicación, commit,
push ni cambios de rama. Siguiente fase: aclaración y planificación de las decisiones aplicables.
