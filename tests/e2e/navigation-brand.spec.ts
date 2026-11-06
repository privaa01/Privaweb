import {test,expect} from '@playwright/test';
test('official vector brand, approved tokens and locally loaded variable font',async({page,baseURL})=>{
 const external:string[]=[];page.on('request',r=>{if(new URL(r.url()).origin!==new URL(baseURL!).origin)external.push(new URL(r.url()).origin);});
 await page.goto('/index.html');await page.evaluate(()=>document.fonts.ready);
 for(const section of ['banner','contentinfo'] as const){const img=page.getByRole(section).getByRole('img',{name:'Priva',exact:true});await expect(img).toHaveAttribute('src','/brand/priva-logo.svg');expect(await img.evaluate(i=>(i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth>0)).toBe(true);}
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--primary-base').trim())).toBe('#047857');
 expect(await page.evaluate(()=>[...document.fonts].filter(f=>f.family.includes('Jakarta')&&f.status==='loaded').length)).toBeGreaterThan(0);expect(external).toEqual([]);
});
