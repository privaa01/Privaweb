// Reproducer for local review of the real guarded Home entry; not site integration.
const {createRequire}=require('node:module');
const {resolve,join}=require('node:path');
const {writeFileSync}=require('node:fs');
const assert=require('node:assert/strict');
const req=createRequire(join(resolve(__dirname,'../../..'),'package.json'));
const pw=req('@playwright/test');
const AxeBuilder=req('@axe-core/playwright').default;
const engine=process.argv[2]||'chromium';
const base='http://127.0.0.1:4327';
const results=[];
let browser;
async function run(name,fn){
 try {await fn();results.push({name,status:'passed'});console.log('PASS '+name);}
 catch(error){results.push({name,status:'failed',error:error.stack});console.error('FAIL '+name+': '+error.message);}
}
async function loaded(page,decode=true){
 for(const image of await page.locator('.home img').all()){
  await image.scrollIntoViewIfNeeded();
  await pw.expect.poll(()=>image.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
  if(decode)await image.evaluate(i=>i.decode());
  assert.deepEqual(await image.evaluate(i=>[i.naturalWidth,i.naturalHeight]),[500,350]);
 }
}
async function heading(page,anchor){
 const h=page.locator(`#${anchor} h2`);
 await pw.expect(h).toBeFocused();await pw.expect(h).toBeInViewport();
 await pw.expect.poll(async()=> (await h.boundingBox())?.y??-1).toBeGreaterThanOrEqual(0);
}
(async()=>{
 try {
  browser=await pw[engine].launch(engine==='chromium'?{executablePath:'/usr/bin/chromium'}:{});
  const widths=engine==='chromium'?[360,390,430,768,1024,1280,1440]:[390,1440];
  for(const width of widths)for(const percent of [100,200])await run(`${width}px text ${percent}%`,async()=>{
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   const page=await context.newPage();const remote=[];
   page.on('request',r=>{if(!r.url().startsWith(base+'/'))remote.push(r.url());});
   try{
    await page.addInitScript(size=>document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.fontSize=`${size}px`),16*percent/100);
    const response=await page.goto(base+'/index.html');assert.equal(response.status(),200);
    await pw.expect(page.getByRole('heading',{level:1})).toHaveCount(1);
    await pw.expect(page.getByText(/banco de pruebas|recurso ficticio/i)).toHaveCount(0);
    assert.deepEqual(await page.locator('.home > section').evaluateAll(nodes=>nodes.map(n=>n.id)),['hero','somos-priva','que-hacemos','cierre']);
    await pw.expect(page.locator('#que-hacemos h3')).toHaveText(['Educación Digital','Historias reales','Herramientas Seguras','Acompañamiento']);
    await pw.expect(page.locator('#que-hacemos a, #que-hacemos button, #que-hacemos [tabindex="0"]')).toHaveCount(0);
    assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize),`${16*percent/100}px`);
    await loaded(page);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.goto(base+'/index.html');
    const violations=(await new AxeBuilder({page}).analyze()).violations;
    assert.deepEqual(violations.map(v=>({id:v.id,impact:v.impact})),[]);
    for(const keyboard of [false,true]){
     await page.goto(base+'/index.html');
     const learn=page.getByRole('main').getByRole('link',{name:'Conocer más',exact:true});
     if(keyboard){await learn.focus();await page.keyboard.press('Enter');}else await learn.click();
     await heading(page,'somos-priva');
     await page.keyboard.press('Tab');
     await pw.expect(page.getByRole('main').getByRole('link',{name:'Explora nuestras historias',exact:true})).toBeFocused();
    }
    for(const anchor of ['somos-priva','que-hacemos']){
     await page.goto('about:blank'); // A direct entry is a new document, not reactivating the current fragment programmatically.
     await page.goto(`${base}/index.html#${anchor}`);await heading(page,anchor);
     await page.reload();await heading(page,anchor);
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    for(const link of await page.locator('.home a').all()){
     await link.focus();assert((await link.boundingBox()).height>=44);
     assert.notEqual(await link.evaluate(e=>getComputedStyle(e).outlineStyle),'none');
    }
    // Destination integration is deliberately left to the real-site suite.
    await pw.expect(page.getByRole('main').getByRole('link',{name:'Explora nuestras historias',exact:true})).toHaveAttribute('href','/historias.html');
    assert.deepEqual(await context.cookies(),[]);
    assert.deepEqual(await page.evaluate(()=>[localStorage.length,sessionStorage.length]),[0,0]);
    assert.deepEqual(remote,[]);
    if(engine==='chromium'&&[390,1440].includes(width)&&percent===100){
     await page.goto(base+'/index.html');await loaded(page);await page.evaluate(()=>scrollTo(0,0));
     await page.screenshot({path:join(__dirname,`final-review-${width}.png`),fullPage:true});
    }
   }finally{await context.close();}
  });
  for(const block of ['hero','identidad','cierre'])await run(`failed official image ${block}`,async()=>{
   const context=await browser.newContext();const page=await context.newPage();
   try{
    await page.route(`**/images/home/${block}.png`,r=>r.abort());await page.goto(base+'/index.html');
    const img=page.locator(`img[src="/images/home/${block}.png"]`);await img.scrollIntoViewIfNeeded();
    await pw.expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth===0)).toBe(true);
    await pw.expect(img).toHaveAttribute('alt','');
    await page.getByRole('main').getByRole('link',{name:'Conocer más',exact:true}).click();await heading(page,'somos-priva');
    await pw.expect(page.getByRole('main').getByRole('link',{name:'Explora nuestras historias',exact:true})).toBeVisible();
   }finally{await context.close();}
  });
  await run('real home without JavaScript',async()=>{
   const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();
   try{
    await page.goto(base+'/index.html');await pw.expect(page.getByRole('heading',{level:1})).toBeVisible();await loaded(page,false);
    await page.getByRole('main').getByRole('link',{name:'Conocer más',exact:true}).click();
    await pw.expect(page.locator('#somos-priva h2')).toBeInViewport();
    await pw.expect(page.getByRole('main').getByRole('link',{name:'Explora nuestras historias',exact:true})).toHaveAttribute('href','/historias.html');
   }finally{await context.close();}
  });
 }catch(error){results.push({name:'browser launch',status:'blocked',error:error.stack});console.error(error.message);}
 finally{
  if(browser)await browser.close();
  const report={recordedAt:new Date().toISOString(),scope:'isolated real Home entry, not site integration',engine,version:browser?.version(),base,results};
  writeFileSync(join(__dirname,`final-review-${engine}.json`),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({engine,passed:results.filter(r=>r.status==='passed').length,failed:results.filter(r=>r.status==='failed').length,blocked:results.filter(r=>r.status==='blocked').length}));
  if(results.some(r=>r.status!=='passed'))process.exitCode=1;
 }
})();
