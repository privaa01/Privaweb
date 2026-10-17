import { homeContent } from '../../../../src/content/home';
export const fixtureHome = structuredClone(homeContent);
fixtureHome.testOnly = true;
for (const image of [fixtureHome.hero.image, fixtureHome.identity.image, fixtureHome.closing.image, fixtureHome.brand]) {
 image.src = `/test-${image.block}.svg`; image.width = 600; image.height = 420;
 image.purpose = 'informativo'; image.alt = `Recurso ficticio de prueba: ${image.block}`;
 // Do not mark this resource as verified or the real descriptions as reviewed.
}
fixtureHome.brand.width = 40; fixtureHome.brand.height = 40;
