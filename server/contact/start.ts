import {resolve} from 'node:path';
import {openContactRuntime} from './runtime.ts';import {contactServer} from './http.ts';
import {contactContent,contactReadiness} from '../../src/config/contact.ts';import {assertContactPublication} from '../../src/lib/contact-publication.ts';
// Production entry fails closed until editorial and operational review is configured.
assertContactPublication(contactContent,contactReadiness,resolve('public'));
const origin=process.env.PUBLIC_ORIGIN,directory=process.env.PRIVA_CONTACT_DATA_DIR;
if(!origin||!directory||origin!==contactReadiness.origin)throw new Error('BLOQUEADO 005: configure qualified origin/private storage.');
const runtime=openContactRuntime(directory,[resolve('public'),resolve('dist')]);
const server=contactServer(runtime.service,{origin});
server.listen(Number(process.env.PRIVA_CONTACT_PORT??'4327'),'127.0.0.1');
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>server.close(()=>{runtime.repository.close();process.exit(0);}));
