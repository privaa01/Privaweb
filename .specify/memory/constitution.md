# PRIVA — Constitución del proyecto web

**Metodología**: Spec-Driven Development (SDD: desarrollo guiado por especificaciones).
**Revisión documental de origen**: R36.
**Propósito**: establecer las reglas para especificar, planificar, implementar y verificar la web.
**Estado**: constitución incorporada a solicitud de la usuaria; no acredita implementación ni pruebas superadas.

## Core Principles

### 1. Autoridad y prioridad de las fuentes

**CONST-01 — Las decisiones explícitas gobiernan el alcance.**

- Una instrucción vigente de la responsable del proyecto prevalece sobre una decisión anterior que contradiga expresamente.
- Esta constitución define cómo se trabaja; el SPEC define qué debe construirse; las historias y sus criterios precisan el comportamiento; el plan y las tareas organizan la ejecución. No pueden contradecirse.
- Los wireframes definen estructura, jerarquía y componentes visuales, salvo diferencias aprobadas y registradas. Los detalles añadidos por necesidad técnica deben identificarse como derivados, no atribuirse al dibujo.
- Ante un conflicto, registrar fuentes, regla afectada, impacto y resolución. Una tarea, propuesta técnica o código existente no modifica por sí solo el requisito.
- Las instrucciones gráficas vigentes permiten modificar únicamente el año de los cuatro footers del PDF: **2025 → 2026**. La indicación anterior de 2006 fue corregida; no es vigente.

**Comprobación:** cada diferencia de alcance tiene una decisión identificable en el historial; no se resuelve con supuestos silenciosos.

### 2. Especificación antes de implementación

**CONST-02 — Ninguna funcionalidad se incorpora sin una especificación trazable.**

Flujo de trabajo: constitución → especificación → historias y criterios → plan técnico → tareas → implementación → verificación → actualización documental.

- Antes de implementar una función, definir actor, necesidad, comportamiento, datos, estados, errores, dependencia y aceptación.
- La historia debe seguir «Como [actor], quiero [acción], para [objetivo]»; los criterios deben expresar condiciones observables con Dado/Cuando/Entonces.
- La especificación describe el resultado necesario sin fijar proveedores o tecnologías no decididos. El plan justifica las elecciones técnicas y sus dependencias.
- La selección de tecnología no puede eliminar requisitos ni introducir datos, pantallas o flujos fuera de alcance.
- Una ambigüedad que cambie comportamiento, datos o alcance queda pendiente de decisión. El trabajo independiente de esa decisión puede continuar.

**Comprobación:** no iniciar la parte bloqueada de una tarea si su comportamiento o dependencia crítica sigue sin definir.

### 3. Alcance controlado

**CONST-03 — Se implementa únicamente el alcance aprobado.**

- Páginas públicas: Inicio, Historias, Priva App y Contáctanos; auxiliares: Términos, Manifiesto y 404.
- Administración privada: cuentas individuales autorizadas, gestión de historias y bandeja de Contacto.
- No hay registro público de visitantes, perfiles públicos ni comentarios publicados. El ejemplo «Crear cuenta» usado para redactar historias no constituye un requisito de producto.
- Priva App es un prototipo. La web presenta funciones previstas; no incorpora un chat con IA ni un diagnóstico funcional.
- Historias comienza con los tres casos del wireframe y admite nuevas historias publicadas y activas. No se añade una historia principal de suplantación de María ni una sección #maria.
- No añadir lista de espera, roles administrativos nuevos, eliminación definitiva de historias, estadísticas de ejercicios o catálogo separado sin decisión de alcance.

**Comprobación:** toda tarea se justifica con un requisito vigente; cualquier ampliación exige registrar y sincronizar la decisión antes de construirla.

### 4. Trazabilidad y documentación única

**CONST-04 — Cada función debe poder seguirse desde su fuente hasta su prueba.**

Cadena obligatoria: fuente/decisión → requisito → historia de usuario → criterios detallados → tarea → prueba → evidencia.

- Usar identificadores estables. Los requisitos G/I/H/A/C/AD/X/CT se enlazan con TSK-R, CA-R y las historias HU y CA numerados del catálogo 07.
- La línea base actual contiene **53 requisitos, 53 historias, 53 tareas y 195 criterios detallados**. Son inventario documental, no resultados de ejecución; actualizar los totales si cambia el alcance.
- Un criterio detallado desarrolla un requisito; no debe generar tareas duplicadas para la misma implementación. Una tarea puede contener subtareas verificables si su alcance lo exige.
- Mantener un archivo vigente por documento. Actualizarlo directamente; no crear copias «final», «v2» o «corregido». El historial conserva motivos y decisiones, no versiones completas duplicadas.
- Ante un cambio, revisar todos los documentos afectados en la misma revisión. No basta con agregar una nota si el cuerpo vigente sigue contradiciéndola.

