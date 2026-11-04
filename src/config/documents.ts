import {draftDocuments,applyOperation} from '../content/documents.ts';
export const documents=draftDocuments();
// Public facts supplied by the project owner; not operational qualification or editorial approval.
documents.operation.responsible='Priva';
documents.operation.contact='mailto:Priva202611@gmail.com';
documents.operation.channel='mailto:Priva202611@gmail.com';
documents.operation.providers='La demo pública está publicada en Firebase Hosting. Contacto guarda exclusivamente registros ficticios predefinidos en Firestore de Google, sin lectura pública. La administración funcional se ejecuta por separado en el computador de la responsable, con Node y SQLite privados. No hay proveedor de envío de correos ni entrega real acreditada.';
documents.operation.location='Sitio público: https://priva-785cb.web.app/. La base Firestore de pruebas está configurada en nam5, verificada el 2026-11-03. Las cuentas, sesiones, historias y consultas del panel local se almacenan en el computador de la responsable, fuera de los archivos públicos del sitio. La ubicación y operación de una futura administración productiva siguen pendientes.';
documents.operation.copies='Por decisión de la responsable, Priva no crea copias de seguridad en este perfil. La eliminación de registros no ofrece recuperación desde una copia de Priva. Los ciclos internos de Firebase y las copias del sistema operativo no se consideran comprobados por esta decisión.';
applyOperation(documents);
// Owner decisions update the draft; they do not approve its text or production readiness.
documents.revision='010-mvp-draft-2026-11-04';
for (const document of Object.values(documents.documents)) document.sections.push({
 id:'estado-mvp',title:'Estado del producto mínimo viable',paragraphs:[
  'Priva está en etapa de producto mínimo viable. La demo pública está disponible en Firebase Hosting. Sus documentos describen exclusivamente esa demostración; este borrador de la versión completa no constituye una política final aprobada.',
  'En esta etapa, las pruebas del formulario de Contacto se limitan a datos ficticios. No introduzcas datos personales reales ni consultas de personas reales.',
  'El envío de correos está en modo de prueba, sin proveedor externo de envío. Las pruebas de respuesta, recuperación de acceso y confirmación de eliminación no acreditan recepción de correos reales.',
  'El inicio de sesión y la gestión de historias funcionan de forma local en el computador de la responsable. La bandeja local permite lectura; su envío de respuestas está desactivado y no recibe los registros ficticios de Firestore. Las sesiones administrativas utilizan cookies necesarias para autenticar el acceso.',
  'La responsable eligió mantener el plan gratuito de Firebase, ejecutar el mantenimiento de ambas bases desde su computador, no crear copias de seguridad y mantener el correo desactivado. El proceso comprueba vencimientos de 90 días; su ejecución depende de que el computador y el proceso estén encendidos. La eliminación anticipada con comprobación por correo continúa deshabilitada.',
  'Este documento permanece en revisión. Las condiciones de acceso, almacenamiento privado y copias de seguridad deben concretarse antes de habilitar la recepción de consultas reales.'
 ]
});
documents.documents.manifesto.sections.push({
 id:'marco-colombiano',title:'Marco colombiano de protección de datos',paragraphs:[
  'Este borrador toma como referencia la Ley 1581 de 2012 y su reglamentación, incluido el Decreto 1377 de 2013 y su compilación en el Decreto 1074 de 2015. La referencia a estas normas no constituye una certificación de cumplimiento.',
  'Los titulares cuentan, en los términos de la normativa aplicable, con derechos a conocer, actualizar y rectificar sus datos, conocer su uso, solicitar prueba de la autorización, acceder gratuitamente a sus datos y solicitar la revocatoria de la autorización o la supresión cuando procedan. También pueden presentar quejas ante la Superintendencia de Industria y Comercio, con los requisitos legales aplicables.',
  'El correo de contacto declarado es Priva202611@gmail.com. El área responsable, el procedimiento de atención de consultas y reclamos y los datos de identificación y contacto aún faltantes deben completarse para la versión final de la política.'
 ],links:[
  {label:'Ley 1581 de 2012 — texto oficial',href:'https://cancilleria.gov.co/normograma/compilacion/docs/ley_1581_2012.htm'},
  {label:'Ley 1581 y Decreto 1377 — explicación del MinCIT',href:'https://www.mincit.gov.co/minindustria/estrategia-transversal/regulacion/proteccion-de-datos-personales'},
  {label:'Decreto 1074 de 2015 — políticas de tratamiento, artículo 2.2.2.25.3.1',href:'https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/decreto_1074_2015_pr025.htm'}
 ]
});
