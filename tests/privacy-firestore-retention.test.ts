import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error Pure JS maintenance module shared by the operator runner.
import {demoExpiry,sweepDemoContacts,RETENTION_MS} from '../server/privacy/firestore-retention.mjs';

test('Firestore sweep removes only expired approved demo records and supports dry-run, pages and races',async()=>{
 const now=Date.now();
 const data=(time:number)=>({mode:'demo',revision:'demo-contact-v1',nameOrAlias:'Visitante de prueba',email:'prueba@example.test',message:'Mensaje ficticio para probar el formulario.',consent:true,createdAt:new Date(time).toISOString()});
 const records=[{id:'expired',data:data(now-RETENTION_MS)},{id:'unapproved',data:{...data(now-RETENTION_MS-1),email:'person@example.test'}},{id:'fresh',data:data(now-RETENTION_MS+1)}];
 let writes=0;
 const store={expiredPage:async(_cutoff:number,cursor:unknown)=>cursor?{items:records.slice(2),nextCursor:null}:{items:records.slice(0,2),nextCursor:'page2'},eraseExpired:async()=>{writes++;return true;}};
 const preview=await sweepDemoContacts(store,{now,dryRun:true});assert.equal(preview.eligible,1);assert.equal(writes,0);
 const result=await sweepDemoContacts(store,{now,dryRun:false});assert.equal(result.deleted,1);assert.equal(result.skipped,2);assert.equal(writes,1);
 assert.equal(demoExpiry({...data(now),extra:'private'}),null);
 const race=await sweepDemoContacts({...store,eraseExpired:async()=>false},{now,dryRun:false});assert.equal(race.deleted,0);
 await assert.rejects(()=>sweepDemoContacts({expiredPage:async()=>({items:[],nextCursor:'same'})},{now}),/cursor/);
});
