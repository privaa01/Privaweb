import {fileURLToPath} from 'node:url';
import {realpathSync} from 'node:fs';

export function mediaBinary(program:'ffprobe'|'ffmpeg'):string {
 return process.platform==='darwin'
  ?fileURLToPath(new URL(`../../.tools/ffmpeg/9.0/bin/${program}`,import.meta.url))
  :`/usr/bin/${program}`;
}
export function macosSandboxProfile(input:string,binary:string):string {
 const literal=(value:string)=>JSON.stringify(value);
 const profile=`(version 1)
 (deny default)
 (allow process-exec (literal ${literal(binary)}))
 (allow sysctl-read)
 (allow file-read-metadata)
 (allow file-read-data (require-all (literal "/") (vnode-type DIRECTORY)))
 (allow file-read* (literal ${literal(input)}) (literal ${literal(binary)})
  (subpath "/System/Library") (subpath "/usr/lib") (subpath "/Library/Apple/System/Library")
  (literal "/dev/null") (literal "/dev/urandom") (literal "/dev/random"))`;
 return profile;
}
export function macosSandboxCommand(path:string,program:'ffprobe'|'ffmpeg',args:string[]){
 const input=realpathSync(path),binary=realpathSync(mediaBinary(program));
 const profile=macosSandboxProfile(input,binary);
 return {command:fileURLToPath(new URL('../../.tools/ffmpeg/9.0/bin/priva-media-supervisor',import.meta.url)),
  args:['/usr/bin/sandbox-exec','-p',profile,binary,'-max_alloc','134217728',...args.map(arg=>arg==='/input'?input:arg)]};
}
