import {fields,type Validation,type ContactInput,type FieldErrors} from './contact-contract.ts';
export function validateContact(raw:unknown):Validation {
 const input=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
 const errors:FieldErrors={}; const value={} as ContactInput;
 for(const field of fields){
  const v=input[field]; value[field]=typeof v==='string'?v.trim():'';
  if(!value[field]) errors[field]='required';
  else if(Array.from(value[field]).length>({nameOrAlias:60,email:254,message:1500}[field]))errors[field]='length';
 }
 if(!errors.email&&(!/^[^\s@<>]+@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/u.test(value.email)||/[\u0000-\u001f\u007f]/u.test(value.email)))errors.email='format';
 return Object.keys(errors).length?{ok:false,errors}:{ok:true,value:Object.freeze(value)};
}