**Comprobación:** la matriz no contiene requisitos, historias, criterios ni tareas huérfanas; las referencias apuntan a IDs existentes.

### 5. Privacidad y separación de datos

**CONST-05 — Solo se recopilan y conservan los datos del flujo aprobado.**

- Contacto requiere nombre o alias, correo y mensaje; acepta seudónimo, sin exigir identidad legal. Límites aprobados: alias 1–60 y mensaje 1–1500 caracteres tras recortar extremos; no aceptar solo espacios.
- Guardar comentario y datos de Contacto para consulta privada del equipo autorizado. La respuesta se redacta desde el panel, se envía al correo proporcionado y se conserva asociada al comentario.
- Los ejercicios de Historias son locales: no enviar ni almacenar persistentemente sus respuestas; no producir estadísticas. Recargar reinicia la actividad.
- Aplicar la política de Contacto de 90 días desde la última actividad y permitir solicitud de eliminación anticipada. Definición operativa, canal de solicitud, verificación y tratamiento de copias deben quedar documentados y comprobados antes del cierre.
- No prometer eliminación total o inmediata de proveedores, buzones o respaldos sin verificar sus ciclos. No aplicar el plazo de Contacto por defecto a cuentas administrativas, historias o registros de seguridad.
- No publicar mensajes, respuestas, correos ni otros datos privados en páginas públicas. Usar datos de prueba en evidencias sin exponer credenciales o contenido sensible.
- No incluir rastreo publicitario ni cookies de rastreo. Verificar también servicios integrados; las cookies necesarias deben documentarse y no confundirse con rastreo.

**Comprobación:** los avisos describen la operación real; hay pruebas de no persistencia educativa, acceso privado, vencimiento y eliminación. Esta política no equivale a certificación de cumplimiento legal.

### 6. Seguridad y operaciones reales

**CONST-06 — La interfaz nunca sustituye la autorización ni confirma operaciones ficticias.**

- Autenticar administradores por cuenta individual, correo y contraseña, con un único tipo de permiso aprobado, recuperación y cierre de sesión; sin alta pública.
- Verificar sesión y autorización en servidor para cada lectura y modificación privada. Ocultar un botón no protege la operación.
- Mantener secretos fuera del cliente; validar datos en servidor además del cliente; tratar el contenido enviado como datos y no como código; proteger transporte y sesiones.
- La recuperación no debe revelar públicamente si un correo tiene cuenta. Provisión y proveedor deben configurarse, no inventarse.
- Confirmar Contacto solo tras persistencia real. Marcar Respondido solo tras aceptación real del servicio de correo; esa aceptación no demuestra recepción en bandeja ni lectura.
- Los fallos conservan lo escrito, permiten reintentar y evitan registros o envíos duplicados. No mostrar éxito mientras la operación sea fallida o desconocida.

**Comprobación:** probar acceso directo sin sesión, sesión inválida/expirada, validación servidor, fallos y reintentos; acreditar recepción de correo por separado en un buzón de prueba.

### 7. Integridad editorial y estados de publicación

**CONST-07 — Solo se muestra contenido público conforme al estado persistido.**

- Gestión de historias: crear, editar, guardar borrador, publicar y activar/desactivar; no eliminación definitiva.
- Conservar los campos aprobados del editor: título, categoría, imagen, descripción, audio, transcripción, pregunta, tres opciones y explicación por opción.
- Permitir borrador incompleto; impedir publicación si faltan campos o recursos válidos. Guardar y publicar son acciones distintas.
- Solo historias publicadas y activas aparecen en la web. Desactivar conserva contenido; activar vuelve a incluirlo sin duplicados. Mantener identificadores y enlaces al editar.
- Bandeja de Contacto privada con Pendiente y Respondido. No implementar Aprobar/Aprobados como publicación comunitaria: la decisión vigente sustituyó esa parte de la captura administrativa.
- Contadores y tablas reflejan registros reales, no números de demostración. Los errores de guardado no deben presentarse como cambios confirmados.

**Comprobación:** las vistas públicas, tablas y contadores coinciden con los estados guardados y nunca exponen borradores o datos privados.

### 8. Fidelidad visual, accesibilidad y recursos

**CONST-08 — Se conserva la estructura aprobada y se adapta sin excluir usuarios.**

