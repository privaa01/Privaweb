# Informe de estado del proyecto Priva

**Corte:** commit `b17f4be`, rama `main`, repositorio `privaa01/Privaweb`.
**Fecha de referencia:** 2026-10-23, America/Bogota.
**Fuentes:** tareas de cada spec, evidencias locales, decisiones de la responsable y validadores actuales. Este informe resume el estado; no sustituye las especificaciones.

## Estado general

El proyecto tiene las funcionalidades principales implementadas y probadas localmente: páginas públicas, acceso administrativo, gestión de historias, consultas privadas, respuestas desde el panel y mecanismos de conservación/eliminación. **El cierre para publicar el conjunto sigue pendiente.**

Diez specs tienen implementación local; la 011 conserva únicamente su borrador inicial. Los diez archivos de tareas contienen **477 tareas: 417 marcadas completas y 60 abiertas**. Algunas abiertas tienen avances parciales; las tareas de convergencia pueden remediar tareas anteriores. Este recuento no mide un porcentaje de preparación productiva y no incluye tareas todavía no generadas de la 011.

La revisión visual y manual guiada de Inicio fue aceptada por la responsable. Las imágenes oficiales están conectadas y el validador propio de la 002 pasa. Persisten WebKit y la integración con el sitio completo.

El siguiente bloqueo comprobado del build es la **010**, que requiere completar datos, revisión de documentos y calificación de privacidad de la **009**. El alojamiento y el proveedor técnico de envío de correo no están elegidos. No consta un despliegue productivo calificado.

## Pasos realizados

1. Se analizó el SPEC original y los wireframes, conservando sus decisiones y diferencias aprobadas.
2. Se dividió el alcance en once specs por funcionalidad, con responsabilidades para los 53 requisitos originales.
3. Se instaló y adaptó Spec Kit y se incorporó la constitución del proyecto. Se trabajó el ciclo especificar, aclarar, planificar, generar tareas, analizar e implementar sobre las features 001–010.
4. Se construyeron componentes públicos y servicios privados, con bancos de prueba separados, validaciones de publicación y evidencias. Se corrigieron fallos encontrados y se conservaron los bloqueos no resueltos.
5. Se incorporaron el logo oficial, Plus Jakarta Sans alojada localmente, su licencia y la paleta aportada. En Inicio se aprobaron cinco textos educativos y se conectaron las imágenes oficiales de candado, ajedrez y teclas.
6. Se ejecutó convergencia sobre la 002: se sincronizaron documentos, ampliaron recorridos de teclado/foco y corrigieron los iconos de tarjetas contra el PDF.
7. Se validó la entrada real de Inicio con sus imágenes finales, incluidos móvil, escritorio, texto al 200%, fallos de imagen y ausencia de JS. La responsable aprobó el resultado visual, confirmó encabezados y aceptó los pasos manuales guiados con VoiceOver en su Mac.
8. Se registró **Priva** como entidad responsable y **Priva202611@gmail.com** como contacto público y canal de solicitudes. Se aclaró que Priva redacta las respuestas desde el panel; el servicio técnico que las enviará por correo sigue pendiente.
9. Se realizaron commits y pushes sucesivos. Al comenzar este informe, el checkout estaba limpio y el HEAD de GitHub coincidía con `b17f4be`.

## Estado por spec

