export type DocumentId='terms'|'manifesto';
export type TextId=DocumentId|'notice';
export interface Section {id:string;title:string;paragraphs:string[];links?:{label:string;href:string}[]}
export interface InformativeDocument {title:string;path:string;effectiveDate:string;sections:Section[]}
export interface EditorialReview {status:'pendiente'|'revisado';reviewer:string;date:string;reference:string;sha256:string;bundleHash:string}
export interface PublicOperation {responsible:string;contact:string;channel:string;providers:string;location:string;copies:string;categories:string;cookies:string;permissions:string;evidence:string}
export interface DocumentBundle {revision:string;testOnly:boolean;language:'es';documents:Record<DocumentId,InformativeDocument>;notice:{responsible:string;channel:string;manifesto:string;text:string};operation:PublicOperation;reviews:Record<TextId,EditorialReview>;trackingClaims:boolean}
export const operationLabels:Record<keyof PublicOperation,string>={responsible:'Responsable',contact:'Contacto del responsable',channel:'Canal de consultas y eliminación anticipada',providers:'Proveedores y destinatarios',location:'Ubicación y condiciones del tratamiento',copies:'Ciclos de proveedores, buzones y copias',categories:'Políticas de cuentas, historias y registros de seguridad',cookies:'Cookies necesarias',permissions:'Titularidad, permisos y condiciones',evidence:'Información operativa verificada'};
export const documentPaths={terms:'/terminos.html',manifesto:'/manifiesto-datos.html'} as const;
export const destinations={index:'/index.html',casos:'/historias.html#casos',como:'/app.html#como-funciona',descarga:'/app.html#descarga',escribir:'/contacto.html#escribir'} as const;
export const dataWarning='No incluyas contraseñas, códigos de acceso, datos bancarios, documentos ni información sensible o de otras personas.';
export const retentionText='Conservamos los datos de Contacto y sus respuestas durante 90 días desde la recepción inicial o la aceptación original comprobada de una nueva respuesta por el servicio de correo, lo que ocurra después. Leer, guardar borradores, fallos, resultados desconocidos, repetir confirmaciones y el correo de verificación de eliminación no reinician ese plazo. La aceptación del servicio no demuestra recepción en bandeja ni lectura.';
export const erasureText='Al vencer se bloquean el acceso ordinario y los nuevos envíos. Revisamos vencimientos al menos cada hora y completamos el borrado operativo como máximo una hora después del vencimiento. Puedes solicitar eliminación anticipada por el canal verificado; comprobamos el control del correo guardado mediante un enlace o código de un solo uso, sin documentos de identidad. El borrado operativo se completa como máximo 24 horas después de confirmación válida, o antes si lo exige la conservación. Esto no es un plazo general de respuesta a consultas.';
export const noticeText='Para enviar tu consulta completa nombre o alias, correo y mensaje, todos obligatorios. Puedes usar un seudónimo; no necesitamos tu nombre legal. Guardamos estos datos para consulta privada del equipo autorizado y respuesta por correo; la respuesta se conserva asociada. Tus mensajes y respuestas no se publican en la web. Conservación: 90 días desde la última actividad, según el Manifiesto. Puedes solicitar eliminación anticipada por el canal verificado. '+dataWarning;
const section=(id:string,title:string,...paragraphs:string[]):Section=>({id,title,paragraphs});
export const requiredSections={terms:['servicio','prototipo','contacto','acceso','condiciones'],manifesto:['datos','conservacion','eliminacion','ejercicios','operacion']} as const;
export function draftDocuments():DocumentBundle {
 const review=():EditorialReview=>({status:'pendiente',reviewer:'',date:'',reference:'',sha256:'',bundleHash:''});
 return {revision:'010-draft',testOnly:false,language:'es',trackingClaims:false,
 operation:{responsible:'',contact:'',channel:'',providers:'',location:'',copies:'',categories:'',cookies:'',permissions:'',evidence:''},
 notice:{responsible:'',channel:'',manifesto:documentPaths.manifesto,text:noticeText},
 reviews:{terms:review(),manifesto:review(),notice:review()},
 documents:{terms:{title:'Términos de Servicio',path:documentPaths.terms,effectiveDate:'',sections:[
 section('servicio','Contenido educativo','Priva ofrece contenidos educativos sobre cuidado de datos personales. Los casos ayudan a reconocer riesgos; no garantizan evitar incidentes ni representan una comprobación técnica de tus cuentas. No se presentan como testimonios reales sin respaldo.'),
 section('prototipo','Priva App es un prototipo','Las funciones de consejos, asistente con IA y diagnóstico son previstas. Cada descarga muestra Próximamente sin acción hasta tener enlace oficial verificado, de forma independiente por plataforma. El teléfono y Conversar son una representación visual, no un chat web.'),
 section('contacto','Consultas privadas','Puedes enviar consultas con nombre o alias, correo y mensaje. Respondemos por correo sin plazo garantizado; los mensajes y respuestas no se publican. El Manifiesto describe uso, conservación y eliminación. '+dataWarning),
 section('acceso','Acceso y enlaces externos','No hay registro público; el panel está reservado a cuentas individuales autorizadas. Las respuestas de ejercicios son locales y no persistentes. Enlaces externos como Instagram llevan a servicios con condiciones propias.'),
 section('condiciones','Responsable, vigencia y permisos') ]},
 manifesto:{title:'Manifiesto de Datos',path:documentPaths.manifesto,effectiveDate:'',sections:[
 section('datos','Datos y finalidad','Contacto requiere nombre o alias, correo y mensaje, sin identidad legal. Se guardan para consulta del equipo autorizado y respuesta privada por correo. Las respuestas se conservan asociadas, sin publicación web. Los proveedores pueden tener acceso técnico según sus funciones verificadas.'),
 section('conservacion','Conservación de Contacto',retentionText),
 section('eliminacion','Eliminación y copias',erasureText,'El borrado operativo se distingue de proveedores, buzones y respaldos con ciclos propios comprobados. No prometemos retirada de correos enviados, eliminación inmediata total ni éxito si existen actuaciones pendientes o fallidas.'),
 section('ejercicios','Ejercicios y servicios externos','Las selecciones de los ejercicios son locales: no se envían ni almacenan persistentemente y se reinician al recargar. La ausencia de rastreo publicitario y cookies de rastreo requiere verificar la web y sus integraciones; las cookies necesarias se documentan por separado. Instagram es un servicio externo.'),
 section('operacion','Responsable y operación') ]}}};
}
/** Populate public operational facts only; does not approve or create evidence. */
export function applyOperation(b:DocumentBundle):void {
 b.notice.responsible=b.operation.responsible;b.notice.channel=b.operation.channel;
 b.documents.terms.sections.find(s=>s.id==='condiciones')!.paragraphs=(['responsible','contact','permissions'] as const).map(k=>operationLabels[k]+': '+b.operation[k]);
 b.documents.manifesto.sections.find(s=>s.id==='operacion')!.paragraphs=(Object.keys(operationLabels) as (keyof PublicOperation)[]).map(k=>operationLabels[k]+': '+b.operation[k]);
 const operation=b.documents.manifesto.sections.find(s=>s.id==='operacion')!;
 operation.links=[...(b.operation.contact?[{label:'Contactar al responsable',href:b.operation.contact}]:[]),...(b.operation.channel?[{label:'Solicitar eliminación anticipada',href:b.operation.channel}]:[])];
}
