import {draftContact} from '../../../../src/content/contact';
export const content=draftContact({url:'https://www.instagram.com/priva_fixture/',status:'verificado',reviewRef:'FIXTURE: no cuenta oficial'});
content.testOnly=true;content.notice.responsible='Equipo sintético de pruebas';content.notice.channel='mailto:fixture@example.test';
content.image={src:'/images/contact/test-hero.svg',alt:'Ilustración sintética de contacto, no recurso oficial',width:600,height:400,status:'verificado',reference:'FIXTURE'};
content.brand={src:'/images/contact/test-brand.svg',alt:'Marca de prueba',width:120,height:40,status:'verificado',reference:'FIXTURE'};
