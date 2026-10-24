# Feature Specification: Inicio e identidad de Priva

**Feature Directory**: `specs/002-inicio-institucional`
**Created**: 2026-10-16
**Updated**: 2026-10-20 (America/Bogota)
**Status**: componentes validados contractualmente en Chromium y Firefox; cinco textos educativos y recursos comunes aprobados/recibidos. Imágenes institucionales recibidas; revisión visual/manual aceptada por la usuaria. WebKit e integración pendientes.
**Input**: `/speckit-specify 002`: desarrollar la especificación existente conservando alcance e IDs.
**Fuentes**: [SPEC R35](../reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md), I01–I04,
PDF página 1 y [constitución 1.0.0](../../.specify/memory/constitution.md).

## User Scenarios & Testing

### User Story 1 — Conocer la identidad de Priva (Priority: P1)

Como visitante, quiero entender qué es Priva y su propósito para reconocer qué información
puedo encontrar sobre el cuidado de mis datos personales.

**Why this priority**: Es el objetivo principal de la página y la entrada a su contenido institucional.

**Independent Test**: Abrir Inicio directamente, leer hero e identidad y usar Conocer más
con teclado y puntero; verificar el destino sin requerir formulario, login o audio.

**Acceptance Scenarios**:

1. **Dado** Inicio abierto, **cuando** consulto su primer bloque, **entonces** encuentro la
   etiqueta TUS DATOS, TU DERECHO, el título “La privacidad también es una forma de libertad.”,
   su descripción, imagen y control Conocer más según la composición del PDF 1. (I01)
2. **Dado** Conocer más disponible, **cuando** lo activo con puntero o teclado, **entonces**
   llego a Quiénes somos / Somos Priva en la misma página, mediante #somos-priva,
   con encabezado visible y posibilidad de seguir recorriendo el contenido. (I01, I02)
3. **Dado** el bloque de identidad, **cuando** lo leo, **entonces** encuentro su imagen,
   etiqueta QUIÉNES SOMOS, título Somos Priva y descripción de referencia, sin insertar
   una historia principal de María ni un destino #maria. (I02)
4. **Dado** una visita directa a Inicio con #somos-priva, **cuando** se carga o recarga,
   **entonces** la sección de identidad se identifica y el título no queda oculto. (I02)

### User Story 2 — Comprender las áreas de contenido (Priority: P2)

Como visitante, quiero conocer las cuatro áreas de Priva para entender qué contenidos
educativos propone sin recibir promesas de servicios no comprobados.

**Why this priority**: Permite valorar la propuesta, manteniendo la veracidad del contenido.

**Independent Test**: Consultar Qué hacemos, comprobar los cuatro títulos y contrastar
sus descripciones con el contenido revisado y el estado de las capacidades anunciadas.

**Acceptance Scenarios**:

1. **Dado** el bloque Qué hacemos, **cuando** lo consulto, **entonces** encuentro la etiqueta,
   el título “Informamos para que estés en control.”, la introducción y cuatro tarjetas:
   Educación Digital, Historias reales, Herramientas Seguras y Acompañamiento, en ese orden. (I03)
2. **Dado** un acceso directo a #que-hacemos, **cuando** abro Inicio con esa ancla,
   **entonces** alcanzo la sección correcta con su encabezado visible. (I03)
3. **Dado** una descripción que anuncia curaduría, asistencia u otra capacidad pendiente,
   **cuando** se revisa la página para publicación, **entonces** esa promesa no se publica
   como un servicio existente sin respaldo; requiere revisión identificable sin eliminar silenciosamente la tarjeta ni inventar una redacción aprobada. La revisión de los cinco textos educativos actuales ya está aprobada; cualquier cambio material invalida esa revisión. (I03)
4. **Dado** las cuatro tarjetas informativas del dibujo, **cuando** recorro la página con
   teclado, **entonces** no encuentro enlaces o botones ficticios añadidos a esas tarjetas. (I03)

