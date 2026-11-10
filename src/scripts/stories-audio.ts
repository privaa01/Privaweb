export function connectAudio(card:HTMLElement):()=>void{
 const audio=card.querySelector<HTMLAudioElement>('[data-audio]')!;
 const status=card.querySelector<HTMLElement>('[data-audio-status]')!;
 const duration=card.querySelector<HTMLElement>('[data-audio-duration]')!;
 const update=()=>{
  const d=audio.duration;duration.textContent=Number.isFinite(d)&&d>0?`${Math.floor(d/60)}:${String(Math.floor(d%60)).padStart(2,'0')}`:'Sin metadatos';
 };
 const listeners: [string,()=>void][]=[
 ['loadedmetadata',update],['durationchange',update],
 ...Object.entries({loadstart:'Cargando audio…',waiting:'Cargando audio…',stalled:'Esperando datos del audio…',canplay:'Audio disponible.',playing:'Reproduciendo.',pause:'Audio en pausa.',ended:'Audio finalizado.',error:'No se pudo reproducir el audio. Puedes consultar la transcripción.'}).map(([event,text]):[string,()=>void]=>[event,()=>{status.textContent=text;}]),
 ];
 listeners.forEach(([event,fn])=>audio.addEventListener(event,fn));update();
 return()=>{listeners.forEach(([event,fn])=>audio.removeEventListener(event,fn));audio.pause();audio.removeAttribute('src');audio.load();};
}

export function connectSpotify(card:HTMLElement,audio:{episodeId:string;publicUrl:string;embedUrl:string;durationSeconds:number}):()=>void{
 const file=card.querySelector<HTMLElement>('[data-file-player]')!,spotify=card.querySelector<HTMLElement>('[data-spotify-player]')!;
 const button=card.querySelector<HTMLButtonElement>('[data-load-spotify]')!,frame=card.querySelector<HTMLElement>('[data-spotify-frame]')!;
 const link=card.querySelector<HTMLAnchorElement>('[data-spotify-link]')!,status=card.querySelector<HTMLElement>('[data-audio-status]')!,duration=card.querySelector<HTMLElement>('[data-audio-duration]')!;
 file.hidden=true;spotify.hidden=false;link.href=audio.publicUrl;
 duration.textContent=`${Math.floor(audio.durationSeconds/60)}:${String(audio.durationSeconds%60).padStart(2,'0')}`;
 status.textContent='El reproductor de Spotify se carga solamente cuando lo solicitas.';
 const load=()=>{
  if(frame.firstElementChild)return;
  const iframe=document.createElement('iframe');iframe.src=audio.embedUrl;iframe.title='Reproductor de Spotify';iframe.loading='lazy';iframe.width='100%';iframe.height='152';iframe.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';iframe.setAttribute('allowfullscreen','');
  frame.append(iframe);button.hidden=true;status.textContent='Reproductor de Spotify cargado.';
 };
 button.addEventListener('click',load);
 return()=>{button.removeEventListener('click',load);frame.replaceChildren();};
}
