import {createHash} from 'node:crypto';
import {realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {ContactService} from './service.ts';
import {openContactRuntime} from './runtime.ts';
import {validateContact} from '../../src/lib/contact-validation.ts';
import {isSyntheticContactEmail} from '../../src/lib/contact-test.ts';

export function assertSyntheticOrigin(origin:string):void {
 const url=new URL(origin);
 if(url.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.origin!==origin||url.username||url.password)throw Error('Synthetic Contact requires an exact HTTP loopback origin');
}
export function isLocalContactRequest(host:string|undefined,remote:string|undefined,origin:string):boolean {
 return host===new URL(origin).host&&['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote??'');
}
export function syntheticContactDirectory(root:string):string {
 return join(realpathSync(tmpdir()),'priva-contact-mvp-'+createHash('sha256').update(resolve(root)).digest('hex').slice(0,16));
}
class SyntheticContactService extends ContactService {
 override submit(raw:Record<string,unknown>){
  const checked=validateContact(raw);
  if(checked.ok&&!isSyntheticContactEmail(checked.value.email))return this.repository.terminalReject({attemptId:raw.attemptId as string,token:raw.token as string},{email:'format'});
  return super.submit(raw);
 }
}
export function openSyntheticContact(directory:string,root:string){
 const runtime=openContactRuntime(directory,[resolve(root),resolve(root,'public'),resolve(root,'dist')]);
 return {...runtime,service:new SyntheticContactService(runtime.repository,runtime.tokens)};
}
