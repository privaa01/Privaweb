import {chromium,firefox,webkit} from '@playwright/test';
import assert from 'node:assert/strict';import {writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('.test-output',{recursive:true});
const base=process.env.PRIVA_DEMO_URL??'http://127.0.0.1:4330';const report=[];
for(const [name,type] of Object.entries({chromium,firefox,webkit})){
 const browser=await type.launch(name==='chromium'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{});
 try{const context=await browser.newContext();const page=await context.newPage();const requests=[];page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
 for(const path of ['/index.html','/historias.html','/app.html','/contacto.html','/terminos.html','/manifiesto-datos.html','/404.html']){
  const response=await page.goto(base+path);assert.ok([200,404].includes(response.status()));await page.locator('.demo-notice').waitFor();assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('textarea').count(),0);if(path==='/contacto.html'){assert.equal(await page.locator('form[data-demo-contact]').count(),1);assert.equal(await page.locator('input:not([readonly]):not([type=checkbox])').count(),0);}else assert.equal(await page.locator('form').count(),0);
 }
 await page.goto(base+'/historias.html');await page.locator('[data-story]').nth(2).waitFor();assert.equal(await page.locator('[data-story]').count(),3);await page.getByRole('button',{name:'Ver más historias'}).click();assert.equal(await page.locator('[data-story]').count(),4);
 for(const card of await page.locator('[data-story]').all()){
  const audio=card.locator('audio');await audio.evaluate(async a=>{if(a.readyState<1)await new Promise((resolve,reject)=>{a.addEventListener('loadedmetadata',resolve,{once:true});a.addEventListener('error',reject,{once:true});});});
  await page.waitForFunction(a=>Number.isFinite(a.duration)&&a.duration>100,await audio.elementHandle(),{timeout:15000});
  await audio.evaluate(async a=>{a.muted=true;await a.play();});await page.waitForFunction(a=>a.currentTime>0,await audio.elementHandle(),{timeout:10000});await audio.evaluate(a=>a.pause());
  if(!base.includes('127.0.0.1')){await audio.evaluate(async a=>{await new Promise((resolve,reject)=>{a.addEventListener('seeked',resolve,{once:true});a.addEventListener('error',reject,{once:true});a.currentTime=10;});});assert.ok(await audio.evaluate(a=>a.paused&&Math.abs(a.currentTime-10)<0.25));}
  await card.getByRole('radio').first().check();await card.locator('summary').click();assert.ok(await card.locator('[data-story-transcript]').isVisible());
 }
 assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.deepEqual(await context.cookies(),[]);
 assert.ok(requests.every(r=>r.method==='GET'));assert.ok(requests.every(r=>new URL(r.url).origin===base));assert.ok(requests.every(r=>!new URL(r.url).pathname.startsWith('/api/')));
 await page.setViewportSize({width:390,height:900});await page.reload();await page.locator('[data-story]').nth(2).waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 if(name==='chromium')await page.screenshot({path:'.test-output/demo-mobile.png'});
 report.push({browser:name,routes:7,stories:4,audiosPlayedAndPaused:4,audioSeeking:base.includes('127.0.0.1')?'not-qualified-emulator-no-range':'4-passed',contactDemoOnly:true,noAPI:true,noStorage:true,noExternalRequests:true});
 }finally{await browser.close();}
}
writeFileSync('.test-output/demo-check-results.json',JSON.stringify({base,report},null,2));console.log(JSON.stringify(report));
