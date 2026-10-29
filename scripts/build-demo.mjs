import {readFileSync,writeFileSync,cpSync,mkdirSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {initialStoryImages} from '../src/content/story-images.ts';
import {validateDraft} from '../server/stories/validation.ts';
const json=p=>JSON.parse(readFileSync(p,'utf8'));
for(const name of ['home','stories','app']){
 const r=spawnSync(process.execPath,[`scripts/require-${name}-publication.mjs`],{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);
}
const mandate=json('specs/003-historias-educativas/evidence/local-publication-authorization.json');
if(mandate.authorization!=='publica las historias'||mandate.fourthCover!=='reuse-llamada')throw Error('Missing story authorization');
const manifest=json('content/stories/audio/manifest.json');
rmSync('demo/public',{recursive:true,force:true});cpSync('public','demo/public',{recursive:true});mkdirSync('demo/public/demo',{recursive:true});mkdirSync('demo/public/media/public',{recursive:true});
const stories=[];
for(const id of ['enlace-falso','llamada-sospechosa','contrasena-compartida','numero-desconocido']){
 const draft=json(`content/stories/drafts/${id}.json`),image=initialStoryImages[id==='numero-desconocido'?'llamada-sospechosa':id];draft.imageAlt=image.alt;
 if(createHash('sha256').update(JSON.stringify(draft)).digest('hex')!==mandate.stories[id])throw Error(`Unapproved changed story: ${id}`);
 validateDraft(draft);
 const a=manifest.files.find(a=>(a.materialKey??a.storyId)===id);if(!a?.approvedByProjectOwner)throw Error('Unapproved audio');
 const bytes=readFileSync(`content/stories/audio/${a.file}`);if(createHash('sha256').update(bytes).digest('hex')!==a.sha256)throw Error('Audio hash mismatch');
 const src=`/media/public/${a.sha256}.mp3`;writeFileSync('demo/public'+src,bytes);
 stories.push({id,title:draft.title,category:draft.category,description:draft.description,image:{src:image.src,alt:image.alt,width:image.width,height:image.height},audio:{src,type:'audio/mpeg'},transcript:draft.transcript,question:draft.question,options:draft.options});
}
writeFileSync('demo/public/demo/catalog.json',JSON.stringify({schemaVersion:1,stories}));
const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build','--root','demo'],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});process.exit(result.status??1);
