import { realpathSync, statSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { catalogCopy, methodSteps, storiesClosingText, type StoriesData } from '../content/stories.ts';
export function reviewText(block:{title:string;description:string}):string{return JSON.stringify([block.title,block.description,catalogCopy,methodSteps]);}
export function storiesPublicationIssues(content:StoriesData,publicRoot:string):string[]{
 const issues:string[]=[];
 if(content.testOnly)issues.push('contenido de fixture no publicable');
 const blocks=[content.hero,content.method,content.closing,...content.identity];
 for(const block of blocks){
  if(!block.title.trim()||!block.description.trim())issues.push('texto incompleto');
  if(block.review.status!=='revisado'||!block.review.decisionReference.trim()||block.review.reviewedText!==reviewText(block))issues.push(`${block.title}: revisión editorial pendiente o desactualizada`);
 }
 if(content.hero.title!=='Aprende con recreaciones educativas sobre riesgos digitales.'||content.method.title!=='Identifica el error y aprende'||content.closing.description!==storiesClosingText)issues.push('contenido de referencia/C16 alterado');
 if(content.identity.length!==2||content.identity[0]?.href!=='/index.html#somos-priva'||content.identity[1]?.href!=='/index.html#que-hacemos'||content.identity[0]?.title!=='Somos Priva'||content.identity[1]?.title!=='Informamos para que estés en control.')issues.push('destinos institucionales incorrectos');
 const images=[content.hero.image,content.method.image,content.closing.image,content.brand];
 for(const [i,image] of images.entries()){
  if(image.block!==['hero','identidad','cierre','marca'][i]||image.status!=='verificado'||!image.sourceReference.trim())issues.push('recurso oficial pendiente');
  if(![image.width,image.height].every(n=>Number.isFinite(n)&&n>0))issues.push('dimensiones pendientes');
  if(image.purpose==='informativo'?!image.alt.trim():image.purpose!=='decorativo'||image.alt!=='')issues.push('alternativa inválida');
  if(!/^\/(images\/stories|brand)\/[A-Za-z0-9_./-]+\.(svg|png|jpe?g|webp|avif)$/i.test(image.src)||image.src.includes('..')||/fixture|test-/i.test(image.src)){issues.push('ruta oficial inválida');continue;}
  try{
   const root=realpathSync(publicRoot),file=realpathSync(resolve(root,image.src.slice(1))),rel=relative(root,file);
   if(rel.startsWith('..')||isAbsolute(rel)||!statSync(file).isFile()||!statSync(file).size)throw new Error();
  }catch{issues.push('archivo oficial ausente, vacío o fuera de public');}
 }
 try{const url=new URL(content.social.url);if(url.protocol!=='https:'||!['instagram.com','www.instagram.com'].includes(url.hostname)||url.username||url.password||url.port||url.pathname==='/'||url.search||url.hash)throw new Error();}catch{issues.push('Instagram oficial inválido o ausente');}
 if(content.social.status!=='verificado'||!content.social.reviewRef.trim())issues.push('Instagram pendiente de verificación');
 if(content.endpoint!=='/api/public/historias')issues.push('contrato público no configurado');
 for(const origin of content.mediaOrigins){try{const url=new URL(origin);if(url.protocol!=='https:'||url.origin!==origin)throw new Error();}catch{issues.push('origen de medios inválido');}}
 for(const visual of Object.values(content.visual))if(visual.status!=='verificado'||!visual.sourceReference.trim())issues.push('referencia visual pendiente');
 return issues;
}
export function assertStoriesPublication(content:StoriesData,publicRoot:string):void{
 const issues=storiesPublicationIssues(content,publicRoot);if(issues.length)throw new Error('BLOQUEADO 003: '+issues.join('; '));
}
