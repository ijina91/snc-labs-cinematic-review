import { motionProfile } from '../utils/MotionPreferences.js';
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (a, b, value) => { const x = clamp((value - a) / (b - a)); return x * x * (3 - 2 * x); };
export function createScrollJourney(section) {
  const stage = section.querySelector('.journey-stage');
  const panels = [...section.querySelectorAll('.journey-panel')];
  const buttons = [...section.querySelectorAll('[data-chapter-target]')];
  const nav = section.querySelector('.journey-nav');
  const word = section.querySelector('.journey-word');
  const count = section.querySelector('.journey-counter b');
  const progress = section.querySelector('.journey-progress span');
  const poster = section.querySelector('.journey-poster');
  const status = section.querySelector('.journey-status');
  const events = new AbortController();
  let start = 0, span = 1, frame, visible = false, disposed = false, engine, sceneFactory, current = -1;
  let target = 0, visual = 0, announce;
  section.dataset.enhanced = 'true'; nav.hidden = false;
  function measure() {
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    start = section.getBoundingClientRect().top + scrollY - headerHeight;
    span = Math.max(1, section.offsetHeight - stage.clientHeight);
    engine?.resize(); update();
  }
  function paint() {
    frame = undefined;
    if (disposed || !visible || document.hidden) return;
    visual += (target - visual) * .16;
    if (Math.abs(target - visual) < .0003) visual = target;
    const phase = Math.min(visual * panels.length, panels.length - .0001);
    const index = Math.floor(phase), fraction = phase - index;
    const travel = Math.min(panels.length - 1, index + smooth(.58, .98, fraction));
    if (current !== index) {
      current = index; stage.dataset.chapter = String(index);
      word.textContent = panels[index].dataset.word; count.textContent = String(index + 1).padStart(2, '0');
      panels.forEach((panel, i) => { panel.setAttribute('aria-hidden', String(i !== index)); panel.inert = i !== index; });
      buttons.forEach((button, i) => { if (i === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current'); });
      clearTimeout(announce); announce = setTimeout(() => { if (!disposed) status.textContent = `${index + 1} / ${panels.length}. ${panels[index].querySelector('h3').textContent}`; }, 250);
    }
    const opacity = (index === 0 ? 1 : smooth(0, .14, fraction)) * (index === panels.length - 1 ? 1 : 1 - smooth(.65, .96, fraction));
    panels.forEach((panel, i) => {
      panel.style.opacity = i === index ? String(opacity) : '0';
      panel.style.transform = i === index ? `translateY(${fraction < .14 ? (1 - opacity) * 26 : -(1 - opacity) * 20}px)` : 'translateY(26px)';
    });
    progress.style.transform = `scaleX(${visual})`;
    if (engine) engine.render(travel);
    else poster.style.transform = `rotate(${travel * 12}deg) scale(${1 + Math.sin(travel * Math.PI) * .08})`;
    section.dataset.scenePosition = travel.toFixed(3);
    if (visual !== target) frame = requestAnimationFrame(paint);
  }
  function update() {
    target = clamp((scrollY - start) / span);
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(paint);
  }
  function initializeEngine() {
    if (!sceneFactory || !visible || engine || disposed) return;
    try {
      engine = sceneFactory(section.querySelector('canvas'), () => {
        section.dataset.renderer = 'poster'; engine?.dispose(); engine = undefined; sceneFactory = undefined; update();
      });
      section.dataset.renderer = 'webgl'; update();
    } catch { sceneFactory = undefined; section.dataset.renderer = 'poster'; }
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (!visible) { cancelAnimationFrame(frame); frame = undefined; }
    else { initializeEngine(); update(); }
  });
  observer.observe(section);
  window.addEventListener('scroll', update, { passive: true, signal: events.signal });
  window.addEventListener('resize', measure, { passive: true, signal: events.signal });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = undefined; } else update();
  }, { signal: events.signal });
  nav.addEventListener('click', event => {
    const button = event.target.closest('[data-chapter-target]');
    if (button) window.scrollTo({ top: start + span * ((Number(button.dataset.chapterTarget) + .3) / panels.length), behavior: 'smooth' });
  }, { signal: events.signal });
  const size = new ResizeObserver(measure); size.observe(stage);
  measure(); visual = target;
  if (!motionProfile().simple) {
    import('./JourneyScene.js').then(({ createJourneyScene }) => {
      if (disposed) return;
      sceneFactory = createJourneyScene; initializeEngine();
    }).catch(() => { if (!disposed) section.dataset.renderer = 'poster'; });
  } else section.dataset.renderer = 'poster';
  document.dispatchEvent(new Event('snc:layout'));
  return () => {
    const restoreFocus = nav.contains(document.activeElement) && matchMedia('(prefers-reduced-motion: reduce)').matches;
    disposed = true; events.abort(); observer.disconnect(); size.disconnect(); cancelAnimationFrame(frame); clearTimeout(announce); engine?.dispose();
    delete section.dataset.enhanced; delete section.dataset.renderer; delete section.dataset.scenePosition;
    nav.hidden = true; panels.forEach(panel => { panel.removeAttribute('aria-hidden'); panel.inert = false; panel.style.removeProperty('opacity'); panel.style.removeProperty('transform'); });
    status.textContent = ''; document.dispatchEvent(new Event('snc:layout'));
    if (restoreFocus) { const heading = panels[Math.max(0, current)].querySelector('h3'); heading.tabIndex = -1; heading.focus(); }
  };
}
