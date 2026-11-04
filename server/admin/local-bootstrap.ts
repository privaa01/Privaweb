// Explicit local operator bootstrap. Never imported by production startup.
import {createHash,timingSafeEqual} from 'node:crypto';
import type {IncomingMessage,ServerResponse} from 'node:http';
import type {openAdminRuntime} from './runtime.ts';
import {AdminError} from '../../src/lib/admin-contract.ts';
import {validateNewPassword,validateEmail} from '../../src/lib/admin-validation.ts';
export interface LocalOwner {email:string;verifiedAt:number;verifiedBy:'google-userinfo';tokenDigest:string;expiresAt:number}
export function localBootstrap(runtime:ReturnType<typeof openAdminRuntime>,owner:LocalOwner,origin:string){
 if(process.env.PRIVA_ADMIN_MODE!=='local'||!validateEmail(owner.email)||owner.verifiedBy!=='google-userinfo'||!Number.isFinite(owner.expiresAt)||!Number.isFinite(owner.verifiedAt)||owner.verifiedAt>Date.now()||!/^https:\/\/localhost:\d+$/.test(origin)||!/^[a-f0-9]{64}$/.test(owner.tokenDigest))throw Error('Invalid local owner configuration');
 const ready=()=>Boolean(runtime.repository.findAccount(owner.email)?.passwordRecord);
 function authorize(token:unknown){
  if(ready()||Date.now()>owner.expiresAt)throw new AdminError(410,'setup_closed');
  if(typeof token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(token)||!timingSafeEqual(createHash('sha256').update(token).digest(),Buffer.from(owner.tokenDigest,'hex')))throw new AdminError(403,'forbidden');
 }
 return {ready,async apply(token:unknown,input:Record<string,unknown>){
  authorize(token);
  if(input.action==='context'&&Object.keys(input).length===1)return {email:owner.email};
  if(input.action!=='create'||Object.keys(input).sort().join(',')!=='action,confirmation,password'||!validateNewPassword(input.password)||input.password!==input.confirmation)throw new AdminError(422,'invalid_password');
  const hash=await runtime.hasher.hash(input.password);
  runtime.repository.transaction(()=>{
   authorize(token);
   if(runtime.repository.findAccount(owner.email))throw new AdminError(409,'account_exists');
   const account=runtime.repository.createAccount(owner.email);
   runtime.repository.db.prepare('UPDATE admin_accounts SET passwordRecord=?,mailboxVerifiedAt=?,updatedAt=? WHERE id=?').run(JSON.stringify(hash),owner.verifiedAt,Date.now(),account.id);
  });
  return {result:'configured'};
 }};
}
export async function localSetupBody(req:IncomingMessage){
 if(!/^application\/json(?:;\s*charset=utf-8)?$/i.test(req.headers['content-type']??''))throw new AdminError(415,'invalid');
 let size=0;const chunks:Buffer[]=[];for await(const chunk of req){size+=chunk.length;if(size>8192)throw new AdminError(413,'invalid');chunks.push(Buffer.from(chunk));}
 try{const value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)));if(!value||typeof value!=='object'||Array.isArray(value))throw Error();return value as Record<string,unknown>;}catch{throw new AdminError(400,'invalid');}
}
export function localJson(res:ServerResponse,status:number,value:unknown){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end(JSON.stringify(value));}
