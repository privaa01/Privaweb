# PRIVA — Especificación web

**Revisión consolidada:** R35 · 16/10/2026  
**Estado:** decisiones de alcance registradas; implementación no verificada.  
**Año aprobado del footer: 2026.** Sustituye la indicación anterior de 2006.

## Alcance y fuentes

Fuentes: wireframes web (2).pdf, cuatro páginas, y dos imágenes de acceso/gestión administrativa. La usuaria aprobó las decisiones C01–C34 registradas en 06. Este documento y la matriz 05 consolidan el estado vigente; las propuestas descartadas no son requisitos. Las diferencias aprobadas se registran sin modificar la referencia gráfica, cuyo único cambio autorizado es el año del footer a 2026.

Web pública: Inicio, Historias, Priva App y Contacto, más Términos, Manifiesto y recuperación 404. Administración privada: cuentas individuales, gestión de historias y bandeja de Contacto. Priva App es un prototipo presentado por la web: no se implementan aquí chat con IA ni diagnóstico. No hay cuentas de visitantes, registro público, comentarios públicos, estadísticas de ejercicios ni eliminación definitiva de historias.

La extracción de fuentes permite identificar estructura y controles, pero no certifica revisión visual de medidas, estilos o etiquetas poco legibles. No se aportó código ni despliegue. Todos los requisitos de implementación siguen abiertos; una decisión aprobada no prueba que funcione.

## Arquitectura y componentes globales

Navegación: **Inicio → Historias → Priva App → Contáctanos**, igual en escritorio/móvil, logo a Inicio y activo por página. Rutas propuestas, no URLs existentes: /index.html, /historias.html, /app.html, /contacto.html, /terminos.html, /manifiesto-datos.html, /404.html y /admin/login. Anclas: Inicio #somos-priva/#que-hacemos; Historias #casos; App #como-funciona/#descarga; Contacto #escribir. No usar #maria.

CTA: PROTÉGETE HOY en Inicio/Historias → casos de Historias; DESCARGAR APP en App/Contacto → bloque de descarga. Todos los controles reales tienen acción, foco y estados claros. Conversar dentro del teléfono es imagen, sin acción ni foco de botón.

Footer común: logo, Defendiendo la soberanía digital individual., panel administrador, Términos de Servicio, Manifiesto de Datos, Contacto Seguro → formulario; **© 2026 Priva. Todos los derechos reservados. Navega con dignidad.** Año fijo aprobado, no inferencia sobre fundación.

## Pantallas y orden de contenido

**Inicio, PDF 1:** encabezado; hero TUS DATOS, TU DERECHO / La privacidad también es una forma de libertad., descripción, imagen y Conocer más → Somos Priva; Quiénes somos con imagen; Qué hacemos / Informamos para que estés en control. y cuatro tarjetas Educación Digital, Historias reales, Herramientas Seguras, Acompañamiento; CTA final con imagen y Explora nuestras historias → Historias; footer. Mantener estructura, sin historia principal adicional de María. Verificar capacidades anunciadas en tarjetas antes de publicarlas.

**Historias, PDF 2:** hero HISTORIAS REALES / Aprende de casos reales sobre robo de datos., imagen, descripción y Explorar episodios → #casos; Casos destacados con Ver todas las historias → listado completo de activas en la misma página; tres casos iniciales; metodología con imagen y Escucha/Reflexiona/Aplica; recordatorios Somos Priva/Qué hacemos con Saber más → sus secciones de Inicio; CTA final e imagen, Explorar más contenidos → Instagram oficial (URL pendiente); footer. No afirmar testimonios reales sin respaldo: ese copy requiere revisión si no existen fuentes.

