import { test, expect } from '@playwright/test';
import { parseCatalog } from '../../src/lib/stories-contract.ts';
import { initialStoryIds, storiesClosingText, storiesContent } from '../../src/content/stories.ts';
import { instagram } from '../../src/config/social.ts';
// Administrative credentials in the isolated harness must never enter trace artifacts.
test.use({trace:'off',video:'off',screenshot:'off'});
test('real public catalog, resources and three initial materials',async({page,request,baseURL})=>{
 const response=await request.get('/api/public/historias',{headers:{'Cache-Control':'no-cache'}});expect(response.ok()).toBe(true);expect(response.headers()['cache-control']).toContain('no-store');
 const data=parseCatalog(await response.json(),{baseURL:baseURL!,mediaOrigins:storiesContent.mediaOrigins});
 for(const id of initialStoryIds)expect(data.stories.some(s=>s.id===id)).toBe(true);
 await page.goto('/historias.html');await expect(page.locator('[data-story]')).toHaveCount(Math.min(3,data.stories.length));await page.getByRole('button',{name:'Ver más historias'}).click();await expect(page.locator('[data-story]')).toHaveCount(data.stories.length);
 for(const story of data.stories){const media=await request.get(story.audio.src,{headers:{Range:'bytes=0-99'}});expect(media.status()).toBe(206);expect(media.headers()['content-type']).toContain('audio/');}
});
test('real institutional destinations and verified shared Instagram',async({page})=>{
 expect(instagram.status,'BLOQUEADO: Instagram oficial pendiente').toBe('verificado');await page.goto('/historias.html');await expect(page.getByText(storiesClosingText,{exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'EXPLORAR MÁS CONTENIDOS'})).toHaveAttribute('href',instagram.url);
 for(const id of ['somos-priva','que-hacemos']){await page.goto(`/index.html#${id}`);await expect(page.locator(`#${id} h2`)).toBeFocused();}
 await page.goto('/contacto.html');await expect(page.locator(`a[href="${instagram.url}"]`).first()).toBeVisible();
});
test.describe('isolated real007 publication transitions',()=>{
 test('007 publish/deactivate/reactivate/edit preserves public eligibility and IDs',async({page,request,baseURL})=>{
  test.setTimeout(60000);
  const {storiesIntegrationHarness}=await import('../helpers/stories-integration-harness.ts');
  const {readFileSync}=await import('node:fs');
  const {randomUUID}=await import('node:crypto');
  const {emptyDraft}=await import('../../src/lib/story-management-contract.ts');
  const fixture=await storiesIntegrationHarness(baseURL!);
  try{
   const api=fixture.origin+'/api/admin/historias';
   const current=async(id:string)=>{const response=await request.get(api+'/'+id,{headers:fixture.headers});expect(response.status()).toBe(200);return response.json();};
   const change=async(id:string,action:string,body:Record<string,unknown>)=>{
    const story=await current(id);
    const response=await request[action==='save'?'put':'post'](api+'/'+id+(action==='save'?'':'/'+action),{headers:fixture.headers,data:{operationId:randomUUID(),expectedRevision:story.revision,...body}});
    expect(response.status()).toBe(200);return response.json();
   };
   const working=JSON.parse(readFileSync('content/stories/drafts/numero-desconocido.json','utf8'));
   working.imageAlt='Teléfono recibiendo una llamada de un número desconocido.';
   const create=async(title:string,complete:boolean)=>{
    const response=await request.post(api,{headers:fixture.headers,data:{operationId:randomUUID(),working:{...emptyDraft(),title}}});expect(response.status()).toBe(201);
    const id=(await response.json()).storyId;
    if(!complete)return {id,resources:[] as string[]};
    const resources=[randomUUID(),randomUUID()];
    for(const [index,kind,file,mime] of [[0,'image','public/images/stories/llamada.png','image/png'],[1,'audio','content/stories/audio/hidtoria_cuatro_editada.mp3.mpeg','audio/mpeg']] as const){
     const upload=await request.put(api+'/'+id+'/recursos/'+resources[index],{headers:{...fixture.headers,'content-type':mime,'x-resource-kind':kind},data:readFileSync(file)});expect(upload.status()).toBe(201);
    }
    await change(id,'save',{working:{...working,title,imageResourceId:resources[0],audioResourceId:resources[1]}});
    await change(id,'publicar',{});return {id,resources};
   };
   const added=await create(working.title,true);
   await change(added.id,'activacion',{active:true});
   const draft=await create('BORRADOR PRIVADO de verificación',false);
   const inactive=await create('INACTIVA PRIVADA de verificación',true);
   const catalog=async()=>{const response=await request.get(fixture.origin+'/api/public/historias');expect(response.status()).toBe(200);expect(response.headers()['cache-control']).toBe('no-store');return parseCatalog(await response.json(),{baseURL:fixture.origin,mediaOrigins:[]});};
   let data=await catalog();expect(data.stories).toHaveLength(4);
   expect(data.stories.some(story=>[draft.id,inactive.id].includes(story.id))).toBe(false);
   expect(JSON.stringify(data)).not.toMatch(/BORRADOR PRIVADO|INACTIVA PRIVADA|working|createdBy|example.com/);
   expect((await request.get(fixture.origin+'/media/public/'+inactive.resources[0])).status()).toBe(404);
   expect((await request.get(api+'/'+added.id)).status()).toBe(403);
   await page.goto(fixture.origin+'/historias.html');
   await expect(page.locator('[data-story]')).toHaveCount(3);
   await page.getByRole('button',{name:'Ver más historias'}).click();
   await expect(page.locator('[data-story]')).toHaveCount(4);
   await expect(page.getByRole('heading',{name:working.title,exact:true})).toBeFocused();
   await change(added.id,'activacion',{active:false});
   expect((await catalog()).stories).toHaveLength(3);
   expect((await request.get(fixture.origin+'/media/public/'+added.resources[1])).status()).toBe(404);
   await page.reload();await expect(page.locator('[data-story]')).toHaveCount(3);
   await change(added.id,'activacion',{active:true});
   expect((await catalog()).stories.filter(story=>story.id===added.id)).toHaveLength(1);
   const media=await request.get(fixture.origin+'/media/public/'+added.resources[1],{headers:{Range:'bytes=0-99'}});expect(media.status()).toBe(206);
   const before=(await catalog()).stories.find(story=>story.id===added.id)!;
   const edited={...(await current(added.id)).working,description:'Recreación educativa ampliada para verificar publicación atómica.'};
   await change(added.id,'save',{working:edited});
   expect((await catalog()).stories.find(story=>story.id===added.id)?.description).toBe(before.description);
   await change(added.id,'publicar',{});
   data=await catalog();expect(data.stories.find(story=>story.id===added.id)?.description).toBe(edited.description);
   expect(new Set(data.stories.map(story=>story.id)).size).toBe(4);
   await page.reload();await expect(page.locator('[data-story]')).toHaveCount(3);
   await page.getByRole('button',{name:'Ver más historias'}).click();
   await expect(page.locator(`[data-story="${added.id}"] [data-story-description]`)).toHaveText(edited.description);
  }finally{await fixture.stop();}
 });
});
