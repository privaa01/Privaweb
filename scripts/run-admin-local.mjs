import {spawn,execFileSync} from 'node:child_process';
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';
import {X509Certificate} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
const directory=resolve(process.env.PRIVA_ADMIN_LOCAL_DATA_DIR??join(homedir(),'Library/Application Support/Priva/local-admin'));
const configPath=join(directory,'local-config.json'),ca=resolve('.tools/admin-local-tls/ca.pem'),keychain=join(homedir(),'Library/Keychains/login.keychain-db');
if(process.env.PRIVA_LOCAL_TLS_TRUST!=='approved')throw Error('Local user-keychain TLS trust requires explicit authorization.');
if(!existsSync(ca))throw Error('Prepare the local TLS certificate first.');
const fingerprint=new X509Certificate(readFileSync(ca)).fingerprint.replaceAll(':','');
const env={...process.env,ASTRO_TELEMETRY_DISABLED:'1',PRIVA_ADMIN_MODE:'local',PRIVA_ADMIN_LOCAL_CONFIG:configPath,PRIVA_LOCAL_SUPERVISOR_PID:String(process.pid)};
for(const args of [['node_modules/astro/bin/astro.mjs','build','--root','server/admin/views'],['scripts/build-demo.mjs'],['scripts/prepare-admin-local.mjs']])execFileSync(process.execPath,args,{env,stdio:'ignore'});
const imported=join(directory,'initial-stories-imported.json');
if(!existsSync(imported)) {
 execFileSync(process.execPath,['scripts/publish-local-stories.ts','specs/003-historias-educativas/evidence/local-publication-authorization.json'],{env:{...env,PRIVA_STORIES_MODE:'local',PRIVA_STORIES_DATA_DIR:directory,PRIVA_STORIES_RECEIPT_DIR:directory},stdio:'ignore'});
 writeFileSync(imported,JSON.stringify({date:new Date().toISOString(),source:'four-local owner authorization'}),{mode:0o600});
}
const settingsPath=join(directory,'privacy-local-settings.json');
const privacy=existsSync(settingsPath)?JSON.parse(readFileSync(settingsPath,'utf8')):null;
if(privacy&&(privacy.backups!==false||privacy.mail!==false||privacy.retentionDays!==90||privacy.execution!=='computer'))throw Error('Unexpected local privacy policy');
let child,remoteChild,attempted=false,trusted=false,stopping=false,remoteTimer,localTimer;
const status={execution:'computer',backups:false,mail:false,local:null,firestore:null};
function saveStatus(){if(privacy)writeFileSync(join(directory,'privacy-status.json'),JSON.stringify(status),{mode:0o600});}
function localSweep(){
 if(!privacy||!existsSync(join(directory,'contact.sqlite')))return;
 try {execFileSync(process.execPath,['scripts/privacy-local-sweep.ts',directory],{env,stdio:'pipe',timeout:30000});status.local={result:'ok',checkedAt:new Date().toISOString()};saveStatus();}
 catch {status.local={result:'failed',checkedAt:new Date().toISOString()};saveStatus();throw Error('Local privacy maintenance failed; access remains stopped');}
}
function expiredLocalData(){
 const path=join(directory,'contact.sqlite');if(!existsSync(path))return false;
 const db=new DatabaseSync(path,{readOnly:true});
 try {return !!db.prepare('SELECT 1 FROM consultations WHERE lastActivityAt<=? LIMIT 1').get(new Date(Date.now()-90*86400000).toISOString())||!!db.prepare("SELECT 1 FROM attempts WHERE state!='COMMITTED' AND expiresAt<=? LIMIT 1").get(Date.now());}
 finally {db.close();}
}
async function remoteSweep(){
 if(!privacy||stopping||remoteChild)return;
 const job=spawn(process.execPath,['scripts/privacy-firestore.mjs','--execute-demo-only'],{env,stdio:['ignore','pipe','ignore']});remoteChild=job;
 let output='';job.stdout.on('data',chunk=>{if(output.length<8192)output+=chunk;});
 const deadline=setTimeout(()=>job.kill('SIGTERM'),30000);
 await new Promise(resolveJob=>{let finished=false;const finish=code=>{if(finished)return;finished=true;clearTimeout(deadline);remoteChild=undefined;
  let result;try{result=JSON.parse(output.trim().split('\n').at(-1));}catch{}
  status.firestore={result:code===0&&result?.event==='firestore_retention'?'ok':'failed',checkedAt:new Date().toISOString(),...(code===0&&result?.event==='firestore_retention'?{scanned:result.scanned,deleted:result.deleted}:{})};saveStatus();resolveJob();};job.once('error',()=>finish(-1));job.once('exit',finish);});
}
function stop(){stopping=true;clearInterval(localTimer);clearInterval(remoteTimer);remoteChild?.kill('SIGTERM');child?.kill('SIGTERM');}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
try {
 localSweep();
 attempted=true;execFileSync('/usr/bin/security',['add-trusted-cert','-r','trustRoot','-k',keychain,ca],{stdio:'ignore'});trusted=true;
 if(privacy){void remoteSweep();remoteTimer=setInterval(()=>void remoteSweep(),15*60000);}
 while(!stopping){
  let forMaintenance=false;
  child=spawn(process.execPath,['server/admin/local.ts'],{env,stdio:'inherit'});
  if(privacy)localTimer=setInterval(()=>{try{if(!stopping&&!forMaintenance&&expiredLocalData()){forMaintenance=true;child.kill('SIGTERM');}else if(!forMaintenance){status.local={result:'ok',checkedAt:new Date().toISOString()};saveStatus();}}catch{status.local={result:'failed',checkedAt:new Date().toISOString()};saveStatus();}},60000);
  const code=await new Promise((resolveChild,reject)=>{child.once('error',reject);child.once('exit',resolveChild);});
  clearInterval(localTimer);child=undefined;
  if(stopping)break;
  if(!forMaintenance){if(code!==0)throw Error('Local service stopped');break;}
  localSweep();
 }
} finally {
 stop();
 if(attempted)for(const args of [['remove-trusted-cert',ca],['delete-certificate','-Z',fingerprint,keychain]])try{execFileSync('/usr/bin/security',args,{stdio:'ignore'});}catch{if(trusted)console.error('Check local certificate cleanup for this Priva session.');}
}
