import {draftDocuments,applyOperation} from '../../../src/content/documents.ts';
export const content=draftDocuments();
content.testOnly=true;content.revision='synthetic-browser';
content.operation={responsible:'Equipo sintético',contact:'mailto:equipo@example.test',channel:'mailto:datos@example.test',providers:'Proveedor sintético de correo',location:'Ubicación de prueba',copies:'Copias de prueba, ciclo separado',categories:'Políticas de prueba de cuentas, historias y registros separadas',cookies:'Cookie necesaria de sesión administrativa en el servicio privado',permissions:'Permisos sintéticos',evidence:'Referencia de prueba'};
applyOperation(content);
for(const d of Object.values(content.documents))d.effectiveDate='2026-01-01';
