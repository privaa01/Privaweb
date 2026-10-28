import {test,expect} from '@playwright/test';
import {parseCatalog} from '../../src/lib/stories-contract';

test('Historias consumes the real007 catalog and distinguishes empty from failure',async({page,request,baseURL,browserName})=>{
 const response=await request.get('/api/public/historias');
 expect(response.status()).toBe(200);
 expect(response.headers()['cache-control']).toBe('no-store');
 expect(response.headers()['content-type']).toContain('application/json');
 const catalog=parseCatalog(await response.json(),{baseURL:baseURL!,mediaOrigins:[]});
 const pageResponse=await page.goto('/historias.html');
 expect(pageResponse?.status()).toBe(200);
 await expect(page.locator('[data-catalog]')).not.toHaveAttribute('aria-busy','true');
 await expect(page.locator('[data-catalog] [data-story]')).toHaveCount(Math.min(3,catalog.stories.length));
 if(!catalog.stories.length)await expect(page.locator('[data-catalog-status]')).toHaveText('No hay historias publicadas activas en este momento.');
 await expect(page.locator('[data-retry]')).toBeHidden();
 await page.reload();
 await expect(page.locator('[data-catalog]')).not.toHaveAttribute('aria-busy','true');
 if(browserName==='chromium')await page.screenshot({path:'.test-output/stories-local-connected.png',fullPage:true});
});

test('local public integration denies writes, forged Host and unpublished media',async({request})=>{
 expect((await request.post('/api/public/historias',{data:{}})).status()).toBe(405);
 expect((await request.get('/api/public/historias?debug=1')).status()).toBe(404);
 expect((await request.get('/api/public/historias',{headers:{Host:'invalid.example'}})).status()).toBe(403);
 expect((await request.get('/media/public/00000000-0000-4000-8000-000000000000')).status()).toBe(404);
 const admin=await request.get('/api/admin/historias');
 expect([401,403,404]).toContain(admin.status());
});
