import type { AvailabilityMask } from '../lib/app-downloads.ts';
export interface AppReview {status:'pendiente'|'revisado';decisionReference:string;reviewedValue:string}
export interface AppImage {
 block:'hero'|'overview'|'download'|'brand';src:string;width:number;height:number;purpose:'informativo'|'decorativo';alt:string;
 status:'pendiente'|'verificado';sourceReference:string;decorativeReason:string;compatibleStates:AvailabilityMask[];review:AppReview;
}
export interface AppItem {title:string;description:string}
export interface AppData {
 testOnly:boolean;hero:{eyebrow:string;title:string;description:string;notice:string;image:AppImage};
 overview:{title:string;description:string;notice:string;image:AppImage;benefits:AppItem[]};
 steps:{id:'como-funciona';title:string;description:string;items:AppItem[]};
 features:{title:string;description:string;items:AppItem[]};
 downloads:{id:'descarga';eyebrow:string;title:string;description:string;note:string;image:AppImage};
 brand:AppImage;review:AppReview;visual:{typography:{status:string;sourceReference:string};palette:{status:string;sourceReference:string}};
}
export const appDownloadNote='Orientación para cuidar tus datos personales';
export const benefitTitles=['Guía paso a paso','Privacidad digital','Ayuda clara y rápida'];
export const stepTitles=['Escribe tu duda','Recibe instrucciones','Aplica los cambios','Mantente seguro'];
export const featureTitles=['Tips','Asistente IA','Diagnóstico de Seguridad'];
const review=():AppReview=>({status:'pendiente',decisionReference:'',reviewedValue:''});
const image=(block:AppImage['block']):AppImage=>({block,src:'',width:0,height:0,purpose:'informativo',alt:'',status:'pendiente',sourceReference:'',decorativeReason:'',compatibleStates:[],review:review()});
// Draft wording derived from C31: explicit prototype, pending P03 approval. Not final claims.
export const appContent:AppData={testOnly:false,
 hero:{eyebrow:'MANEJA TU PRIVACIDAD',title:'Tu chat privado para proteger tus datos.',description:'Priva App es un prototipo que propone orientación paso a paso para cuidar tus datos personales.',notice:'Prototipo. Las funciones descritas están previstas; esta web no ofrece un chat ni un diagnóstico operativo.',image:image('hero')},
 overview:{title:'¿Qué es Priva App?',description:'El prototipo plantea una guía para comprender opciones de privacidad y tomar decisiones informadas.',notice:'Funciones previstas del prototipo, sujetas a desarrollo y validación.',image:image('overview'),benefits:benefitTitles.map((title,i)=>({title,description:['Se prevén instrucciones claras y fáciles de seguir.','Se prevé orientación para el cuidado de los datos personales.','Se prevé ayuda expresada de forma comprensible; no es un servicio de respuesta actual.'][i]}))},
 steps:{id:'como-funciona',title:'¿Cómo se usa?',description:'Así se plantea el recorrido del prototipo; estos pasos no activan funciones en esta web.',items:stepTitles.map((title,i)=>({title,description:['En la aplicación prevista se plantearía una duda sobre privacidad.','La función prevista ofrecería una guía comprensible.','La persona revisaría la orientación antes de decidir sus cambios.','El recorrido previsto ayudaría a conocer buenas prácticas.'][i]}))},
 features:{title:'¿Para qué sirve?',description:'Estas son funciones previstas de Priva App, no herramientas disponibles en esta página.',items:featureTitles.map((title,i)=>({title,description:['Se proponen consejos educativos para cuidar los datos personales.','Se plantea un asistente que oriente sobre dudas de privacidad.','Se plantea orientación sobre hábitos de seguridad, sin evaluación operativa en esta web.'][i]}))},
 downloads:{id:'descarga',eyebrow:'LLEVA TU PRIVACIDAD CONTIGO',title:'Descubre la disponibilidad de Priva App.',description:'Consulta el estado de cada plataforma. Solo se habilitarán destinos oficiales verificados.',note:appDownloadNote,image:image('download')},
 brand:image('brand'),review:review(),visual:{typography:{status:'pendiente',sourceReference:''},palette:{status:'pendiente',sourceReference:''}},
};
