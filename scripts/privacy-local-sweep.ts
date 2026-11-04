import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import {privatePath,secureConnection,checkpoint} from '../server/privacy/storage.ts';
import {exclusiveCli} from '../server/privacy/operator-cli.ts';
import {removeConsultation,initializeContactSchema} from '../server/contact/schema.ts';
import {RETENTION} from '../server/privacy/policy.ts';

const directory=process.argv[2];
if(process.env.PRIVA_ADMIN_MODE!=='local'||!directory)throw Error('Explicit local profile required');
const settings=JSON.parse(readFileSync(join(directory,'privacy-local-settings.json'),'utf8'));
if(settings.backups!==false||settings.mail!==false||settings.retentionDays!==90)throw Error('Approved local policy required');
const path=join(directory,'contact.sqlite');privatePath(path);
if(exclusiveCli(path+'.maintenance.lock',fileURLToPath(import.meta.url),[directory])) {
 const db=new DatabaseSync(path);
 try {
  secureConnection(db);initializeContactSchema(db);
  if(db.prepare('PRAGMA user_version').get()!.user_version!==8)throw Error('This no-backup local profile requires schema8');
  const now=Date.now();let removed=0;
  db.exec('BEGIN IMMEDIATE');
  try {
   const expired=db.prepare('SELECT id FROM consultations WHERE lastActivityAt<=?').all(new Date(now-RETENTION).toISOString());
   for(const row of expired){removeConsultation(db,String(row.id),now,'expiry');removed++;}
   db.prepare("DELETE FROM attempts WHERE state!='COMMITTED' AND expiresAt<=?").run(now);
   db.exec('COMMIT');
  }catch(error){db.exec('ROLLBACK');throw error;}
  if(removed)db.exec('VACUUM');
  checkpoint(db,path);
  console.log(JSON.stringify({event:'local_retention',removed,backups:false,checkpointVerified:true}));
 }finally{db.close();}
}
