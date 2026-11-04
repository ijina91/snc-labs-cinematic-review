export function initScrollJourney() {
  const section = document.querySelector('#journey');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 900px) and (max-height: 500px)');
  const events = new AbortController();
  let near = false, eligible = scrollY > 20, disposed = false, loading = false, generation = 0, cleanup;
  async function start() {
    if (!near || !eligible || preference.matches || compact.matches || loading || cleanup || disposed) return;
    loading = true; const current = generation;
    try {
      const { createScrollJourney } = await import('../animations/ScrollJourney.js');
      if (disposed || preference.matches || compact.matches || current !== generation) return;
      cleanup = createScrollJourney(section);
    } catch { /* Complete static chapters remain in the document. */ }
    finally { loading = false; if (current !== generation && !preference.matches && !disposed) start(); }
  }
  const observer = new IntersectionObserver(entries => {
    near = entries.some(entry => entry.isIntersecting); start();
  }, { rootMargin: '350px 0px' });
  observer.observe(section);
  window.addEventListener('scroll', () => { if (!eligible && scrollY > 20) { eligible = true; start(); } }, { passive: true, signal: events.signal });
  const reset = () => {
    generation++; cleanup?.(); cleanup = undefined;
    if (!preference.matches) start();
  };
  preference.addEventListener('change', reset, { signal: events.signal });
  compact.addEventListener('change', reset, { signal: events.signal });
  return () => { disposed = true; generation++; observer.disconnect(); events.abort(); cleanup?.(); };
}
