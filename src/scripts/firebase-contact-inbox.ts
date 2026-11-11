import {onAuthStateChanged,signOut} from 'firebase/auth';
import {collection,doc,getDoc,getDocs,limit,orderBy,query,type Timestamp} from 'firebase/firestore';
import {administratorsCollection,demoContactCollection} from '../config/firebase';
import {firebaseAuth,firebaseDb} from './firebase-client';

const root=document.querySelector<HTMLElement>('[data-firebase-contact]');
if(root){
 const status=root.querySelector<HTMLElement>('[data-admin-status]')!;
 const privateRoot=root.querySelector<HTMLElement>('[data-admin-private]')!;
 const list=root.querySelector<HTMLElement>('[data-contact-list]')!;
 const date=(value:Timestamp|undefined)=>value?.toDate().toLocaleString('es-CO',{dateStyle:'medium',timeStyle:'short'})??'Fecha no disponible';
 const row=(label:string,value:string)=>{const paragraph=document.createElement('p'),strong=document.createElement('strong');strong.textContent=`${label}: `;paragraph.append(strong,value);return paragraph;};
 async function load(){
  status.textContent='Cargando mensajes…';list.replaceChildren();
  try{
   const snapshot=await getDocs(query(collection(firebaseDb,demoContactCollection),orderBy('createdAt','desc'),limit(100)));
   if(snapshot.empty){const empty=document.createElement('p');empty.textContent='No hay mensajes de contacto guardados.';list.append(empty);status.textContent='Bandeja actualizada. No hay mensajes.';return;}
   for(const item of snapshot.docs){const data=item.data(),article=document.createElement('article');article.append(row('Fecha',date(data.createdAt)),row('Nombre',String(data.nameOrAlias??'Sin nombre')),row('Correo',String(data.email??'Sin correo')),row('Mensaje',String(data.message??'Sin mensaje')));list.append(article);}
   status.textContent=`Bandeja actualizada: ${snapshot.size} mensaje${snapshot.size===1?'':'s'}.`;
  }catch{status.textContent='No se pudo cargar la bandeja privada.';}
 }
 onAuthStateChanged(firebaseAuth,async current=>{privateRoot.hidden=true;if(!current){location.replace('/admin/login.html');return;}try{const administrator=await getDoc(doc(firebaseDb,administratorsCollection,current.uid));if(!administrator.exists()||administrator.data().active!==true){await signOut(firebaseAuth);return;}root.querySelector<HTMLElement>('[data-admin-email]')!.textContent=current.email??'Cuenta administradora';privateRoot.hidden=false;status.textContent='Acceso administrativo verificado.';await load();}catch{status.textContent='No pudimos comprobar el acceso administrativo.';}});
 root.querySelector('[data-refresh-contact]')?.addEventListener('click',()=>void load());
 root.querySelector('[data-admin-logout]')?.addEventListener('click',()=>void signOut(firebaseAuth));
}