- Respetar jerarquía y orden de los wireframes. En móvil apilar bloques en el mismo orden; en Contacto, Instagram antes del formulario.
- Operación con teclado, foco visible, etiquetas de campos, errores asociados, alternativas de imágenes, transcripciones y feedback anunciado. El menú móvil debe abrir, cerrar y devolver el foco sin atrapar al usuario.
- Probar los anchos 360, 390, 430, 768, 1024, 1280 y 1440 px y ampliación de texto al 200%, sin contenido cortado ni desbordamiento que impida utilizar funciones.
- Verificar los objetivos de contraste y tamaños de control del SPEC con mediciones, no por apreciación subjetiva.
- La usuaria aporta recursos oficiales. Mantener inventario por bloque con estado recibido/pendiente. No inventar logo, perfil, archivo de audio, duración o URL ni eliminar un bloque para ocultar un faltante.
- Sin audio final, no simular reproductor. Sin recurso o revisión visual, no certificar fidelidad ni completar la tarea sin una excepción de alcance expresamente decidida.

**Comprobación:** registrar pruebas y comparaciones renderizadas. La extracción de texto de un PDF no acredita tipografía, color ni fidelidad visual precisa.

### 9. Contenido verificable e interacciones honestas

**CONST-09 — No se prometen resultados, capacidades o disponibilidad sin respaldo.**

- Usar los reemplazos editoriales aprobados del SPEC. No reintroducir «100%», «miles de personas», «menos de 24h» ni jurisdicciones no verificadas.
- Precio y versiones mínimas de App quedan omitidos hasta información oficial. Cada descarga muestra Próximamente sin acción hasta tener su URL oficial verificada; habilitar Android/iPhone independientemente.
- El botón Conversar del teléfono es parte de una imagen, sin interacción web, foco o rol de botón.
- Los ejercicios muestran explicación específica del riesgo y prevención al elegir/cambiar opción, sin correcta/incorrecta, puntuación o botón adicional. Validar las nueve explicaciones contra los materiales aportados.
- No atribuir a relatos hechos no narrados ni presentarlos como testimonios reales sin respaldo.
- Una URL o texto final pendiente es una dependencia abierta. No usar # o destinos vacíos para aparentar una función completa; las anclas reales aprobadas sí son válidas.
- «Cero rastreo publicitario» y «Sin cookies de rastreo» solo se publican tras verificación técnica de la web y sus integraciones.

**Comprobación:** revisión editorial contra fuentes y decisiones, destinos comprobados y evidencia para afirmaciones técnicas.

### 10. Verificación proporcional y cierre

**CONST-10 — Aprobar una especificación no significa haber implementado una función.**

- Separar estado de requisito, estado de implementación y resultado de prueba.
- Para iniciar una tarea: alcance definido, criterios verificables, dependencias identificadas y decisiones bloqueantes resueltas para esa parte del trabajo.
- Para cerrar: todos los criterios aplicables probados, resultado y evidencia registrados, errores bloqueantes corregidos y documentos sincronizados.
- Registrar por prueba fecha, entorno/navegador, criterio, resultado y evidencia. Un fallo o dependencia ausente se registra como fallido o bloqueado, nunca como aprobado.
- Elegir pruebas proporcionales al cambio y al riesgo. No imponer cobertura numérica arbitraria ni escribir pruebas que solo repitan el código. Sí comprobar especialmente persistencia, acceso, correo, borrado y límites.
- Repetir pruebas afectadas tras una corrección; ampliar regresión si existen dependencias o riesgo, sin repetir trabajo sin motivo.
- No afirmar que el PDF fue editado, los archivos movidos al Escritorio o la app desplegada sin verificarlo.

**Comprobación:** ninguna casilla de tarea se marca por existir código, aprobar copy o redactar esta constitución. La línea base sigue con implementación no verificada.

## Contexto y restricciones documentales

La fuente de alcance conservada es
`specs/reference/01_PRIVA_WEB_SPEC_DEFINITIVO.md` (R35). La presente constitución
incorpora el contenido R36 suministrado por la usuaria sin modificar las decisiones de producto.
Las once features se organizan en `specs/001-*` a `specs/011-*`; `specs/README.md`
contiene el índice y `specs/TRACEABILITY.md` asigna los 53 requisitos a sus responsables.

Los totales de 53 historias, 53 tareas y 195 criterios citados en CONST-04 describen
el inventario declarado por las fuentes. Los documentos históricos 02–07 no han sido
aportados al repositorio; sus contenidos y totales no se han comprobado. Los escenarios
incluidos en los once specs no sustituyen ni acreditan el catálogo 07.
No se inventarán IDs HU/CA/TSK históricos ni se afirmará trazabilidad completa a archivos ausentes.

