import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateContact} from '../src/lib/contact-validation.ts';
const good={nameOrAlias:'Alias',email:'prueba@example.test',message:'Consulta sintética'};
for(const [field,max] of [['nameOrAlias',60],['message',1500]] as const){
 for(const n of [0,1,max,max+1]) test(`${field} frontera ${n}`,()=>assert.equal(validateContact({...good,[field]:'a'.repeat(n)}).ok,n>0&&n<=max));
 test(`${field} emoji puntos de código`,()=>assert.equal(validateContact({...good,[field]:'😀'.repeat(max)}).ok,true));
 test(`${field} combinantes`,()=>assert.equal(validateContact({...good,[field]:'á'.repeat(max)}).ok,false));
}
for(const field of ['nameOrAlias','email','message'] as const){
 for(const value of [undefined,null,42,'   ','\t\n'])test(`${field} inválido ${JSON.stringify(value)}`,()=>assert.equal(validateContact({...good,[field]:value}).ok,false));
}
for(const email of ['a@b.test','á@dominio.test','a+b@sub.example.test'])test(`correo válido ${email}`,()=>assert.equal(validateContact({...good,email}).ok,true));
for(const email of ['a@b','a@@b.test','a b@b.test','a@.test','a@b..test','a@b.test\u0000','a'.repeat(255)+'@b.test'])test(`correo inválido ${JSON.stringify(email)}`,()=>assert.equal(validateContact({...good,email}).ok,false));
test('trim preserva interior y caso',()=>{const r=validateContact({...good,nameOrAlias:'  Á  B  ',email:'  A@B.test ',message:'  x\n y  '});assert.deepEqual(r,{ok:true,value:{nameOrAlias:'Á  B',email:'A@B.test',message:'x\n y'}});});
test('sin objeto es inválido',()=>assert.equal(validateContact(null).ok,false));
