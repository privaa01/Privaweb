import {resolve} from 'node:path';
import {appContent} from '../src/content/app.ts';
import {appDownloadConfig} from '../src/config/app-downloads.ts';
import {assertAppPublication} from '../src/lib/app-publication.ts';
try{assertAppPublication(appContent,appDownloadConfig,resolve('public'));}
catch(error){console.error(error.message);process.exit(1);}
