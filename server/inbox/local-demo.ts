import { createHash, randomUUID } from 'node:crypto';
import type { InboxRepository } from './sqlite-repository.ts';
import { removeConsultation } from '../contact/schema.ts';

// Explicit operator-requested demonstration snapshots, never real mail acceptance.
export function seedLocalInboxExamples(repository: InboxRepository) {
  if (process.env.PRIVA_ADMIN_MODE !== 'local') throw Error('Examples require local mode');
  const examples = [
    {id:'b1d45bf0-b301-45dc-9fd2-47fc89445c01',name:'Ejemplo pendiente',status:'Pendiente',message:'EJEMPLO FICTICIO: Quisiera saber dónde puedo escuchar las historias sobre privacidad. Esta consulta sirve para mostrar la bandeja y no corresponde a una persona real.'},
    {id:'b1d45bf0-b301-45dc-9fd2-47fc89445c02',name:'Ejemplo respondido',status:'Respondido',message:'EJEMPLO FICTICIO: ¿Puedo usar las historias en una actividad educativa? Esta consulta y su respuesta son ejemplos locales; no se envió ningún correo.'},
  ] as const;
  return repository.tx(() => {
    let inserted = 0;
    const now=repository.now(), date=new Date(now).toISOString();
    for(const example of examples) {
      const old=repository.db.prepare('SELECT nameOrAlias,message FROM consultations WHERE id=?').get(example.id);
      if(old) {
        if(old.nameOrAlias!==example.name||old.message!==example.message)throw Error('Example identity collision; no data changed');
        continue;
      }
      repository.db.prepare('INSERT INTO consultations(id,nameOrAlias,email,message,receivedAt,lastActivityAt,status) VALUES(?,?,?,?,?,?,?)')
        .run(example.id,example.name,'ejemplo@example.test',example.message,date,date,example.status);
      if(example.status==='Respondido') {
        const operation={operationId:randomUUID(),consultationId:example.id,actorAccountId:randomUUID(),deliveryId:randomUUID()};
        const text='RESPUESTA FICTICIA, NO ENVIADA: Puedes explorar los relatos desde Historias y utilizar sus preguntas para reflexionar sobre la privacidad. Este historial se cargó únicamente para mostrar cómo se vería una consulta respondida.';
        const envelope=repository.crypto.seal(repository.aad(operation),{to:'ejemplo@example.test',from:'sin-envio@example.invalid',subject:'Ejemplo local sin envío',text});
        const proof=repository.crypto.seal(repository.aad(operation),{demonstration:true,externalDelivery:false});
        repository.db.prepare("INSERT INTO reply_operations(operationId,consultationId,actorAccountId,sessionDigest,expectedRevision,reviewedRevision,payloadHash,deliveryId,state,createdAt,updatedAt,acceptedAt,proof) VALUES(?,?,?,?,?,?,?,?,'accepted',?,?,?,?)")
          .run(operation.operationId,example.id,operation.actorAccountId,'local-demo-no-session',1,1,createHash('sha256').update(text).digest('hex'),operation.deliveryId,now,now,now,proof);
        repository.db.prepare('INSERT INTO reply_responses(id,consultationId,operationId,actorAccountId,acceptedAt,envelope) VALUES(?,?,?,?,?,?)')
          .run(randomUUID(),example.id,operation.operationId,operation.actorAccountId,now,envelope);
      }
      inserted++;
    }
    return {inserted,examples:examples.map(example=>example.id)};
  });
}

export function removeLocalInboxExamples(repository: InboxRepository) {
  if(process.env.PRIVA_ADMIN_MODE!=='local')throw Error('Examples require local mode');
  return repository.tx(()=>{
    let removed=0;
    for(const [id,name] of [
      ['b1d45bf0-b301-45dc-9fd2-47fc89445c01','Ejemplo pendiente'],
      ['b1d45bf0-b301-45dc-9fd2-47fc89445c02','Ejemplo respondido'],
    ]) {
      const row=repository.db.prepare('SELECT nameOrAlias,email,message FROM consultations WHERE id=?').get(id);
      if(!row)continue;
      if(row.nameOrAlias!==name||row.email!=='ejemplo@example.test'||!String(row.message).startsWith('EJEMPLO FICTICIO:'))throw Error('Example identity mismatch; no data changed');
      removeConsultation(repository.db,id,repository.now());
      removed++;
    }
    return {removed};
  });
}
