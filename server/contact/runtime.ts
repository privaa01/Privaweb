import {mkdirSync,lstatSync,realpathSync} from 'node:fs';import {resolve,relative,isAbsolute,join} from 'node:path';
import {AttemptTokens,loadSigningKey} from './attempt-token.ts';import {SqliteContactRepository} from './sqlite-repository.ts';import {ContactService} from './service.ts';
export function openContactRuntime(directory:string,staticRoots:string[],options:ConstructorParameters<typeof SqliteContactRepository>[2]={}){
 const path=resolve(directory);mkdirSync(path,{recursive:true,mode:0o700});const st=lstatSync(path);
 if(st.isSymbolicLink()||realpathSync(path)!==path||(st.mode&0o077)!==0)throw new Error('Unsafe private data directory');
 for(const root of staticRoots){const rel=relative(resolve(root),path);if(rel===''||(!rel.startsWith('..')&&!isAbsolute(rel)))throw new Error('Private files may not be under a static root');}
 const tokens=new AttemptTokens(loadSigningKey(join(path,'contact.key')),options?.clock);const repository=new SqliteContactRepository(join(path,'contact.sqlite'),tokens,options);return {tokens,repository,service:new ContactService(repository,tokens)};
}
