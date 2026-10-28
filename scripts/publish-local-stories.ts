// Explicit operator command. No HTTP route, credentials, fixture data or automatic startup.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {Readable} from 'node:stream';
import type {IncomingMessage} from 'node:http';
import {randomUUID,createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {openLocalStories,localStoriesDirectory} from '../server/stories/development.ts';
import {localStoryOperator} from '../server/stories/local-operator.ts';
import {importInitialStory} from '../server/stories/import.ts';
import {initialStoryImages} from '../src/content/story-images.ts';
import {validateDraft} from '../server/stories/validation.ts';
import {emptyDraft} from '../src/lib/story-management-contract.ts';
import {assertSyntheticOrigin} from '../server/contact/development.ts';

if(process.env.PRIVA_STORIES_MODE!=='local')throw Error('Publication command requires PRIVA_STORIES_MODE=local');
const reference=process.argv[2];
if(!reference)throw Error('A publication authorization file is required');
const mandate=JSON.parse(readFileSync(reference,'utf8'));
if(mandate.scope!=='four-local'||mandate.authorization!=='publica las historias'||mandate.fourthCover!=='reuse-llamada')throw Error('Unexpected authorization scope');
const root=resolve('.'),origin=process.env.PRIVA_STORIES_ORIGIN??'http://127.0.0.1:4321';
assertSyntheticOrigin(origin);
const runtime=openLocalStories(process.env.PRIVA_STORIES_DATA_DIR??localStoriesDirectory(root),root,origin);
const results=[];
try{
 const operator=localStoryOperator(runtime.repository.admin,runtime.media.directory);
 for(const id of ['enlace-falso','llamada-sospechosa','contrasena-compartida'] as const){
  const draft=JSON.parse(readFileSync(resolve(`content/stories/drafts/${id}.json`),'utf8'));
  draft.imageAlt=initialStoryImages[id].alt;
  const digest=createHash('sha256').update(JSON.stringify(draft)).digest('hex');
  if(mandate.stories[id]!==digest)throw Error(`Changed authorized content: ${id}`);
  validateDraft(draft);
  let story=await importInitialStory(operator.service,operator.media,operator.token,{id,working:draft,sourceReference:'content/stories/transcripts/TRANSCRIPCIONES.pdf; content/stories/audio/manifest.json',reviewReference:reference});
  // Never overwrite a story subsequently edited by its manager.
  const expected={...draft,imageResourceId:story.working.imageResourceId,audioResourceId:story.working.audioResourceId};
  if(JSON.stringify(validateDraft(expected,true))!==JSON.stringify(validateDraft(story.working,true)))throw Error(`Managed story differs: ${id}`);
  if(story.pendingChanges||!story.published){
   operator.service.change(operator.token,'publish',id,{operationId:randomUUID(),expectedRevision:story.revision});
   story=operator.service.get(operator.token,id);
  }
  if(!story.active)operator.service.change(operator.token,'activate',id,{operationId:randomUUID(),expectedRevision:story.revision,active:true});
  results.push({id,status:'published-active'});
 }
 const fourth=JSON.parse(readFileSync(resolve('content/stories/drafts/numero-desconocido.json'),'utf8'));
 fourth.imageAlt=initialStoryImages['llamada-sospechosa'].alt;
 if(createHash('sha256').update(JSON.stringify(fourth)).digest('hex')!==mandate.stories['numero-desconocido'])throw Error('Changed fourth authorized content');
 const receiptPath=resolve('specs/003-historias-educativas/evidence/local-fourth-receipt.json');
 let id=existsSync(receiptPath)?JSON.parse(readFileSync(receiptPath,'utf8')).storyId:null;
 if(!id){
  if(runtime.repository.all().some(story=>story.working.title===fourth.title))throw Error('Existing fourth story needs operator review');
  id=operator.service.change(operator.token,'create',null,{operationId:randomUUID(),working:emptyDraft()}).storyId;
  writeFileSync(receiptPath,JSON.stringify({scope:'local',storyId:id},null,2)+'\n');
 }
 let fourthStory=operator.service.get(operator.token,id);
 if(!fourthStory.published){
  const manifest=JSON.parse(readFileSync(resolve('content/stories/audio/manifest.json'),'utf8'));
  const audio=manifest.files.find((item:{materialKey:string})=>item.materialKey==='numero-desconocido');
  const audioBytes=readFileSync(resolve('content/stories/audio',audio.file));
  if(createHash('sha256').update(audioBytes).digest('hex')!==audio.sha256)throw Error('Changed fourth approved audio');
  const imageId=randomUUID(),audioId=randomUUID();
  for(const [resourceId,kind,bytes,mime] of [[imageId,'image',readFileSync(resolve('public/images/stories/llamada.png')),'image/png'],[audioId,'audio',audioBytes,'audio/mpeg']] as const){
   const stream=Readable.from([bytes]) as IncomingMessage;stream.headers={'content-type':mime};
   await operator.media.upload(operator.token,id,resourceId,kind,stream);
  }
  operator.service.change(operator.token,'save',id,{operationId:randomUUID(),expectedRevision:fourthStory.revision,working:{...fourth,imageResourceId:imageId,audioResourceId:audioId}});
  fourthStory=operator.service.get(operator.token,id);
  operator.service.change(operator.token,'publish',id,{operationId:randomUUID(),expectedRevision:fourthStory.revision});
  fourthStory=operator.service.get(operator.token,id);
 }
 const expectedFourth={...fourth,imageResourceId:fourthStory.working.imageResourceId,audioResourceId:fourthStory.working.audioResourceId};
 if(JSON.stringify(validateDraft(expectedFourth,true))!==JSON.stringify(validateDraft(fourthStory.working,true)))throw Error('Fourth managed story differs');
 if(!fourthStory.active)operator.service.change(operator.token,'activate',id,{operationId:randomUUID(),expectedRevision:fourthStory.revision,active:true});
 results.push({id,status:'published-active'});
 writeFileSync(resolve('.test-output/local-publication-result.json'),JSON.stringify({results,catalogIds:runtime.service.catalog().stories.map(story=>story.id)},null,2)+'\n');
 console.log(JSON.stringify(results));
}finally{runtime.close();}
