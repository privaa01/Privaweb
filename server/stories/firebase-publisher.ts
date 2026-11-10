import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {join,resolve} from 'node:path';
import {validateFirebaseStory,type FirebaseStoryInput} from '../../src/lib/firebase-story.ts';

type ApiClient={post:(path:string,body:unknown)=>Promise<{status:number;body:any}>};
const documentRoot='projects/priva-785cb/databases/(default)/documents';
export class FirebaseStoryInputError extends Error{}

function encode(value:unknown):any{
 if(typeof value==='string')return{stringValue:value};
 if(typeof value==='boolean')return{booleanValue:value};
 if(typeof value==='number'&&Number.isInteger(value))return{integerValue:String(value)};
 if(Array.isArray(value))return{arrayValue:{values:value.map(encode)}};
 if(value&&typeof value==='object')return{mapValue:{fields:Object.fromEntries(Object.entries(value).map(([key,item])=>[key,encode(item)]))}};
 throw Error('Unsupported Firestore value');
}

function decode(value:any):any{
 if('stringValue'in value)return value.stringValue;
 if('booleanValue'in value)return value.booleanValue;
 if('integerValue'in value)return Number(value.integerValue);
 if('arrayValue'in value)return(value.arrayValue.values??[]).map(decode);
 if('mapValue'in value)return Object.fromEntries(Object.entries(value.mapValue.fields??{}).map(([key,item])=>[key,decode(item)]));
 return undefined;
}

export class FirebaseStoriesPublisher{
 private client?:ApiClient;
 private loading?:Promise<ApiClient>;
 private async api(){
  if(this.client)return this.client;
  if(!this.loading)this.loading=(async()=>{
   const req=createRequire(resolve(process.env.FIREBASE_TOOLS_LIB??join(homedir(),'.local/lib/node_modules/firebase-tools/lib'),'index.js'));
   const auth=req('./auth'),{requireAuth}=req('./requireAuth'),{Client}=req('./apiv2');
   const options={project:'priva-785cb',nonInteractive:true};auth.setActiveAccount(options,auth.getGlobalDefaultAccount());await requireAuth(options);
   return new Client({urlPrefix:'https://firestore.googleapis.com',apiVersion:'v1'}) as ApiClient;
  })();
  this.client=await this.loading;return this.client;
 }
 async get(slug:string){
  const client=await this.api(),name=`${documentRoot}/stories/${slug}`;
  const lookup=await client.post(`/${documentRoot}:batchGet`,{documents:[name]});
  const existing=lookup.body.find((row:any)=>row.found)?.found;
  if(!existing)return null;
  const raw=Object.fromEntries(Object.entries(existing.fields??{}).map(([key,value])=>[key,decode(value)]));
  return validateFirebaseStory(raw as FirebaseStoryInput);
 }
 async save(raw:FirebaseStoryInput,actor:string){
  let story:FirebaseStoryInput;
  try{story=validateFirebaseStory(raw);}catch(error){throw new FirebaseStoryInputError(error instanceof Error?error.message:'Datos de historia inválidos.');}
  const client=await this.api();
  const name=`${documentRoot}/stories/${story.slug}`;
  const lookup=await client.post(`/${documentRoot}:batchGet`,{documents:[name]});
  const existing=lookup.body.find((row:any)=>row.found)?.found;
  const fields=Object.fromEntries(Object.entries(story).map(([key,value])=>[key,encode(value)]));
  fields.createdBy=existing?.fields?.createdBy??encode(actor);
  if(existing?.fields?.createdAt)fields.createdAt=existing.fields.createdAt;
  const transforms=[{fieldPath:'updatedAt',setToServerValue:'REQUEST_TIME'}];
  if(!existing)transforms.push({fieldPath:'createdAt',setToServerValue:'REQUEST_TIME'});
  const response=await client.post(`/${documentRoot}:commit`,{writes:[{update:{name,fields},updateTransforms:transforms}]});
  if(response.status!==200)throw Error('Firestore did not confirm the story.');
  return{result:'confirmed',storyId:story.slug,provider:'spotify',episodeId:story.podcast.episodeId};
 }
}
