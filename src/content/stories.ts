import { instagram, type SocialLink } from '../config/social.ts';
import type { ImageResource, Review } from './home.ts';
export const storiesClosingText = 'Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.';
export const catalogCopy={title:'Historias que te pueden pasar a ti.',description:'Escucha, reflexiona y participa. Cada historia está basada en situaciones reales para que identifiques errores comunes y aprendas a proteger tus datos.'};
export const methodSteps=[{title:'1. Escucha',description:'Relatos reales narrados'},{title:'2. Reflexiona',description:'Identifica el punto débil'},{title:'3. Aplica',description:'Aprende a protegerte'}];
export const initialStoryIds = ['enlace-falso','llamada-sospechosa','contrasena-compartida'] as const;
export const referenceOptions = [
 ['Hacer clic en un enlace desconocido','Compartir sus datos bancarios','No verificar el remitente'],
 ['Compartir código de autenticación en llamada','Ceder ante la falsa urgencia o presión','No colgar y verificar con la app bancaria oficial'],
 ['Reutilizar claves en múltiples servicios','Anotar contraseñas en chats sin cifrado','No activar autenticación de dos pasos (2FA)'],
];
export interface StoriesBlock { title:string; description:string; image:ImageResource; review:Review }
export interface StoriesData {
 testOnly:boolean; hero:StoriesBlock; method:StoriesBlock; closing:StoriesBlock;
 identity: { title:string; description:string; href:string; review:Review }[];
 brand:ImageResource; social:SocialLink; endpoint:string; mediaOrigins:string[];
 visual:{ typography: {status:string;sourceReference:string};palette:{status:string;sourceReference:string} };
}
const review=():Review=>({status:'pendiente',decisionReference:'',reviewedText:''});
const image=(block:ImageResource['block']):ImageResource=>({block,src:'',alt:'',width:0,height:0,purpose:'decorativo',status:'pendiente',sourceReference:''});
// Text transcribed from PDF2; capabilities/testimony and official assets remain unapproved.
export const storiesContent:StoriesData={testOnly:false,
 hero:{title:'Aprende de casos reales sobre robo de datos.',description:'Escucha relatos reales en formato audio o mini podcast y descubre cómo pequeñas decisiones y descuidos cotidianos pueden poner tus datos en riesgo.',image:image('hero'),review:review()},
 method:{title:'Identifica el error y aprende',description:'Cada historia te muestra cómo un descuido puede convertirse en un riesgo real. Escucha, analiza y descubre buenas prácticas de prevención digital para tu vida diaria.',image:image('identidad'),review:review()},
 closing:{title:'Sigue explorando, aprende y mantente seguro.',description:storiesClosingText,image:image('cierre'),review:review()},
 identity:[{title:'Somos Priva',description:'Una plataforma creada para ayudarte a entender, proteger y gestionar tus datos personales. Creemos en un internet más transparente, libre y seguro donde la información sea un derecho inalienable.',href:'/index.html#somos-priva',review:review()},{title:'Informamos para que estés en control.',description:'A través de historias reales, herramientas prácticas, auditorías y recursos educativos continuos, te damos acceso a conocimiento claro sin tecnicismos innecesarios ni sesgos comerciales.',href:'/index.html#que-hacemos',review:review()}],
 brand:image('marca'),social:instagram,endpoint:'/api/public/historias',mediaOrigins:[],
 visual:{typography:{status:'pendiente',sourceReference:''},palette:{status:'pendiente',sourceReference:''}},
};
