import {demoWrite,demoEndpoint} from '../contact-model';
const form=document.querySelector<HTMLFormElement>('[data-demo-contact]');
if(form){
 const button=form.querySelector<HTMLButtonElement>('button[type=submit]')!;
 const status=form.querySelector<HTMLElement>('[role=status]')!;
 const again=form.querySelector<HTMLButtonElement>('[data-new-test]')!;
 let id=crypto.randomUUID(),busy=false,done=false;
 button.disabled=false;form.querySelector('[data-needs-js]')?.remove();
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy||done||!form.reportValidity())return;
  const data=new FormData(form);let payload;
  try{payload=demoWrite(id,String(data.get('nameOrAlias')),String(data.get('message')),data.get('consent')==='on');}catch(error){status.textContent=(error as Error).message;return;}
  busy=true;button.disabled=true;form.setAttribute('aria-busy','true');status.textContent='Guardando prueba en Firestore…';
  const controller=new AbortController();const deadline=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(demoEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
   if(!response.ok)throw Error('No se pudo confirmar el envío.');
   const result=await response.json();if(!result.commitTime||result.writeResults?.length!==1)throw Error('Respuesta no confirmada.');
   done=true;status.textContent='Prueba guardada en Firestore. No se ha enviado ningún correo.';again.hidden=false;
  }catch{status.textContent='No se pudo confirmar el envío. Puede haberse guardado si hubo un fallo de conexión. Reintentar conserva el mismo identificador de prueba.';}
  finally{clearTimeout(deadline);busy=false;button.disabled=done;form.removeAttribute('aria-busy');}
 });
 again.addEventListener('click',()=>{form.reset();id=crypto.randomUUID();done=false;button.disabled=false;again.hidden=true;status.textContent='Puedes enviar otra prueba ficticia.';form.querySelector<HTMLSelectElement>('select')?.focus();});
}