Cada feature mantendrá su `spec.md` y, cuando corresponda a su fase, `plan.md`,
`tasks.md` y evidencias asociadas, conservando los IDs originales y actualizando la matriz.
La copia de referencia es una línea base histórica, no una segunda especificación editable:
los cambios vigentes se aplicarán a las features y se registrarán con su decisión.

La estructura operativa de Spec Kit cumple las funciones del mapa documental original
sin exigir crear documentos históricos ficticios. La falta de un documento o recurso
se registra como pendiente y solo bloquea el trabajo que depende de él.

## Flujo SDD y aplicación

**CONST-12 — La constitución se aplica durante todo el ciclo SDD.**

| Documento | Función |
|---|---|
| 00 — Constitución SDD | Principios y reglas de trabajo del proyecto |
| 01 — SPEC | Alcance, pantallas, flujos, datos, requisitos y borradores informativos |
| 02 — Plan | Arquitectura por definir, dependencias, fases y validación |
| 03 — Tasks | Trabajo ejecutable y criterios de cierre |
| 04 — Auditoría | Diferencias, tratamiento vigente y limitaciones de verificación |
| 05 — Matriz | Vínculos requisito/historia/tarea/prueba/evidencia |
| 06 — Historial | Decisiones, modificaciones y enmiendas |
| 07 — Historias y criterios | 53 historias y 195 criterios detallados de aceptación |

### Revisión constitucional por cambio

| Momento | Qué revisar | Reglas |
|---|---|---|
| Especificar | Fuente, actor, comportamiento, datos, alcance y aceptación | CONST-01–05 |
| Planificar | Dependencias, servicios, estados, seguridad y pruebas | CONST-02, CONST-05–08, CONST-10 |
| Implementar | Tarea trazada, autorización, integridad y errores reales | CONST-03–09 |
| Verificar | Criterios ejecutados, recursos, evidencia y ausencia de bloqueos | CONST-04, CONST-08–10 |
| Entregar o cambiar | Documentos coherentes, historial y excepciones registradas | CONST-01, CONST-04, CONST-10–12 |

La revisión es un control del proyecto, no una declaración de que las funciones ya existen. Código, servicios, recursos y pruebas permanecen pendientes según el SPEC.

Al trabajar una feature, indicar su directorio existente mediante
`SPECIFY_FEATURE_DIRECTORY` o la selección de `.specify/feature.json`.
Completar aclaraciones antes de las partes bloqueadas del plan; después generar tareas,
analizar coherencia, implementar y verificar convergencia. No regenerar los once specs
ni ampliar alcance por el mero uso de un comando.

## Governance

**CONST-11 — Las excepciones y cambios se hacen explícitos y revisables.**

- La responsable del proyecto decide cambios de alcance y reglas de producto; quien implementa documenta opciones, consecuencias y evidencia sin inventar aprobaciones.
- Una excepción debe identificar regla, motivo, alcance, riesgo, alternativa, decisión y documentos/pruebas afectados. Una necesidad técnica no constituye aprobación automática para ampliar el producto.
- Las decisiones ya aprobadas siguen vigentes; no solicitar otra confirmación para ejecutarlas. Consultar únicamente cuando falte una decisión material o exista un conflicto real.
- Una enmienda actualiza esta constitución y los documentos afectados, con fecha y motivo en 06. No crear una segunda constitución paralela.
- Versionado: mayor para cambios incompatibles de principios o gobierno; menor para reglas nuevas compatibles; parche para correcciones de redacción sin cambio de comportamiento. El historial conserva la evolución.
- No elegir proveedor, infraestructura, identidad del responsable o política de datos desconocidos como si fueran hechos. Registrar la dependencia y avanzar en trabajo que no dependa de ella.

**Comprobación:** cada excepción o enmienda deja una decisión verificable; no altera silenciosamente compromisos anteriores.

La revisión de cada plan, tarea y entrega comprobará expresamente los principios aplicables.
Las enmiendas registrarán fecha, motivo, regla afectada y documentos relacionados en el
historial vigente del proyecto; si el documento 06 no está disponible, su referencia se
mantendrá como pendiente y la enmienda se documentará en el registro constitucional,
sin afirmar que se actualizó un archivo ausente.

### Registro inicial

**1.0.0 — 2026-10-16**: adopción inicial del texto constitucional R36 aportado por la
usuaria en la estructura activa de Spec Kit. Integra las doce reglas CONST-01–12 y
aclara la correspondencia con las once features y las fuentes históricas ausentes.
Conserva los pendientes de recursos, operación y verificación; no amplía el producto.

**Version**: 1.0.0 | **Ratified**: 2026-10-16 | **Last Amended**: 2026-10-16
