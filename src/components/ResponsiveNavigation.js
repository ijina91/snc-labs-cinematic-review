export function initNavigation() {
  const events = new AbortController();
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  const close = (restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '메뉴 열기');
    menu.hidden = true;
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    menu.hidden = !open;
  }, { signal: events.signal });
  menu.addEventListener('click', (event) => { if (event.target.closest('a')) close(); }, { signal: events.signal });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) close(true); }, { signal: events.signal });
  document.addEventListener('click', (event) => { if (!event.target.closest('.site-header') && !menu.hidden) close(); }, { signal: events.signal });
  const desktop = matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', (event) => { if (event.matches) close(); }, { signal: events.signal });
  return () => { close(); events.abort(); };
}