| Spec | Funcionalidad | Tareas completas | Realizado | Pendiente principal |
|---|---|---:|---|---|
| 001 | Navegación global | 23/28 | Header, footer, menú móvil, enlaces, foco, logo, fuente y colores compartidos | Integración de todos los destinos, revisión final transversal, WebKit y cierre documental |
| 002 | Inicio e identidad | 28/33 | Cuatro bloques, textos aprobados, tres imágenes oficiales, pruebas reales y aceptación visual/manual | WebKit, recorrido integrado Inicio → Historias, build conjunto y cierre de evidencia |
| 003 | Historias educativas | 30/35 | Catálogo, reproductor, transcripciones como función, ejercicios locales, estados y validación | Audios/imágenes/transcripciones y nueve explicaciones oficiales revisadas; materiales sociales, revisión manual e integración con 007 |
| 004 | Presentación de la app | 28/32 | Página del prototipo, beneficios, pasos, funciones previstas y estados de descarga | Imágenes/mockup y textos finales aprobados, revisión manual, navegadores e integración. Las plataformas pueden seguir en Próximamente sin enlace |
| 005 | Contacto público | 44/49 | Formulario, validación cliente/servidor, persistencia privada, reintentos y estados | Materiales/avisos finales, operación real de datos, HTTPS, privacidad e integración completa |
| 006 | Acceso administrativo | 58/63 | Login individual, sesiones, recuperación, cierre y autorización de servidor | Provisión y entorno productivo, recuperación con correo real, recursos/revisión final e integración |
| 007 | Gestión de historias | 56/60 | Crear/editar, borradores separados de publicación, activar/desactivar y gestionar medios | Materiales finales, revisión editorial/manual, almacenamiento/proxy/copias y publicación real controlada |
| 008 | Bandeja y respuestas | 60/66 | Bandeja privada, redacción/respuesta asociada, estados, control de concurrencia y reintentos | Proveedor de correo/remitente, recepción comprobada, operación de privacidad, revisión manual y build integrado |
| 009 | Privacidad y conservación | 57/67 | Política de 90 días, vencimiento, eliminación, verificación, workers, migración y restauración comprobados localmente | Acreditar canal, correo, almacenamiento, réplicas/copias, restauración, plazos y ausencia de rastreo en el entorno real |
| 010 | Documentos y 404 | 33/44 | Términos/Manifiesto/aviso como base, 404 y configuración de responsable/correo | Infraestructura y datos operativos restantes, vigencia/permisos, revisión final de textos, calificación 009 y entrega real |
| 011 | Accesibilidad y fidelidad global | Sin tareas generadas | Borrador de alcance; hay pruebas parciales en otras features | Desarrollar aclaración, plan, tareas y revisión transversal del sitio completo |

Una funcionalidad probada localmente no tiene por ello aceptación productiva. Ninguna fila se presenta como spec cerrada al 100%.

## Pruebas y evidencia existentes

Los siguientes son resultados registrados en sus ejecuciones; no se volvieron a ejecutar todas las suites para elaborar este informe y no deben sumarse entre sí como una única campaña sin duplicados.

- **001:** 46 pruebas Chromium, 32 Firefox y 2 de autorización de servicio; matriz de siete anchos y texto 100%/200% en el banco.
- **002, imágenes finales:** 18 recorridos Chromium y 8 Firefox sobre la entrada real aislada, más 24 pruebas de publicación. Chromium incluye 14 celdas ancho/texto, tres fallos de imágenes y un recorrido sin JS. Revisión visual/manual aceptada por la responsable; no se presenta como auditoría externa de accesibilidad.
- **003:** 40 pruebas unitarias y 29 de interfaz Chromium registradas.
- **004:** 52 pruebas unitarias y 31 de interfaz Chromium registradas.
- **005:** 66 pruebas Node, 39 de interfaz y 4 de navegador/servicio registradas.
- **006:** 39 pruebas Node, 30 de interfaz y 8 de servicio registradas.
- **007:** 37 pruebas Node y 25 Chromium registradas.
- **008:** 43 pruebas Node, 14 de servicio/navegador entre Chromium y Firefox, y 5 de interfaz simulada. El correo de prueba no acredita un proveedor real.
- **009:** 43 pruebas Node y 6 de navegador/servicio entre Chromium y Firefox.
- **010:** 27 pruebas Node y recorridos contractuales en Chromium/Firefox. Tras incorporar responsable/correo, las 27 pruebas y Astro check raíz pasaron; 0 errores/advertencias y 1 hint previo de administración.

**WebKit:** el intento más reciente sigue bloqueado por la detección de `libGLESv2.so.2` en el entorno. No se cuenta como prueba aprobada ni se extrapolan a Safari los resultados de Chromium/Firefox.

