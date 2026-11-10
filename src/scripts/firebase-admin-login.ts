import {signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {firebaseAuth} from './firebase-client';
const form=document.querySelector<HTMLFormElement>('[data-firebase-login]');
if(form){
 const status=form.querySelector<HTMLElement>('[data-login-status]')!,button=form.querySelector<HTMLButtonElement>('button[type=submit]')!;
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;button.disabled=true;status.textContent='Comprobando acceso…';
  const data=new FormData(form);
  try{
   const credential=await signInWithEmailAndPassword(firebaseAuth,String(data.get('email')).trim(),String(data.get('password')));
   const token=await credential.user.getIdTokenResult(true);
   if(token.claims.admin!==true){await signOut(firebaseAuth);throw Error('unauthorized');}
   location.assign('/admin/historias.html');
  }catch{status.textContent='No pudimos iniciar sesión con esos datos o la cuenta no está autorizada.';}
  finally{button.disabled=false;(form.elements.namedItem('password') as HTMLInputElement).value='';}
 });
}
