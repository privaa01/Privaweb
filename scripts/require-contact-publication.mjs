import {resolve} from 'node:path';
import {contactContent,contactReadiness} from '../src/config/contact.ts';
import {assertContactPublication} from '../src/lib/contact-publication.ts';
try{assertContactPublication(contactContent,contactReadiness,resolve('public'));}catch(e){console.error(e.message);process.exit(1);}
