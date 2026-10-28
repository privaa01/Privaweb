import approvedCopy from './app-review.json' with { type: 'json' };
import { officialBrand, visualReference } from '../config/brand.ts';
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
const image=(block:AppImage['block']):AppImage=>{
 const brand=block==='brand';
 const asset:AppImage={block,src:brand?officialBrand.src:'/images/app/asistente-zyro.png',width:brand?officialBrand.width!:1024,height:brand?officialBrand.height!:1536,purpose:'informativo',alt:brand?'Priva':'Representación del prototipo de Priva App: conversación con el Asistente Zyro sobre cómo eliminar una cuenta de Instagram.',status:'verificado',sourceReference:'specs/004-presentacion-app/evidence/approved-images.md',decorativeReason:'',compatibleStates:block==='download'?['00','10','01','11']:[],review:review()};
 asset.review={status:'revisado',decisionReference:asset.sourceReference,reviewedValue:JSON.stringify({block:asset.block,src:asset.src,width:asset.width,height:asset.height,purpose:asset.purpose,alt:asset.alt,sourceReference:asset.sourceReference,decorativeReason:asset.decorativeReason,compatibleStates:asset.compatibleStates})};
 return asset;
};
// Explicit prototype copy approved by the project owner on 2026-10-28.
export const appContent:AppData={testOnly:false,
 hero:{eyebrow:'MANEJA TU PRIVACIDAD',title:'Tu chat privado para proteger tus datos.',description:'Priva App es un prototipo que propone orientación paso a paso para cuidar tus datos personales.',notice:'Prototipo. Las funciones descritas están previstas; esta web no ofrece un chat ni un diagnóstico operativo.',image:image('hero')},
 overview:{title:'¿Qué es Priva App?',description:'El prototipo plantea una guía para comprender opciones de privacidad y tomar decisiones informadas.',notice:'Funciones previstas del prototipo, sujetas a desarrollo y validación.',image:image('overview'),benefits:benefitTitles.map((title,i)=>({title,description:['Se prevén instrucciones claras y fáciles de seguir.','Se prevé orientación para el cuidado de los datos personales.','Se prevé ayuda expresada de forma comprensible; no es un servicio de respuesta actual.'][i]}))},
 steps:{id:'como-funciona',title:'¿Cómo se usa?',description:'Así se plantea el recorrido del prototipo; estos pasos no activan funciones en esta web.',items:stepTitles.map((title,i)=>({title,description:['En la aplicación prevista se plantearía una duda sobre privacidad.','La función prevista ofrecería una guía comprensible.','La persona revisaría la orientación antes de decidir sus cambios.','El recorrido previsto ayudaría a conocer buenas prácticas.'][i]}))},
 features:{title:'¿Para qué sirve?',description:'Estas son funciones previstas de Priva App, no herramientas disponibles en esta página.',items:featureTitles.map((title,i)=>({title,description:['Se proponen consejos educativos para cuidar los datos personales.','Se plantea un asistente que oriente sobre dudas de privacidad.','Se plantea orientación sobre hábitos de seguridad, sin evaluación operativa en esta web.'][i]}))},
 downloads:{id:'descarga',eyebrow:'LLEVA TU PRIVACIDAD CONTIGO',title:'Descubre la disponibilidad de Priva App.',description:'Consulta el estado de cada plataforma. Solo se habilitarán destinos oficiales verificados.',note:appDownloadNote,image:image('download')},
 brand:image('brand'),review:review(),visual:{typography:{status:'verificado',sourceReference:visualReference},palette:{status:'verificado',sourceReference:visualReference}},
};

// Exact approved snapshot: changes invalidate the editorial publication guard.
appContent.review={...approvedCopy,status:'revisado'};
