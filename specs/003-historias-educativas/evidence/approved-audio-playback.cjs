// Local codec/control check of approved originals via Blob URLs; not site integration.
const {createRequire}=require('node:module');
const {readFileSync,writeFileSync}=require('node:fs');
const {join}=require('node:path');
const {createHash}=require('node:crypto');
const req=createRequire(join(process.cwd(),'package.json'));
const pw=req('@playwright/test');const engine=process.argv[2]||'chromium';
(async()=>{
 const manifest=JSON.parse(readFileSync('content/stories/audio/manifest.json','utf8'));
 const browser=await pw[engine].launch(engine==='chromium'?{executablePath:'/usr/bin/chromium'}:{});
 const results=[];
 try{
  const page=await browser.newPage();
  for(const source of manifest.files){
   const bytes=readFileSync(join('content/stories/audio',source.file));
   if(createHash('sha256').update(bytes).digest('hex')!==source.sha256)throw Error('El audio cambió desde la aprobación');
   await page.setContent('<button type="button" onclick="document.querySelector(\'audio\').play()">Reproducir</button><audio controls preload="metadata"></audio>');
   const url=await page.evaluate(({encoded,mime})=>{
    const data=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([data],{type:mime}));
    const audio=document.querySelector('audio');audio.src=url;audio.muted=true;return url;
   },{encoded:bytes.toString('base64'),mime:source.mime});
   const audio=page.locator('audio');
   await pw.expect.poll(()=>audio.evaluate(a=>Number.isFinite(a.duration)&&a.duration>0)).toBe(true);
   const duration=await audio.evaluate(a=>a.duration);pw.expect(Math.abs(duration-source.durationSeconds)).toBeLessThan(.2);
   await page.getByRole('button',{name:'Reproducir',exact:true}).click();await pw.expect.poll(()=>audio.evaluate(a=>a.currentTime)).toBeGreaterThan(.05);
   await audio.evaluate(a=>{a.pause();a.currentTime=10;});await pw.expect.poll(()=>audio.evaluate(a=>Math.abs(a.currentTime-10))).toBeLessThan(.2);pw.expect(await audio.evaluate(a=>a.paused)).toBe(true);
   await page.evaluate(u=>URL.revokeObjectURL(u),url);
   results.push({file:source.file,storyId:source.storyId,title:source.title||null,duration,result:'passed'});console.log('PASS '+source.file);
  }
 }finally{await browser.close();}
 writeFileSync(`specs/003-historias-educativas/evidence/approved-audio-${engine}.json`,JSON.stringify({engine,scope:'approved source audio Blob codec/controls; no publication or delivery claim',results},null,2)+'\n');
})().catch(error=>{console.error(error);process.exitCode=1;});
