import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';

const project='priva-785cb';
const apply=process.argv.includes('--apply');
const explicitUid=process.argv.find(value=>value.startsWith('--uid='))?.slice('--uid='.length);
const req=createRequire(resolve(process.env.FIREBASE_TOOLS_LIB??join(homedir(),'.local/lib/node_modules/firebase-tools/lib'),'index.js'));
const auth=req('./auth');
const {requireAuth}=req('./requireAuth');
const {Client}=req('./apiv2');
const options={project,nonInteractive:true};
auth.setActiveAccount(options,auth.getGlobalDefaultAccount());
await requireAuth(options);

const firestore=new Client({urlPrefix:'https://firestore.googleapis.com',apiVersion:'v1'});
const listed=await firestore.get(`/projects/${project}/databases/(default)/documents/admin_users`,{queryParams:{pageSize:100}});
const active=(listed.body.documents??[]).filter(document=>document.fields?.active?.booleanValue===true);
if(!explicitUid&&active.length!==1)throw Error(`Se requiere exactamente un administrador activo o --uid; encontrados: ${active.length}.`);
const uid=explicitUid??decodeURIComponent(active[0].name.split('/').at(-1));
if(!/^[A-Za-z0-9_-]{20,128}$/.test(uid))throw Error('El UID administrativo no es válido.');
if(!apply){
  console.log(JSON.stringify({activeAdministrators:1,ready:true}));
  process.exit(0);
}

const identity=new Client({urlPrefix:'https://identitytoolkit.googleapis.com',apiVersion:'v1'});
const lookup=await identity.post(`/projects/${project}/accounts:lookup`,{localId:[uid]});
const user=lookup.body.users?.[0];
if(!user||user.localId!==uid)throw Error('El UID administrativo no existe en Firebase Authentication.');
let claims={};
if(user.customAttributes){
  try{claims=JSON.parse(user.customAttributes);}catch{throw Error('Los atributos actuales de la cuenta no son JSON válido.');}
}
await identity.post(`/projects/${project}/accounts:update`,{localId:uid,customAttributes:JSON.stringify({...claims,admin:true})});
const verification=await identity.post(`/projects/${project}/accounts:lookup`,{localId:[uid]});
const verified=JSON.parse(verification.body.users?.[0]?.customAttributes??'{}').admin===true;
if(!verified)throw Error('Firebase no confirmó el rol administrativo.');
console.log(JSON.stringify({activeAdministrators:1,claim:'admin',value:true,result:'verified'}));
