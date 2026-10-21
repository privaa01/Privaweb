import {createHash} from 'node:crypto';
import type {DocumentBundle,TextId} from '../content/documents.ts';
export function canonical(value:unknown):string {
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(value!==null&&typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b,'en')).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
 return JSON.stringify(value);
}
export const hash=(v:unknown)=>createHash('sha256').update(canonical(v)).digest('hex');
export function bundleHash(b:DocumentBundle){const {reviews,...content}=b;return hash(content);}
export function textHash(b:DocumentBundle,id:TextId){return hash({text:id==='notice'?b.notice:b.documents[id],operation:b.operation,revision:b.revision,trackingClaims:b.trackingClaims});}