### User Story 3 — Continuar hacia Historias (Priority: P2)

Como visitante, quiero acceder a Historias desde el cierre de Inicio para seguir aprendiendo
sobre los riesgos relacionados con mis datos.

**Why this priority**: Conecta la presentación institucional con el contenido educativo.

**Independent Test**: Llegar al bloque final y activar Explora nuestras historias con teclado
 y puntero; comprobar el destino y los textos sin exigir reproducir episodios de 003.

**Acceptance Scenarios**:

1. **Dado** el bloque final, **cuando** lo consulto, **entonces** veo la etiqueta TU PRIVACIDAD
   IMPORTA, el título “Infórmate, protégete, conéctate con seguridad.”, su imagen y
   el botón Explora nuestras historias conservando la jerarquía del PDF 1. (I04)
2. **Dado** ese bloque, **cuando** leo su párrafo, **entonces** el texto es exactamente:
   “Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.”;
   no se conserva el párrafo anterior “Únete a miles de personas”. (I04, C16)
3. **Dado** Explora nuestras historias, **cuando** lo activo con teclado o puntero,
   **entonces** llego a la página Historias. No abre Instagram, una descarga ni #maria. (I04)

### Edge Cases

- Las visitas directas a #somos-priva y #que-hacemos funcionan sin navegación previa.
- Un encabezado fijo no oculta el título al llegar a un ancla; la navegación permite continuar
  con teclado sin trampas de foco y respeta preferencias de movimiento reducido.
- Sin imágenes oficiales, no se inventan recursos ni se certifica fidelidad: el faltante queda
  registrado. No retirar un bloque para ocultarlo ni publicar placeholders como entrega final.
- Si una imagen falla, no se pierde el texto ni el funcionamiento de los controles; se mantienen
  sus alternativas pertinentes y el problema se registra para corregirlo antes de cerrar fidelidad.
- Si Historias aún no existe, la prueba integrada de I04 queda bloqueada; no usar un href vacío,
  `#` aislado o página ficticia como evidencia de recorrido completo.
- Si una capacidad de las tarjetas sigue sin comprobarse, la publicación de ese contenido queda
  bloqueada, aunque el trabajo de estructura independiente pueda continuar.
- Al apilar bloques y ampliar texto, se mantiene su orden y no se corta contenido; las tarjetas
  no reciben acciones nuevas por estar presentadas visualmente como tarjetas.

## Requirements

### Functional Requirements

- **FR-001 / I01 — Hero y acceso a identidad**: Inicio DEBE mostrar etiqueta TUS DATOS, TU DERECHO,
  título “La privacidad también es una forma de libertad.”, descripción, imagen y Conocer más
  según el PDF 1. Conocer más DEBE llevar a la sección Quiénes somos mediante #somos-priva
  en la misma página, con título visible y operación por teclado y puntero.
- **FR-002 / I02 — Quiénes somos**: La sección DEBE conservar imagen, etiqueta QUIÉNES SOMOS,
  título Somos Priva, descripción y composición de referencia. DEBE identificarse con
  #somos-priva y permitir visitas directas. NO DEBE añadirse una historia principal de María,
  una historia adicional de suplantación o un enlace/ancla #maria. Fuente: C07.
- **FR-003 / I03 — Qué hacemos**: La sección #que-hacemos DEBE conservar etiqueta, título
  “Informamos para que estés en control.”, introducción y las cuatro tarjetas Educación Digital,
  Historias reales, Herramientas Seguras y Acompañamiento, en ese orden. Las descripciones
  DEBEN revisarse contra las capacidades existentes antes de publicarse. P03 está resuelto para los cinco textos educativos actuales mediante aprobación explícita registrada en [editorial-review.md](evidence/editorial-review.md); un cambio material exige nueva revisión.
  NO DEBEN inventarse servicios, promesas verificadas o acciones en tarjetas informativas.
