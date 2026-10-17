import {realpathSync,statSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';
import {instagram,type SocialLink} from '../config/social.ts';
import type {ContactContent} from '../content/contact.ts';
import type {ContactReadiness} from '../config/contact.ts';
export function contactSnapshot(c:ContactContent){return JSON.stringify({...c,review:undefined});}
export function readinessSnapshot(r:ContactReadiness){return JSON.stringify({origin:r.origin,provider:r.provider,qualificationReference:r.qualificationReference,privacyReference:r.privacyReference});}
export function trackingVerified(r:ContactReadiness):boolean{return !!r.tracking.reference.trim()&&!!r.tracking.scope.trim()&&r.tracking.reviewedValue===readinessSnapshot(r);}
function httpsAddress(value:string,originOnly=false):boolean{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&(!originOnly||u.origin===value);}catch{return false;}}
export function contactPublicationIssues(c:ContactContent,r:ContactReadiness,root:string,canonical:SocialLink=instagram):string[]{
 const issues:string[]=[];const filled=(v:string)=>!!v?.trim();
 if(c.testOnly)issues.push('fixture no publicable');
 if(c.review.status!=='revisado'||!filled(c.review.reference)||c.review.value!==contactSnapshot(c))issues.push('revisión editorial pendiente o desactualizada');
 if(!filled(c.eyebrow)||!filled(c.title)||!filled(c.intro)||JSON.stringify(c.topics)!==JSON.stringify(['Anti-phishing','Contraseñas','Móviles','Brechas']))issues.push('contenido incompleto');
 if(!filled(c.notice.responsible)||!(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.notice.channel)||httpsAddress(c.notice.channel))||c.notice.manifesto!=='/manifiesto-datos.html'||!filled(c.notice.text))issues.push('aviso/canal/Manifiesto pendientes');
 try{if(!statSync(resolve(root,'../src/pages/manifiesto-datos.astro')).isFile())issues.push('Manifiesto real ausente');}catch{issues.push('Manifiesto real ausente');}
 if(c.social.url!==canonical.url||canonical.status!=='verificado'||!filled(canonical.reviewRef)||c.social.status!=='verificado'||!filled(c.social.reviewRef)||!/^https:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/.test(c.social.url))issues.push('Instagram oficial pendiente');
 for(const img of[c.image,c.brand]){
  if(img.status!=='verificado'||!filled(img.reference)||!filled(img.alt)||img.width<=0||img.height<=0)issues.push('recurso oficial pendiente');
  if(!/^\/(?:images\/contact|brand)\/[A-Za-z0-9_./-]+\.(?:svg|png|jpe?g|webp|avif)$/i.test(img.src)||img.src.includes('..')||/fixture|test-/i.test(img.src)){issues.push('ruta de recurso inválida');continue;}
  try{const dir=realpathSync(root),file=realpathSync(resolve(dir,img.src.slice(1))),rel=relative(dir,file);if(rel.startsWith('..')||isAbsolute(rel)||!statSync(file).isFile()||!statSync(file).size)throw new Error();}catch{issues.push('archivo oficial ausente o fuera de public');}
 }
 if(!filled(c.visual.typography)||!filled(c.visual.palette))issues.push('referencias visuales pendientes');
 if(!httpsAddress(r.origin,true)||!filled(r.provider)||!filled(r.qualificationReference)||!filled(r.privacyReference)||r.reviewedValue!==readinessSnapshot(r))issues.push('operación productiva pendiente');
 return issues;
}
export function assertContactPublication(c:ContactContent,r:ContactReadiness,root:string){const issues=contactPublicationIssues(c,r,root);if(issues.length)throw new Error('BLOQUEADO 005: '+issues.join('; '));}
