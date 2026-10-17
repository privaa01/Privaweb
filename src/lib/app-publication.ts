import {realpathSync,statSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';
import {appDownloadNote,benefitTitles,stepTitles,featureTitles,type AppData,type AppImage} from '../content/app.ts';
import {platforms,verifiedEntry,resolveDownloads,availabilityMask,reviewToday} from './app-downloads.ts';
export function contentSnapshot(c:AppData):string {
 return JSON.stringify({hero:{eyebrow:c.hero.eyebrow,title:c.hero.title,description:c.hero.description,notice:c.hero.notice},overview:{title:c.overview.title,description:c.overview.description,notice:c.overview.notice,benefits:c.overview.benefits},steps:c.steps,features:c.features,downloads:{id:c.downloads.id,eyebrow:c.downloads.eyebrow,title:c.downloads.title,description:c.downloads.description,note:c.downloads.note}});
}
export function imageSnapshot(i:AppImage):string {
 return JSON.stringify({block:i.block,src:i.src,width:i.width,height:i.height,purpose:i.purpose,alt:i.alt,sourceReference:i.sourceReference,decorativeReason:i.decorativeReason,compatibleStates:i.compatibleStates});
}
export function appPublicationIssues(c:AppData,config:unknown,publicRoot:string,today=reviewToday()):string[]{
 const issues:string[]=[];
 if(c.testOnly)issues.push('fixture no publicable');
 const nonempty=(s:unknown)=>typeof s==='string'&&!!s.trim();
 for(const block of[c.hero,c.overview,c.steps,c.features,c.downloads])if(!nonempty(block.title)||!nonempty(block.description))issues.push('contenido incompleto');
 for(const list of[c.overview.benefits,c.steps.items,c.features.items])if(list.some(i=>!nonempty(i.title)||!nonempty(i.description)))issues.push('elemento de contenido incompleto');
 if(c.review.status!=='revisado'||!nonempty(c.review.decisionReference)||c.review.reviewedValue!==contentSnapshot(c))issues.push('revisión editorial pendiente o desactualizada');
 if(!nonempty(c.hero.notice)||!/prototipo/i.test(c.hero.notice)||!nonempty(c.overview.notice)||!/previstas/i.test(c.overview.notice))issues.push('condición de prototipo/funciones previstas incompleta');
 if(c.steps.id!=='como-funciona'||c.downloads.id!=='descarga'||c.downloads.note!==appDownloadNote)issues.push('anclas o notaA07 incorrectas');
 for(const [items,titles] of[[c.overview.benefits,benefitTitles],[c.steps.items,stepTitles],[c.features.items,featureTitles]] as const)if(items.length!==titles.length||items.some((v,i)=>v.title!==titles[i]))issues.push('títulos/cantidad/orden de contenido incorrectos');
 const raw=Array.isArray(config)?config:[];
 if(raw.length!==2||platforms.some(p=>raw.filter(v=>v&&v.platform===p).length!==1))issues.push('descargas: falta una plataforma o hay duplicados');
 for(const entry of raw){
  if(!entry||!platforms.includes(entry.platform)||!['pendiente','verificado'].includes(entry.status)||(entry.candidateURL!==null&&typeof entry.candidateURL!=='string')){issues.push('descargas: configuración inválida');continue;}
  if(entry.status==='verificado'&&!verifiedEntry(entry,today))issues.push(`descargas: ${entry.platform} se declara verificado sin evidencia consistente`);
 }
 const mask=availabilityMask(resolveDownloads(config,today));
 for(const [index,img] of[c.hero.image,c.overview.image,c.downloads.image,c.brand].entries()){
  if(img.block!==['hero','overview','download','brand'][index]||img.status!=='verificado'||!nonempty(img.sourceReference))issues.push('recurso oficial pendiente');
  if(![img.width,img.height].every(n=>Number.isFinite(n)&&n>0))issues.push('dimensiones pendientes');
  if(img.purpose==='informativo'?!nonempty(img.alt):img.purpose!=='decorativo'||img.alt!==''||!nonempty(img.decorativeReason))issues.push('alternativa/propósito inválido');
  if(img.block==='overview'&&(img.purpose!=='informativo'||!/prototipo/i.test(img.alt)))issues.push('teléfono debe describir representación del prototipo');
  if(img.review.status!=='revisado'||!nonempty(img.review.decisionReference)||img.review.reviewedValue!==imageSnapshot(img))issues.push('revisión de recurso pendiente o desactualizada');
  if(img.block==='download'&&(!img.compatibleStates.includes(mask)||img.compatibleStates.some(m=>!['00','10','01','11'].includes(m))))issues.push('mockup incompatible con disponibilidad efectiva');
  if(!/^\/(images\/app|brand)\/[A-Za-z0-9_./-]+\.(svg|png|jpe?g|webp|avif)$/i.test(img.src)||img.src.includes('..')||/fixture|test-/i.test(img.src)){issues.push('ruta de recurso oficial inválida');continue;}
  try{const root=realpathSync(publicRoot),file=realpathSync(resolve(root,img.src.slice(1))),path=relative(root,file);if(path.startsWith('..')||isAbsolute(path)||!statSync(file).isFile()||!statSync(file).size)throw new Error();}catch{issues.push('archivo ausente, vacío o fuera de public');}
 }
 for(const visual of Object.values(c.visual))if(visual.status!=='verificado'||!nonempty(visual.sourceReference))issues.push('referencia visual pendiente');
 return issues;
}
export function assertAppPublication(content:AppData,config:unknown,publicRoot:string):void {
 const issues=appPublicationIssues(content,config,publicRoot);if(issues.length)throw new Error('BLOQUEADO 004: '+issues.join('; '));
}
