// Persistent loopback-only administrative profile. Not production startup.
import {createServer} from 'node:https';
import {readFileSync,realpathSync,lstatSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {X509Certificate,randomUUID,createHash} from 'node:crypto';
import {openAdminRuntime} from './runtime.ts';
import {AdminService} from './service.ts';
import {RecoveryService} from './recovery.ts';
import {createAdminHandler,securityHeaders} from './http.ts';
import {composeStories} from '../stories/composition.ts';
import {composeLocalInbox} from '../inbox/local.ts';
import {localBootstrap,localJson,localSetupBody,type LocalOwner} from './local-bootstrap.ts';
import {AdminError} from '../../src/lib/admin-contract.ts';
import {sharedLock} from '../privacy/maintenance.ts';
if(process.env.PRIVA_ADMIN_MODE!=='local'||!process.env.PRIVA_ADMIN_LOCAL_CONFIG)throw Error('Explicit local configuration required');
const configPath=realpathSync(process.env.PRIVA_ADMIN_LOCAL_CONFIG);if((lstatSync(configPath).mode&0o077)!==0)throw Error('Local configuration must be private');
const config=JSON.parse(readFileSync(configPath,'utf8')) as {directory:string;owner:LocalOwner;certificate:string;key:string;origin:string};
const origin=new URL(config.origin);if(origin.protocol!=='https:'||origin.hostname!=='localhost'||!origin.port||origin.origin!==config.origin)throw Error('Local origin must be a canonical HTTPS localhost origin with a port');
for(const path of [config.certificate,config.key])if(realpathSync(path)!==resolve(path))throw Error('Unsafe TLS path');
if((lstatSync(config.key).mode&0o077)!==0)throw Error('TLS key must be private');const leaf=new X509Certificate(readFileSync(config.certificate));if(!leaf.checkHost('localhost')||Date.now()>Date.parse(leaf.validTo))throw Error('Local TLS certificate invalid');
const runtime=openAdminRuntime(config.directory,[resolve('.'),resolve('public'),resolve('dist'),resolve('.demo-dist'),resolve('.private-build')]);
const releasePrivacyLock=await sharedLock(join(config.directory,'contact.sqlite.maintenance.lock'));
const inbox=composeLocalInbox({repository:runtime.repository,directory:config.directory,origin:origin.origin,csrfKey:runtime.csrfKey});
const bootstrap=localBootstrap(runtime,config.owner,origin.origin),stories=composeStories({repository:runtime.repository,directory:config.directory,origin:origin.origin,csrfKey:runtime.csrfKey,contactDatabase:inbox.contactDatabase});
const handler=createAdminHandler({...runtime,service:new AdminService(runtime.repository,runtime.hasher,runtime.abuseKey),recovery:new RecoveryService(runtime.repository,runtime.hasher,runtime.abuseKey,runtime.mailKey,origin.origin),origin:origin.origin,viewsRoot:resolve('.private-build/admin'),stories:stories.handler,inbox:inbox.handler});
const instance=randomUUID();
const setupFiles=new Map([['/admin/configurar',['index.html','text/html']],['/admin/local-setup.js',['setup.js','text/javascript']],['/admin/local-setup.css',['setup.css','text/css']]]);
const server=createServer({cert:readFileSync(config.certificate),key:readFileSync(config.key),minVersion:'TLSv1.2'},async(req,res)=>{
 for(const [key,value]of Object.entries(securityHeaders))res.setHeader(key,value);
 try{
  if(req.headers.host!==origin.host||!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress??''))return localJson(res,403,{result:'forbidden'});
  const path=new URL(req.url??'/',origin).pathname;
  if(path==='/api/local/estado'&&req.method==='GET')return localJson(res,200,{application:'priva-local-admin',configured:bootstrap.ready(),instance});
  if(setupFiles.has(path)){
   if(req.method!=='GET'&&req.method!=='HEAD')return localJson(res,405,{result:'method_not_allowed'});
   if(bootstrap.ready()){res.writeHead(303,{Location:'/admin/login'});res.end();return;}
   const [file,type]=setupFiles.get(path)!;res.setHeader('Content-Type',type+'; charset=utf-8');res.end(req.method==='HEAD'?undefined:readFileSync(new URL('./local-setup/'+file,import.meta.url)));return;
  }
  if(path==='/api/local/configuracion'){
   if(req.method!=='POST')return localJson(res,405,{result:'method_not_allowed'});
   if(req.headers.origin!==origin.origin||req.headers['sec-fetch-site']==='cross-site')return localJson(res,403,{result:'forbidden'});
   const result=await bootstrap.apply(req.headers['x-priva-setup'],await localSetupBody(req));return localJson(res,200,result);
  }
  // No email provider is configured for this local stage; never queue a fictitious delivery.
  if(path==='/api/admin/recuperar'&&req.method==='POST')return localJson(res,503,{result:'mail_unavailable'});
  if(path==='/historias.html') {const html=readFileSync('.demo-dist/historias.html','utf8');const hashes=(tag:string)=>[...html.matchAll(new RegExp('<'+tag+'(?![^>]*\\bsrc=)[^>]*>([\\s\\S]*?)</'+tag+'>','g'))].map(match=>"'sha256-"+createHash('sha256').update(match[1]).digest('base64')+"'").join(' ');res.setHeader('Content-Security-Policy',securityHeaders['Content-Security-Policy']+"; style-src-elem 'self' "+hashes('style')+"; script-src-elem 'self' "+hashes('script'));res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return;}
  if(path.startsWith('/demo/')) {if(path!=='/demo/catalog.json')return localJson(res,404,{result:'not_found'});return localJson(res,200,stories.service.catalog());}
  // Public demo assets are a fixed build snapshot; no private media directories are exposed.
  if(/^\/(?:_astro|images|brand|fonts)\/[A-Za-z0-9_./-]+$/.test(path)&&!path.includes('..')){
   const root=realpathSync('.demo-dist'),target=resolve(root,'.'+path);let stat;try{stat=lstatSync(target);}catch{return localJson(res,404,{result:'not_found'});}if(!target.startsWith(root+'/')||!stat.isFile()||stat.isSymbolicLink()||realpathSync(target)!==target)return localJson(res,404,{result:'not_found'});
   const ext=target.split('.').pop();const types:Record<string,string>={js:'text/javascript',css:'text/css',png:'image/png',svg:'image/svg+xml',ttf:'font/ttf',woff2:'font/woff2'};if(!types[ext??''])return localJson(res,404,{result:'not_found'});res.setHeader('Content-Type',types[ext!]);res.end(readFileSync(target));return;
  }
  await handler(req,res);
 }catch(error){if(res.headersSent){res.destroy();return;}localJson(res,error instanceof AdminError?error.status:503,{result:error instanceof AdminError?error.result:'unavailable'});}
});
server.requestTimeout=30000;server.headersTimeout=30000;server.listen(Number(origin.port),'127.0.0.1',()=>console.log('Priva local admin ready at '+origin.origin+'/admin/login'));
writeFileSync(join(config.directory,'local.pid'),JSON.stringify({pid:process.pid,instance,supervisorPid:Number(process.env.PRIVA_LOCAL_SUPERVISOR_PID)||undefined}),{mode:0o600});
// Contact retention is supervised outside this process so cleanup can drain all connections.
const maintenance=setInterval(()=>{runtime.repository.purge();stories.media.cleanup();},60000);
function stop(){clearInterval(maintenance);server.close(async()=>{inbox.repository.close();runtime.repository.close();await releasePrivacyLock();process.exit(0);});server.closeIdleConnections();}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
