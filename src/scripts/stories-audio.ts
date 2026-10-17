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
