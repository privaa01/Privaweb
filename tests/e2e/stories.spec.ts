import { test, expect, type Page } from '@playwright/test';
import { fixtureCatalog } from '../fixtures/stories/src/content';
async function catalog(page:Page, data:unknown=fixtureCatalog){ await page.route('**/api/public/historias',r=>r.fulfill({json:data}));await page.goto('/historias.html');await expect(page.locator('[data-story]')).toHaveCount(3); }
test('catalog expands without duplicates or losing selection and fragment works',async({page})=>{
 await catalog(page);await page.getByRole('radio').first().check();await page.getByRole('button',{name:'Ver todas las historias'}).click();await expect(page.locator('[data-story]')).toHaveCount(4);await expect(page.getByRole('radio').first()).toBeChecked();
 await page.getByRole('link',{name:'Explorar episodios'}).click();await expect(page).toHaveURL(/#casos$/);await expect(page.locator('#casos')).toBeFocused();
 await page.reload();await expect(page.locator('#casos')).toBeFocused();expect(await page.content()).not.toContain('private@example.test');
});
test('three or fewer stays same collection',async({page})=>{await catalog(page,{schemaVersion:1,stories:fixtureCatalog.stories.slice(0,3)});await page.getByRole('button',{name:'Ver todas las historias'}).click();await expect(page.locator('[data-story]')).toHaveCount(3);});
test('empty differs from error; retry recovers',async({page})=>{
 let mode=0;await page.route('**/api/public/historias',r=>mode===0?r.fulfill({json:{schemaVersion:1,stories:[]}}):mode===1?r.fulfill({status:503,body:'private error'}):r.fulfill({json:fixtureCatalog}));
 await page.goto('/historias.html');await expect(page.locator('[data-catalog-status]')).toContainText('No hay historias');mode=1;await page.reload();await expect(page.locator('[data-catalog-status]')).toContainText('No pudimos');expect(await page.content()).not.toContain('private error');mode=2;await page.getByRole('button',{name:'Reintentar'}).click();await expect(page.locator('[data-story]')).toHaveCount(3);
});
for(const mode of ['invalid','type','network'])test(`reject ${mode} response`,async({page})=>{await page.route('**/api/public/historias',r=>mode==='network'?r.abort():mode==='type'?r.fulfill({contentType:'text/html',body:'private'}):r.fulfill({json:{...fixtureCatalog,admins:['private']}}));await page.goto('/historias.html');await expect(page.locator('[data-catalog-status]')).toContainText('No pudimos');await expect(page.locator('[data-story]')).toHaveCount(0);});
test('real media plays pauses seeks and exposes equivalent fixture transcript',async({page})=>{
 await catalog(page);const audio=page.locator('audio').first();await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.readyState)).toBeGreaterThan(0);
 expect(await audio.evaluate((a:HTMLAudioElement)=>a.autoplay||!a.paused)).toBe(false);
 for(let i=1;i<3;i++){const other=page.locator('audio').nth(i);await expect.poll(()=>other.evaluate((a:HTMLAudioElement)=>a.readyState)).toBeGreaterThan(0);expect(await other.evaluate((a:HTMLAudioElement)=>a.autoplay||!a.paused)).toBe(false);await page.locator('[data-story-title]').nth(i).click();await other.evaluate((a:HTMLAudioElement)=>a.play());await expect.poll(()=>other.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(0.1);await other.evaluate((a:HTMLAudioElement)=>{a.pause();a.currentTime=2;});await expect.poll(()=>other.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeCloseTo(2,0);await expect(page.locator('[data-audio-duration]').nth(i)).toHaveText(`0:0${4+i}`);}
 await page.getByRole('heading',{name:fixtureCatalog.stories[0].title,exact:true}).click();
 await audio.evaluate((a:HTMLAudioElement)=>a.play());await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(0.1);
 await audio.evaluate((a:HTMLAudioElement)=>{a.pause();a.currentTime=2;});await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeCloseTo(2,0);
 expect(await audio.evaluate((a:HTMLAudioElement)=>a.paused)).toBe(true);await expect(page.locator('[data-audio-duration]').first()).toHaveText('0:04');
 await page.getByText('Leer transcripción').first().click();await expect(page.getByText(fixtureCatalog.stories[0].transcript,{exact:true})).toBeVisible();
 const response=await page.request.get('/media/public/test-audio-0.wav',{headers:{Range:'bytes=0-99'}});expect(response.status()).toBe(206);expect((await response.body()).length).toBe(100);
});
for(const file of ['missing.wav','broken.wav'])test(`media error ${file} retains transcript and activity`,async({page})=>{
 const data=structuredClone(fixtureCatalog);data.stories[0].audio.src=`/media/public/${file}`;await catalog(page,data);
 await expect(page.locator('[data-audio-status]').first()).toContainText('No se pudo');await page.getByText('Leer transcripción').first().click();await expect(page.getByText(data.stories[0].transcript,{exact:true})).toBeVisible();await page.getByRole('radio').first().check();await expect(page.locator('[data-feedback]').first()).toContainText('riesgo');
});
test('all nine feedbacks by pointer and keyboard, independent, no transmission/storage, reload reset',async({page})=>{
 await catalog(page);await page.waitForLoadState('networkidle');const before=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage},cookies:document.cookie}));const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 for(let i=0;i<3;i++){const card=page.locator('[data-story]').nth(i);for(let j=0;j<3;j++){const radio=card.getByRole('radio').nth(j);await radio.focus();await radio.press('Space');await expect(card.locator('[data-feedback]')).toHaveText(fixtureCatalog.stories[i].options[j].explanation);await card.getByRole('radio').nth((j+1)%3).check();await radio.check();await expect(card.locator('[data-feedback]')).toHaveText(fixtureCatalog.stories[i].options[j].explanation);await radio.focus();await expect(radio).toBeFocused();}}
 const first=page.getByRole('radio').first();await first.focus();await first.press('ArrowRight');await expect(page.locator('[data-story]').first().getByRole('radio').nth(1)).toBeChecked();await expect(page.locator('[data-story]').nth(1).getByRole('radio').nth(2)).toBeChecked();
 expect(requests).toEqual([]);expect(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage},cookies:document.cookie}))).toEqual(before);
 await page.reload();await expect(page.locator('[data-story]')).toHaveCount(3);await expect(page.locator('input:checked')).toHaveCount(0);await expect(page.locator('[data-feedback]').first()).toBeEmpty();
});
test('pageshow restoration revalidates and clears selection; failure removes stale cards',async({page})=>{
 let fails=false;await page.route('**/api/public/historias',r=>fails?r.fulfill({status:500}):r.fulfill({json:fixtureCatalog}));await page.goto('/historias.html');await expect(page.locator('[data-story]')).toHaveCount(3);await page.getByRole('radio').first().check();
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await expect(page.locator('[data-story]')).toHaveCount(3);await expect(page.locator('input:checked')).toHaveCount(0);
 fails=true;await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await expect(page.locator('[data-catalog-status]')).toContainText('No pudimos');await expect(page.locator('[data-story]')).toHaveCount(0);
});
test('method and continuation exact contracts, image failure preserves text',async({page})=>{
 await page.route('**/*.svg',r=>r.abort());await catalog(page);await expect(page.locator('[data-method-step]')).toHaveText(['1. Escucha','2. Reflexiona','3. Aplica']);
 await expect(page.getByRole('link',{name:'Saber más de Somos Priva'})).toHaveAttribute('href','/index.html#somos-priva');await expect(page.getByRole('link',{name:'Saber más de Qué hacemos'})).toHaveAttribute('href','/index.html#que-hacemos');
 await page.getByRole('link',{name:'Saber más de Somos Priva'}).click();await expect(page.locator('#somos-priva')).toBeFocused();await page.goBack();
 await expect(page.getByText('Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.',{exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'EXPLORAR MÁS CONTENIDOS'})).toHaveAttribute('href',/instagram.com\/priva_fixture/);
});
test('delayed old request never replaces new catalog; visibility refresh uses same contract',async({page})=>{
 let calls=0;let release:()=>void=()=>{};const gate=new Promise<void>(resolve=>release=resolve);
 await page.route('**/api/public/historias',async r=>{calls++;if(calls===1){await gate;await r.fulfill({json:fixtureCatalog}).catch(()=>{});}else await r.fulfill({json:{schemaVersion:1,stories:[fixtureCatalog.stories[3]]}});});
 await page.goto('/historias.html');await expect(page.locator('[data-catalog-status]')).toContainText('Cargando');
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await expect(page.locator('[data-story]')).toHaveCount(1);release();await expect(page.locator('[data-story-title]')).toHaveText('Nuevo caso de prueba');
});
test('catalog values render as text and controls have unique ids and live region',async({page})=>{
 const data=structuredClone(fixtureCatalog);data.stories[0].title='<img src=x onerror="alert(1)">';await catalog(page,data);await expect(page.locator('[data-story-title]').first()).toHaveText(data.stories[0].title);expect(await page.locator('[data-story-title] img').count()).toBe(0);
 const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));expect(ids.length).toBe(new Set(ids).size);
 await expect(page.locator('[data-feedback]').first()).toHaveAttribute('role','status');await expect(page.locator('[data-feedback]').first()).toHaveAttribute('aria-live','polite');
 const request=await page.waitForRequest('**/api/public/historias',{timeout:10}).catch(()=>null);expect(request).toBe(null);
});
