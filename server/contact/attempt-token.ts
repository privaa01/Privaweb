import {randomBytes,createHmac,timingSafeEqual} from 'node:crypto';
import {openSync,readFileSync,writeFileSync,closeSync,lstatSync} from 'node:fs';
import type {SignedAttempt} from '../../src/lib/contact-contract.ts';
export const validityMs=24*60*60*1000;
export class AttemptTokens {
 readonly key:Buffer; readonly clock:()=>number;
 constructor(key:Buffer,clock:()=>number=Date.now){this.clock=clock;if(key.length!==32)throw new Error('Invalid signing key');this.key=key;}
 issue():SignedAttempt{const now=this.clock(),id=randomBytes(32).toString('base64url');const payload=Buffer.from(JSON.stringify({v:1,id,iat:now,exp:now+validityMs})).toString('base64url');return {attemptId:id,token:payload+'.'+this.sign(payload),expiresAt:new Date(now+validityMs).toISOString()};}
 private sign(payload:string){return createHmac('sha256',this.key).update(payload).digest('base64url');}
 verify(id:string,token:string):{expiresAt:number}|null{
  try{if(!/^[A-Za-z0-9_-]{43}$/.test(id)||token.length>1024||! /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(token))return null;const parts=token.split('.');if(parts.length!==2)return null;const a=Buffer.from(parts[1]!,'ascii'),b=Buffer.from(this.sign(parts[0]!),'ascii');if(a.length!==b.length||!timingSafeEqual(a,b))return null;const p=JSON.parse(Buffer.from(parts[0]!,'base64url').toString('utf8'));if(p.v!==1||p.id!==id||!Number.isSafeInteger(p.iat)||p.iat>this.clock()||p.exp!==p.iat+validityMs||p.exp<=this.clock())return null;return {expiresAt:p.exp};}catch{return null;}
 }
}
export function loadSigningKey(path:string):Buffer {
 try{const fd=openSync(path,'wx',0o600);try{writeFileSync(fd,randomBytes(32));}finally{closeSync(fd);}}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;}
 const stat=lstatSync(path);if(!stat.isFile()||stat.isSymbolicLink()||(stat.mode&0o077)!==0)throw new Error('Unsafe signing key');
 const key=readFileSync(path);if(key.length!==32)throw new Error('Invalid signing key');return key;
}
