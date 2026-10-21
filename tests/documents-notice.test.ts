import test from 'node:test';import assert from 'node:assert/strict';
import {draftContact} from '../src/content/contact.ts';import {documents} from '../src/config/documents.ts';import {instagram} from '../src/config/social.ts';import {dataWarning} from '../src/content/documents.ts';
test('V05 Contacto consumes canonical notice including required precautions',()=>{const c=draftContact(instagram);assert.deepEqual(c.notice,documents.notice);assert(c.notice.text.includes('90 días'));assert(c.notice.text.includes('no se publican'));assert(c.notice.text.includes(dataWarning));});
