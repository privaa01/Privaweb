import type {AstroIntegration} from 'astro';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {assertSyntheticOrigin,isLocalContactRequest} from '../contact/development.ts';
import {localStoriesDirectory,openLocalStories} from './development.ts';

export function storiesDevelopment():AstroIntegration {
 let root=process.cwd();
 let close:(()=>void)|undefined;
 return {name:'priva-stories-local',hooks:{
  'astro:config:setup':({config})=>{root=fileURLToPath(config.root);},
  'astro:server:setup':({server,logger})=>{
   if(process.env.PRIVA_STORIES_MODE!=='local')return;
   const origin=process.env.PRIVA_STORIES_ORIGIN??'http://127.0.0.1:4321';
   assertSyntheticOrigin(origin);
   const directory=resolve(process.env.PRIVA_STORIES_DATA_DIR??localStoriesDirectory(root));
   const runtime=openLocalStories(directory,root,origin);
   close=runtime.close;
   server.httpServer?.once('close',()=>{close?.();close=undefined;});
   server.middlewares.use((req,res,next)=>{
    const path=(req.url??'').split('?')[0];
    if(!path.startsWith('/api/public/historias')&&!path.startsWith('/media/public/'))return next();
    if(!isLocalContactRequest(req.headers.host,req.socket.remoteAddress,origin)){
     res.writeHead(403,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({result:'forbidden'}));return;
    }
    void runtime.handler(req,res).then(handled=>{if(!handled)next();}).catch(()=>{
     if(res.headersSent){res.destroy();return;}
     res.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({result:'unavailable'}));
    });
   });
   logger.info('Historias: catálogo real007 conectado; sin publicación automática ni acceso administrativo.');
  },
  'astro:server:start':({address})=>{
   if(process.env.PRIVA_STORIES_MODE!=='local')return;
   const expected=new URL(process.env.PRIVA_STORIES_ORIGIN??'http://127.0.0.1:4321');
   if(!['127.0.0.1','::1'].includes(address.address)||address.port!==Number(expected.port||80)){
    close?.();close=undefined;throw Error('Local Stories must listen on its configured loopback port');
   }
  },
  'astro:server:done':()=>{close?.();close=undefined;}
 }};
}
