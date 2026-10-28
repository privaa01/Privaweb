import { test, expect } from '@playwright/test';
import { parseCatalog } from '../../src/lib/stories-contract';
import { initialStoryIds, storiesClosingText, storiesContent } from '../../src/content/stories';
import { instagram } from '../../src/config/social';
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
 for(const id of ['somos-priva','que-hacemos']){await page.goto(`/index.html#${id}`);await expect(page.locator(`#${id}`)).toBeFocused();}
 await page.goto('/contacto.html');await expect(page.locator(`a[href="${instagram.url}"]`).first()).toBeVisible();
});
test('007 transitions and private resource revocation require real administrative harness',()=>{
 throw new Error('BLOQUEADO 003/007: falta integrar harness autorizado de publicación/desactivación/reactivación/edición y URLs privadas; no sustituirlo por mocks ni marcar cierre integrado.');
});
