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
const pendingReview = (): Review => ({ status: 'pendiente', decisionReference: '', reviewedText: '' });
const missingImage = (block: ImageResource['block']): ImageResource => ({ block, status: 'pendiente', src: '', width: 0, height: 0, purpose: 'decorativo', alt: '', sourceReference: '' });
// References are not claims of verified services. Real publication remains blocked by reviews.
export const homeContent: HomeData = {
 testOnly: false,
 hero: { id: 'hero', eyebrow: 'TUS DATOS, TU DERECHO', title: 'La privacidad también es una forma de libertad.', description: 'Información y herramientas para proteger tus datos personales y tomar decisiones seguras, conscientes y sin fricciones en el mundo digital.', image: missingImage('hero') },
 identity: { id: 'somos-priva', eyebrow: 'QUIÉNES SOMOS', title: 'Somos Priva', description: 'Una plataforma creada para ayudarte a entender, proteger y gestionar tus datos personales. Creemos en un internet más transparente, libre y seguro, donde la información sea un derecho inalienable y nunca un riesgo.', image: missingImage('identidad') },
 areas: { id: 'que-hacemos', eyebrow: 'QUÉ HACEMOS', title: 'Informamos para que estés en control.', description: 'Información clara, herramientas útiles y acompañamiento práctico para cuidar tu privacidad en el entorno digital de manera constante y comprensible.', review: pendingReview(), cards: [
 { title: 'Educación Digital', description: 'Guías claras, prácticas y accesibles para navegar en la web sin dejar rastros involuntarios.', review: pendingReview() },
 { title: 'Historias reales', description: 'Conoce experiencias que te ayudarán a estar más alerta y preparado.', review: pendingReview() },
 { title: 'Herramientas Seguras', description: 'Curaduría periódica de navegadores, VPNs y suites encriptadas con privacidad por diseño.', review: pendingReview() },
 { title: 'Acompañamiento', description: 'Protocolos de acción y asistencia para la eliminación de datos y respuesta ante filtraciones.', review: pendingReview() },
 ] },
 closing: { id: 'cierre', eyebrow: 'TU PRIVACIDAD IMPORTA', title: 'Infórmate, protégete, conéctate con seguridad.', description: closingText, image: missingImage('cierre') },
 brand: missingImage('marca'),
 visual: { typography: { status: 'pendiente', sourceReference: '' }, palette: { status: 'pendiente', sourceReference: '' } },
};
