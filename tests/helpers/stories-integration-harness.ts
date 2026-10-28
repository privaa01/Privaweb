import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {storyFixture} from '../fixtures/story-management-service/helpers.ts';
import {createStoriesHandler} from '../../server/stories/http.ts';
import {importInitialStory} from '../../server/stories/import.ts';
import {initialStoryImages} from '../../src/content/story-images.ts';
import {csrf,SESSION_COOKIE} from '../../server/admin/sessions.ts';

/** Isolated real007 database + HTTP router; forwards UI/assets to the approved Astro app. */
export async function storiesIntegrationHarness(frontend:string){
 const fixture=await storyFixture();
 let handler:ReturnType<typeof createStoriesHandler>;
 const server=createServer((request,response)=>{
  void (async()=>{
   if(await handler(request,response))return;
   if(!['GET','HEAD'].includes(request.method??'GET')||!request.url?.startsWith('/')||request.url.startsWith('//')||/^\/(api|media|admin)(\/|$)/.test(request.url)){
    response.writeHead(404);response.end();return;
   }
   const target=new URL(request.url,frontend);
   if(target.origin!==new URL(frontend).origin){response.writeHead(404);response.end();return;}
   const upstream=await fetch(target,{method:request.method});
   response.writeHead(upstream.status,{'Content-Type':upstream.headers.get('content-type')??'application/octet-stream','Cache-Control':'no-store'});
   response.end(request.method==='HEAD'?undefined:Buffer.from(await upstream.arrayBuffer()));
  })().catch(()=>{if(response.headersSent)response.destroy();else{response.writeHead(503);response.end();}});
 });
 try{
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  handler=createStoriesHandler({service:fixture.service,media:fixture.media,origin,csrfKey:fixture.csrfKey});
  for(const id of ['enlace-falso','llamada-sospechosa','contrasena-compartida'] as const){
   const working=JSON.parse(readFileSync(resolve(`content/stories/drafts/${id}.json`),'utf8'));
   working.imageAlt=initialStoryImages[id].alt;
   const story=await importInitialStory(fixture.service,fixture.media,fixture.token,{id,working,sourceReference:'Approved project assets; isolated integration database',reviewReference:'specs/003-historias-educativas/evidence/local-publication-authorization.json'});
   fixture.service.change(fixture.token,'activate',id,{operationId:randomUUID(),expectedRevision:story.revision,active:true});
  }
  fixture.setTime(fixture.time()+1000); // New records must follow the three initial timestamps.
  return {...fixture,origin,headers:{'x-priva-request':'1',origin,'content-type':'application/json',cookie:`${SESSION_COOKIE}=${fixture.token}`,'x-csrf-token':csrf(fixture.csrfKey,'session',fixture.token)},
   async stop(){server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));fixture.cleanup();}};
 }catch(error){server.closeAllConnections();server.close();fixture.cleanup();throw error;}
}
