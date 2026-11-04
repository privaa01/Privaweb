// Test-bank transport only; never imported by the production service.
import {createServer as httpServer, type RequestListener} from 'node:http';
import {createServer as httpsServer} from 'node:https';
import {createSecureContext} from 'node:tls';
import {X509Certificate} from 'node:crypto';
import {readFileSync,realpathSync,statSync} from 'node:fs';
import {isAbsolute,relative,resolve,sep} from 'node:path';
export function testTransport(env:NodeJS.ProcessEnv=process.env){
 const certificate=env.PRIVA_ADMIN_TEST_TLS_CERT,keyPath=env.PRIVA_ADMIN_TEST_TLS_KEY;
 if(Boolean(certificate)!==Boolean(keyPath))throw Error('TLS fixture requires both certificate and private key paths.');
 if(!certificate||!keyPath)return {origin:'http://localhost:4329',listen:(handler:RequestListener)=>httpServer(handler)};
 for(const path of [certificate,keyPath]){
  if(!isAbsolute(path))throw Error('TLS fixture paths must be absolute.');
  const real=realpathSync(path);
  for(const root of ['public','dist','.demo-dist','.private-build/admin']){
   const rel=relative(resolve(root),real);if(rel===''||(!rel.startsWith('..'+sep)&&rel!=='..'&&!isAbsolute(rel)))throw Error('TLS fixture material must stay outside served roots.');
  }
 }
 if((statSync(realpathSync(keyPath)).mode&0o077)!==0)throw Error('TLS private key must have private file permissions.');
 const cert=readFileSync(certificate),key=readFileSync(keyPath),leaf=new X509Certificate(cert);
 if(!leaf.checkHost('localhost')||Date.now()<Date.parse(leaf.validFrom)||Date.now()>Date.parse(leaf.validTo))throw Error('TLS certificate must be current and cover localhost.');
 createSecureContext({cert,key,minVersion:'TLSv1.2'});
 return {origin:'https://localhost:4329',listen:(handler:RequestListener)=>httpsServer({cert,key,minVersion:'TLSv1.2'},handler)};
}
