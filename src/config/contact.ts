import {instagram} from './social.ts';
import {draftContact} from '../content/contact.ts';
export interface ContactReadiness {origin:string;provider:string;qualificationReference:string;privacyReference:string;reviewedValue:string;tracking:{reference:string;scope:string;reviewedValue:string}}
export const contactContent=draftContact(instagram);
export const contactReadiness:ContactReadiness={origin:'',provider:'',qualificationReference:'',privacyReference:'',reviewedValue:'',tracking:{reference:'',scope:'',reviewedValue:''}};
