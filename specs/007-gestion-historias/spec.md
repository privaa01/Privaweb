# Feature Specification: Gestión y publicación de historias

**Feature Directory**: `specs/007-gestion-historias`
**Created**: 2026-10-16
**Updated**: 2026-10-19
**Status**: Implementación local verificada; 56/60 tareas cerradas. Entrega productiva, materiales/revisión manual y navegadores adicionales pendientes; ver [evidence.md](evidence.md).
**Input**: `/speckit-specify 007`: desarrollar la feature existente, conservando su alcance.
**Fuentes**: [SPEC R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), AD03/AD04/AD05/AD06/AD10, C27;
[constitución 1.0.0](../../.specify/memory/constitution.md), especialmente CONST-03–10/12;
captura administrativa aportada y contratos funcionales de [003](../003-historias-educativas/spec.md),
[006](../006-acceso-administrativo/spec.md) y [008](../008-bandeja-respuestas/spec.md).

## Alcance

Permitir al equipo autorizado preparar historias educativas, conservar borradores incompletos,
publicar contenido completo y controlar su activación. La tabla y los contadores describen
registros reales; la página pública de Historias consume únicamente historias publicadas y activas.
Crear, editar, guardar, publicar y activar/desactivar deben comunicar resultados comprobados,
sin perder contenido por un error ni confirmar cambios que no se hayan demostrado.

Se conservan los campos aprobados: título, categoría, imagen, descripción, audio, transcripción,
pregunta, tres opciones y una explicación por opción. Guardar y Publicar son acciones distintas.
La edición mantiene el identificador y los enlaces existentes de cada historia.

**Fuera de alcance**: eliminación definitiva, nuevos roles, registro público, catálogo público
separado o páginas de detalle nuevas, comentarios o respuestas de visitantes por historia,
aprobación pública de comentarios, estadísticas/puntuaciones de ejercicios, respuesta correcta
única y funcionalidades de bandeja/correo que pertenecen a 008. No se añaden gestión de categorías,
programación de publicaciones, colaboración en tiempo real ni una interfaz de historial de versiones.
La separación entre borrador de cambios y publicación vigente no añade una interfaz de historial de versiones.

## Clarifications

### Session 2026-10-19

- **Q1**: Al editar una historia ya publicada, ¿qué debe ocurrir al guardar cambios?
  **A**: Opción A elegida por la usuaria: Guardar conserva un borrador de cambios; la versión publicada
  sigue visible hasta pulsar Publicar. Se preservan identidad/enlaces y activación independiente.

## User Scenarios & Testing

### User Story 1 — Crear y conservar un borrador (Priority: P1)

Como persona administradora autorizada, quiero preparar una historia y guardar su contenido
aunque esté incompleto, para retomarlo sin publicarlo accidentalmente.

**Why this priority**: Permite producir contenido sin exigir que todos los recursos estén listos.
Es una primera entrega útil, independiente de habilitar publicaciones reales.

**Independent Test**: Crear una historia sintética con campos faltantes, guardar, recargar y
reabrirla con autorización. Contrastar contenido e identidad conservados y ausencia en la página
pública, distinguiendo fallo/resultado desconocido de persistencia confirmada.

**Acceptance Scenarios**:

1. **Dado** acceso autorizado a Historias, **cuando** elijo Agregar historia, **entonces** encuentro
   los campos aprobados y acciones diferenciadas de Guardar borrador y Publicar, sin nuevos permisos
   ni campos para guardar respuestas de visitantes. (AD04/AD06)
2. **Dado** contenido incompleto, **cuando** guardo un borrador, **entonces** se conserva lo introducido
   con un identificador estable y estado de borrador; no se exige completar los campos de publicación
   ni se inventan títulos, recursos, duración o explicaciones para hacerlo parecer completo. (AD06)
3. **Dado** un guardado confirmado, **cuando** recargo y reabro el borrador con acceso válido,
   **entonces** recupero los campos y recursos efectivamente guardados de esa misma historia,
   que sigue ausente del catálogo público. (AD04/AD06)
4. **Dado** un fallo al guardar, **cuando** termina el intento, **entonces** no aparece Guardado;
   conservo el texto y las referencias recuperables mientras el acceso siga autorizado, puedo
   reintentar y se indica si un archivo debe volver a seleccionarse. (AD06)
