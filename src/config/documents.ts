import {draftDocuments,applyOperation} from '../content/documents.ts';
export const documents=draftDocuments();
// Public facts supplied by the project owner; not operational qualification or editorial approval.
documents.operation.responsible='Priva';
documents.operation.contact='mailto:priva202611@gmail.com';
documents.operation.channel='mailto:priva202611@gmail.com';
documents.operation.providers='El MVP público está alojado en Firebase Hosting y utiliza Firestore de Google para los registros habilitados. Priva no tiene proveedor SMTP ni servicio transaccional: priva202611@gmail.com es un canal manual atendido fuera del panel y la web no confirma envío automático.';
documents.operation.location='Sitio público: https://priva-785cb.web.app/. La base Firestore de pruebas está configurada en nam5, verificada el 2026-11-03. Las cuentas, sesiones, historias y consultas del panel local se almacenan en el computador de la responsable, fuera de los archivos públicos del sitio. La ubicación y operación de una futura administración productiva siguen pendientes.';
documents.operation.copies='Por decisión de la responsable, el MVP no crea copias de seguridad de Priva ni ofrece restauración. Al eliminar un registro se retira de la operación controlada por Priva. Esta decisión no permite prometer la eliminación inmediata de ciclos internos no documentados de Firebase, Google, buzones o dispositivos.';
applyOperation(documents);
// Owner decisions update the draft; they do not approve its text or production readiness.
documents.revision='010-mvp-approved-2026-11-10';
for (const document of Object.values(documents.documents)) document.sections.push({
 id:'estado-mvp',title:'Estado del producto mínimo viable',paragraphs:[
  'Priva continúa en etapa de producto mínimo viable y está disponible en Firebase Hosting. Estos documentos describen el alcance MVP aprobado por la responsable el 10 de noviembre de 2026; no constituyen certificación legal.',
  'En esta etapa, las pruebas del formulario de Contacto se limitan a datos ficticios. No introduzcas datos personales reales ni consultas de personas reales.',
  'Priva no dispone de SMTP ni proveedor transaccional. El correo priva202611@gmail.com funciona como canal manual fuera del panel; la web no promete envío automático, recuperación por correo ni confirmación automatizada de eliminación.',
  'El inicio de sesión y la gestión de historias funcionan de forma local en el computador de la responsable. La bandeja local permite lectura; su envío de respuestas está desactivado y no recibe los registros ficticios de Firestore. Las sesiones administrativas utilizan cookies necesarias para autenticar el acceso.',
  'La responsable eligió mantener el plan gratuito de Firebase, conservar los registros de Contacto durante 90 días desde la última actividad y no crear copias de seguridad de Priva. No se ofrece restauración en el MVP.',
  'Las solicitudes de privacidad y eliminación se reciben manualmente en priva202611@gmail.com. La eliminación retira los datos de la operación controlada por Priva, sin prometer control inmediato sobre ciclos internos no documentados de terceros.'
 ]
});
documents.documents.manifesto.sections.push({
 id:'marco-colombiano',title:'Marco colombiano de protección de datos',paragraphs:[
  'Este borrador toma como referencia la Ley 1581 de 2012 y su reglamentación, incluido el Decreto 1377 de 2013 y su compilación en el Decreto 1074 de 2015. La referencia a estas normas no constituye una certificación de cumplimiento.',
  'Los titulares cuentan, en los términos de la normativa aplicable, con derechos a conocer, actualizar y rectificar sus datos, conocer su uso, solicitar prueba de la autorización, acceder gratuitamente a sus datos y solicitar la revocatoria de la autorización o la supresión cuando procedan. También pueden presentar quejas ante la Superintendencia de Industria y Comercio, con los requisitos legales aplicables.',
  'El responsable declarado para el MVP es Priva y el canal de contacto, consultas, reclamos y eliminación es priva202611@gmail.com. La atención es manual y no exige un sistema automático de correo en este alcance.'
 ],links:[
  {label:'Ley 1581 de 2012 — texto oficial',href:'https://cancilleria.gov.co/normograma/compilacion/docs/ley_1581_2012.htm'},
  {label:'Ley 1581 y Decreto 1377 — explicación del MinCIT',href:'https://www.mincit.gov.co/minindustria/estrategia-transversal/regulacion/proteccion-de-datos-personales'},
  {label:'Decreto 1074 de 2015 — políticas de tratamiento, artículo 2.2.2.25.3.1',href:'https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/decreto_1074_2015_pr025.htm'}
 ]
});
