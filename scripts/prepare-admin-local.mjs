// Private operator preparation; credentials never enter the web application or logs.
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync,chmodSync,existsSync,realpathSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';
import {randomBytes,createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
const root=resolve('.'),tools=resolve('.tools/admin-local-tls');
const directory=resolve(process.env.PRIVA_ADMIN_LOCAL_DATA_DIR??join(homedir(),'Library','Application Support','Priva','local-admin'));
mkdirSync(directory,{recursive:true,mode:0o700});chmodSync(directory,0o700);
const configPath=join(directory,'local-config.json'),openPath=join(directory,'open-url.txt');
if(existsSync(configPath)&&existsSync(join(directory,'admin.sqlite'))){
 const config=JSON.parse(readFileSync(configPath,'utf8'));const db=new DatabaseSync(join(directory,'admin.sqlite'),{readOnly:true});let ready;try{ready=Boolean(db.prepare('SELECT passwordRecord FROM admin_accounts WHERE emailKey=?').get(config.owner.email.toLowerCase())?.passwordRecord);}finally{db.close();}
 if(ready){writeFileSync(openPath,'https://localhost:4354/admin/login',{mode:0o600});console.log('Local account already configured; preserved.');process.exit(0);}
}
if(!process.env.FIREBASE_TOOLS_LIB)throw Error('FIREBASE_TOOLS_LIB is required to verify the signed-in operator identity once.');
const req=createRequire(resolve(process.env.FIREBASE_TOOLS_LIB,'index.js'));const auth=req('./auth'),{requireAuth}=req('./requireAuth'),{Client}=req('./apiv2');const options={project:'priva-785cb',nonInteractive:true};auth.setActiveAccount(options,auth.getGlobalDefaultAccount());await requireAuth(options);
const client=new Client({urlPrefix:'https://www.googleapis.com',apiVersion:'oauth2/v2'});const profile=(await client.get('/userinfo')).body;
if(profile.verified_email!==true||typeof profile.email!=='string')throw Error('The operator email must be verified by Google.');
const token=randomBytes(32).toString('base64url');
const config={directory:realpathSync(directory),origin:'https://localhost:4354',certificate:join(tools,'localhost.pem'),key:join(tools,'localhost-key.pem'),owner:{email:profile.email.toLowerCase(),verifiedBy:'google-userinfo',verifiedAt:Date.now(),tokenDigest:createHash('sha256').update(token).digest('hex'),expiresAt:Date.now()+30*60*1000}};
writeFileSync(configPath,JSON.stringify(config),{mode:0o600});writeFileSync(openPath,config.origin+'/admin/configurar#setup='+token,{mode:0o600});writeFileSync(resolve('.tools/admin-local-code.txt'),token,{mode:0o600});
console.log('Verified operator and prepared one-time local setup. No account or password created.');