5. **Dado** doble envío o una respuesta perdida, **cuando** compruebo el resultado y reintento
   de forma explícita si corresponde, **entonces** no se crean historias duplicadas ni se reemplaza
   el contenido con una respuesta antigua; el resultado no confirmado se presenta como tal. (AD04/AD06)
6. **Dado** falta de sesión, expiración o autorización retirada, **cuando** intento crear, guardar
   o reabrir un borrador por cualquier entrada, **entonces** no se entregan datos privados ni se
   producen cambios; se exige recuperar el acceso sin reenviar automáticamente la operación. (AD06; 006)

### User Story 2 — Publicar contenido completo y coherente (Priority: P1)

Como persona administradora autorizada, quiero comprobar y publicar una historia completa,
para que los visitantes accedan al relato y a su actividad educativa sin materiales faltantes.

**Why this priority**: Distingue preparación privada de disponibilidad pública y evita exponer
borradores o un ejercicio que no puede utilizarse.

**Independent Test**: Usar una historia sintética completa y variantes con cada campo/recurso
faltante o inválido. Comprobar rechazo explicado, contenido público elegible y coincidencia entre
lo confirmado en administración y lo presentado por Historias, sin equiparar una simulación a entrega.

**Acceptance Scenarios**:

1. **Dado** que falta un campo aprobado, un recurso utilizable o alguna de las tres opciones y
   sus explicaciones, **cuando** intento publicar, **entonces** se bloquea la publicación y se
   identifican los faltantes de forma accesible, sin perder el borrador. (AD06)
2. **Dado** contenido completo y válido, **cuando** confirmo su publicación y activación,
   **entonces** la historia puede verse en el catálogo público vigente con ese mismo identificador
   y enlaces, sin una segunda copia ni exposición de datos de administración. (AD05/AD06/AD10)
3. **Dado** una publicación que no tiene activación confirmada, **cuando** consulto Historias
   pública, **entonces** no se muestra. La interfaz distingue Publicada de Activa y hace explícito
   si una acción solicita ambos cambios; publicar una historia desactivada no la reactiva sin decisión
   explícita de la persona. (AD05/AD06)
4. **Dado** contenido preparado, **cuando** publico, **entonces** imagen/alternativa, audio real y
   transcripción equivalente están disponibles conforme a sus reglas, y cada una de las tres opciones
   tiene una explicación de riesgo y prevención coherente con el relato. No se deduce una duración del
   dibujo ni se añade una respuesta correcta o puntuación. (AD06; 003/011)
5. **Dado** un fallo o resultado desconocido al publicar o reflejar el cambio en la web,
   **cuando** termina el intento, **entonces** no se afirma disponibilidad pública completa;
   se conserva el contenido confirmado, se puede comprobar el estado real y no se publican versiones
   parciales por una confirmación optimista. (AD05/AD06/AD10)
6. **Dado** una solicitud repetida o una respuesta antigua de publicación, **cuando** se procesa,
   **entonces** no duplica la historia ni cambia otro registro y no revierte un estado confirmado
   más reciente sin informar del conflicto. (AD04/AD06)
7. **Dado** recursos nuevos de un borrador no publicado, **cuando** se intenta acceder públicamente
   al contenido o a esos recursos privados antes de su publicación autorizada, **entonces** no se
   filtran para aparentar que la historia ya está disponible. (AD05/AD06)

### User Story 3 — Activar y desactivar sin perder contenido (Priority: P1)

Como persona administradora autorizada, quiero retirar o devolver una historia al catálogo,
para controlar su visibilidad conservando su contenido y referencias.

**Why this priority**: Es el mecanismo aprobado para retirar una historia; no se sustituye por borrado.

**Independent Test**: Con una historia publicada activa y un borrador, desactivar/reactivar la
publicada y contrastar tabla, contadores y catálogo vigente. Probar errores y activación inválida.

**Acceptance Scenarios**:

1. **Dado** una historia publicada activa, **cuando** confirmo su desactivación, **entonces** deja
   de aparecer en Historias pública y en Ver todas, pero conserva contenido, recursos, identificador
   y enlaces para una futura reactivación. (AD05/AD10)
