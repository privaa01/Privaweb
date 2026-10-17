import {resolve,relative,isAbsolute,extname,join} from 'node:path';import {readFileSync,realpathSync,existsSync,unlinkSync} from 'node:fs';
import {openContactRuntime} from '../../../server/contact/runtime.ts';import {contactServer} from '../../../server/contact/http.ts';
const root=realpathSync(resolve('.test-output/contact')),data=resolve('.test-output/contact-service-data'),fault=join(data,'fault');
function consume(value:string){if(existsSync(fault)&&readFileSync(fault,'utf8')===value){unlinkSync(fault);return true;}return false;}
const runtime=openContactRuntime(data,[root,resolve('public'),resolve('dist')],{failure:stage=>{if(stage==='beforeCommit'&&consume('before'))throw new Error('synthetic before commit');}});
const server=contactServer(runtime.service,{origin:'http://127.0.0.1:4327',afterSubmit:()=>consume('after')?'corrupt':false,staticHandler:(req,res)=>{
 try{if(req.method!=='GET'&&req.method!=='HEAD')throw new Error();const path=decodeURIComponent(new URL(req.url??'/','http://localhost').pathname);const file=realpathSync(resolve(root,'.'+(path==='/'?'/contacto.html':path))),rel=relative(root,file);if(rel.startsWith('..')||isAbsolute(rel))throw new Error();const body=readFileSync(file);res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'} as Record<string,string>)[extname(file)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404);res.end('Not found');}
}});
server.listen(4327,'127.0.0.1');
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>server.close(()=>{runtime.repository.close();process.exit(0);}));
