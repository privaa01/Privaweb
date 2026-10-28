import { test, expect, type Page } from '@playwright/test';

export type InputMethod = 'puntero' | 'teclado';

async function activate(page: Page, name: string, method: InputMethod) {
 const link = page.getByRole('main').getByRole('link', { name, exact: true });
 if (method === 'teclado') {
  await link.focus();
  await expect(link).toBeFocused();
  expect(await link.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
 } else await link.click();
}

export async function expectHomeAnchor(page: Page, anchor: 'somos-priva' | 'que-hacemos') {
 const heading = page.locator(`#${anchor} h2`);
 await expect(heading).toBeInViewport();
 await expect(heading).toBeFocused();
 await expect.poll(async () => (await heading.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(0);
}

export async function continueFromHomeAnchor(page: Page) {
 // Moving forward from either heading must reach the next native content link.
 // macOS WebKit uses Option+Tab to include links with its native keyboard preference.
 await page.keyboard.press(process.platform === 'darwin' && test.info().project.name === 'webkit' ? 'Alt+Tab' : 'Tab');
 await expect(page.getByRole('main').getByRole('link', { name: 'Explora nuestras historias', exact: true })).toBeFocused();
}

export async function followHomeLearn(page: Page, method: InputMethod) {
 await activate(page, 'Conocer más', method);
 await expect(page).toHaveURL(/\/index\.html#somos-priva$/);
 await expectHomeAnchor(page, 'somos-priva');
 await continueFromHomeAnchor(page);
}

export async function followHomeStories(page: Page, method: InputMethod) {
 await activate(page, 'Explora nuestras historias', method);
 await expect(page).toHaveURL(/\/historias\.html$/);
}
