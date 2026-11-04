import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import { readFileSync } from 'node:fs';
import { openAdminRuntime } from '../server/admin/runtime.ts';
import { composeLocalInbox } from '../server/inbox/local.ts';
import { seedLocalInboxExamples, removeLocalInboxExamples } from '../server/inbox/local-demo.ts';
import {sharedLock} from '../server/privacy/maintenance.ts';

if(process.env.PRIVA_ADMIN_MODE!=='local'||!['--fictitious-only','--remove-fictitious-only'].includes(process.argv[2]))throw Error('Explicit local fictitious examples required');
const directory=resolve(process.env.PRIVA_ADMIN_LOCAL_DATA_DIR??join(homedir(),'Library/Application Support/Priva/local-admin'));
const config=JSON.parse(readFileSync(join(directory,'local-config.json'),'utf8'));
if(config.directory!==directory||config.origin!=='https://localhost:4354')throw Error('Local profile mismatch');
const runtime=openAdminRuntime(directory,[resolve('.')]);
const release=await sharedLock(join(directory,'contact.sqlite.maintenance.lock'));
let inbox:ReturnType<typeof composeLocalInbox>|undefined;
try {
  inbox=composeLocalInbox({repository:runtime.repository,directory,origin:config.origin,csrfKey:runtime.csrfKey});
  const result=process.argv[2]==='--remove-fictitious-only'?removeLocalInboxExamples(inbox.repository):seedLocalInboxExamples(inbox.repository);
  console.log(JSON.stringify({...result,mode:'fictitious-local-only',mailSent:false}));
} finally {inbox?.repository.close();runtime.repository.close();await release();}
