import { parseCatalog, type PublicStory } from '../lib/stories-contract';
import { connectAudio } from './stories-audio';
import { connectExercise } from './stories-exercise';
for(const root of document.querySelectorAll<HTMLElement>('[data-stories]')){
 const catalog=root.querySelector<HTMLElement>('[data-catalog]')!,status=root.querySelector<HTMLElement>('[data-catalog-status]')!;
 const expand=root.querySelector<HTMLButtonElement>('[data-expand]')!,retry=root.querySelector<HTMLButtonElement>('[data-retry]')!;
 const template=root.querySelector<HTMLTemplateElement>('[data-story-template]')!;
 let controller:AbortController|undefined,serial=0,stories:PublicStory[]=[],cleanups:(()=>void)[]=[];
 const clear=()=>{cleanups.forEach(fn=>fn());cleanups=[];catalog.replaceChildren();stories=[];expand.hidden=true;expand.setAttribute('aria-expanded','false');retry.hidden=true;};
 const render=(story:PublicStory)=>{
  const fragment=template.content.cloneNode(true) as DocumentFragment,card=fragment.querySelector<HTMLElement>('[data-story]')!;
  card.dataset.story=story.id;
  for(const [name,text] of Object.entries({title:story.title,category:story.category,description:story.description,transcript:story.transcript,question:story.question}))card.querySelector<HTMLElement>(`[data-story-${name}]`)!.textContent=text;
  const title=card.querySelector<HTMLElement>('[data-story-title]')!;title.id=`story-${story.id}--heading`;card.setAttribute('aria-labelledby',title.id);
  const image=card.querySelector<HTMLImageElement>('[data-story-image]')!;image.alt=story.image.alt;image.width=story.image.width;image.height=story.image.height;image.src=story.image.src;
  const audio=card.querySelector<HTMLAudioElement>('audio')!;audio.setAttribute('aria-label',`Audio: ${story.title}`);
  const audioStatus=card.querySelector<HTMLElement>('[data-audio-status]')!;audioStatus.id=`story-${story.id}--audio-status`;audio.setAttribute('aria-describedby',audioStatus.id);
  cleanups.push(connectAudio(card),connectExercise(card,story));catalog.append(fragment);audio.src=story.audio.src;audio.load();
 };
 async function load(){
  controller?.abort();controller=new AbortController();const current=++serial;clear();status.textContent='Cargando historias…';catalog.setAttribute('aria-busy','true');
  try{
   const response=await fetch(root.dataset.endpoint!,{credentials:'omit',cache:'no-store',signal:controller.signal});
   if(!response.ok||!/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type')||''))throw new Error('respuesta inválida');
   const data=parseCatalog(await response.json(),{baseURL:location.origin,mediaOrigins:JSON.parse(root.dataset.mediaOrigins||'[]')});
   if(current!==serial)return;
   stories=data.stories;stories.slice(0,3).forEach(render);expand.hidden=!stories.length;
   status.textContent=stories.length?'':'No hay historias publicadas activas en este momento.';
  }catch(error){if(current!==serial)return;clear();status.textContent='No pudimos cargar las historias. Inténtalo de nuevo.';retry.hidden=false;}
  finally{if(current===serial)catalog.removeAttribute('aria-busy');}
 }
 expand.addEventListener('click',()=>{
  const firstAdded=catalog.children.length;
  const additional=stories.slice(firstAdded);
  additional.forEach(render);
  expand.setAttribute('aria-expanded','true');
  status.textContent='Todas las historias disponibles están visibles.';
  if(additional.length){
   const heading=catalog.children[firstAdded]?.querySelector<HTMLElement>('[data-story-title]');
   if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({block:'start',behavior:'instant'});}
   expand.hidden=true;
  }
 });
 retry.addEventListener('click',()=>void load());
 window.addEventListener('pageshow',event=>{if(event.persisted)void load();});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void load();});
 void load();
}
