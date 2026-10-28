import type {AstroIntegration} from 'astro';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {Server as HttpServer} from 'node:http';
import {assertSyntheticOrigin,isLocalContactRequest,openSyntheticContact,syntheticContactDirectory} from './development.ts';
import {contactServer} from './http.ts';

/** Development only: does not run during build/preview or change production entry points. */
export function contactDevelopment():AstroIntegration {
 let root=process.cwd();
 let close:(()=>void)|undefined;
 return {name:'priva-contact-synthetic-development',hooks:{
  'astro:config:setup':({config})=>{root=fileURLToPath(config.root);},
  'astro:server:setup':({server,logger})=>{
   if(process.env.PRIVA_CONTACT_TEST_MODE!=='synthetic')return;
   const origin=process.env.PRIVA_CONTACT_TEST_ORIGIN??'http://127.0.0.1:4321';
   assertSyntheticOrigin(origin);
   const directory=process.env.PRIVA_CONTACT_TEST_DATA_DIR??syntheticContactDirectory(root);
   const runtime=openSyntheticContact(resolve(directory),root);
   const api=contactServer(runtime.service,{origin});
   if(!(server.httpServer instanceof HttpServer)){runtime.repository.close();throw Error('Synthetic Contact requires a local HTTP development server');}
   server.httpServer.requestTimeout=30000;server.httpServer.headersTimeout=10000;server.httpServer.timeout=30000;
   close=()=>runtime.repository.close();
   server.httpServer?.once('close',()=>{close?.();close=undefined;});
   server.middlewares.use((req,res,next)=>{
    if(!req.url?.split('?')[0].startsWith('/api/contacto'))return next();
    if(!isLocalContactRequest(req.headers.host,req.socket.remoteAddress,origin)){
     res.writeHead(403,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({result:'unavailable'}));return;
    }
    api.emit('request',req,res);
   });
   logger.info('Contacto: pruebas locales con datos ficticios y correo example.test; sin envío de correos.');
  },
  'astro:server:start':({address})=>{
   if(process.env.PRIVA_CONTACT_TEST_MODE!=='synthetic')return;
   const expected=new URL(process.env.PRIVA_CONTACT_TEST_ORIGIN??'http://127.0.0.1:4321');
   if(!['127.0.0.1','::1'].includes(address.address)||address.port!==Number(expected.port||80)){
    close?.();close=undefined;throw Error('Synthetic Contact must listen on its configured loopback port');
   }
  },
  'astro:server:done':()=>{close?.();close=undefined;}
 }};
}