Casos iniciales: 1 Enlace falso, Phishing, María y mensaje que aparenta ser de banco; 2 La llamada sospechosa, Ingeniería social, Juan y código de autenticación; 3 La contraseña compartida, Contraseñas, Luis y reutilización de clave. Cada caso conserva imagen, categoría, título, descripción, audio y tres opciones bajo ¿QUÉ ERROR SE COMETIÓ?. Duraciones del dibujo 04:15/06:40/05:20 no acreditan archivos: mostrar duración real al recibirlos. No se incluye una cuarta historia principal de suplantación. Nuevas historias publicadas y activas se incorporan a la misma página.

Opciones de referencia: Caso 1 enlace desconocido / compartir datos bancarios / no verificar remitente; Caso 2 compartir código en llamada / ceder ante urgencia / no colgar y verificar con app oficial; Caso 3 reutilizar claves / anotarlas en chats sin cifrado / no activar 2FA. Al elegir o cambiar opción, mostrar inmediatamente explicación específica de riesgo y prevención, sin botón extra, correcta/incorrecta, puntuación ni clave única. Nueve explicaciones pendientes de validar contra materiales. No atribuir al relato hechos que no narra. Selección local, independiente por caso, sin envío ni almacenamiento persistente; recarga reinicia.

**Priva App, PDF 3:** hero MANEJA TU PRIVACIDAD con imagen y dos CTA Descargar app/Ver cómo funciona; Qué es Priva App, teléfono Conversar y tres beneficios; Cómo se usa con cuatro pasos; Para qué sirve con Tips/Asistente IA/Diagnóstico de Seguridad; bloque de descarga con dos plataformas y mockup; footer. Presentar explícitamente como prototipo y funciones previstas; redacción final pendiente, sin afirmar funcionamiento actual. Android/iPhone muestran Próximamente sin acción hasta URL oficial verificada; habilitar independientemente, sin lista de espera. Retirar precio/versiones mínimas; usar Orientación para cuidar tus datos personales. No decir Listo para descargar como hecho sin disponibilidad.

**Contacto, PDF 4:** hero ESTAMOS AQUÍ PARA TI con título, invitación, imagen e indicadores; Instagram a izquierda, formulario a derecha en escritorio; bloque final y footer. En móvil Instagram precede al formulario, respetando lectura del original. Tarjeta Instagram: descripción y temas anti-phishing, contraseñas, móviles, brechas; botón a misma URL oficial que CTA de Historias.

Formulario: nombre o alias obligatorio (1–60 caracteres), correo obligatorio con formato válido y mensaje obligatorio (1–1500). Recortar extremos para validar; rechazar solo espacios, conservar espacios internos; aceptar seudónimo sin exigir identidad real. Etiquetas/obligatoriedad visibles, errores asociados, validación cliente y servidor, bloqueo de doble envío, valores conservados ante fallo. Guardar datos/comentario y confirmar solo con persistencia real. Avisar antes de enviar que no incluya contraseñas, códigos, datos bancarios ni información sensible/de terceros.

**Administración:** acceso individual por correo/contraseña, recuperación verificada y cierre; sin registro público y un único tipo de administrador. Provisión restringida pendiente de configuración. Panel con historias y bandeja privada de Contacto. Historias: crear/editar, guardar borrador, publicar y activar/desactivar; sin borrado definitivo. Campos de editor: título, categoría, imagen, descripción, audio, transcripción, pregunta, tres opciones y sus explicaciones. Permitir borrador incompleto; bloquear publicación incompleta; guardar y publicar son acciones distintas. Solo publicadas y activas se ven en público; desactivar conserva contenido. Mantener identificadores/enlaces en edición. Límites de archivos y edición de publicados pendientes de diseño técnico.

Bandeja: consulta por Pendiente/Respondido, datos de Contacto y comentario; redactar/enviar al correo proporcionado y conservar la respuesta asociada. Marcar Respondido solo tras aceptación del servicio; entrega/lectura no se deducen de esa aceptación. Fallo mantiene Pendiente y texto para reintentar sin duplicados. No publicar comentarios. Los controles Aprobar/Aprobados y comentarios asociados a casos de la captura se sustituyen por este flujo privado aprobado, sin editar la imagen.

