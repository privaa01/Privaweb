import {officialBrand,visualReference} from '../config/brand.ts';
import {documents} from '../config/documents.ts';
import {dataWarning} from './documents.ts';
import type {SocialLink} from '../config/social.ts';
export interface Review {status:'pendiente'|'revisado';reference:string;value:string}
export interface ContactImage {src:string;alt:string;width:number;height:number;status:'pendiente'|'verificado';reference:string}
export interface ContactContent {testOnly:boolean;eyebrow:string;title:string;intro:string;image:ContactImage;brand:ContactImage;topics:string[];notice:{responsible:string;channel:string;manifesto:string;text:string};review:Review;visual:{typography:string;palette:string};social:SocialLink}
export const warning=dataWarning;
export const indicators=['Respuesta por correo electrónico','Deja tu consulta en el formulario'];
export const closing=['Respondemos al correo que indiques','Puedes usar un alias'];
export function draftContact(social:SocialLink):ContactContent{return {testOnly:false,eyebrow:'ESTAMOS AQUÍ PARA TI',title:'Contáctanos',intro:'Si tienes dudas, sugerencias o quieres compartir una historia, escríbenos. En Priva creemos en una comunidad más informada y segura, y tu mensaje es importante para nosotros.',image:{src:'/images/contact/contacto.png',alt:'Priva está contigo: un candado ilustrado acompañado de símbolos de contacto y protección.',width:1122,height:1402,status:'verificado',reference:'specs/005-contacto-publico/approved-images.md'},brand:{src:officialBrand.src,alt:'Priva',width:officialBrand.width!,height:officialBrand.height!,status:'verificado',reference:'specs/005-contacto-publico/approved-images.md'},topics:['Anti-phishing','Contraseñas','Móviles','Brechas'],notice:{...documents.notice},review:{status:'pendiente',reference:'',value:''},visual:{typography:visualReference,palette:visualReference},social};}
