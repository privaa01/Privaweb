import {evidenceIssues} from '../server/privacy/readiness.ts';
if(evidenceIssues().length){console.error('BLOQUEADO 009: canal, conservación, copias, recuperación y rastreo sin calificar.');process.exitCode=1;}