## Textos aprobados y condiciones de publicación

| Ubicación | Texto vigente | Condición |
|---|---|---|
| CTA final Inicio e Historias | Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales. | Sustituye párrafo completo Únete a miles de personas; conservar títulos/imágenes/CTA. |
| Descarga de App | Orientación para cuidar tus datos personales | Sustituye Respeta el 100% de tu privacidad; omitir Gratis/Android 10+/iOS 15+. |
| Hero Contacto | Respuesta por correo electrónico | Sustituye Respuesta en menos de 24h. |
| Hero Contacto | Deja tu consulta en el formulario | Sustituye Canales cifrados; indicador informativo. |
| Bloque final Contacto | Respondemos al correo que indiques | Sustituye 100% Confidencial. |
| Bloque final Contacto | Puedes usar un alias | Sustituye Servidores en jurisdicción estricta. |
| Hero / bloque final Contacto | Cero rastreo publicitario / Sin cookies de rastreo | Solo publicar tras verificar implementación y proveedores; no implica cero cookies necesarias. |

## Datos, seguridad y conservación

Contacto guarda nombre/alias, correo, comentario y respuesta enviada; acceso privado del equipo autorizado. Política aprobada: 90 días desde última actividad y solicitud anticipada de eliminación. Criterio operativo propuesto para configuración: recepción inicial o nueva respuesta aceptada por servicio, lo posterior; lectura o envío fallido no reinicia. Aplica a pendientes y respondidos. Canal/verificación de solicitud, proveedores y borrado en buzones/respaldos por definir y comprobar; no prometer borrado inmediato total sin evidencia. Tras restauración, no reactivar registros vencidos. No aplicar por defecto este plazo a historias/cuentas/logs: sus políticas faltan.

Autorización en servidor en cada operación, sesiones seguras, secretos fuera del cliente, validación y salida segura de contenido. Recuperación no revela existencia de una cuenta. Verificar ausencia de rastreo publicitario/cookies de rastreo en scripts, tráfico, almacenamiento y proveedores bajo navegación, audio, formulario y administración; documentar cookies necesarias si existen. No extender la promesa a Instagram externo. Eliminar un reclamo de cifrado no elimina requisito técnico de transporte seguro.

## Accesibilidad, recursos y estados

Usuaria aporta logo/imágenes/audios/enlaces; inventario por bloque, sin inventar recursos ni duraciones. Audio real con controles de reproducir/pausar/avance/tiempo, carga/error, sin autoplay y transcripción equivalente. Sin archivo, no simular reproductor; texto accesible y recurso pendiente impiden cerrar fidelidad sin excepción aprobada.

Respetar estructura/orden y apilar en móvil; menú compacto con cierre/Escape/devolución de foco; no scroll horizontal ni contenido cortado; 360/390/430/768/1024/1280/1440 px. Teclado/foco visible, feedback anunciado, texto 200%, alternativas informativas/decorativas adecuadas, errores textuales, controles cómodos. Objetivos técnicos: contraste 4.5:1 texto normal y 3:1 texto grande/componentes, controles de aproximadamente 44 px; no son mediciones del wireframe. Fuente/hex exactos pendientes de recursos originales.

Estados: carga/error de audio; selección sin feedback previo y actualización inmediata; descargas pendientes; formulario inválido/enviando/guardado/error con reintento; lista sin historias; sesión inválida/expirada; borrador/publicada activa/inactiva; Pendiente/Respondido; fallo de guardado/publicación sin falso éxito. Enlaces externos solo con URL verificada.

## Historias de usuario y criterios detallados

El archivo [07_PRIVA_HISTORIAS_USUARIO_CRITERIOS.md](07_PRIVA_HISTORIAS_USUARIO_CRITERIOS.md) contiene 53 historias y 195 criterios Dado/Cuando/Entonces, una historia por requisito de la tabla siguiente. Es el catálogo canónico de detalle; las aceptaciones resumidas de este SPEC siguen vigentes. El ejemplo de registro de visitantes no amplía el alcance. Todos los criterios están no ejecutados.

