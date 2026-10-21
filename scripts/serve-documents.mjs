import {createServer} from 'node:http';
import {readFileSync,realpathSync,statSync} from 'node:fs';
import {resolve,relative,isAbsolute,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf'};
/** Local validation only. Private services must be routed separately by real hosting. */
export function documentsServer(directory){
 const root=realpathSync(directory);
 const file=(path)=>{const actual=realpathSync(resolve(root,'.'+path));const rel=relative(root,actual);if(rel.startsWith('..')||isAbsolute(rel)||!statSync(actual).isFile())throw Error('Not a public file');return readFileSync(actual);};
 return createServer((req,res)=>{
 res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Content-Type-Options','nosniff');
 const send=(code,bytes,type='text/plain; charset=utf-8')=>{res.statusCode=code;res.setHeader('Content-Type',type);res.setHeader('Content-Length',Buffer.byteLength(bytes));if(code!==200)res.setHeader('Cache-Control','no-store');res.end(req.method==='HEAD'?undefined:bytes);};
 if(req.method!=='GET'&&req.method!=='HEAD'){res.setHeader('Allow','GET, HEAD');send(405,'Method not allowed');return;}
 let path;try{path=decodeURIComponent((req.url??'/').split('?')[0]);}catch{send(400,'Invalid path');return;}
 if(!path.startsWith('/')||path.startsWith('//')||path.includes('\\')||path.includes('\0')||path.split('/').some(x=>x==='..'||x.startsWith('.'))){send(400,'Invalid path');return;}
 if(/^\/(api|admin)(\/|$)/i.test(path)){send(404,'Reserved route');return;}
 if(path==='/')path='/index.html';
 try{send(200,file(path),mime[extname(path)]??'application/octet-stream');}
 catch{if(!extname(path)||extname(path)==='.html'){try{send(404,file('/404.html'),mime['.html']);return;}catch{}}send(404,'Not found');}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const port=Number(process.argv[3]);if(!process.argv[2]||!Number.isInteger(port)||port<0||port>65535)throw Error('Usage: node scripts/serve-documents.mjs DIRECTORY PORT');
 const server=documentsServer(process.argv[2]);server.listen(port,'127.0.0.1');for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
}
