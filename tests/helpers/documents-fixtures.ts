import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {draftDocuments,applyOperation,type TextId} from '../../src/content/documents.ts';
import {bundleHash,textHash} from '../../src/lib/documents-review.ts';
export function reviewedDocuments(){
 const dir=mkdtempSync(join(tmpdir(),'priva010-'));const b=draftDocuments();
 b.revision='synthetic-010';
 b.operation={responsible:'Responsable sintético',contact:'mailto:equipo@example.test',channel:'mailto:datos@example.test',providers:'Proveedor de prueba, correo y datos',location:'Ubicación sintética',copies:'Copias sintéticas: ciclo separado verificado solo en prueba',categories:'Cuentas, historias y registros: políticas de prueba separadas, sin heredar Contacto',cookies:'Cookie necesaria de sesión administrativa, no publicitaria; inventario de prueba',permissions:'Permisos de contenido y condiciones sintéticos',evidence:'Expediente sintético'};
 applyOperation(b);for(const doc of Object.values(b.documents))doc.effectiveDate='2026-01-01';
 const reference=join(dir,'review.txt');writeFileSync(reference,'Revisión exclusivamente sintética de pruebas');
 for(const id of ['terms','manifesto','notice'] as TextId[])b.reviews[id]={status:'revisado',reviewer:'Revisor sintético',date:'2026-01-01',reference,sha256:textHash(b,id),bundleHash:bundleHash(b)};
 return {b,dir,close:()=>rmSync(dir,{recursive:true,force:true})};
}