## Requisitos y criterios de aceptación

Cada fila enlaza 1:1 con TSK-R-[ID] en 03 y CA-R-[ID] en 05. La decisión se distingue del resultado de pruebas; todos permanecen no verificados.

| ID | Fuente base | Pantalla/componente | Aceptación vigente |
|---|---|---|---|
| G01 | PDF 1–4 | Encabezado y navegación | Logo a Inicio; menú idéntico en orden Inicio, Historias, Priva App, Contáctanos; activo correcto en escritorio y móvil (C06). |
| G02 | PDF 1–2 | CTA PROTÉGETE HOY | PROTÉGETE HOY lleva a /historias.html#casos desde Inicio y a #casos desde Historias; comprobar encabezado visible y teclado (C10) |
| G03 | PDF 3–4 | CTA DESCARGAR APP | Abre app y sección de descarga; ancla accesible con teclado |
| G04 | PDF 1–4 | Footer: logo, lema y copyright | Texto exacto © 2026 Priva. Todos los derechos reservados. Navega con dignidad.; idéntico en las cuatro páginas. El PDF requiere 2025 → 2026 en sus cuatro footers (C34). |
| G05 | PDF 1–4 + imágenes | Footer: panel administrador | Enlace visible abre acceso administrativo; rutas protegidas no muestran datos sin sesión |
| G06 | PDF 1–4 | Footer: Términos, Manifiesto, Contacto Seguro | Cada enlace abre contenido aprobado; Contacto Seguro conduce al formulario |
| I01 | PDF 1 | Hero Inicio: etiqueta, título, texto, imagen, Conocer más | Mantiene composición y contenido de referencia; Conocer más desplaza a Quiénes somos |
| I02 | PDF 1 | Quiénes somos | Imagen, etiqueta y Somos Priva en orden de referencia; sin historia principal adicional de María ni enlace #maria (C07). |
| I03 | PDF 1 | Qué hacemos: introducción y cuatro tarjetas | Educación Digital, Historias reales, Herramientas Seguras y Acompañamiento presentes; capacidades y promesas pendientes de revisión de contenido/capacidades (P03) |
| I04 | PDF 1 | CTA final de Inicio | Conservar título/imagen y botón a Historias; párrafo exacto: Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales. (C16). |
| H01 | PDF 2 | Hero Historias | Etiqueta, título, descripción e imagen; Explorar episodios lleva a #casos, sin insertar María |
| H02 | PDF 2 | Casos destacados: encabezado y Ver todas las historias | Tres casos iniciales y control visibles; Ver todas muestra el listado completo de activas en esta página, incluidas nuevas publicaciones; sin borradores, desactivadas ni duplicados (C11) |
| H03 | PDF 2 | Caso 1: Enlace Falso / Phishing | María, mensaje bancario y enlace; imagen y relato coinciden; duración 04:15 es referencia, verificar audio real |
| H04 | PDF 2 | Caso 2: La llamada sospechosa / Ingeniería Social | Juan y código de autenticación; imagen y relato coinciden; 06:40 sujeto a archivo; corrección Confiada pendiente de revisión editorial (P03) |
| H05 | PDF 2 | Caso 3: La contraseña compartida / Contraseñas | Luis, streaming y correo corporativo; imagen y relato coinciden; 05:20 sujeto a archivo |
| H06 | PDF 2 | Audio de cada caso | Reproducir/pausar, avance, duración real y estado de carga/error; sin autoplay; transcripción equivalente; sin audio bloquea cierre de caso |
| H07 | PDF 2 | Ejercicio Caso 1 | Tres opciones de referencia; explicación específica de riesgo y prevención inmediata al seleccionar/cambiar, sin calificación, puntuación ni botón extra; teclado y anuncio accesible; sin envío/persistencia; recarga reinicia (C05/C08/C09). |
| H08 | PDF 2 | Ejercicio Caso 2 | Tres opciones de referencia; misma interacción educativa de H07, selección independiente por caso; explicación por opción validada contra el material aportado. |
| H09 | PDF 2 | Ejercicio Caso 3 | Tres opciones de referencia; misma interacción educativa de H07, selección independiente por caso; nueve explicaciones en total, pendientes de contenido validado. |
| H10 | PDF 2 | Metodología con imagen | Identifica el error y aprende; 1 Escucha, 2 Reflexiona, 3 Aplica en ese orden |
| H11 | PDF 2 | Identidad en dos bloques y SABER MÁS | Somos Priva y Qué hacemos; cada enlace lleva a su sección de Inicio |
| H12 | PDF 2 | CTA final de Historias | Conservar título/imagen; párrafo exacto C16: Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales. EXPLORAR MÁS CONTENIDOS abre Instagram oficial, misma URL que Contacto; URL pendiente. |
| A01 | PDF 3 | Hero de Priva App | Mantener estructura, imagen y CTA a #descarga/#como-funciona; identificar claramente prototipo y funciones previstas, sin afirmar operación actual; copy final para revisión (C31). |
| A02 | PDF 3 | Qué es Priva App y mockup Conversar | Descripción y teléfono conservados; Conversar es parte de la imagen, sin enlace, clic, foco ni rol de botón web (C13) |
| A03 | PDF 3 | Tres beneficios del prototipo | Guía paso a paso, Privacidad digital, Ayuda clara y rápida presentados como previstos; no certificar funcionamiento. |
| A04 | PDF 3 | Cómo se usa el prototipo | Escribe tu duda, Recibe instrucciones, Aplica los cambios, Mantente seguro, en orden 1–4; explicar como flujo previsto, sin promesa de funcionamiento actual. |
| A05 | PDF 3 | Para qué serviría Priva App | Tips, Asistente IA y Diagnóstico de Seguridad como funciones previstas del prototipo; no implementarlas en la web; revisar copy final/errata de referencia. |
| A06 | PDF 3 | Descarga por plataforma | Android/iPhone identificados; Próximamente sin acción hasta URL oficial verificada; habilitar independientemente; probar ambas pendientes, mixto y ambas disponibles; CTA mantiene #descarga; mockup no afirma disponibilidad inexistente (C14). |
| A07 | PDF 3 | Texto bajo descargas | Usar Orientación para cuidar tus datos personales; retirar Gratis y versiones mínimas Android 10+/iOS 15+ hasta datos oficiales; sin garantía del 100% (C17/C23). |
| C01 | PDF 4 | Hero Contacto e imagen | Etiqueta Estamos aquí para ti, título e invitación conservados |
| C02 | PDF 4 | Indicadores del hero de Contacto | Respuesta por correo electrónico y Deja tu consulta en el formulario como indicadores informativos; Cero rastreo publicitario solo tras verificación técnica de web y proveedores (C18/C21/C22). |
| C03 | PDF 4 | Tarjeta Instagram | Descripción, cuatro temas: anti-phishing, contraseñas, móviles, brechas; Ir a Instagram abre URL oficial |
| C04 | PDF 4 | Formulario de Contacto | Nombre o alias, correo y mensaje obligatorios; aceptar seudónimo sin exigir nombre real; alias 1–60 y mensaje 1–1500 tras recortar extremos; etiquetas visibles (C24/C25). |
| C05 | PDF 4 | Validación y carga de Contacto | Cliente/servidor: rechazar vacíos/solo espacios, correo inválido, alias mayor de 60 y mensaje mayor de 1500; errores asociados; bloquear doble envío; probar fronteras 0/1/60/61 y 0/1/1500/1501. |
| C06 | PDF 4 | Guardado y estados de Contacto | Persistir nombre/alias, correo y comentario; confirmar éxito solo con guardado real; nuevo comentario Pendiente en bandeja privada; fallo conserva valores y reintento sin duplicados (C02/C03/C28). |
| C07 | PDF 4 | Bloque final y aviso de Contacto | Respondemos al correo que indiques y Puedes usar un alias; Sin cookies de rastreo solo tras verificación; aviso explica almacenamiento, respuesta privada por correo y 90 días; borrador pendiente de completar/revisar (C19/C20/C22/C29/C32). |
| AD01 | Imagen sin (1) | Acceso, recuperación y cierre de sesión | Correo/contraseña por cuenta individual, sin registro público; recuperación verificada por correo sin revelar existencia de cuenta; sesión cerrada impide acceso; provisión restringida por definir (C26). |
| AD02 | Imagen (1) | Panel y permisos | Un tipo de administrador con acceso a historias y comentarios de Contacto; todas las cuentas autorizadas con mismos permisos; navegación privada legible y coherente; sin rol editor adicional (C26). |
| AD03 | Imagen (1) | Resumen y contadores | Contadores derivados de historias activas/borradores y comentarios de Contacto reales; sin cifras de demostración; coherentes al guardar/publicar/responder. |
| AD04 | Imagen (1) | Tabla de historias | Título, categoría, estado y acciones de gestión aprobadas; registros reales conectados con contenido público; sin borrado definitivo (C27). |
| AD05 | Imagen (1) | Activar/desactivar historia | Solo publicada y activa visible; desactivar conserva contenido; activar la devuelve a lista; borrador nunca público; errores sin cambio confirmado ni pérdida de contenido (C27). |
| AD06 | Imagen (1) | Crear, editar, borrador y publicar | Campos: título, categoría, imagen, descripción, audio, transcripción, pregunta, tres opciones y sus explicaciones; borrador incompleto permitido; bloquear publicación incompleta; guardar/publicar diferenciados; sin eliminar definitivamente (C27). |
| AD07 | Imagen (1) | Bandeja privada de Contacto | Consultar comentarios Pendiente/Respondido con nombre/alias, correo y mensaje; sin comentarios públicos ni aprobación para publicar; filtros/listado privados, contadores reales (C28). |
| AD08 | Imagen (1) | Estado Pendiente → Respondido | Transición solo tras aceptación real del servicio de correo; fallo conserva Pendiente y texto para reintento; sin duplicados. Sustituye acción de aprobación pública de captura (C28). |
| AD09 | Imagen (1) | Redactar y conservar respuesta | Administrador responde desde panel al correo almacenado correcto; conservar respuesta enviada asociada al comentario; acceso privado y error/reintento; no prometer entrega/lectura por mera aceptación (C04/C28). |
| AD10 | Imagen (1) | Ver historias en la web | Abre Historias pública; refleja solo historias activas; no expone borradores ni correos |
| AD11 | Imagen (1) + PDF 2 | Origen de comentarios y alcance público | Comentarios entran únicamente por Contacto y son privados; sin formulario de comentarios en Historias; sus ejercicios son locales sin guardado. Captura con comentarios por caso queda registrada como diferencia aprobada (C28). |
| X01 | Derivado UX | Adaptación y accesibilidad | Respetar orden de wireframes al apilar; Instagram antes del formulario en móvil; probar 360/390/430/768/1024/1280/1440, teclado/foco, texto 200%, sin recortes, alternativa de imágenes/transcripciones (C33). |
| X02 | Derivado técnico | Seguridad, rastreo y conservación | Autorización servidor, sesión segura, validación y salida segura; verificar red/scripts/cookies/proveedores sin rastreo publicitario; borrar datos de Contacto y respuestas a 90 días de última actividad, solicitud anticipada y tratamiento documentado de copias/respaldos (C22/C26/C29). |
| X03 | Derivado técnico | Auxiliares y documentos informativos | Términos/Manifiesto/aviso completos y revisados antes de publicar, 404 recuperable y anclas #casos/#como-funciona/#descarga/#escribir; sin #maria; QR solo con destino aprobado (C32). |
| X04 | Derivado QA | Recursos y fidelidad | Usuaria aporta logo/imágenes/audios/enlaces; inventario recibido/pendiente sin inventar archivos; cero placeholders finales; verificación visual pendiente; PDF solo cambiar año 2025 a 2026 (C30/C33/C34). |
| X05 | Derivado gestión | Sincronización y cierre | Cada cambio actualiza spec, plan, tareas, matriz e historial; aprobación documentada antes de cerrar decisiones; ninguna implementación aprobada sin evidencia |
| CT01 | Instrucciones de la usuaria C02–C04/C28/C29 | Flujo completo de Contacto | Enviar comentario → guardado → consulta privada → respuesta por correo guardada → Respondido tras aceptación de servicio; verificar recepción aparte, errores y reintento sin duplicados; aplicar retención y eliminación. |

