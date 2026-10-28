// Private operator authority of the storage owner; never imported by an HTTP entry point.
import {statSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {resolve} from 'node:path';
import {SqliteAdminRepository} from '../admin/sqlite-repository.ts';
import type {AdminAccount} from '../admin/repository.ts';
import {StoriesRepository} from './sqlite-repository.ts';
import {StoriesService} from './service.ts';
import {StoryMedia} from './media.ts';
import {AdminError} from '../../src/lib/admin-contract.ts';

export function localStoryOperator(admin:SqliteAdminRepository,mediaDirectory:string){
 if(process.env.PRIVA_STORIES_MODE!=='local')throw Error('Local operator requires explicit local mode');
 const directory=statSync(resolve(mediaDirectory,'..'));
 if(!process.getuid||directory.uid!==process.getuid()||(directory.mode&0o077)!==0)throw Error('Local operator requires owner-only storage');
 // An audit identity only: no password, no mailbox verification, no login permission.
 const actor=admin.createAccount(`local-operator-${randomUUID()}@example.test`);
 admin.setAuthorization(actor.id,false);
 const token=randomUUID();
 const operatorAdmin=Object.create(admin) as SqliteAdminRepository;
 operatorAdmin.withAuthorizedTransaction=<T>(provided:string|undefined,operation:(db:SqliteAdminRepository['db'],account:AdminAccount)=>T):T=>{
  if(provided!==token)throw new AdminError(401,'unauthenticated');
  return admin.transaction(()=>operation(admin.db,admin.accountById(actor.id)!));
 };
 const repository=new StoriesRepository(operatorAdmin);
 const media=new StoryMedia(repository,mediaDirectory);
 return {service:new StoriesService(repository,media.verify),media,token,actorId:actor.id};
}
