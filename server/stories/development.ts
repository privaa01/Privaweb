import {createHash} from 'node:crypto';
import {realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {openAdminRuntime} from '../admin/runtime.ts';
import {composeStories} from './composition.ts';

export function localStoriesDirectory(root:string):string {
 return join(realpathSync(tmpdir()),'priva-stories-local-'+createHash('sha256').update(resolve(root)).digest('hex').slice(0,16));
}

/** Real service, with no account provisioning or automatic editorial publication. */
export function openLocalStories(directory:string,root:string,origin:string) {
 const runtime=openAdminRuntime(directory,[resolve(root),resolve(root,'public'),resolve(root,'dist'),resolve(root,'.private-build')]);
 try {
  const stories=composeStories({repository:runtime.repository,directory,origin,csrfKey:runtime.csrfKey});
  return {...stories,close:()=>runtime.repository.close()};
 } catch(error) {runtime.repository.close();throw error;}
}