## Pendientes reales

| ID | Tema | Pendiente |
|---|---|---|
| P01 | Materiales | Logo, imágenes, audios, guiones/transcripciones y enlaces oficiales pendientes de aporte/verificación; nueve explicaciones pendientes de validación contra relatos. |
| P02 | Datos operativos | Responsable y contacto oficial, proveedor de datos/correo, remitente, provisión de cuentas, canal/procedimiento para eliminación y copias/respaldos. |
| P03 | Textos finales | Borradores de aviso/Términos/Manifiesto, redacción explícita de prototipo, erratas y capacidades/servicios de Herramientas Seguras/Acompañamiento: pendientes de revisar/comprobar; no convertir en promesas. |
| P04 | Diseño y configuración | Editor y bandeja aprobados en alcance, diseño preciso pendiente; formatos/tamaños/límites técnicos de recursos y política de edición de publicados por definir. Fuente y colores exactos sin certificar. |
| P05 | Verificación y entrega material | Código/sitio no aportado; inspección visual completa pendiente. PDF no editado: cambio 2025 → 2026 aún pendiente. No se trasladaron archivos al Escritorio. |

## Definición de terminado

53 requisitos con evidencia de pruebas; decisiones y textos finales coherentes; recursos oficiales completos; contacto persistido y respuesta recibida en prueba; acceso protegido, publicación y estados comprobados; retención/borrado y rastreo verificados; auxiliares completos; adaptación/fidelidad revisada; PDF con cambio exclusivo a 2026 comprobado; documentos sincronizados. Nada de ello se marca completado por esta consolidación.

