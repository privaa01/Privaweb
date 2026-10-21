import {documents} from '../src/config/documents.ts';
import {documentsIssues} from '../src/lib/documents-publication.ts';
import {evidenceIssues} from '../server/privacy/readiness.ts';
const issues=[...documentsIssues(documents),...evidenceIssues()];
if(issues.length){console.error('BLOQUEADO010: documentos, revisión o calificación operativa pendientes: '+issues.join(', '));process.exitCode=1;}
