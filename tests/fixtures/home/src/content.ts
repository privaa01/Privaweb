import { homeContent } from '../../../../src/content/home';
export const fixtureHome = structuredClone(homeContent);
fixtureHome.testOnly = true;
for (const image of [fixtureHome.hero.image, fixtureHome.identity.image, fixtureHome.closing.image]) {
 image.src = `/test-${image.block}.svg`; image.width = 600; image.height = 420;
 image.purpose = 'informativo'; image.alt = `Recurso ficticio de prueba: ${image.block}`;
 // Do not mark this resource as verified or the real descriptions as reviewed.
}
// Shared official brand stays intact; institutional images remain explicitly synthetic.
