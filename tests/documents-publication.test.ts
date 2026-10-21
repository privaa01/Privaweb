import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewedDocuments} from './helpers/documents-fixtures.ts';
import {draftDocuments} from '../src/content/documents.ts';
import {documentsIssues} from '../src/lib/documents-publication.ts';
import {canonical,bundleHash} from '../src/lib/documents-review.ts';
test('review binds content and public operation, independent of key ordering',()=>{const f=reviewedDocuments();try{assert.deepEqual(documentsIssues(f.b),[]);assert.equal(canonical({b:2,a:1}),canonical({a:1,b:2}));const h=bundleHash(f.b);f.b.reviews.terms.reviewer='Otro';assert.equal(bundleHash(f.b),h);f.b.documents.terms.sections[0].paragraphs[0]+=' cambiado';assert(documentsIssues(f.b).includes('review:terms'));}finally{f.close();}});
test('draft missing facts and review cannot publish',()=>{assert(documentsIssues(draftDocuments()).length>0);});
for(const [name,mutate] of Object.entries({
 fixture:(b:any)=>{b.testOnly=true;}, future:(b:any)=>{b.reviews.notice.date='2999-01-01';},reference:(b:any)=>{b.reviews.terms.reference='/nonexistent';},hash:(b:any)=>{b.reviews.manifesto.sha256='0'.repeat(64);},operation:(b:any)=>{b.operation.copies='';},placeholder:(b:any)=>{b.documents.terms.sections[0].paragraphs=['[COMPLETAR]'];},section:(b:any)=>{b.documents.manifesto.sections.pop();},unsafe:(b:any)=>{b.documents.terms.sections[0].links=[{label:'x',href:'javascript:alert(1)'}];},path:(b:any)=>{b.documents.terms.path='/falsa';},notice:(b:any)=>{b.notice.text='24 horas garantizadas';},policy:(b:any)=>{b.documents.manifesto.sections[1].paragraphs=['30 días'];},blank:(b:any)=>{b.documents.terms.sections[0].title='';}
}))test('reject '+name,()=>{const f=reviewedDocuments();try{mutate(f.b);assert(documentsIssues(f.b).length>0);}finally{f.close();}});
