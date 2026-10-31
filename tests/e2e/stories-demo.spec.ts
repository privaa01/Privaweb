import {test,expect} from '@playwright/test';
test('Demo historias: doce opciones, independencia, expansión y recarga sin persistencia',async({page,request,context})=>{
 const response=await request.get('/demo/catalog.json');expect(response.status()).toBe(200);expect(response.headers()['cache-control']).toBe('no-store');const catalog=await response.json();expect(catalog.stories).toHaveLength(4);
 const requests:{url:string;method:string}[]=[];page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
 await page.goto('/historias.html');await expect(page.locator('[data-story]')).toHaveCount(3);
 const first=page.locator('[data-story]').first();await first.getByRole('radio').first().check();
 await page.getByRole('button',{name:'Ver más historias'}).click();await expect(page.locator('[data-story]')).toHaveCount(4);
 await expect(first.getByRole('radio').first()).toBeChecked();await expect(page.locator('[data-story]').nth(1).locator('input:checked')).toHaveCount(0);
 for(const [i,story]of catalog.stories.entries()){
  const card=page.locator('[data-story]').nth(i);await expect(card.getByRole('heading')).toHaveText(story.title);await expect(card.locator('[data-story-transcript]')).toHaveText(story.transcript);
  const radios=card.getByRole('radio');await expect(radios).toHaveCount(3);
  for(const [n,option]of story.options.entries()){
   const radio=radios.nth(n);await radio.focus();await radio.press('Space');await expect(radio).toBeChecked();await expect(radio).toBeFocused();
   await expect(card.locator('[data-feedback]')).toHaveText(option.explanation);await expect(card.locator('[data-feedback]')).toHaveAttribute('role','status');await expect(card.locator('[data-feedback]')).toHaveAttribute('aria-live','polite');
  }
 }
 await page.reload();await expect(page.locator('[data-story]')).toHaveCount(3);await expect(page.locator('[data-story] input:checked')).toHaveCount(0);
 for(const feedback of await page.locator('[data-feedback]').all())await expect(feedback).toBeEmpty();
 expect(requests.every(r=>r.method==='GET')).toBe(true);expect(requests.every(r=>!new URL(r.url).pathname.startsWith('/api/'))).toBe(true);
 expect(await context.cookies()).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
});
test('Demo historias: cuatro audios reales reproducen, pausan y buscan a diez segundos',async({page})=>{
 await page.goto('/historias.html');await expect(page.locator('[data-story]')).toHaveCount(3);await page.getByRole('button',{name:'Ver más historias'}).click();await expect(page.locator('[data-story]')).toHaveCount(4);
 for(const audio of await page.locator('[data-story] audio').all()){
  await expect(audio).toHaveAttribute('controls','');expect(await audio.evaluate((el:HTMLAudioElement)=>el.autoplay)).toBe(false);
  const element=await audio.elementHandle();await page.waitForFunction(el=>el instanceof HTMLAudioElement&&Number.isFinite(el.duration)&&el.duration>100,element,{timeout:15000});
  await audio.evaluate(async(el:HTMLAudioElement)=>{el.muted=true;await el.play();});await page.waitForFunction(el=>el instanceof HTMLAudioElement&&el.currentTime>0,element,{timeout:15000});
  await audio.evaluate((el:HTMLAudioElement)=>{el.pause();el.currentTime=10;});await page.waitForFunction(el=>el instanceof HTMLAudioElement&&el.paused&&Math.abs(el.currentTime-10)<.25&&!el.seeking,element,{timeout:15000});
 }
});
test('Demo historias: fallo inducido del audio conserva transcripción y ejercicio',async({page})=>{
 await page.route('**/media/public/*.mp3',route=>route.abort());
 await page.goto('/historias.html');const card=page.locator('[data-story]').first();await expect(card).toBeVisible();
 await expect(card.locator('[data-audio-status]')).toContainText('No se pudo reproducir');await card.locator('summary').click();await expect(card.locator('[data-story-transcript]')).toBeVisible();
 await card.getByRole('radio').first().check();await expect(card.locator('[data-feedback]')).not.toBeEmpty();
});