- **FR-004 / I04 — Cierre hacia Historias**: Inicio DEBE conservar título, etiqueta e imagen
  del cierre del PDF 1, con Explora nuestras historias enlazado a Historias. DEBE sustituir
  el párrafo completo anterior por “Aprende a reconocer riesgos y toma decisiones más
  informadas sobre tus datos personales.”, sin conservar la afirmación de miles de personas.
  El recorrido DEBE funcionar con teclado y puntero. Fuente: C16.

### Orden y composición de la página

1. Encabezado compartido de 001.
2. Hero: texto a la izquierda, imagen a la derecha en referencia de escritorio.
3. Quiénes somos: imagen a la izquierda, texto a la derecha.
4. Qué hacemos: introducción a la izquierda y cuatro tarjetas en cuadrícula a la derecha.
5. Cierre: texto/CTA a la izquierda e imagen a la derecha; fondo oscuro de referencia.
6. Footer compartido de 001, con año 2026.

La adaptación móvil mantiene ese orden de lectura de los bloques y el orden de tarjetas.
No se fijan aquí medidas, fuente o valores de color como si estuvieran certificados por el PDF.
Los detalles de adaptación y diseño técnico se justifican en el plan, conservando la referencia.

### Contenido de referencia y pendientes editoriales

La referencia para la descripción del hero es:
“Información y herramientas para proteger tus datos personales y tomar decisiones seguras,
conscientes y sin fricciones en el mundo digital.”

La descripción de Somos Priva es:
“Una plataforma creada para ayudarte a entender, proteger y gestionar tus datos personales.
Creemos en un internet más transparente, libre y seguro, donde la información sea un derecho
inalienable y nunca un riesgo.”

La introducción de Qué hacemos y las cuatro descripciones vigentes son los cinco textos educativos aprobados explícitamente en [editorial-review.md](evidence/editorial-review.md), aplicados literalmente en `src/content/home.ts`. Mantienen títulos y orden, sin prometer curaduría o asistencia operativas. La referencia del PDF se conserva como fuente histórica, no como capacidades acreditadas. Un cambio material requiere registrar el nuevo texto y su decisión antes de publicar; no reintroducir garantías absolutas.

### Límites de alcance y contratos con otras features

- 002 aporta contenido de Inicio; 001 es responsable del menú, activo Inicio, CTA de encabezado
  PROTÉGETE HOY y footer. Se reutilizan sus comportamientos sin duplicar requisitos o componentes.
- Referencias de ruta de R35: Inicio `/index.html`; anclas `/index.html#somos-priva` y
  `/index.html#que-hacemos`; CTA final `/historias.html`. Son destinos propuestos para integración,
  las páginas y anclas ya existen en código, sin acreditar por ello un entorno integrado. Cambios de ruta exigen sincronizar fuentes y consumidores.
- Los enlaces Saber más de Historias (003) pueden consumir las dos anclas de Inicio; 002 asegura
  que existan, sin implementar en esta feature los controles ni episodios de Historias.
- Fuera de alcance: formularios, autenticación, nuevas ofertas, cuentas de visitantes, comentarios,
  chat IA, diagnóstico, historias adicionales o acciones de tarjeta no incluidas en las fuentes.
- No se incorpora captura de datos, almacenamiento de preferencias ni estadísticas a Inicio.

### Key Entities

- **Bloque institucional**: orden, etiqueta, título, descripción, imagen y destino si lo tiene.
- **Tarjeta informativa**: uno de los cuatro títulos establecidos, descripción y estado de
  revisión de la capacidad; no constituye un servicio operativo por aparecer en la referencia.
- **Recurso visual**: bloque al que pertenece, archivo oficial, propósito informativo/decorativo,
  alternativa adecuada y estado recibido/pendiente; no se inventan archivos de entrega.