2. **Dado** una historia publicada inactiva, **cuando** confirmo su activación, **entonces** vuelve
   al catálogo vigente una sola vez, con su contenido público válido y sus enlaces anteriores. Si hay
   cambios guardados sin publicar, se muestra la publicación vigente y esos cambios siguen privados. (AD05)
3. **Dado** un borrador, aunque presente una señal de activación incorrecta, **cuando** consulto la
   web pública o intento activarlo como si estuviera publicado, **entonces** nunca se expone como
   historia pública: antes debe cumplir la publicación completa. (AD05/AD06)
4. **Dado** un fallo o resultado desconocido al cambiar activación, **cuando** compruebo el control,
   **entonces** no se presenta el cambio como confirmado ni se pierde contenido; se muestra el
   estado comprobado o su incertidumbre y se permite verificar/reintentar sin duplicados. (AD05)
5. **Dado** cambios simultáneos o pérdida de autorización durante una operación, **cuando** otra
   operación pretende usar estado anterior, **entonces** no sobrescribe silenciosamente cambios
   confirmados ni elude la autorización; tabla y catálogo se actualizan desde resultados comprobados. (AD04/AD05; 006)

### User Story 4 — Editar conservando identidad y control editorial (Priority: P2)

Como persona administradora autorizada, quiero corregir una historia existente sin perder su
identidad ni publicar un trabajo incompleto, para mantener enlaces y contenido coherentes.

**Why this priority**: Completa el ciclo editorial sin crear historias duplicadas ni modificar
accidentalmente lo que ya consultan los visitantes.

**Independent Test**: Reabrir un borrador e identificar una historia publicada de prueba; cambiar
campos, guardar, reabrir y contrastar los enlaces. En una historia publicada activa, guardar cambios incompletos y comprobar
que sigue visible la publicación previa; completar y publicar después, conservando la misma identidad.
Comprobar también una publicada inactiva: editar/publicar no la reactiva automáticamente.

**Acceptance Scenarios**:

1. **Dado** un borrador guardado, **cuando** lo edito y vuelvo a guardar, **entonces** se conservan
   los nuevos valores confirmados en la misma historia, sin cambiar identificador ni crear otra fila. (AD04/AD06)
2. **Dado** una historia ya publicada, **cuando** inicio edición y guardo cambios,
   **entonces** se conserva un borrador de cambios asociado a la misma historia y se identifica
   como trabajo aún no publicado. La publicación anterior sigue vigente y, si estaba activa, visible;
   Guardar no reemplaza sus textos o recursos. Reabrir el editor recupera el trabajo guardado. (AD06; decisión Q1)
3. **Dado** cambios incompletos o un recurso inválido, **cuando** intento hacerlos públicos,
   **entonces** no se sustituyen contenidos públicos por una versión incompleta ni se afirma éxito;
   conservo el borrador y la publicación vigente. Cuando completo y publico los cambios, la versión
   publicada se reemplaza como contenido coherente de la misma historia, mantiene su activación
   y deja de presentar esos cambios como pendientes. Si el resultado es desconocido, se comprueba
   el estado antes de afirmar qué versión quedó vigente. (AD06; decisión Q1)
4. **Dado** cambio de título, categoría o contenido, **cuando** se confirma la actualización,
   **entonces** los enlaces existentes de la historia siguen identificándola y la página pública
   muestra solo el contenido elegible, sin crear un catálogo separado o reutilizar su identidad para otra. (AD04/AD06/AD10)
5. **Dado** dos personas autorizadas que editan la misma historia, **cuando** una intenta guardar
   sobre cambios más recientes de la otra, **entonces** se informa del conflicto y se puede recuperar
   el estado confirmado sin destruir silenciosamente el trabajo previo; no se presupone edición colaborativa. (AD06)
6. **Dado** un error de guardado o salida con cambios aún no confirmados, **cuando** decido cómo
   continuar, **entonces** distingo lo guardado de lo pendiente y puedo reintentar mientras haya
   autorización. Reautenticar no ejecuta automáticamente una edición anterior ni expone texto privado. (AD06; 006)

### User Story 5 — Consultar tabla, contadores y resultado público (Priority: P2)

