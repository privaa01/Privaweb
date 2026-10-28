import type {ContactContent} from '../content/contact.ts';

export const isSyntheticContactEmail=(email:string)=>/^[^\s@]+@example\.test$/i.test(email.trim());

/** An explicitly labelled local copy; never an editorial approval of the real content. */
export function syntheticContactContent(content:ContactContent):ContactContent {
 const copy=structuredClone(content);
 copy.testOnly=true;
 copy.notice={...copy.notice,channel:'',text:'Modo de prueba local: usa únicamente un alias y un mensaje ficticios y un correo del dominio example.test, por ejemplo prueba@example.test. La consulta se guarda en una base local privada de pruebas. No se envían correos ni se atienden consultas reales. No introduzcas datos personales reales.'};
 return copy;
}