**Integración:** la URL `http://localhost:4321` fue proporcionada para la revisión manual en el Mac de la responsable. No equivale a una URL accesible desde el entorno de pruebas automatizadas ni a un despliegue productivo.

## Decisiones confirmadas

- La web es informativa y educativa; incluye orientación para usar Priva App.
- La app se presenta como prototipo. No se implementó un chat IA web ni un diagnóstico operativo.
- No hay registro público, perfiles públicos o comentarios de comunidad publicados.
- El equipo de Priva redacta respuestas desde el panel. La respuesta se envía por correo mediante un servicio todavía por elegir.
- Responsable declarada: **Priva**. Contacto público y canal declarado: **Priva202611@gmail.com**. Su registro no acredita titularidad fiscal, configuración del buzón o entrega de mensajes.
- Los ejercicios educativos no persisten ni envían las selecciones.
- Contacto conserva datos y respuestas durante 90 días conforme a la actividad definida; los plazos de eliminación y el tratamiento de copias deben verificarse en operación. No se aplica ese plazo por defecto a cuentas, historias o logs.
- Solo historias publicadas y activas son públicas; guardar y publicar son operaciones distintas.

## Pendientes y orden recomendado

1. **Completar los materiales y contenidos oficiales de 003–005/007.** Revisar por bloque imágenes, audios, transcripciones, explicaciones, mockup y enlaces aplicables. El logo/fuente/paleta compartidos y las imágenes de Inicio ya están recibidos; no hay que solicitarlos otra vez.
2. **Elegir infraestructura compatible con el sistema existente.** Hace falta alojar páginas públicas, procesos Node del panel/API/workers, datos privados y medios. Registrar ubicación, almacenamiento persistente, HTTPS, permisos y copias. No limitar la decisión a hosting estático si se va a habilitar Contacto y administración.
3. **Elegir y configurar el envío de correo.** Definir servicio, remitente, credenciales privadas y recepción en un buzón controlado. Probar respuestas del panel y recuperación de acceso sin confundir aceptación del proveedor con recepción o lectura.
4. **Completar operación009 y documentos010.** Conocer proveedores/ubicación/ciclos/políticas, comprobar eliminación/restauración y revisar Términos, Manifiesto y aviso final. El nombre y correo ya aportados resuelven parte de los datos, no la calificación completa.
5. **Preparar un entorno integrado de prueba.** Probar Inicio → Historias, publicar/activar/desactivar historias, Contacto → bandeja → respuesta por correo y acceso → recuperación → cierre con servicios reales y datos sintéticos.
6. **Resolver WebKit y completar 011.** Ejecutar navegadores pendientes y revisión transversal de público/administración, lector de pantalla, ampliación, foco, errores, contraste, textos y recursos finales. La aprobación de Inicio no cierra automáticamente las otras páginas.
7. **Superar el build completo y planificar la publicación.** Ejecutar todos los validadores, verificar artefactos y revisiones de entrega; después aprobar y realizar un despliegue con pruebas de funcionamiento, supervisión y copias/restauración.

Mientras no se haya elegido alojamiento se puede seguir con materiales, desarrollo y pruebas locales. El sitio completo no se considera listo para recibir consultas reales o publicarse con todas sus funciones.

## Ubicaciones para continuar

- [Tareas 002](specs/002-inicio-institucional/tasks.md) y [validación real de Inicio](specs/002-inicio-institucional/evidence/final-validation.md).
- [Aceptación manual reportada](specs/002-inicio-institucional/evidence/manual-review.md).
- [Contenido y datos pendientes de 010](specs/010-documentos-recuperacion/content-review.md).
- [Operación y evidencia de 009](specs/009-privacidad-conservacion/evidence.md).
- [Borrador 011](specs/011-accesibilidad-fidelidad/spec.md).

**Nota de lectura:** algunos índices y resúmenes históricos conservan estados de fases anteriores. Este informe prioriza los archivos actuales de tareas, la evidencia más reciente y los guards comprobados al corte. El bloqueo antiguo de imágenes de la 002 ya se resolvió; no es el bloqueo actual de documentos010.
