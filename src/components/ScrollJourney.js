import { createScrollJourney } from '../animations/ScrollJourney.js';

export function initScrollJourney() {
  const section = document.querySelector('#journey');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(min-width: 901px) and (max-height: 600px) and (orientation: landscape), (max-width: 900px) and (max-height: 500px) and (orientation: landscape), (hover: none) and (pointer: coarse) and (max-height: 500px) and (orientation: landscape)');
  const events = new AbortController();
  let near = false, disposed = false, cleanup;
  function start() {
    if (!near || preference.matches || compact.matches || cleanup || disposed) return;
    try {
      cleanup = createScrollJourney(section);
    } catch { /* Complete static chapters remain in the document. */ }
  }
  const observer = new IntersectionObserver(entries => {
    near = entries.some(entry => entry.isIntersecting); start();
  }, { rootMargin: '350px 0px' });
  observer.observe(section);
  // The film is the first screen. Pin its native layout in this startup task,
  // before a first wheel/touch event can race a lazy module or observer callback.
  const bounds = section.getBoundingClientRect();
  near = bounds.top < innerHeight + 350 && bounds.bottom > -350;
  start();
  const reset = () => {
    cleanup?.(); cleanup = undefined;
    if (!preference.matches) start();
  };
  preference.addEventListener('change', reset, { signal: events.signal });
  compact.addEventListener('change', reset, { signal: events.signal });
  return () => { disposed = true; observer.disconnect(); events.abort(); cleanup?.(); };
}
