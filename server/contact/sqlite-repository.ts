import {initializeContactSchema,removeConsultation} from './schema.ts';
import {DatabaseSync} from 'node:sqlite';
import {createHash,randomUUID} from 'node:crypto';
import {lstatSync,existsSync,realpathSync} from 'node:fs';
import {dirname} from 'node:path';
import type {ContactRepository,Attempt,RepositoryOptions} from './repository.ts';
import type {Receipt,FieldErrors} from '../../src/lib/contact-contract.ts';
import {validateContact} from '../../src/lib/contact-validation.ts';
import {AttemptTokens} from './attempt-token.ts';
export class SqliteContactRepository implements ContactRepository {
 readonly db:DatabaseSync;readonly tokens:AttemptTokens;readonly options:RepositoryOptions;private closed=false;lastWasInsert=false;
 constructor(path:string,tokens:AttemptTokens,options:RepositoryOptions={}){this.tokens=tokens;this.options=options;
  const dir=lstatSync(dirname(path));if(!dir.isDirectory()||dir.isSymbolicLink()||(dir.mode&0o077)!==0)throw new Error('Unsafe database directory');
  if(realpathSync(dirname(path))!==dirname(path))throw new Error('Database directory must be canonical');
  for(const f of[path,path+'-wal',path+'-shm'])if(existsSync(f)){const s=lstatSync(f);if(!s.isFile()||s.isSymbolicLink()||(s.mode&0o077)!==0)throw new Error('Unsafe database file');}
  const mask=process.umask(0o077);try{this.db=new DatabaseSync(path);this.db.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
   if(this.db.prepare('PRAGMA synchronous').get()!.synchronous!==2||this.db.prepare('PRAGMA foreign_keys').get()!.foreign_keys!==1||this.db.prepare('PRAGMA journal_mode').get()!.journal_mode!=='wal'||this.db.prepare('PRAGMA busy_timeout').get()!.timeout!==5000)throw new Error('Unsafe database configuration');
   initializeContactSchema(this.db);
  }finally{process.umask(mask);}
 }
 private now(){return (this.options.clock??this.tokens.clock)();}
 submit(a:Attempt,raw:unknown):Receipt {return this.execute(a,raw);}
 terminalReject(a:Attempt,errors:FieldErrors):Receipt {return this.execute(a,null,errors);}
 private execute(a:Attempt,raw:unknown,terminalErrors?:FieldErrors):Receipt {
  if(typeof a.token!=='string'||a.token.length>1024||typeof a.attemptId!=='string')return {result:'retired',attemptId:typeof a.attemptId==='string'?a.attemptId:''};
  this.lastWasInsert=false;
  const digest=createHash('sha256').update(a.token).digest('hex');const result=terminalErrors?{ok:false as const,errors:terminalErrors}:validateContact(raw);let committed=false;
  this.db.exec('BEGIN IMMEDIATE');
  try{
   const old=this.db.prepare('SELECT * FROM attempts WHERE tokenDigest=?').get(digest);
   let receipt:Receipt;
   if(old){
    if(old.attemptId!==a.attemptId)receipt={result:'conflict',attemptId:a.attemptId};
    else if(old.state!=='COMMITTED')receipt={result:'retired',attemptId:a.attemptId};
    else {const row=this.db.prepare('SELECT * FROM consultations WHERE id=?').get(old.consultationId!);
     receipt={result:row&&result.ok&&['nameOrAlias','email','message'].every(k=>row[k]===result.value[k as keyof typeof result.value])?'stored':row?'conflict':'retired',attemptId:a.attemptId};}
   }else{
    const verified=this.tokens.verify(a.attemptId,a.token);
    if(!verified)receipt={result:'retired',attemptId:a.attemptId};
    else if(!result.ok){this.db.prepare('INSERT INTO attempts VALUES(?,?,?,?,NULL)').run(digest,a.attemptId,verified.expiresAt,'REJECTED');receipt={result:'not_stored',attemptId:a.attemptId,errors:result.errors};}
    else {this.lastWasInsert=true;const id=randomUUID(),date=new Date(this.now()).toISOString();this.db.prepare('INSERT INTO consultations(id,nameOrAlias,email,message,receivedAt,lastActivityAt,status) VALUES(?,?,?,?,?,?,?)').run(id,result.value.nameOrAlias,result.value.email,result.value.message,date,date,'Pendiente');this.db.prepare('INSERT INTO attempts VALUES(?,?,?,?,?)').run(digest,a.attemptId,verified.expiresAt,'COMMITTED',id);receipt={result:'stored',attemptId:a.attemptId};}
   }
   this.options.failure?.('beforeCommit');this.db.exec('COMMIT');committed=true;this.options.failure?.('afterCommit');return receipt;
  }catch(error){if(!committed){try{this.db.exec('ROLLBACK');}catch{/* Outcome cannot be asserted here. */}}throw error;}
 }
 revoke(id:string){this.db.exec('BEGIN IMMEDIATE');try{removeConsultation(this.db,id);this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e;}}
 sweepOpaqueReceipts(){this.db.prepare("DELETE FROM attempts WHERE state!='COMMITTED' AND expiresAt<=?").run(this.now());}
 close(){if(!this.closed){this.closed=true;this.db.close();}}
}
