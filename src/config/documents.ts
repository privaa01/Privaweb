import {draftDocuments,applyOperation} from '../content/documents.ts';
export const documents=draftDocuments();
// Public facts supplied by the project owner; not operational qualification or editorial approval.
documents.operation.responsible='Priva';
documents.operation.contact='mailto:Priva202611@gmail.com';
documents.operation.channel='mailto:Priva202611@gmail.com';
applyOperation(documents);
