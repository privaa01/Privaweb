// Private operator process; Firebase CLI credentials never enter the public website.
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';
import {randomUUID} from 'node:crypto';
import {sweepDemoContacts,demoExpiry} from '../server/privacy/firestore-retention.mjs';
import {demoWrite} from '../demo/src/contact-model.ts';
async function main(){
const mode=process.argv[2];
if(!['--inspect','--execute-demo-only','--verify-demo-only'].includes(mode))throw Error('Explicit maintenance mode required');
const req=createRequire(resolve(process.env.FIREBASE_TOOLS_LIB??join(homedir(),'.local/lib/node_modules/firebase-tools/lib'),'index.js'));
const auth=req('./auth'),{requireAuth}=req('./requireAuth'),{Client}=req('./apiv2');
const options={project:'priva-785cb',nonInteractive:true};auth.setActiveAccount(options,auth.getGlobalDefaultAccount());await requireAuth(options);
const client=new Client({urlPrefix:'https://firestore.googleapis.com',apiVersion:'v1'});
const root='/projects/priva-785cb/databases/(default)/documents',nameRoot=root.slice(1);
function decode(document) {
 const data=Object.fromEntries(Object.entries(document.fields??{}).map(([key,value])=>[key,value.stringValue??value.booleanValue??value.timestampValue??null]));
 return {id:document.name.split('/').at(-1),name:document.name,data};
}
const store={
 async expiredPage(cutoff,cursor,limit) {
  const structuredQuery={from:[{collectionId:'demo_contact'}],where:{fieldFilter:{field:{fieldPath:'createdAt'},op:'LESS_THAN_OR_EQUAL',value:{timestampValue:new Date(cutoff).toISOString()}}},orderBy:[{field:{fieldPath:'createdAt'},direction:'ASCENDING'},{field:{fieldPath:'__name__'},direction:'ASCENDING'}],limit};
  if(cursor)structuredQuery.startAt={values:[{timestampValue:cursor.date},{referenceValue:cursor.name}],before:false};
  const response=await client.post(root+':runQuery',{structuredQuery});
  const items=response.body.filter(row=>row.document).map(row=>decode(row.document));
  const last=items.at(-1);
  return {items,nextCursor:items.length===limit?{date:last.data.createdAt,name:last.name}:null};
 },
 async eraseExpired(item,now) {
  if(!/^[a-f0-9-]{36}$/.test(item.id)||item.name!==nameRoot+'/demo_contact/'+item.id)throw Error('Invalid maintenance scope');
  const begin=await client.post(root+':beginTransaction',{options:{readWrite:{}}});
  const transaction=begin.body.transaction;
  try {
   const read=await client.post(root+':batchGet',{documents:[item.name],transaction});
   const found=read.body.find(row=>row.found)?.found;if(!found)return false;
   const expiry=demoExpiry(decode(found).data);
   if(expiry===null||expiry>now)return false;
   await client.post(root+':commit',{transaction,writes:[
    {update:{name:nameRoot+'/privacy_suppressions/'+item.id,fields:{collection:{stringValue:'demo_contact'},reason:{stringValue:'expiry'}}},updateTransforms:[{fieldPath:'deletedAt',setToServerValue:'REQUEST_TIME'}]},
    {delete:item.name,currentDocument:{updateTime:found.updateTime}},
   ]});
   return true;
  } finally {try{await client.post(root+':rollback',{transaction});}catch{}}
 },
};
if(mode==='--verify-demo-only') {
 const oldId=randomUUID(),freshId=randomUUID();
 const oldName=nameRoot+'/demo_contact/'+oldId,freshName=nameRoot+'/demo_contact/'+freshId,suppression=nameRoot+'/privacy_suppressions/'+oldId;
 const endpoint='https://firestore.googleapis.com/v1'+root;
 const publicWrite=id=>demoWrite(id,'Visitante de prueba','Mensaje ficticio para probar el formulario.',true);
 let verified=false;
 try {
  const expired=publicWrite(oldId).writes[0];delete expired.updateTransforms;
  expired.update.fields.createdAt={timestampValue:new Date(Date.now()-91*86400000).toISOString()};
  await client.post(root+':commit',{writes:[expired]});
  const live=await fetch(endpoint+':commit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(publicWrite(freshId))});
  if(!live.ok)throw Error('Live demo write rejected');
  const read=await client.post(root+':batchGet',{documents:[oldName]});
  if(!await store.eraseExpired(decode(read.body.find(row=>row.found).found),Date.now()))throw Error('Expired example not removed');
  const state=await client.post(root+':batchGet',{documents:[oldName,freshName,suppression]});
  if(!state.body.some(row=>row.missing===oldName)||!state.body.some(row=>row.found?.name===freshName)||!state.body.some(row=>row.found?.name===suppression))throw Error('Retention state mismatch');
  const recreation=await fetch(endpoint+':commit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(publicWrite(oldId))});
  const privateRead=await fetch(endpoint+'/privacy_suppressions/'+oldId);
  if(recreation.status!==403||privateRead.status!==403)throw Error('Suppression privacy or replay guard failed');
  verified=true;
 } finally {await client.post(root+':commit',{writes:[oldName,freshName,suppression].map(name=>({delete:name}))});}
 if(verified)console.log(JSON.stringify({event:'firestore_retention_verification',expiredRemoved:true,freshPreserved:true,recreationDenied:true,publicReadDenied:true,examplesCleaned:true}));
 return;
}
const result=await sweepDemoContacts(store,{dryRun:mode==='--inspect'});
console.log(JSON.stringify({event:'firestore_retention',...result}));
}
main().catch(error=>{console.error(JSON.stringify({event:'firestore_retention',result:'failed',http:error.status??null}));process.exitCode=1;});
