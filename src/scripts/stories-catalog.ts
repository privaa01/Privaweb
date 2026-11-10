import { parseCatalog, type PublicStory } from '../lib/stories-contract';
import { connectAudio,connectSpotify } from './stories-audio';
import { connectExercise } from './stories-exercise';
import {initializeApp,getApps} from 'firebase/app';
import {collection,getDocs,getFirestore,orderBy,query,where} from 'firebase/firestore';
import {firebaseConfig,storiesCollection} from '../config/firebase';
import {validateFirebaseStory,type FirebaseStoryInput} from '../lib/firebase-story';
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
  const audioCleanup=story.audio.provider==='spotify'?connectSpotify(card,story.audio):connectAudio(card);
  cleanups.push(audioCleanup,connectExercise(card,story));catalog.append(fragment);
  if(story.audio.provider==='file'){audio.src=story.audio.src;audio.load();}
 };
 const firestoreCatalog=async():Promise<PublicStory[]>=>{
  const app=getApps()[0]??initializeApp(firebaseConfig),db=getFirestore(app);
  const snapshot=await getDocs(query(collection(db,storiesCollection),where('status','==','published'),where('active','==',true),orderBy('order','asc')));
  return snapshot.docs.map(document=>{
   const data=validateFirebaseStory(dataForValidation(document.data(),document.id));
   return {id:data.slug,title:data.title,category:data.category,description:data.description,image:{src:data.image.url,alt:data.image.alt,width:data.image.width,height:data.image.height},audio:{...data.podcast,src:data.podcast.publicUrl,type:'audio/spotify' as const},transcript:data.transcript,question:data.question,options:data.options};
  });
 };
 const dataForValidation=(raw:Record<string,any>,id:string):FirebaseStoryInput=>({
  schemaVersion:1,slug:raw.slug??id,title:raw.title,personName:raw.personName??'',category:raw.category,description:raw.description,transcript:raw.transcript,question:raw.question,options:raw.options,
  image:raw.image,podcast:raw.podcast,status:raw.status,active:raw.active,order:raw.order,
 });
 async function load(){
  controller?.abort();controller=new AbortController();const current=++serial;clear();status.textContent='Cargando historias…';catalog.setAttribute('aria-busy','true');
  try{
   let data:{stories:PublicStory[]}|undefined;
   if(root.dataset.firestore){try{const remote=await firestoreCatalog();if(remote.length)data={stories:remote};}catch(error){console.warn('Catálogo Firestore no disponible; se conserva el catálogo publicado.',error);}}
   if(!data){const response=await fetch(root.dataset.endpoint!,{credentials:'omit',cache:'no-store',signal:controller.signal});
   if(!response.ok||!/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type')||''))throw new Error('respuesta inválida');
   data=parseCatalog(await response.json(),{baseURL:location.origin,mediaOrigins:JSON.parse(root.dataset.mediaOrigins||'[]')});}
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
