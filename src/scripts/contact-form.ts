import {fields,type ContactInput,type FieldErrors,type SignedAttempt,type FormState} from '../lib/contact-contract';
import {validateContact} from '../lib/contact-validation';
import {isSyntheticContactEmail} from '../lib/contact-test';
for(const form of document.querySelectorAll<HTMLFormElement>('form[data-contact]')){
 const node=<T extends HTMLElement>(s:string)=>form.querySelector<T>(s)!;
 const synthetic=form.dataset.contactMode==='synthetic';
 const controls=Object.fromEntries(fields.map(k=>[k,form.elements.namedItem(k)])) as Record<keyof ContactInput,HTMLInputElement|HTMLTextAreaElement>;
 const send=node<HTMLButtonElement>('[data-send]'),retry=node<HTMLButtonElement>('[data-retry]'),fresh=node<HTMLButtonElement>('[data-new]'),status=node<HTMLElement>('[data-contact-status]'),summary=node<HTMLElement>('[data-error-summary]'),warning=node<HTMLElement>('[data-new-warning]');
 let state:FormState='editing',generation=0,sequence=0,attempt:SignedAttempt|null=null,snapshot:Readonly<ContactInput>|null=null,controller:AbortController|null=null,retired=false;
 const current=(g:number,q:number)=>g===generation&&q===sequence;
 const clearErrors=()=>{summary.hidden=true;summary.textContent='';for(const k of fields){controls[k].removeAttribute('aria-invalid');node('#error-'+k).textContent='';}};
 function errors(map:FieldErrors){clearErrors();for(const k of fields)if(map[k]){controls[k].setAttribute('aria-invalid','true');node('#error-'+k).textContent=map[k]==='required'?'Completa este campo.':map[k]==='format'?(synthetic?'Usa un correo ficticio del dominio example.test.':'Escribe un correo con formato válido.'):`Usa como máximo ${k==='nameOrAlias'?60:k==='message'?1500:254} caracteres.`;}summary.hidden=false;summary.textContent='Revisa los campos indicados.';controls[fields.find(k=>map[k])??'nameOrAlias'].focus();}
 function render(text:string){status.textContent=text;const frozen=['preparing','submitting','unknown','confirmed'].includes(state);for(const k of fields)controls[k].readOnly=frozen;send.disabled=!['editing','invalid','rejected'].includes(state);send.textContent=state==='preparing'?'Preparando…':state==='submitting'?'Enviando…':'Enviar mensaje';retry.hidden=state!=='unknown'||retired;fresh.hidden=!['unknown','confirmed'].includes(state);form.setAttribute('aria-busy',String(state==='preparing'||state==='submitting'));}
 async function post(path:string,payload:unknown,signal:AbortSignal){const response=await fetch('/api/contacto/'+path,{method:'POST',headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify(payload),cache:'no-store',credentials:'omit',signal});return {status:response.status,body:await response.json() as Record<string,unknown>};}
 async function submit(repeat=false){
  if(state==='preparing'||state==='submitting'||state==='confirmed')return;
  if(repeat){if(state!=='unknown'||retired||!attempt||!snapshot)return;}
  else {if(state==='unknown')return;const checked=validateContact(Object.fromEntries(fields.map(k=>[k,controls[k].value])));if(!checked.ok){state='invalid';errors(checked.errors);render('Revisa los datos antes de enviar.');return;}if(synthetic&&!isSyntheticContactEmail(checked.value.email)){state='invalid';errors({email:'format'});render('Usa únicamente datos ficticios para esta prueba.');return;}snapshot=checked.value;attempt=null;clearErrors();}
  const g=generation,q=++sequence;controller=new AbortController();const localController=controller;
  const timeout=Number(form.dataset.timeout)||10000;const timer=window.setTimeout(()=>localController.abort(),timeout);let sent=false;
  try{
   if(!attempt){state='preparing';render('Preparando el envío…');const r=await post('intentos',{},localController.signal);if(!current(g,q))return;const b=r.body;if(r.status!==201||b.result!=='attempt'||typeof b.attemptId!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(b.attemptId)||typeof b.token!=='string'||!b.token||typeof b.expiresAt!=='string'||!Number.isFinite(Date.parse(b.expiresAt)))throw new Error('preparation');attempt={attemptId:b.attemptId,token:b.token,expiresAt:b.expiresAt};}
   if(!current(g,q))return;state='submitting';render('Enviando…');sent=true;
   const r=await post('consultas',{attemptId:attempt.attemptId,token:attempt.token,...snapshot},localController.signal);if(!current(g,q))return;
   if(r.body.attemptId!==attempt.attemptId)throw new Error('uncorrelated');
   if((r.status===200||r.status===201)&&r.body.result==='stored'){state='confirmed';render(synthetic?'Tu consulta quedó guardada en la base local de pruebas. No se enviaron correos.':'Tu consulta quedó guardada. El equipo podrá responder al correo indicado.');}
   else if(r.status===422&&r.body.result==='not_stored'&&r.body.errors&&typeof r.body.errors==='object'&&!Array.isArray(r.body.errors)&&Object.entries(r.body.errors).length>0&&Object.entries(r.body.errors).every(([k,v])=>fields.includes(k as keyof ContactInput)&&['required','length','format'].includes(String(v)))){state='rejected';attempt=null;render('No se guardó esta consulta. Corrige los campos indicados e inténtalo de nuevo.');errors(r.body.errors as FieldErrors);}
   else if((r.status===410&&r.body.result==='retired')||(r.status===409&&r.body.result==='conflict')){state='unknown';retired=true;render('No podemos confirmar este intento ni reintentarlo. Puedes iniciar otra consulta; la anterior podría estar guardada.');}
   else throw new Error('unknown');
  }catch{if(!current(g,q))return;if(sent){state='unknown';render('No sabemos si tu consulta quedó guardada. Conservamos los datos originales para reintentar el mismo envío.');}else{state='editing';attempt=null;render('El servicio no está disponible. Conservamos tus datos; puedes volver a intentar el envío.');}}
  finally{window.clearTimeout(timer);if(current(g,q))controller=null;}
 }
 form.addEventListener('submit',e=>{e.preventDefault();void submit();});retry.addEventListener('click',()=>void submit(true));
 fresh.addEventListener('click',()=>{if(state==='confirmed'){reset();return;}warning.hidden=false;node<HTMLButtonElement>('[data-continue]').focus();});
 node('[data-stay]').addEventListener('click',()=>{warning.hidden=true;fresh.focus();});
 function reset(){generation++;sequence++;controller?.abort();controller=null;attempt=null;snapshot=null;retired=false;form.reset();clearErrors();warning.hidden=true;state='editing';render('Puedes escribir otra consulta.');controls.nameOrAlias.focus();}
 node('[data-continue]').addEventListener('click',reset);node('[data-js-required]').hidden=true;render('');
}
