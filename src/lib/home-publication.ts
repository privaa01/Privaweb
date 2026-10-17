import { realpathSync, statSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { areaTitles, closingText, type HomeData } from '../content/home.ts';
export function publicationIssues(content: HomeData, publicRoot: string): string[] {
 const issues: string[] = [];
 if (content.testOnly) issues.push('contenido de fixture no publicable');
 if (content.hero.id !== 'hero' || content.identity.id !== 'somos-priva' || content.areas.id !== 'que-hacemos' || content.closing.id !== 'cierre') issues.push('anclas/orden de bloques inválidos');
 for (const entry of [content.hero, content.identity, content.areas, content.closing]) {
  if (![entry.eyebrow, entry.title, entry.description].every(x => typeof x === 'string' && x.trim())) issues.push(`${entry.id}: contenido incompleto`);
 }
 if (content.closing.description !== closingText) issues.push('cierre: texto C16 incorrecto');
 if (content.areas.cards.length !== 4 || content.areas.cards.some((card, i) => card.title !== areaTitles[i])) issues.push('tarjetas: títulos/orden incorrectos');
 for (const entry of [content.areas, ...content.areas.cards]) {
  if (!entry.description.trim() || entry.review.status !== 'revisado' || !entry.review.decisionReference.trim() || entry.review.reviewedText !== entry.description) issues.push(`${entry.title}: revisión editorial pendiente o inválida`);
 }
 const images = [content.hero.image, content.identity.image, content.closing.image, content.brand];
 for (const [index, image] of images.entries()) {
  const expectedBlock = ['hero', 'identidad', 'cierre', 'marca'][index];
  if (image.block !== expectedBlock || image.status !== 'verificado' || !image.sourceReference.trim()) issues.push(`${expectedBlock}: recurso oficial no verificado`);
  if (![image.width, image.height].every(n => Number.isFinite(n) && n > 0)) issues.push(`${expectedBlock}: dimensiones pendientes`);
  if (image.purpose === 'informativo' ? !image.alt.trim() : image.purpose !== 'decorativo' || image.alt !== '') issues.push(`${expectedBlock}: alternativa inválida`);
  const src = image.src;
  if (!/^\/(images\/home|brand)\/[A-Za-z0-9_./-]+\.(svg|png|jpe?g|webp|avif)$/i.test(src) || src.split('/').includes('..') || /fixture|test-brand/i.test(src)) {
   issues.push(`${expectedBlock}: ruta oficial local pendiente o inválida`); continue;
  }
  try {
   const root = realpathSync(publicRoot);
   const file = realpathSync(resolve(root, src.slice(1)));
   const path = relative(root, file);
   if (path.startsWith('..') || isAbsolute(path) || !statSync(file).isFile() || statSync(file).size === 0) throw new Error('recurso fuera de public o vacío');
  } catch { issues.push(`${expectedBlock}: archivo oficial ausente o fuera de public`); }
 }
 for (const [name, visual] of Object.entries(content.visual)) if (visual.status !== 'verificado' || !visual.sourceReference.trim()) issues.push(`${name}: referencia visual pendiente`);
 return issues;
}
export function assertHomePublication(content: HomeData, publicRoot: string): void {
 const issues = publicationIssues(content, publicRoot);
 if (issues.length) throw new Error('BLOQUEADO 002: '+issues.join('; '));
}
