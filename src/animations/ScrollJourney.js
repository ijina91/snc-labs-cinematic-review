import { motionProfile } from '../utils/MotionPreferences.js';
import { film } from '../data/film.js';
import { createFilmPlayer } from './FilmPlayer.js';
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (a, b, value) => { const x = clamp((value - a) / (b - a)); return x * x * (3 - 2 * x); };
export function createScrollJourney(section) {
  const stage = section.querySelector('.journey-stage');
  const panels = [...section.querySelectorAll('.journey-panel')];
  const word = section.querySelector('.journey-word');
  const progress = section.querySelector('.journey-progress span');
  const status = section.querySelector('.journey-status');
  const mobile = matchMedia('(max-width: 900px)');
  const events = new AbortController();
  let start = 0, span = 1, frame, visible = false, disposed = false, player, current = -1;
  let target = 0, visual = 0, announce, pinTop = 0, frameHeight = 0;
  section.dataset.enhanced = 'true';
  function placeFrame() {
    if (!mobile.matches) {
      stage.style.removeProperty('clip-path'); stage.style.removeProperty('visibility'); stage.inert = false;
      return;
    }
    // Reveal a stationary frame through the section's visible intersection.
    // Native scroll still moves the document; the film never rides in or out.
    const bounds = section.getBoundingClientRect();
    const top = clamp(bounds.top - pinTop, 0, frameHeight);
    const bottom = clamp(pinTop + frameHeight - bounds.bottom, 0, frameHeight);
    const shown = top + bottom < frameHeight && bounds.top < innerHeight;
    stage.style.clipPath = `inset(${top}px 0 ${bottom}px)`;
    stage.style.visibility = shown ? 'visible' : 'hidden';
    stage.inert = !shown || top > 1 || bottom > 1;
  }
  function measure() {
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    start = section.getBoundingClientRect().top + scrollY - headerHeight;
    span = Math.max(1, section.offsetHeight - stage.clientHeight);
    pinTop = parseFloat(getComputedStyle(stage).top) || 0; frameHeight = stage.clientHeight;
    placeFrame();
    update();
  }
  function paint() {
    frame = undefined;
    if (disposed || !visible || document.hidden) return;
    placeFrame();
    visual = mobile.matches ? target : visual + (target - visual) * .16;
    if (Math.abs(target - visual) < .0003) visual = target;
    const phase = Math.min(visual * panels.length, panels.length - .0001);
    const index = Math.floor(phase), fraction = phase - index;
    const travel = clamp((phase - .3) / (panels.length - 1), 0, 1) * (panels.length - 1);
    if (current !== index) {
      current = index; stage.dataset.chapter = String(index);
      word.textContent = panels[index].dataset.word;
      panels.forEach((panel, i) => { panel.setAttribute('aria-hidden', String(i !== index)); panel.inert = i !== index; });
      clearTimeout(announce); announce = setTimeout(() => { if (!disposed) status.textContent = panels[index].querySelector('h3').textContent; }, 250);
    }
    const opacity = mobile.matches ? 1 : (index === 0 ? 1 : smooth(0, .14, fraction)) * (index === panels.length - 1 ? 1 : 1 - smooth(.65, .96, fraction));
    panels.forEach((panel, i) => {
      panel.style.opacity = i === index ? String(opacity) : '0';
      panel.style.transform = mobile.matches ? 'none' : i === index ? `translateY(${fraction < .14 ? (1 - opacity) * 26 : -(1 - opacity) * 20}px)` : 'translateY(26px)';
    });
    progress.style.transform = `scaleX(${visual})`;
    player?.render(travel / (panels.length - 1));
    section.dataset.scenePosition = travel.toFixed(3);
    if (visual !== target) frame = requestAnimationFrame(paint);
  }
  function update() {
    target = clamp((scrollY - start) / span);
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(paint);
  }
  function initializeFilm() {
    if (!film.source || motionProfile().simple || !visible || player || disposed) return;
    player = createFilmPlayer(section.querySelector('video'), film.source,
      () => { if (!disposed) { section.dataset.renderer = 'video'; update(); } },
      () => { if (!disposed) section.dataset.renderer = 'poster'; });
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (!visible) {
      cancelAnimationFrame(frame); frame = undefined;
      if (mobile.matches) { stage.style.visibility = 'hidden'; stage.inert = true; }
    }
    else { initializeFilm(); update(); }
  });
  observer.observe(section);
  window.addEventListener('scroll', update, { passive: true, signal: events.signal });
  window.addEventListener('resize', measure, { passive: true, signal: events.signal });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = undefined; } else update();
  }, { signal: events.signal });
  const size = new ResizeObserver(measure); size.observe(stage);
  measure(); visual = target;
  section.dataset.renderer = 'poster';
  document.dispatchEvent(new Event('snc:layout'));
  return () => {
    disposed = true; events.abort(); observer.disconnect(); size.disconnect(); cancelAnimationFrame(frame); clearTimeout(announce); player?.dispose();
    delete section.dataset.enhanced; delete section.dataset.renderer; delete section.dataset.scenePosition;
    panels.forEach(panel => { panel.removeAttribute('aria-hidden'); panel.inert = false; panel.style.removeProperty('opacity'); panel.style.removeProperty('transform'); });
    stage.style.removeProperty('background-color');
    stage.style.removeProperty('clip-path'); stage.style.removeProperty('visibility'); stage.inert = false;
    status.textContent = ''; document.dispatchEvent(new Event('snc:layout'));
  };
}
