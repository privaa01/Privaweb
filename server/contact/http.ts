import {createServer,type IncomingMessage,type ServerResponse} from 'node:http';
import {TextDecoder} from 'node:util';
import {ContactService} from './service.ts';
export interface HttpOptions {origin:string;afterSubmit?:()=>boolean|'corrupt';staticHandler?:(req:IncomingMessage,res:ServerResponse)=>void}
function reply(res:ServerResponse,status:number,body:unknown){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));}
async function body(req:IncomingMessage):Promise<Record<string,unknown>>{
 const chunks:Buffer[]=[];let length=0;
 await new Promise<void>((resolve,reject)=>{req.on('data',(chunk:Buffer)=>{length+=chunk.length;if(length<=32768)chunks.push(chunk);});req.on('end',resolve);req.on('error',reject);req.on('aborted',()=>reject(new Error('aborted')));});
 if(length>32768)throw new Error('body limit');const text=new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks));const value:unknown=JSON.parse(text);
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('object required');return value as Record<string,unknown>;
}
export function contactServer(service:ContactService,options:HttpOptions){
 const expected=new URL(options.origin);if(expected.origin!==options.origin||!['http:','https:'].includes(expected.protocol)||(expected.protocol==='http:'&&!['localhost','127.0.0.1','[::1]'].includes(expected.hostname)))throw new Error('Unsafe public origin');
 const server=createServer(async(req,res)=>{
  const path=req.url?.split('?')[0];
  if(!path?.startsWith('/api/contacto')){if(options.staticHandler)return options.staticHandler(req,res);reply(res,404,{result:'unavailable'});return;}
  if(!['/api/contacto/intentos','/api/contacto/consultas'].includes(path)){reply(res,404,{result:'unavailable'});return;}
  if(req.method!=='POST'){reply(res,405,{result:'unavailable'});return;}
  if(req.headers.origin!==options.origin){reply(res,403,{result:'unavailable'});return;}
  if(req.headers['content-type']?.split(';')[0]?.trim().toLowerCase()!=='application/json'){reply(res,415,{result:'unavailable'});return;}
  let input:Record<string,unknown>;try{input=await body(req);}catch{reply(res,400,{result:'unavailable'});return;}
  if(path==='/api/contacto/intentos'){
   if(Object.keys(input).length){reply(res,400,{result:'unavailable'});return;}
   try{reply(res,201,service.issue());}catch{reply(res,503,{result:'unknown'});}return;
  }
  if(Object.keys(input).length!==5||Object.keys(input).some(k=>!['attemptId','token','nameOrAlias','email','message'].includes(k))||typeof input.attemptId!=='string'||typeof input.token!=='string'){reply(res,400,{result:'unavailable'});return;}
  try{const result=service.submit(input);const injected=options.afterSubmit?.();if(injected==='corrupt'){res.writeHead(201,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end('{');return;}if(injected){res.destroy();return;}
   reply(res,result.result==='stored'?(service.repository.lastWasInsert?201:200):result.result==='not_stored'?422:result.result==='conflict'?409:410,result);
  }catch{reply(res,503,{result:'unknown'});}
 });
 server.requestTimeout=30000;server.headersTimeout=10000;server.timeout=30000;
 return server;
}
