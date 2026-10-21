import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { homeContent, type HomeData } from '../src/content/home.ts';
import { publicationIssues, assertHomePublication } from '../src/lib/home-publication.ts';
function approvedSynthetic() {
 const root = mkdtempSync(join(tmpdir(), 'priva-home-test-'));
 const content = structuredClone(homeContent);
 for (const [index, image] of [content.hero.image, content.identity.image, content.closing.image, content.brand].entries()) {
  Object.assign(image, { src: `/images/home/${index}.svg`, width: 16, height: 16, status: 'verificado', purpose: 'informativo', alt: `Recurso sintético ${index}`, sourceReference: 'Evidencia sintética de prueba, no aprobación real' });
  mkdirSync(join(root, 'images/home'), { recursive: true });
  writeFileSync(join(root, `images/home/${index}.svg`), '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"/>');
 }
 for (const entry of [content.areas, ...content.areas.cards]) Object.assign(entry.review, { status: 'revisado', decisionReference: 'Decisión sintética de test', reviewedText: entry.description });
 for (const entry of Object.values(content.visual)) Object.assign(entry, { status: 'verificado', sourceReference: 'Referencia sintética de test' });
 return { root, content };
}
test('datos reales pendientes no son publicables', () => assert.throws(() => assertHomePublication(homeContent, '/no-existing-public'), /BLOQUEADO/));
test('ejemplo sintético válido comprueba camino de aceptación, no aprobación real', () => {
 const { content, root } = approvedSynthetic(); try { assert.deepEqual(publicationIssues(content, root), []); } finally { rmSync(root, { recursive: true }); }
});
const invalid: Array<[string, (c: HomeData, root: string) => void]> = [
 ['imagen pendiente', c => { c.hero.image.status = 'pendiente'; }],
 ['archivo inexistente verificado', c => { c.identity.image.src = '/images/home/missing.svg'; }],
 ['dimensiones inválidas', c => { c.hero.image.width = 0; }],
 ['imagen informativa sin alternativa', c => { c.hero.image.alt = ''; }],
 ['imagen decorativa con alternativa', c => { c.hero.image.purpose = 'decorativo'; }],
 ['imagen sin procedencia', c => { c.closing.image.sourceReference = ''; }],
 ['ruta fuera de public', c => { c.hero.image.src = '/../secret.svg'; }],
 ['fixture no publicable', c => { c.testOnly = true; }],
 ['URL externa', c => { c.hero.image.src = 'https://example.com/image.svg'; }],
 ['C16 cambiado', c => { c.closing.description = 'Únete a miles de personas'; }],
 ['ancla inválida', c => { c.identity.id = 'maria'; }],
 ['tarjetas reordenadas', c => { c.areas.cards.reverse(); }],
 ['revisión sin decisión', c => { c.areas.cards[0].review.decisionReference = ''; }],
 ['copy modificado tras revisar', c => { c.areas.description += ' Promesa nueva'; }],
 ['tipografía pendiente', c => { c.visual.typography.status = 'pendiente'; }],
 ['paleta sin referencia', c => { c.visual.palette.sourceReference = ''; }],
];
for (let index = 0; index < 5; index++) invalid.push([`revisión ${index} pendiente`, c => { [c.areas, ...c.areas.cards][index].review.status = 'pendiente'; }]);
for (const [name, mutate] of invalid) test(`rechaza ${name}`, () => {
 const { content, root } = approvedSynthetic();
 try { mutate(content, root); assert.ok(publicationIssues(content, root).length > 0); assert.throws(() => assertHomePublication(content, root), /BLOQUEADO/); }
 finally { rmSync(root, { recursive: true }); }
});

test('official shared brand and visual references are configured; approved editorial does not unblock missing institutional images',()=>{
 assert.equal(homeContent.brand.src,'/brand/priva-logo.png');assert.equal(homeContent.brand.width,104);assert.equal(homeContent.brand.height,40);assert.equal(homeContent.brand.status,'verificado');
 assert.equal(homeContent.visual.typography.status,'verificado');assert.equal(homeContent.visual.palette.status,'verificado');
 const issues=publicationIssues(homeContent,'public');assert(issues.some(x=>x.includes('hero:')));assert(!issues.some(x=>x.includes('revisión editorial')));assert(!issues.some(x=>/^marca:|^typography:|^palette:/.test(x)));
});
