import './require-privacy-publication.mjs';
import {inboxIssues} from '../src/config/inbox.ts';
if(inboxIssues().length){console.error('BLOQUEADO 008: correo, migración, privacidad y operación sin calificar.');process.exitCode=1;}
