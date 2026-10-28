import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';
import {macosSandboxProfile} from '../server/stories/macos-media.ts';
import {mediaBinary} from '../server/stories/macos-media.ts';
import {runSandbox} from '../server/stories/media.ts';

if(process.platform==='darwin')test('native macOS denies private reads/writes/network/fork and enforces CPU/memory/output/deadline', {timeout:40000},async()=>{
 const directory=mkdtempSync(join(realpathSync(tmpdir()),'priva-macos-policy-'));
 try{
  const input=join(directory,'input'),secret=join(directory,'secret'),output=join(directory,'output'),probe=join(directory,'probe');
  writeFileSync(input,'synthetic');writeFileSync(secret,'synthetic private sentinel');
  execFileSync('/usr/bin/clang',['-O0','-Wall','-Wextra','-Werror',resolve('tests/fixtures/story-management-service/macos-policy-probe.c'),'-o',probe]);
  const supervisor=resolve('.tools/ffmpeg/9.0/bin/priva-media-supervisor');
  const profile=macosSandboxProfile(input,probe);
  const invoke=(args:string[],timeout=5000)=>spawnSync(supervisor,['/usr/bin/sandbox-exec','-p',profile,probe,...args],{env:{},encoding:'utf8',timeout});
  const checked=invoke(['denials',input,secret,output]);
  assert.equal(checked.status,0,checked.stderr);assert.match(checked.stdout,/policy-denials-verified/);
  assert.equal(invoke(['memory']).status,137,'supervisor must kill excess physical memory');
  assert.equal(invoke(['cpu'],27000).status,152,'kernel CPU quota must terminate worker');
  const wave=join(directory,'audio.wav');
  execFileSync(mediaBinary('ffmpeg'),['-v','error','-f','lavfi','-i','sine=frequency=440:duration=5','-threads','1',wave]);
  await assert.rejects(()=>runSandbox(wave,'ffprobe',['-v','error','-show_packets','-show_data','-of','json','/input']));
  await assert.rejects(()=>runSandbox(wave,'ffprobe',['-v','error','-show_format','/input'],1));
 }finally{rmSync(directory,{recursive:true,force:true});}
});
