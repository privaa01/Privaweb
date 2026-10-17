export interface PublicImage { src:string;alt:string;width:number;height:number }
export interface PublicStory { id:string;title:string;category:string;description:string;image:PublicImage;audio:{src:string;type:string};transcript:string;question:string;options:{id:string;label:string;explanation:string}[] }
export interface PublicCatalog { schemaVersion:1;stories:PublicStory[] }
export interface CatalogPolicy { baseURL:string;mediaOrigins:readonly string[] }
const fail=():never=>{throw new Error('Catálogo público inválido.');};
function record(value:unknown,keys:string[]):Record<string,unknown>{
 if(!value||typeof value!=='object'||Array.isArray(value))return fail();
 const obj=value as Record<string,unknown>;
 if(Object.keys(obj).length!==keys.length||keys.some(k=>!Object.hasOwn(obj,k)))return fail();
 return obj;
}
function text(v:unknown):string{if(typeof v!=='string'||!v.trim())return fail();return v;}
function id(v:unknown):string{const s=text(v);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s))return fail();return s;}
export function safeMediaURL(v:unknown,policy:CatalogPolicy):string{
 const src=text(v);let decoded:string;
 try{decoded=decodeURIComponent(src);}catch{return fail();}
 if(/[\\\s]/.test(src)||decoded.includes('..')||/[\\%]/.test(decoded))return fail();
 const url=new URL(src,policy.baseURL), base=new URL(policy.baseURL);
 if(url.username||url.password||url.hash||url.search)return fail();
 if(url.origin===base.origin){
  if(!src.startsWith('/')||src.startsWith('//')||!/^\/(images\/stories|media\/public|brand)\/[A-Za-z0-9_./-]+$/.test(url.pathname))return fail();
 }else if(url.protocol!=='https:'||!policy.mediaOrigins.includes(url.origin))return fail();
 return src;
}
export function parseCatalog(value:unknown,policy:CatalogPolicy):PublicCatalog{
 const c=record(value,['schemaVersion','stories']);if(c.schemaVersion!==1||!Array.isArray(c.stories))return fail();
 const ids=new Set<string>();
 const stories=c.stories.map(v=>{
  const s=record(v,['id','title','category','description','image','audio','transcript','question','options']);
  const storyId=id(s.id);if(ids.has(storyId))return fail();ids.add(storyId);
  const img=record(s.image,['src','alt','width','height']);
  if(typeof img.width!=='number'||typeof img.height!=='number'||!Number.isFinite(img.width)||!Number.isFinite(img.height)||img.width<=0||img.height<=0)return fail();
  const audio=record(s.audio,['src','type']);const type=text(audio.type);
  if(!/^audio\/[a-z0-9.+-]+$/i.test(type))return fail();
  if(s.question!=='¿QUÉ ERROR SE COMETIÓ?'||!Array.isArray(s.options)||s.options.length!==3)return fail();
  const optionIds=new Set<string>();
  const options=s.options.map(v=>{const o=record(v,['id','label','explanation']);const optionId=id(o.id);if(optionIds.has(optionId))return fail();optionIds.add(optionId);return{id:optionId,label:text(o.label),explanation:text(o.explanation)};});
  return {id:storyId,title:text(s.title),category:text(s.category),description:text(s.description),image:{src:safeMediaURL(img.src,policy),alt:text(img.alt),width:img.width,height:img.height},audio:{src:safeMediaURL(audio.src,policy),type},transcript:text(s.transcript),question:text(s.question),options};
 });
 return{schemaVersion:1,stories};
}