## Borradores para revisión — C32

**Estado: borradores pendientes de revisión y datos operativos. No publicar los marcadores entre corchetes.**

### Aviso junto al formulario de Contacto

Para enviar tu comentario, completa nombre o alias, correo electrónico y mensaje. Puedes usar un seudónimo; no necesitamos tu nombre real. Guardaremos estos datos y el comentario para que el equipo autorizado de Priva pueda consultarlo y responderte por correo. La respuesta enviada también quedará registrada en el panel administrativo. Tus comentarios y respuestas no se publicarán en la web.

Conservaremos este registro durante 90 días desde la última actividad de la conversación, según la política de conservación de Priva. Puedes solicitar su eliminación anticipada en [CANAL VERIFICADO DE ELIMINACIÓN]. No incluyas contraseñas, códigos de acceso, datos bancarios, documentos ni información sensible o de otras personas. Consulta el Manifiesto de Datos para conocer el tratamiento previsto y las condiciones del servicio.

**Antes de publicar:** identificar responsable [NOMBRE Y CONTACTO], precisar proveedores/destinatarios y verificar el borrado en sistemas operativos y respaldos. No afirmar que solo el equipo accede técnicamente si existen proveedores con acceso. La última actividad y el tratamiento de copias deben explicarse en el Manifiesto conforme a la configuración comprobada.