Como persona administradora autorizada, quiero consultar el estado real de las historias y acceder
a su catálogo público, para gestionar el contenido sin confundirlo con consultas de Contacto.

**Why this priority**: Aporta orientación y comprobación del resultado, sin introducir estadísticas
educativas, aprobación pública o registros ficticios.

**Independent Test**: Preparar una mezcla identificada de borradores, publicadas activas e inactivas
con datos reales de prueba y consultas de Contacto controladas. Comprobar tabla, búsqueda/filtros,
contadores y navegación pública; probar vacío confirmado, carga y error por separado.

**Acceptance Scenarios**:

1. **Dado** historias guardadas, **cuando** abro la gestión, **entonces** la tabla muestra sus títulos,
   categorías, estados y acciones aprobadas, coherentes con los registros; no hay eliminación definitiva
   ni filas/identidades/cifras de demostración presentadas como reales. (AD03/AD04)
2. **Dado** los controles de búsqueda y Todas/Activas/Inactivas de la captura, **cuando** busco por
   título o cambio filtro, **entonces** Todas muestra los registros autorizados, Activas solo las
   publicadas activas e Inactivas el resto, incluidos borradores, siempre aplicando la búsqueda.
   Borrador se distingue de una categoría y no se cuenta como activa por una señal errónea. (AD04)
3. **Dado** guardados, publicaciones o cambios de activación confirmados, **cuando** actualizo la
   gestión, **entonces** los contadores derivan de las historias vigentes: Activas solo publicadas
   activas, Borradores las historias cuyo estado es borrador. Un reintento o revisión de la misma
   historia no se contabiliza como una nueva historia. Una publicada con borrador de cambios conserva
   su estado de publicada y su activación; ese trabajo pendiente no crea otra fila ni aumenta el
   contador de historias en estado de borrador. (AD03/AD04)
4. **Dado** consultas recibidas por Contacto, **cuando** se muestra su contador en el resumen,
   **entonces** usa la fuente privada real de 008 y una etiqueta acorde a lo que cuenta. Nunca usa
   elecciones de ejercicios, respuestas por caso ni cifras de la captura; responder una consulta
   cambia sus estados en 008, no incrementa por sí mismo el total de consultas conservadas ni lo
   convierte en un número de historias. Nuevas consultas o bajas conforme a 009 sí cambian ese total. (AD03; 005/008/009)
5. **Dado** una lista realmente vacía, **cuando** termina su comprobación, **entonces** se comunica
   vacío y se ofrece la acción aprobada de agregar. Si hay carga o error, se muestran como tales;
   no se reemplaza un dato desconocido por cero ni por registros de ejemplo. (AD03/AD04)
6. **Dado** historias en distintos estados, **cuando** uso Ver historias en la web,
   **entonces** abro Historias pública existente y solo encuentro publicadas activas, incluidas las
   nuevas elegibles, sin borradores, correos, controles privados ni duplicados. (AD10; 003)
7. **Dado** el panel en móvil, texto ampliado o uso con teclado, **cuando** consulto estados y uso
   sus controles, **entonces** puedo identificar historia/acción, recibir errores y cambios anunciados
   y regresar de forma comprensible; los permisos son iguales para todas las cuentas autorizadas. (AD03/AD04/AD10; 006/011)

### Edge Cases

- Datos solo de espacios, campos demasiado extensos, caracteres que parezcan instrucciones o marcado,
  recursos dañados/inaccesibles o tipo/tamaño no admitido: informar sin ejecutarlos ni confirmar publicación.
  Los límites técnicos deben definirse y comunicarse antes de implementar la parte afectada.
- Un borrador sin título sigue siendo identificable por su estado/identidad; una etiqueta de falta de
  contenido no se guarda como título editorial definitivo ni hace la historia publicable.
- Menos o más de tres opciones, explicación vacía para una opción, transcripción ausente o no equivalente
  y duración no respaldada por el audio: impedir publicación completa, sin convertir guardar en publicar.
- Una subida pendiente o rechazada no equivale a recurso disponible; conservar campos y avisar qué falta
  sin prometer recuperar un archivo que ya no está accesible para el navegador.
- Reintentos, doble clic, respuestas fuera de orden, corte de red o fallo al reflejar un cambio público:
  comprobar estado real y evitar duplicados, pérdida de contenido y confirmaciones falsas.
