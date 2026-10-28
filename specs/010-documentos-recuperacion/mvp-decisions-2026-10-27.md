# Decisiones del MVP y documentos — 2026-10-27

Fuente de decisiones: respuesta de la responsable en este chat. Actualiza P02/P03 de 009/010 sin atribuir una aprobación editorial ni un despliegue.

| Tema | Decisión recibida | Límite de lo confirmado |
|---|---|---|
| Alojamiento web | Firebase | Se resuelve la elección del proveedor de la web; no constan proyecto, producto concreto de Firebase, dominio, región o despliegue verificado |
| Correo | Modo de prueba, sin proveedor por ahora | No envío real ni acreditación de recepción; simulaciones no califican recuperación, respuestas o confirmación de eliminación productivas |
| Acceso y copias | Etapa de producto mínimo viable | No define personas autorizadas, almacenamiento, ciclos de copias o restauración ni autoriza retirar controles existentes |
| Datos del MVP | Solo datos ficticios de prueba, confirmado por la responsable | Sin consultas reales ni información personal de personas reales; no equivale a desplegar o configurar un runtime de prueba |
| Marco de documentos | Colombia: Ley 1581 de 2012 y Decreto 1377 de 2013 | Referencias para preparar el borrador; no son aprobación del texto final ni prueba de cumplimiento |

Se conserva responsable **Priva**, contacto y canal declarado **Priva202611@gmail.com**. Se mantiene la política aprobada de 90 días y sus reglas; no se amplía a cuentas, historias o logs. No se inventan dirección, teléfono, razón social ampliada, vigencia, permisos o evidencia productiva.

## Cambios preparados

`src/config/documents.ts` registra Firebase como proveedor elegido para la web y el correo en prueba. Términos y Manifiesto muestran el estado del MVP; el Manifiesto añade marco normativo y derechos de titulares para revisión. Las tres revisiones y los scopes de privacidad siguen pendientes; los documentos conservan el aviso de borrador y no se habilita Contacto real por completar una cadena de proveedor.

El modo de prueba de correo es una decisión de alcance para esta etapa, no una configuración de runtime ya implementada: los bancos existentes permiten simulaciones aisladas. No se conectó un adaptador de prueba al arranque de producción ni se simula correo entregado a personas reales. La responsable confirmó después: «Solo datos ficticios de prueba». El formulario de Contacto queda limitado a pruebas sintéticas en esta etapa; no se habilita recepción de consultas reales. Esta decisión permite continuar pruebas aisladas sin proveedor de correo ni calificación productiva, manteniendo esa calificación como condición futura para datos reales.

## Marco revisado y contenido final aún necesario

- [MinCIT — Ley 1581/Decreto 1377](https://www.mincit.gov.co/minindustria/estrategia-transversal/regulacion/proteccion-de-datos-personales): confirma el marco, derechos, autorización, políticas y responsabilidad demostrada.
- [Ley 1581 de 2012, compilación oficial de Cancillería](https://cancilleria.gov.co/normograma/compilacion/docs/ley_1581_2012.htm): derechos del artículo 8 y deberes del responsable; procedimientos de consultas/reclamos para completar en el texto final.
- [Decreto 1074 de 2015, artículo 2.2.2.25.3.1](https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/decreto_1074_2015_pr025.htm): incorpora las reglas de políticas del Decreto 1377, artículo 13. Incluye identificación/contacto del responsable, finalidad, derechos, persona/área y procedimiento de atención, vigencia y período de la base. Texto verificado en el índice oficial; algunas aperturas directas de Función Pública/Cancillería devolvieron 502/403, sin atribuirles contenido no leído.

Para el documento final faltan datos de domicilio/dirección y teléfono aplicables a la identificación del responsable; área/persona que atenderá derechos; procedimiento y términos de consultas/reclamos; definición de autorización y evidencia de su obtención cuando corresponda; vigencia, permisos de contenido y revisión final. La lista de pendientes se ajusta al marco suministrado, sin añadir requisitos funcionales al formulario por defecto ni una casilla de aceptación nueva sin revisar el alcance.

## Compatibilidad técnica de Firebase

[Firebase Hosting](https://firebase.google.com/docs/hosting) sirve contenido estático por CDN y puede integrarse con servicios dinámicos. El frontend Astro genera HTML estático; el panel/API actual usa procesos Node, SQLite persistente y tareas de privacidad con requisitos de Linux. Elegir Firebase para la página no equivale a seleccionar Firestore, Functions, Cloud Run ni adaptar esa persistencia. La arquitectura del backend y su almacenamiento requieren diseño explícito antes de activar datos reales; no se inicia una migración ni se elige región o plan de pago por inferencia.

No existe aún `firebase.json` ni `.firebaserc` en este checkout. No se crearon proyectos remotos, desplegaron recursos, contrataron planes ni aceptaron términos de terceros.

## Condiciones para cerrar

Para pruebas locales se pueden seguir usando datos sintéticos y dobles explícitos sin afirmar entrega real. Para recibir datos personales reales hay que completar la configuración/seguridad/acceso, aviso/política y autorización aplicables y verificar la operación correspondiente. Ser MVP no confirma ni elimina esas condiciones. La calificación productiva 009 y las tareas finales 010 siguen abiertas.

## Verificación de esta actualización

- 27/27 pruebas `tests/documents-*.test.ts` aprobadas con Node24.22.1, TMPDIR=/private/tmp y conexiones locales habilitadas. Los intentos iniciales en sandbox y con alias temporal no canónico fallaron por restricciones de puerto/realpath; no se cambiaron validaciones para aprobarlos. Log local: `.test-output/documents-mvp-tests-final.log`.
- Astro check raíz: 94 archivos, 0 errores, 0 advertencias y 1 hint previo de returnValue.
- Manifiesto cargado en el navegador local: aviso de borrador, proveedor elegido, estado MVP, marco colombiano/derechos y enlaces visibles.
- Gate010 sigue bloqueando publicación: faltan ubicación, copias, categorías, cookies, permisos, evidencia, fechas/revisiones y calificación009. `operation:providers` deja de ser un dato vacío por la elección recibida, sin eliminar el control productivo `privacy:providers`.
- El estado de pruebas se documentó; no se conectó correo real, alteró el runtime productivo, desplegó Firebase ni aprobaron documentos.
