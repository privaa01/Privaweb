export const RETENTION_MS=90*86400000;
const fields=['mode','revision','nameOrAlias','email','message','consent','createdAt'];
const names=['Visitante de prueba','Equipo de prueba'];
const messages=['Mensaje ficticio para probar el formulario.','Prueba educativa sobre privacidad.','Comprobación de conexión con Firestore.'];
export function demoExpiry(data) {
  if(!data||Object.keys(data).length!==fields.length||!fields.every(k=>Object.hasOwn(data,k))||data.mode!=='demo'||data.revision!=='demo-contact-v1'||data.email!=='prueba@example.test'||data.consent!==true||!names.includes(data.nameOrAlias)||!messages.includes(data.message))return null;
  const created=Date.parse(data.createdAt);
  return Number.isSafeInteger(created)&&created>=0?created+RETENTION_MS:null;
}
/** Store must atomically re-read and revalidate expiry, journal suppression and delete. */
export async function sweepDemoContacts(store,{now=Date.now(),dryRun=true,maxPages=10}={}) {
  if(!Number.isSafeInteger(now)||now<0)throw Error('Invalid maintenance time');
  const result={scanned:0,eligible:0,deleted:0,skipped:0,dryRun};let cursor=null;
  for(let page=0;page<maxPages;page++) {
    const batch=await store.expiredPage(now-RETENTION_MS,cursor,100);
    for(const item of batch.items) {
      result.scanned++;
      const expiry=demoExpiry(item.data);
      if(expiry===null||expiry>now){result.skipped++;continue;}
      result.eligible++;
      if(!dryRun&&await store.eraseExpired(item,now))result.deleted++;
    }
    if(!batch.nextCursor)break;
    if(JSON.stringify(batch.nextCursor)===JSON.stringify(cursor))throw Error('Non advancing maintenance cursor');
    cursor=batch.nextCursor;
  }
  return result;
}