- Sesión expirada/cerrada, cuenta revocada y acceso directo a un borrador o recurso privado: aplicar006
  antes de entregar datos o producir cambios. No persistir contenido privado en superficies públicas.
- Edición concurrente, publicación concurrente y activar/desactivar con estado viejo: informar conflictos,
  no sobrescribir cambios confirmados a ciegas ni reemitir operaciones después de otro login.
- No aplicar una nueva edición pendiente o respuesta antigua a otra historia al cambiar de registro.
- Filtros sin resultados no equivalen a ausencia total de historias; los contadores globales no se convierten
  en cifras filtradas sin indicarlo. Un error en Contacto no convierte su contador en cero.
- Desactivar retira la historia del catálogo vigente; no se promete recuperar copias ya descargadas o
  cachés ajenas. Un recurso que ya es público por otro contenido no se vuelve privado por esa acción.
- Preservar los identificadores/enlaces de los tres casos iniciales de 003 al integrarlos; usar historias
  adicionales sintéticas solo en pruebas, sin declararlas materiales oficiales ni testimonios reales.

## Requirements

### Functional Requirements

- **FR-001 / AD03 — Resumen y contadores**: Contadores derivados de historias activas/borradores y comentarios de Contacto reales; sin cifras de demostración; coherentes al guardar/publicar/responder.
- **FR-002 / AD04 — Tabla de historias**: Título, categoría, estado y acciones de gestión aprobadas; registros reales conectados con contenido público; sin borrado definitivo (C27).
- **FR-003 / AD05 — Activar/desactivar historia**: Solo publicada y activa visible; desactivar conserva contenido; activar la devuelve a lista; borrador nunca público; errores sin cambio confirmado ni pérdida de contenido (C27).
- **FR-004 / AD06 — Crear, editar, borrador y publicar**: Campos: título, categoría, imagen, descripción, audio, transcripción, pregunta, tres opciones y sus explicaciones; borrador incompleto permitido; bloquear publicación incompleta; guardar/publicar diferenciados; sin eliminar definitivamente (C27).
- **FR-005 / AD10 — Ver historias en la web**: Abre Historias pública; refleja solo historias activas; no expone borradores ni correos

### Reglas y contenido complementario

**Permisos y operaciones reales**

- Aplican el acceso individual, permiso único y autorización por lectura/modificación de 006. La gestión
  incluye protección de borradores y recursos nuevos privados, no solo ocultación visual de controles.
- Confirmar guardado/publicación/activación solo según estado comprobado. Diferenciar guardado privado,
  disponibilidad pública y resultado desconocido. La publicación no se considera entregada por actualizar
  una pantalla administrativa. Si la acción solicita visibilidad pública, no se anuncia disponible hasta
  comprobarla; una publicación inactiva se informa como tal, sin prometer que ya puede verse en el catálogo.
- Mantener identidad y enlaces, evitar duplicados al crear/reintentar e informar conflictos de edición.
  No se exige una técnica de almacenamiento, transporte o coordinación determinada en este spec.

**Contenido y estados**

- Borrador permite trabajar con campos faltantes; Publicar exige todos los campos aprobados, exactamente
  tres opciones/explicaciones y recursos utilizables. Su validación técnica no acredita veracidad editorial,
  equivalencia de transcripción ni revisión de materiales por sí sola.
- Solo Publicada + Activa se expone como historia pública. La interfaz comunica qué acción solicita cada
  cambio y su resultado; activar no elude publicación, y una actualización no reactiva una historia
  desactivada sin decisión explícita. Desactivar conserva contenido, no borra la historia.
- Las tres opciones generan explicaciones de riesgo y prevención, sin correcta/incorrecta, puntuación,
  botón extra ni persistencia de respuestas educativas. No existe contador de respuestas por historia.
- Imagen/alternativa, audio/transcripción y duración deben corresponder al recurso real; sin material no
  se inventa archivo, duración o disponibilidad. Los derechos/revisión editorial siguen pendientes cuando falten.
- **Edición de publicados — decisión Q1, 2026-10-19**: Guardar conserva un borrador de cambios
  de la misma historia. La publicación anterior continúa vigente y visible si está activa; los nuevos
  textos/archivos guardados no sustituyen sus recursos ni se filtran al catálogo antes de Publicar.