### Manifiesto de Datos

Priva propone una experiencia educativa que solicita los datos necesarios para recibir y responder tus comentarios. En Contacto pedimos nombre o alias, correo y mensaje, todos obligatorios. No exigimos nombre legal. Al enviar, estos datos se guardan en el sistema de Contacto; el equipo autorizado los consulta desde el panel y responde al correo que indiques. Conservamos la respuesta enviada asociada al comentario. No publicamos estos mensajes ni sus datos en la web.

La política aprobada prevé eliminar comentario, datos de contacto y respuestas a los 90 días de la última actividad: recepción del comentario o envío confirmado de una nueva respuesta, lo que ocurra después. Consultar el registro o un envío fallido no amplía ese plazo. Puedes solicitar eliminación anticipada mediante [CANAL VERIFICADO]; definiremos una comprobación proporcionada para evitar borrar datos de otra persona. [DESCRIBIR CICLO REAL DE BORRADO, PROVEEDORES, BUZONES Y RESPALDOS; NO PROMETER BORRADO INMEDIATO DE COPIAS SIN VERIFICARLO].

Las selecciones de los ejercicios de Historias son locales, no se envían ni se almacenan de forma persistente y se reinician al recargar. Las cuentas administrativas tienen acceso restringido; sus datos y registros de seguridad requieren política específica [COMPLETAR], pues el plazo de Contacto no se aplica automáticamente a ellas.

