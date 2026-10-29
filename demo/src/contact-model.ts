export const demoContact = {
 project:'priva-785cb',database:'(default)',collection:'demo_contact',revision:'demo-contact-v1',email:'prueba@example.test',
 aliases:['Visitante de prueba','Equipo de prueba'],
 messages:['Mensaje ficticio para probar el formulario.','Prueba educativa sobre privacidad.','Comprobación de conexión con Firestore.'],
} as const;
export function demoWrite(id:string,alias:string,message:string,consent:boolean){
 if(!/^[a-f0-9-]{36}$/.test(id)||!demoContact.aliases.includes(alias as never)||!demoContact.messages.includes(message as never)||!consent)throw Error('Selecciona los datos de prueba y confirma el modo demo.');
 const name=`projects/${demoContact.project}/databases/${demoContact.database}/documents/${demoContact.collection}/${id}`;
 return {writes:[{update:{name,fields:{mode:{stringValue:'demo'},revision:{stringValue:demoContact.revision},nameOrAlias:{stringValue:alias},email:{stringValue:demoContact.email},message:{stringValue:message},consent:{booleanValue:true}}},updateTransforms:[{fieldPath:'createdAt',setToServerValue:'REQUEST_TIME'}],currentDocument:{exists:false}}]};
}
export const demoEndpoint=`https://firestore.googleapis.com/v1/projects/${demoContact.project}/databases/${demoContact.database}/documents:commit`;
