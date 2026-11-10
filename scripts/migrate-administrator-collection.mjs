import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';

const project='priva-785cb';
const uid=process.argv.find(value=>value.startsWith('--uid='))?.slice('--uid='.length);
if(!process.argv.includes('--apply'))throw Error('Use --apply para crear el administrador aprobado.');
if(!uid||!/^[A-Za-z0-9_-]{20,128}$/.test(uid))throw Error('Indique un UID válido con --uid.');
const req=createRequire(resolve(process.env.FIREBASE_TOOLS_LIB??join(homedir(),'.local/lib/node_modules/firebase-tools/lib'),'index.js'));
const auth=req('./auth');
const {requireAuth}=req('./requireAuth');
const {Client}=req('./apiv2');
const options={project,nonInteractive:true};
auth.setActiveAccount(options,auth.getGlobalDefaultAccount());
await requireAuth(options);

const client=new Client({urlPrefix:'https://firestore.googleapis.com',apiVersion:'v1'});
const name=`projects/${project}/databases/(default)/documents/administradores/${uid}`;
const update={name,fields:{schemaVersion:{integerValue:'1'},active:{booleanValue:true},createdBy:{stringValue:'migration:firebase-cli'}}};
const response=await client.post(`/projects/${project}/databases/(default)/documents:commit`,{writes:[{update,updateTransforms:[{fieldPath:'createdAt',setToServerValue:'REQUEST_TIME'},{fieldPath:'updatedAt',setToServerValue:'REQUEST_TIME'}]}]});
if(response.status!==200)throw Error('Firestore no confirmó la creación del administrador.');
const confirmed=await client.get(`/projects/${project}/databases/(default)/documents/administradores/${uid}`);
if(confirmed.body.fields?.active?.booleanValue!==true)throw Error('El administrador no quedó activo.');
console.log(JSON.stringify({collection:'administradores',active:true,result:'verified'}));
