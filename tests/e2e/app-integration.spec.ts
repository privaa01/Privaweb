import {test,expect} from '@playwright/test';
import {appDownloadConfig} from '../../src/config/app-downloads';
import {resolveDownloads} from '../../src/lib/app-downloads';
import {appDownloadNote} from '../../src/content/app';
test('real App states correspond to authored configuration, pending is valid',async({page})=>{
 await page.goto('/app.html');await expect(page.locator('[data-prototype-notice]')).toContainText('Prototipo');await expect(page.locator('[data-download-note]')).toHaveText(appDownloadNote);
 for(const platform of resolveDownloads(appDownloadConfig)){const box=page.locator(`[data-platform="${platform.platform}"]`);if(platform.state==='available'){await expect(box.getByRole('link')).toHaveAttribute('href',platform.href);}else{await expect(box).toContainText('Próximamente');await expect(box.locator('a,button')).toHaveCount(0);}}
 expect(await page.locator('[data-app] form,[data-app] input,[data-app] textarea').count()).toBe(0);
});
test('real Contacto origin and both App fragments',async({page})=>{
 await page.goto('/contacto.html');await page.locator('.header-cta').click();await expect(page).toHaveURL(/app.html#descarga$/);await expect(page.locator('#descarga h2')).toBeFocused();
 for(const id of['descarga','como-funciona']){await page.goto(`/app.html#${id}`);await page.reload();await expect(page.locator(`#${id} h2`)).toBeFocused();await expect(page.locator(`#${id} h2`)).toBeInViewport();}
});
test('enabled official destinations reach their reviewed location; no invented case when pending',async({page})=>{
 const available=resolveDownloads(appDownloadConfig).filter(d=>d.state==='available');await page.goto('/app.html');
 if(!available.length){await expect(page.locator('[data-platform] .app-pending')).toHaveCount(2);return;}
 for(const platform of available){if(platform.state!=='available')continue;const response=await page.goto(platform.href);expect(response?.ok()).toBe(true);expect(new URL(page.url()).protocol).toBe('https:');}
 // Officiality, destination identity and redirects still need manual evidence against review references.
});
