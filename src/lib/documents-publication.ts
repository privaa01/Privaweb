import {lstatSync,readFileSync} from 'node:fs';
import {documentPaths,operationLabels,requiredSections,retentionText,erasureText,noticeText,type DocumentBundle,type TextId} from '../content/documents.ts';
import {bundleHash,textHash} from './documents-review.ts';
const filled=(s:unknown):s is string=>typeof s==='string'&&s.trim().length>0&&!/\[[^\]]+\]|\b(?:COMPLETAR|TODO|TKTK)\b/i.test(s);
const fixedPaths=new Set<string>([...Object.values(documentPaths),'/index.html','/historias.html#casos','/app.html#como-funciona','/app.html#descarga','/contacto.html#escribir']);
export function safeDocumentHref(s:string){if(fixedPaths.has(s))return true;try{const u=new URL(s);return !u.username&&!u.password&&(u.protocol==='https:'&&!!u.hostname||u.protocol==='mailto:'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.pathname)&&!u.search&&!u.hash);}catch{return false;}}
export function documentsIssues(b:DocumentBundle,now=Date.now()):string[]{
 const issues:string[]=[];
 try{
 if(b.testOnly||b.language!=='es'||!filled(b.revision))issues.push('bundle');
 for(const key of Object.keys(operationLabels))if(!filled(b.operation[key as keyof typeof b.operation]))issues.push('operation:'+key);
 if(!safeDocumentHref(b.operation.channel)||!safeDocumentHref(b.operation.contact))issues.push('operation:channel/contact');
 for(const id of ['terms','manifesto'] as const){const d=b.documents[id];
 if(d.path!==documentPaths[id]||!filled(d.title)||!/^\d{4}-\d{2}-\d{2}$/.test(d.effectiveDate)||!Number.isFinite(Date.parse(d.effectiveDate)))issues.push('document:'+id);
 const ids=d.sections.map(s=>s.id);if(new Set(ids).size!==ids.length||!requiredSections[id].every(k=>ids.includes(k)))issues.push('sections:'+id);
 for(const s of d.sections){if(!/^[a-z][a-z0-9-]*$/.test(s.id)||!filled(s.title)||!s.paragraphs.length||s.paragraphs.some(p=>!filled(p)))issues.push('content:'+id);for(const l of s.links??[])if(!filled(l.label)||!safeDocumentHref(l.href))issues.push('links:'+id);}
 }
 if(b.notice.responsible!==b.operation.responsible||b.notice.channel!==b.operation.channel||b.notice.manifesto!==documentPaths.manifesto||b.notice.text!==noticeText)issues.push('notice');
 // These shared policy paragraphs are the approved009 baseline, not independent editable policies.
 const m=b.documents.manifesto;
 if(!m.sections.find(s=>s.id==='conservacion')?.paragraphs.includes(retentionText)||!m.sections.find(s=>s.id==='eliminacion')?.paragraphs.includes(erasureText))issues.push('policy');
 const terms=b.documents.terms.sections.find(s=>s.id==='condiciones')?.paragraphs??[];
 const op=m.sections.find(s=>s.id==='operacion')?.paragraphs??[];
 if(!(['responsible','contact','permissions'] as const).every(k=>terms.includes(operationLabels[k]+': '+b.operation[k]))||!Object.entries(operationLabels).every(([k,label])=>op.includes(label+': '+b.operation[k as keyof typeof b.operation])))issues.push('operation:content');
 const bh=bundleHash(b);
 for(const id of ['terms','manifesto','notice'] as TextId[]){const v=b.reviews[id];let referenceOK=false;try{const st=lstatSync(v.reference);referenceOK=st.isFile()&&!st.isSymbolicLink()&&st.size>0&&st.size<=1048576; if(referenceOK)readFileSync(v.reference);}catch{}
 if(v.status!=='revisado'||!filled(v.reviewer)||!filled(v.reference)||!referenceOK||!Number.isFinite(Date.parse(v.date))||Date.parse(v.date)>now||v.sha256!==textHash(b,id)||v.bundleHash!==bh)issues.push('review:'+id);
 }
 }catch{issues.push('invalid:bundle');}
 return [...new Set(issues)];
}