- **Enlace institucional**: etiqueta, página y sección de destino; Conocer más y CTA final.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Inicio muestra sus cuatro bloques de contenido (hero, identidad, áreas y cierre),
  entre encabezado y footer, en el orden definido; Qué hacemos contiene exactamente cuatro
  tarjetas con los títulos y orden establecidos, sin historia principal adicional.
- **SC-002**: Conocer más y las visitas directas/recargas a #somos-priva y #que-hacemos llegan
  a sus secciones con encabezados visibles; los dos controles de contenido son operables con
  teclado y puntero sin trampa de foco, y el CTA final lleva a Historias.
- **SC-003**: El párrafo del cierre coincide íntegramente con C16; ningún texto pendiente de
  comprobación se publica como capacidad verificada ni conserva la afirmación de miles de personas.
- **SC-004**: Los bloques, tarjetas y dos recorridos de contenido se utilizan a 360/390/430/768/
  1024/1280/1440 px con texto al 100% y 200%, sin recortes ni desplazamiento horizontal.
  La composición final se contrasta con PDF 1 y los recursos oficiales; no basta extraer texto.
- **SC-005**: Todas las imágenes finales tienen tratamiento informativo/decorativo adecuado;
  el fallo de una imagen no elimina texto ni controles. No quedan recursos ficticios o placeholders
  en la entrega final. Los textos y controles cumplen los objetivos de accesibilidad de 011.

Son criterios de aceptación. La evidencia contractual de Chromium/Firefox no sustituye la revisión final con imágenes oficiales ni la aceptación integrada; ver [estado actual](evidence/summary.md).

## Assumptions

- “002” selecciona este directorio existente; no crea otra feature ni autoriza implementación.
- Se preservan I01–I04 y FR-001–FR-004; los escenarios locales no son el catálogo 07 ausente.
- Las prioridades organizan el trabajo sin añadir decisiones de producto ni tecnologías.
- Las tarjetas son informativas: el PDF no define para ellas un recorrido accionable adicional.
- El contenido es público y se puede leer sin cuenta. No se define localización adicional.
- Se aprovecha la navegación compartida de 001 ya implementada, sin dar por cerrada su fidelidad
  ni sus destinos integrados pendientes.

## Dependencias y condiciones de cierre

- **001**: navegación, layout y footer compartidos; la integración debe mantener activo Inicio.
- **003**: la página Historias ya existe en código; el recorrido real del CTA final aún debe verificarse contra un entorno integrado.
- **011 / P01 / P04**: logo, fuente y colores exactos recibidos desde `disenovisual/`; las tres imágenes institucionales oficiales están recibidas y conectadas, y sigue pendiente la revisión final de fidelidad;
  objetivos de contraste 4.5:1 texto normal y 3:1 texto grande/componentes, controles aproximadamente
  44 px, foco visible y alternativas adecuadas. Se evalúan, no se atribuyen al dibujo como mediciones.
- **P03**: revisión de la introducción y las cuatro descripciones educativas aprobada y aplicada. La decisión no acredita servicios operativos; cualquier cambio material debe revisarse y no permite retirar o reescribir silenciosamente el bloque.
- **009**: restricciones de privacidad aplicables; esta feature no añade recopilación ni rastreo.
- Los pendientes de material/editoriales permiten avanzar en estructura y planificación
  independiente, pero impiden afirmar publicación o fidelidad completas hasta resolverse.
- No se requieren proveedores, credenciales o decisiones técnicas nuevas para definir este alcance.

## Trazabilidad y verificación

| ID original | Requisito local | Escenarios | Fuente | Estado de aplicación |
|---|---|---|---|---|
| I01 | FR-001 | US1.1, US1.2 | PDF 1 | Validación contractual Chromium/Firefox; recursos recibidos; fidelidad e integración pendientes |
| I02 | FR-002 | US1.2–US1.4 | PDF 1 / C07 | Validación contractual Chromium/Firefox; recursos recibidos; fidelidad e integración pendientes |
| I03 | FR-003 | US2.1–US2.4 | PDF 1 / P03 | Validación contractual Chromium/Firefox; recursos recibidos; fidelidad e integración pendientes |
| I04 | FR-004 | US3.1–US3.3 | PDF 1 / C16 | Validación contractual Chromium/Firefox; recursos recibidos; fidelidad e integración pendientes |