- Reabrir el editor recupera los últimos cambios guardados y permite distinguirlos de lo publicado.
  Publicar exige validar el conjunto completo y reemplaza la publicación vigente de esa identidad
  sin mostrar una mezcla parcial de contenido anterior/nuevo. Tras confirmación, esos cambios dejan
  de estar pendientes. Un fallo confirmado conserva el trabajo y la publicación anterior; ante un
  resultado desconocido se verifica antes de afirmar cuál quedó vigente o repetir la acción.
- Guardar/Publicar cambios no altera por sí mismo la activación. Si la historia estaba desactivada,
  permanece fuera del catálogo hasta una activación explícita. Si estaba activa, Guardar deja visible
  la publicación previa y Publicar sustituye el contenido público cuando su resultado esté confirmado.
  Desactivar mientras hay cambios pendientes conserva tanto publicación como borrador de cambios.
- El borrador de cambios no es otra historia ni un historial de versiones navegable; se mantiene
  una identidad y un conjunto de enlaces. La política no añade comparación/restauración de versiones
  ni permisos de aprobación adicionales.

**Tabla, resumen y navegación**

- Respetar jerarquía de la captura: navegación privada, título/Agregar historia, resumen, búsqueda/filtros,
  tabla/acciones y acceso a Historias pública. La zona de consultas corresponde al flujo privado de 008.
- Activas cuenta historias publicadas activas; Borradores cuenta historias cuyo estado es borrador, no
  operaciones de guardado ni copias de una misma identidad. Una publicada con borrador de cambios
  sigue siendo publicada; se comunica el trabajo pendiente sin sumarlo como otra historia/borrador
  del resumen. Los contadores son globales, salvo indicación expresa de un alcance distinto.
- El indicador de Contacto cuenta consultas/mensajes según 008; no ejercicios ni respuestas educativas.
  Sus etiquetas y filtros deben corresponder al dato real. No se copian los números03/01/128 de la imagen.
- Búsqueda por título y filtros de activación conservan la distinción entre activación y publicación.
  No se añaden acciones de eliminación o moderación pública bajo un menú de acciones secundarias.
- Duración u otros metadatos conservados de la captura deben provenir del recurso correspondiente;
  si son desconocidos se informa, sin valores de ejemplo presentados como medición real.
- Ver historias en la web abre el listado existente de 003; respeta sus destacados/listado completo en
  la misma página. No se amplía a un catálogo independiente ni a una vista pública de borradores.

**Accesibilidad y recursos**

- Etiquetas, obligatoriedad de publicación, errores asociados, foco visible, teclado y feedback anunciado
  aplican al editor, tabla, búsqueda, filtros y cambios de estado, sin depender solo del color o iconos.
- Comprobar 360/390/430/768/1024/1280/1440px y texto 100/200%, contraste 4.5:1 texto y 3:1 texto grande/
  componentes, controles aproximadamente 44px y lectura sin desbordamientos que impidan operar.
- Diseño preciso del editor, formatos/tamaños/límites y proveedores son decisiones del plan antes de
  implementar sus partes afectadas; no se inventan campos/servicios o restricciones de negocio adicionales.
- Las políticas de historias/recursos no heredan 90d de Contacto. Recursos temporales, versiones y copias
  requieren tratamiento operativo definido sin introducir eliminación definitiva de historias en la interfaz.

### Key Entities

- **Historia administrada**: identidad estable, título, categoría, imagen/alternativa, descripción,
  audio/transcripción, pregunta y tres opciones con explicación; contenido real o faltantes identificados.
- **Estado editorial**: borrador/publicada y activación; determina elegibilidad pública. El trabajo de edición
  de una publicada se conserva como borrador de cambios sin convertir cada guardado en una historia nueva.
- **Publicación vigente y borrador de cambios**: contenido confirmado para consumo público y trabajo
  guardado pendiente de Publicar de la misma historia. Guardar no sustituye la publicación; no representan
  dos historias ni una interfaz de historial. La activación determina si la publicación vigente es visible.
