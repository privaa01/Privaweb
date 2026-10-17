import { resolve } from 'node:path';
import { storiesContent } from '../src/content/stories.ts';
import { assertStoriesPublication } from '../src/lib/stories-publication.ts';
try{assertStoriesPublication(storiesContent,resolve('public'));}
catch(error){console.error(error.message);process.exit(1);}
