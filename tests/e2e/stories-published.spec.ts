import {test,expect} from '@playwright/test';
import {parseCatalog} from '../../src/lib/stories-contract';

test('four owner-authorized local stories: expansion, audio, transcript and twelve explanations',async({page,request,baseURL,browserName})=>{
 const response=await request.get('/api/public/historias');expect(response.status()).toBe(200);
 const catalog=parseCatalog(await response.json(),{baseURL:baseURL!,mediaOrigins:[]});
 expect(catalog.stories.map(story=>story.title)).toEqual(['Enlace falso','La llamada sospechosa','La contraseña compartida','Número desconocido']);
 const writes:string[]=[];page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))writes.push(request.url());});
 await page.goto('/historias.html');
 await expect(page.locator('[data-catalog] [data-story]')).toHaveCount(3);
 const more=page.getByRole('button',{name:'Ver más historias'});
 await expect(more).toBeVisible();
 expect(await more.evaluate(button=>Boolean(button.compareDocumentPosition(document.querySelector('[data-catalog]')!)&Node.DOCUMENT_POSITION_PRECEDING))).toBe(true);
 await expect(more).toHaveAttribute('aria-controls','catalogo-historias');
 await more.focus();await more.press('Enter');
 await expect(page.getByRole('heading',{name:'Número desconocido',exact:true})).toBeFocused();
 await expect(page.getByRole('heading',{name:'Número desconocido',exact:true})).toBeInViewport();
 await expect(more).toBeHidden();
 await expect(page.locator('[data-catalog] [data-story]')).toHaveCount(4);
 for(const story of catalog.stories){
  const card=page.locator(`[data-catalog] [data-story="${story.id}"]`);
  await card.scrollIntoViewIfNeeded();
  await expect.poll(()=>card.locator('img').evaluate((image:HTMLImageElement)=>image.naturalWidth)).toBeGreaterThan(0);
  const media=await request.get(story.audio.src,{headers:{Range:'bytes=0-99'}});
  expect(media.status()).toBe(206);expect(media.headers()['cache-control']).toBe('no-store');expect((await media.body()).length).toBe(100);
  const audio=card.locator('audio');
  await expect.poll(()=>audio.evaluate((audio:HTMLAudioElement)=>Number.isFinite(audio.duration)&&audio.duration>0)).toBe(true);
  expect(await audio.evaluate((audio:HTMLAudioElement)=>audio.autoplay)).toBe(false);
  await audio.evaluate((audio:HTMLAudioElement)=>audio.play());
  await expect.poll(()=>audio.evaluate((audio:HTMLAudioElement)=>audio.currentTime)).toBeGreaterThan(0);
  await audio.evaluate((audio:HTMLAudioElement)=>{audio.pause();audio.currentTime=10;});
  await expect.poll(()=>audio.evaluate((audio:HTMLAudioElement)=>audio.currentTime)).toBeGreaterThanOrEqual(9);
  await card.getByText('Leer transcripción',{exact:true}).click();
  await expect(card.locator('[data-story-transcript]')).toHaveText(story.transcript);
  for(const option of story.options){
   await card.getByRole('radio',{name:option.label,exact:true}).check();
   await expect(card.locator('[data-feedback]')).toHaveText(option.explanation);
  }
 }
 expect(writes).toEqual([]);
 expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
 if(browserName==='chromium'){
  await page.locator('#casos').scrollIntoViewIfNeeded();
  await page.screenshot({path:'.test-output/stories-published.png',fullPage:true});
 }
 await page.reload();
 await expect(page.locator('[data-catalog] [data-story]')).toHaveCount(3);
 await expect(page.locator('input:checked')).toHaveCount(0);
});
