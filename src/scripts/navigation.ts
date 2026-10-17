document.querySelectorAll<HTMLElement>('[data-navigation]').forEach(root => {
  const button = root.querySelector<HTMLButtonElement>('button');
  const nav = root.querySelector<HTMLElement>('nav');
  if (!button || !nav || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const compact = matchMedia('(max-width: 64rem)');
  let open = false;
  function render(returnFocus = false) {
    if (!button || !nav) return;
    if (returnFocus) button.focus();
    button.hidden = !compact.matches;
    nav.hidden = compact.matches && !open;
    button.setAttribute('aria-expanded', String(compact.matches && open));
  }
  button.addEventListener('click', () => { open = !open; render(); });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && compact.matches && open) { open = false; render(true); }
  });
  compact.addEventListener('change', () => {
    const focusWillHide = compact.matches && nav.contains(document.activeElement);
    open = false;
    if (focusWillHide) { button.hidden = false; button.focus(); }
    render();
  });
  render();
});
// Keep native URL behavior; improve the focus destination only for local fragments.
function focusFragment() {
  if (!location.hash) return;
  let id: string;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  const heading = target?.querySelector<HTMLElement>('h1, h2, h3') ?? target;
  if (!heading) return;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
  heading.scrollIntoView({ block: 'start', behavior: 'instant' });
}
window.addEventListener('hashchange', focusFragment);
window.addEventListener('load', focusFragment);