El proyecto exige ausencia de rastreo publicitario y cookies de rastreo. La publicación de esas afirmaciones depende de verificar también los servicios integrados. [DESCRIBIR RESULTADO VERIFICADO Y COOKIES NECESARIAS, SI EXISTEN]. El enlace a Instagram lleva a un servicio externo cuya operación no está descrita por este Manifiesto.

Responsable: [NOMBRE / DATOS DE CONTACTO]. Proveedores y destinatarios operativos: [IDENTIFICAR Y EXPLICAR FUNCIÓN]. Ubicación y condiciones del tratamiento: [VERIFICAR]. Canal para consultas y solicitudes sobre datos: [COMPLETAR]. No se publicarán estos borradores hasta completar la información y revisar su adecuación a la operación real y requisitos aplicables.

### Términos de Servicio

Priva ofrece contenidos educativos sobre cuidado de datos personales y presenta un prototipo de aplicación. Los casos y sus explicaciones buscan ayudar a reconocer riesgos; no garantizan evitar incidentes ni representan una comprobación técnica de tus cuentas. Los contenidos no deben presentarse como testimonios reales sin respaldo.

Priva App todavía es un prototipo. Los consejos, asistente con IA y diagnóstico se describen como funciones previstas, sin afirmar que estén operativas o disponibles públicamente. Cada descarga solo se habilitará con enlace oficial verificado; mientras tanto mostrará Próximamente. El teléfono de muestra y Conversar son una representación visual, no un chat web.

Puedes enviar comentarios a través de Contacto con nombre o alias, correo y mensaje. El equipo los consulta de forma privada y responde por correo, sin plazo de respuesta garantizado. No envíes contraseñas, códigos, datos bancarios ni información sensible o de terceros. El uso, conservación y eliminación de estos datos se describen en el Manifiesto de Datos. Las respuestas de los ejercicios no se guardan.

El acceso al panel está reservado a personas autorizadas, con cuentas individuales. No hay registro público. Los enlaces a servicios externos, como Instagram, deben identificarse y comprobarse; su disponibilidad y condiciones pertenecen al servicio correspondiente.

[COMPLETAR IDENTIDAD DEL RESPONSABLE, CONTACTO, FECHA DE VIGENCIA, TITULARIDAD/PERMISOS DE CONTENIDOS Y CONDICIONES APLICABLES TRAS REVISIÓN]. No se inventan jurisdicción, licencias ni condiciones de proveedores en este borrador.

