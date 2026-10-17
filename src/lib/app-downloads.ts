export type Platform = 'android' | 'iphone';
export interface Verification { reviewedURL:string;platform:Platform;decisionReference:string;checkedAt:string;appIdentity:string;accessibleAtReview:boolean }
export interface DownloadConfig { platform:Platform;status:'pendiente'|'verificado';candidateURL:string|null;verification:Verification|null }
export type EffectiveDownload = {platform:Platform;state:'pending';label:'Próximamente'} | {platform:Platform;state:'available';label:string;href:string};
export type AvailabilityMask = '00'|'10'|'01'|'11';
export const platforms:readonly Platform[]=['android','iphone'];
export function reviewToday():string {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const get=(key:string)=>parts.find(p=>p.type===key)!.value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
function record(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==='object'&&!Array.isArray(v);}
function dateValid(v:unknown):v is string {
 if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;
 const date=new Date(`${v}T00:00:00Z`);return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===v;
}
export function verifiedEntry(value:unknown,today=reviewToday()):value is DownloadConfig {
 if(!record(value)||!platforms.includes(value.platform as Platform)||value.status!=='verificado'||typeof value.candidateURL!=='string')return false;
 const raw=value.candidateURL;
 if(!/^https:\/\//i.test(raw)||/[\s\u0000-\u001f\u007f\\]/.test(raw))return false;
 try{const url=new URL(raw);if(url.protocol!=='https:'||!url.hostname||url.username||url.password)return false;}catch{return false;}
 const review=value.verification;
 return record(review)&&review.reviewedURL===raw&&review.platform===value.platform&&typeof review.decisionReference==='string'&&!!review.decisionReference.trim()&&dateValid(review.checkedAt)&&dateValid(today)&&review.checkedAt<=today&&review.appIdentity==='Priva App'&&review.accessibleAtReview===true;
}
export function resolveDownloads(value:unknown,today=reviewToday()):EffectiveDownload[] {
 const records=Array.isArray(value)?value:[];
 return platforms.map(platform=>{
  const matches=records.filter(v=>record(v)&&v.platform===platform),entry=matches[0];
  if(matches.length===1&&verifiedEntry(entry,today))return{platform,state:'available',label:platform==='android'?'Descargar para Android':'Descargar para iPhone',href:entry.candidateURL!};
  return{platform,state:'pending',label:'Próximamente'};
 });
}
export function availabilityMask(downloads:readonly EffectiveDownload[]):AvailabilityMask {
 return platforms.map(platform=>downloads.find(d=>d.platform===platform)?.state==='available'?'1':'0').join('') as AvailabilityMask;
}
