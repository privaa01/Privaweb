import {officialBrand,visualReference} from '../config/brand.ts';
export type ReviewState = 'pendiente' | 'revisado';
export interface Review { status: ReviewState; decisionReference: string; reviewedText: string }
export interface ImageResource {
 block: 'hero' | 'identidad' | 'cierre' | 'marca'; status: 'pendiente' | 'verificado';
 src: string; width: number; height: number; purpose: 'informativo' | 'decorativo'; alt: string; sourceReference: string;
}
export interface Block { id: string; eyebrow: string; title: string; description: string; image: ImageResource }
export interface Area { title: string; description: string; review: Review }
export interface HomeData {
 testOnly: boolean;
 hero: Block; identity: Block; closing: Block;
 areas: { id: 'que-hacemos'; eyebrow: string; title: string; description: string; review: Review; cards: Area[] };
 brand: ImageResource;
 visual: { typography: { status: 'pendiente' | 'verificado'; sourceReference: string }; palette: { status: 'pendiente' | 'verificado'; sourceReference: string } };
}
export const closingText = 'Aprende a reconocer riesgos y toma decisiones más informadas sobre tus datos personales.';
export const areaTitles = ['Educación Digital', 'Historias reales', 'Herramientas Seguras', 'Acompañamiento'] as const;
const approvedReview = (reviewedText: string): Review => ({ status: 'revisado', decisionReference: 'specs/002-inicio-institucional/evidence/editorial-review.md — aprobación explícita de la usuaria, 2026-10-21', reviewedText });
const officialHomeImage = (block: 'hero' | 'identidad' | 'cierre'): ImageResource => ({ block, status: 'verificado', src: `/images/home/${block}.png`, width: 500, height: 350, purpose: 'decorativo', alt: '', sourceReference: 'Imágenes de Inicio aportadas e identificadas por la usuaria; carga GitHub 10e683a, 2026-10-23. Inventario: specs/002-inicio-institucional/evidence/resources.md' });
// Educational copy approved; official institutional images received and inspected.
export const homeContent: HomeData = {
 testOnly: false,
 hero: { id: 'hero', eyebrow: 'TUS DATOS, TU DERECHO', title: 'La privacidad también es una forma de libertad.', description: 'Información y herramientas para proteger tus datos personales y tomar decisiones seguras, conscientes y sin fricciones en el mundo digital.', image: officialHomeImage('hero') },
 identity: { id: 'somos-priva', eyebrow: 'QUIÉNES SOMOS', title: 'Somos Priva', description: 'Una plataforma creada para ayudarte a entender, proteger y gestionar tus datos personales. Creemos en un internet más transparente, libre y seguro, donde la información sea un derecho inalienable y nunca un riesgo.', image: officialHomeImage('identidad') },
 areas: { id: 'que-hacemos', eyebrow: 'QUÉ HACEMOS', title: 'Informamos para que estés en control.', description: 'Compartimos información educativa sobre privacidad digital para ayudarte a reconocer riesgos y tomar decisiones informadas sobre tus datos.', review: approvedReview('Compartimos información educativa sobre privacidad digital para ayudarte a reconocer riesgos y tomar decisiones informadas sobre tus datos.'), cards: [
 { title: 'Educación Digital', description: 'Contenidos educativos para comprender riesgos digitales y conocer prácticas de cuidado de tus datos personales.', review: approvedReview('Contenidos educativos para comprender riesgos digitales y conocer prácticas de cuidado de tus datos personales.') },
 { title: 'Historias reales', description: 'Relatos educativos para reflexionar sobre riesgos de privacidad y aprender formas de prevención.', review: approvedReview('Relatos educativos para reflexionar sobre riesgos de privacidad y aprender formas de prevención.') },
 { title: 'Herramientas Seguras', description: 'Orientación educativa sobre herramientas y prácticas para cuidar tus datos.', review: approvedReview('Orientación educativa sobre herramientas y prácticas para cuidar tus datos.') },
 { title: 'Acompañamiento', description: 'Información para reconocer riesgos y preparar decisiones sobre el cuidado de tus datos personales.', review: approvedReview('Información para reconocer riesgos y preparar decisiones sobre el cuidado de tus datos personales.') },
 ] },
 closing: { id: 'cierre', eyebrow: 'TU PRIVACIDAD IMPORTA', title: 'Infórmate, protégete, conéctate con seguridad.', description: closingText, image: officialHomeImage('cierre') },
 brand: {block:'marca',status:'verificado',src:officialBrand.src,width:officialBrand.width!,height:officialBrand.height!,purpose:'informativo',alt:'Priva',sourceReference:'disenovisual/Link-PrivaHome.png — identificado como oficial por la usuaria,2026-10-20'},
 visual: { typography: { status: 'verificado', sourceReference: visualReference+' — Plus Jakarta Sans local con OFL, public/fonts/' }, palette: { status: 'verificado', sourceReference: visualReference } },
};
