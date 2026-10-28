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
    const triggerWillHide = !compact.matches && document.activeElement === button;
    open = false;
    if (focusWillHide) { button.hidden = false; button.focus(); }
    // Reveal the destination before hiding the focused compact-menu trigger.
    if (triggerWillHide) {
      nav.hidden = false;
      (nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]') ?? nav.querySelector<HTMLAnchorElement>('a[href]'))?.focus();
    }
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
// Same-fragment navigation does not emit hashchange. Let native activation finish
// before improving focus; Enter's keyup can reset focus after its synthetic click in Gecko.
function isCurrentFragment(anchor: HTMLAnchorElement): boolean {
 if(anchor.hasAttribute('download')||(anchor.target&&anchor.target.toLowerCase()!=='_self'))return false;
 const url=new URL(anchor.href,location.href);
 return url.origin===location.origin&&url.pathname===location.pathname&&url.search===location.search&&!!url.hash&&url.hash===location.hash;
}
function focusAfterActivation(href:string){
 window.setTimeout(()=>requestAnimationFrame(()=>{if(location.href===href)focusFragment();}),0);
}
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const anchor=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
 if(anchor&&isCurrentFragment(anchor))focusAfterActivation(anchor.href);
});
let keyboardFragment:string|null=null;
document.addEventListener('keydown',event=>{
 if(event.key!=='Enter')return;
 keyboardFragment=null;
 if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const anchor=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
 if(anchor&&isCurrentFragment(anchor))keyboardFragment=anchor.href;
});
document.addEventListener('keyup',event=>{
 if(event.key!=='Enter')return;
 const href=keyboardFragment;keyboardFragment=null;
 if(href&&!event.defaultPrevented)focusAfterActivation(href);
});
window.addEventListener('blur',()=>{keyboardFragment=null;});
