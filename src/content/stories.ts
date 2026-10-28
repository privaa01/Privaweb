import approvedReviews from './stories-review.json' with { type: 'json' };
import { instagram, type SocialLink } from '../config/social.ts';
import { officialBrand, visualReference } from '../config/brand.ts';
import type { ImageResource, Review } from './home.ts';
export const storiesClosingText = 'Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.';
export const catalogCopy={title:'Historias que te pueden pasar a ti.',description:'Escucha, reflexiona y participa. Cada historia es una recreación educativa para que identifiques riesgos y conozcas prácticas de cuidado de tus datos.'};
export const methodSteps=[{title:'1. Escucha',description:'Recreaciones educativas narradas'},{title:'2. Reflexiona',description:'Identifica el punto débil'},{title:'3. Aplica',description:'Aprende a protegerte'}];
export const initialStoryIds = ['enlace-falso','llamada-sospechosa','contrasena-compartida'] as const;
export { initialStoryImages } from './story-images.ts';
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
const image=(block:'hero'|'identidad'|'cierre',file:string):ImageResource=>({block,src:`/images/stories/${file}.png`,alt:'',width:500,height:350,purpose:'decorativo',status:'verificado',sourceReference:'Imágenes aportadas por la usuaria y recibidas en GitHub6e7f523; inspección y dimensiones PNG verificadas,2026-10-26. Inventario: specs/003-historias-educativas/evidence/materials.md'});
// Public copy approved explicitly on 2026-10-28; exercises/catalog publication are separate.
export const storiesContent:StoriesData={testOnly:false,
 hero:{title:'Aprende con recreaciones educativas sobre riesgos digitales.',description:'Escucha recreaciones educativas en formato audio o mini podcast y descubre cómo pequeñas decisiones y descuidos cotidianos pueden poner tus datos en riesgo.',image:image('hero','aprende'),review:review()},
 method:{title:'Identifica el error y aprende',description:'Cada historia te muestra cómo un descuido puede convertirse en un riesgo real. Escucha, analiza y descubre buenas prácticas de prevención digital para tu vida diaria.',image:image('identidad','identifica'),review:review()},
 closing:{title:'Sigue explorando, aprende y mantente seguro.',description:storiesClosingText,image:image('cierre','explora'),review:review()},
 identity:[{title:'Somos Priva',description:'Una plataforma creada para ayudarte a entender, proteger y gestionar tus datos personales. Creemos en un internet más transparente, libre y seguro donde la información sea un derecho inalienable.',href:'/index.html#somos-priva',review:review()},{title:'Informamos para que estés en control.',description:'Compartimos información educativa sobre privacidad digital para ayudarte a reconocer riesgos y tomar decisiones informadas sobre tus datos.',href:'/index.html#que-hacemos',review:review()}],
 brand:{block:'marca',src:officialBrand.src,alt:'Priva',width:officialBrand.width!,height:officialBrand.height!,purpose:'informativo',status:'verificado',sourceReference:'disenovisual/Link-PrivaHome.png — recurso compartido identificado por la usuaria'},social:instagram,endpoint:'/api/public/historias',mediaOrigins:[],
 visual:{typography:{status:'verificado',sourceReference:visualReference+' — Plus Jakarta Sans local con licencia OFL'},palette:{status:'verificado',sourceReference:visualReference}},
};

// Frozen approved text snapshots: material edits invalidate the publication review.
[storiesContent.hero,storiesContent.method,storiesContent.closing,...storiesContent.identity].forEach((block,index)=>{
 block.review={...approvedReviews[index],status:'revisado'};
});
