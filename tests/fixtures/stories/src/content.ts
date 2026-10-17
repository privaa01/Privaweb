import { storiesContent, initialStoryIds, referenceOptions } from '../../../../src/content/stories.ts';
export const fixtureContent=structuredClone(storiesContent);
fixtureContent.testOnly=true;
for(const [name,block] of Object.entries({hero:fixtureContent.hero,method:fixtureContent.method,closing:fixtureContent.closing})){
 block.description ||= `Texto de prueba para ${name}; no es contenido oficial.`;
 block.title ||= 'Continúa aprendiendo — título de prueba';
 block.image={...block.image,src:'/images/stories/test-image.svg',alt:'Recurso sintético de prueba',width:640,height:400};
}
for(const item of fixtureContent.identity)item.description='Descripción institucional de prueba, no publicable.';
fixtureContent.brand={...fixtureContent.brand,src:'/images/stories/test-image.svg',alt:'Priva — marca de prueba',width:640,height:400};
fixtureContent.social={url:'https://www.instagram.com/priva_fixture_no_oficial/',status:'pendiente',reviewRef:''};
const titles=['Enlace falso','La llamada sospechosa','La contraseña compartida','Nuevo caso de prueba'];
export const fixtureCatalog={schemaVersion:1,stories:titles.map((title,i)=>({id:initialStoryIds[i]||'nuevo-caso',title,category:['Phishing','Ingeniería social','Contraseñas','Prueba'][i],description:`Relato sintético ${i+1}, no testimonio real.`,image:{src:'/images/stories/test-image.svg',alt:'Imagen de prueba',width:640,height:400},audio:{src:`/media/public/test-audio-${i%3}.wav`,type:'audio/wav'},transcript:`Transcripción de prueba ${i+1}: tono sintético sin voz, no relato final.`,question:'¿QUÉ ERROR SE COMETIÓ?',options:(referenceOptions[i%3]).map((label,j)=>({id:`opcion-${j+1}`,label,explanation:`Explicación de prueba ${i+1}.${j+1}: riesgo simulado; prevención de prueba. No validada para el relato final.`}))}))};
export const privateFixtureRecords=[{id:'borrador',status:'draft',email:'private@example.test'},{id:'inactiva',active:false,email:'private2@example.test'}];