### Registro documental histórico

2026-10-16 — `/speckit-specify 002`: ampliada la separación inicial con tres historias,
escenarios concretos, composición, anclas, criterios medibles y pendientes P01/P03/P04.
Sin cambios de alcance, decisiones editoriales inventadas, implementación ni pruebas de aplicación.

2026-10-16 — `$speckit-clarify 002`: revisión de alcance, entidades, recorridos,
accesibilidad, privacidad, dependencias, errores, restricciones, términos y cierre.
No se detectaron ambigüedades críticas de comportamiento que requieran preguntas.
P01/P03/P04 continúan como dependencias de material/revisión editorial; no se aprueban
capacidades ni se inventa contenido para resolverlas. Checklist documental revalidado:
16/16 antes y después, sin cambios de estado. Lista para planificación independiente;
publicación/fidelidad y pruebas de aplicación siguen pendientes.

2026-10-16 — `$speckit-plan 002`: enfoque y dependencias documentados en [plan.md](plan.md),
con modelo, contrato y guía de validación. Sin cambios de I01–I04, publicación ni pruebas ejecutadas.

2026-10-16 — `$speckit-tasks 002`: generadas [28 tareas](tasks.md) por historia,
con dependencias, gates de publicación y evidencia prevista; ninguna ejecutada.

2026-10-16 — `$speckit-implement 002`: bloques y controles implementados, gate de
publicación y pruebas contractuales. Evidencia en evidence/summary.md; P01/P03/P04
siguen abiertos. Ningún resultado contractual acredita destino real 003 o aprobación editorial.

## Reanudación 2026-10-21

Marca, fuente y paleta recibidas desde disenovisual; cinco textos educativos aprobados explícitamente y aplicados con evidencia en [editorial-review.md](evidence/editorial-review.md). Las imágenes oficiales siguen pendientes; el enlace provisional placehold.co/448x332 devuelve HTTP 403 al descargar. Firefox ya permite verificar recorridos principales; WebKit sigue bloqueado por bibliotecas del host. Páginas 003–005 existen en código; falta URL real para aceptación integrada. No se acredita publicación ni fidelidad final. Estado actual y resultados en [evidence/summary.md](evidence/summary.md); las notas anteriores son históricas.

## Convergencia aplicada — 2026-10-20 (America/Bogota)

T029: estados vigentes sincronizados en el cuerpo del documento. La reanudación previa está fechada 2026-10-21 UTC en sus logs (2026-10-20 en America/Bogota); no representa una aprobación distinta. Se conservan las decisiones y evidencias existentes, sin cerrar imágenes, fidelidad o integración por edición documental.

## Recursos recibidos — 2026-10-23 (America/Bogota)

Las imágenes aportadas están conectadas como `/images/home/hero.png`, `/images/home/identidad.png` y `/images/home/cierre.png`, 500 × 350px, con procedencia y clasificación en [evidence/resources.md](evidence/resources.md). T025/T030 completas y gate de Inicio aprobado. Los bloqueos de imágenes anotados en registros anteriores son históricos; no se cierran por ello fidelidad manual, WebKit o aceptación integrada.

## Revisión manual aceptada — 2026-10-23

La responsable aprobó visualmente Inicio, confirmó el rotor de encabezados y aceptó los pasos guiados con VoiceOver en su Mac (`localhost:4321`). T026/T032 completas en el alcance de revisión de Inicio; 28/33 tareas. [Registro y límites](evidence/manual-review.md). La confirmación no equivale a auditoría externa ni sustituye WebKit, integración real o datos operativos pendientes de otras features.