- **Recurso asociado**: material de imagen/audio y su disponibilidad, equivalencia accesible y metadatos reales;
  distingue un archivo pendiente/privado de uno disponible para una publicación autorizada.
- **Operación de gestión**: historia afectada, intención de guardar/publicar/activar/desactivar y resultado
  confirmado/fallido/desconocido/conflictivo; no autoriza repetir una modificación tras reautenticación.
- **Resumen derivado**: conteos de historias activas/borradores y referencia a consultas reales de 008,
  con alcance y estados de carga/error/vacío diferenciados, sin estadísticas de ejercicios.
- **Selección de tabla**: búsqueda por título y filtro de activación; no cambia el estado persistido ni permisos.
- **Catálogo público vigente**: historias elegibles de 003, con identidades/enlaces conservados y sin datos privados.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Guardar y reabrir borradores de prueba conserva todos los campos efectivamente confirmados
  y una sola identidad por historia; ninguna creación/edición fallida o desconocida se anuncia como éxito
  ni aparece en la web por ser borrador. Se comprueban US1.1–6.
- **SC-002**: Cada campo/recurso obligatorio faltante o inválido y cada conjunto distinto de tres opciones
  impide publicación con explicación accesible; una historia completa publicada activa presenta el contenido
  y las tres explicaciones correctas en el catálogo vigente, sin valores de demostración. US2.1–7.
- **SC-003**: En una mezcla de borradores, publicadas activas e inactivas, el conjunto público contiene
  únicamente publicadas activas, sin duplicados. Desactivar/reactivar modifica visibilidad conservando
  identidad/contenido/enlaces, y un error no se representa como cambio confirmado. US3.1–5.
- **SC-004**: Los cambios confirmados sobre una historia conservan sus enlaces; la edición de publicados
  mantiene vigente la publicación anterior al Guardar (visible si está activa) y solo la sustituye mediante Publicar completo,
  conservando activación/identidad/enlaces y sin mezclar recursos de borrador. Ningún conflicto o edición
  incompleta reemplaza silenciosamente contenido confirmado. US4.1–6 y decisión Q1.
- **SC-005**: La tabla, búsqueda/filtros y todos los contadores probados coinciden con los registros y
  estados reales del alcance indicado. Carga/error/vacío no se confunden y Ver historias en la web
  abre el catálogo de 003 sin información privada. US5.1–7.
- **SC-006**: Dos cuentas autorizadas tienen los mismos permisos de gestión. El 100% de las operaciones
  privadas probadas rechaza falta/alteración/expiración/cierre de sesión o autorización retirada antes
  de revelar borradores/recursos privados o modificar datos; una nueva identificación no reejecuta cambios.
- **SC-007**: Las 14 combinaciones de ancho/texto permiten completar los recorridos aplicables con teclado,
  etiquetas/foco/feedback, sin recorte impeditivo, con objetivos de contraste y tamaño de control medidos.
  Lector de pantalla y fidelidad con recursos oficiales requieren evidencia independiente.
- **SC-008**: Los cinco requisitos originales y los 31 escenarios locales se enlazan con evidencia o un
  bloqueo explícito antes del cierre. Materiales, publicación pública, contador de Contacto, permisos,
  errores y políticas operativas se comprueban por separado; mocks o documentación no acreditan entrega.

## Assumptions

- Se conservan los cinco requisitos originales y C27; las prioridades organizan la entrega, no cambian
  requisitos ni convierten P2 en opcional para la aceptación final. No se inventan IDs históricos HU/CA/TSK.
- Todas las personas administradoras autorizadas tienen el mismo permiso de 006; no se añade editor,
  superadministrador o flujo de aprobación por otra persona.
- La captura aporta estructura; sus registros, cifras y duraciones no son datos oficiales. Búsqueda y filtros
  conservan su función visible sin crear nuevos módulos de administración o estadísticas educativas.
- Guardar es distinto de publicar. La usuaria resolvió la edición de publicados mediante Q1; la separación
  entre publicación y borrador de cambios es comportamiento aprobado, no una elección de tecnología.
- Los contadores cuentan historias: una publicada con trabajo pendiente no se considera una historia nueva
  en estado de borrador. No se añade una métrica de revisiones o actividad editorial al resumen aprobado.
- No se elige almacenamiento, infraestructura de medios, proveedor, formato/tamaño máximo o procedimiento
  de publicación por defecto. El plan debe fijar sus decisiones técnicas y requisitos antes de implementarlos.
- Las pruebas pueden usar contenidos adicionales identificados como sintéticos y cuentas de prueba autorizadas,
  sin presentarlos como relatos/materiales reales ni publicar datos privados para simular integración.

## Dependencias, pendientes y condiciones de cierre

- **003**: catálogo de Historias y sus tres casos iniciales, material/accesibilidad y actividad local. Integrar
  altas/cambios/activación de 007 con la misma página e identidades, sin exponer selección educativa al servidor.
- **006**: acceso/permiso único y protección por operación. Implementación local verificada y subida, pero su
  calificación productiva sigue abierta; esto no autoriza un panel productivo o un adaptador sin comprobar.
- **005/008**: fuente de consultas de Contacto y contadores reales. No crear por 007 bandeja, correo o endpoints
  públicos de lectura para llenar un indicador. Si falta integración, señalar pendiente/error y no inventar cero.
- **009/P02**: políticas operativas de historias/archivos/copias, acceso y proveedores. No aplicarles 90d por defecto.
- **010/011/P01/P03**: textos y recursos oficiales, derechos/revisión editorial, alternativas, equivalencia de
  transcripción, nueve explicaciones de los tres casos y fidelidad/lector manual cuando corresponda.
- **P04**: edición de publicados resuelta en Q1; quedan diseño preciso del editor y formatos/tamaños/límites/
  validación/tratamiento de archivos para el plan, antes de implementación afectada. La separación de
  contenidos aprobada debe respetarse independientemente de las decisiones técnicas posteriores.
- **Entrega**: probar persistencia, autorización, catálogo público vigente, recursos y contadores reales,
  conflictos/fallos/reintentos, matriz accesible e integración entre features. Una simulación visual no acredita
  publicación real, contador integrado, acceso productivo ni satisfacción de dependencias externas.

## Trazabilidad y verificación

| ID original | Requisito local | Escenarios principales | Fuente | Estado |
|---|---|---|---|---|
| AD03 | FR-001 | US5.1/3–5/7 | Captura administrativa / R35 | Implementado/verificado localmente; cierre pendiente |
| AD04 | FR-002 | US1.1/3/5; US3.5; US4.1/4; US5.1–3/5/7 | Captura administrativa / R35 C27 | Implementado/verificado localmente; cierre pendiente |
| AD05 | FR-003 | US2.2–3/5/7; US3.1–5 | Captura administrativa / R35 C27 | Implementado/verificado localmente; cierre pendiente |
| AD06 | FR-004 | US1.1–6; US2.1–7; US3.3; US4.1–6 | R35 C27 / Q1 | Implementado/verificado localmente; cierre pendiente |
| AD10 | FR-005 | US2.2/5; US3.1; US4.4; US5.6–7 | Captura administrativa / R35 | Implementado/verificado localmente; cierre pendiente |

Estos escenarios son locales a 007; no sustituyen los documentos históricos ausentes02–07.
Especificación revisada no significa implementación ni evidencia de aceptación. Materiales/proveedores,
configuración técnica e integración de dependencias deben constar con decisión o bloqueo explícito.

## Registro

2026-10-19 — `/speckit-specify 007`: desarrollo del directorio existente, sin crear otra feature o rama.
AD03/AD04/AD05/AD06/AD10 conservados literalmente; cinco historias/31 escenarios y ocho criterios medibles.
La usuaria resolvió P04/edición mediante Q1 (opción A): guardar conserva cambios privados y mantiene
la publicación previa hasta Publicar. Se sincronizan escenarios/estados/contadores y aceptación; no se
atribuyen decisiones técnicas o cifras reales al wireframe. Sin código, tests de aplicación, commit/push/despliegue.

2026-10-19 — `$speckit-implement 007`: servicioSQLite y autorización006, borradores/recibos/CAS,
publicaciónQ1/activación, medios privados con inspección aislada, editor/tabla/resumen y productor003
implementados. Evidencia local y límites en [evidence.md](evidence.md); T056–T059 permanecen abiertas.
Los materiales sintéticos no acreditan revisión editorial, derechos o operación productiva.
