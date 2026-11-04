import { motionProfile } from '../utils/MotionPreferences.js';
import { film } from '../data/film.js';
import { createFilmPlayer } from './FilmPlayer.js';
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (a, b, value) => { const x = clamp((value - a) / (b - a)); return x * x * (3 - 2 * x); };
export function createScrollJourney(section) {
  const stage = section.querySelector('.journey-stage');
  const panels = [...section.querySelectorAll('.journey-panel')];
  const word = section.querySelector('.journey-word');
  const status = section.querySelector('.journey-status');
  const content = section.querySelector('.journey-panels');
  const poster = section.querySelector('.journey-poster');
  const mobile = matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)');
  const events = new AbortController();
  let start = 0, span = 1, frame, visible = false, disposed = false, player, current = -1, filmLoading = false;
  let target = 0, visual = 0, moviePosition = 0, announce, pinTop = 0, frameHeight = 0, contentHeight = 0, layoutWidth = innerWidth;
  section.dataset.enhanced = 'true';
  function placeFrame() {
    if (!mobile.matches) {
      stage.style.removeProperty('clip-path'); stage.style.removeProperty('visibility'); stage.inert = false;
      return;
    }
    // The parent clips paint natively. JS only controls activity and focus.
    const bounds = section.getBoundingClientRect();
    const top = clamp(bounds.top - pinTop, 0, frameHeight);
    const bottom = clamp(pinTop + frameHeight - bounds.bottom, 0, frameHeight);
    const shown = top + bottom < frameHeight && bounds.top < innerHeight;
    stage.style.visibility = shown ? 'visible' : 'hidden';
    stage.inert = !shown || top > 1 || bounds.bottom < pinTop + contentHeight - 1;
  }
  function measure() {
    if (disposed) return;
    // Resize may arrive before the scroll event/observer catches up. Check
    // the actual scroll position too, so folding cannot pull Contact back in.
    const preserve = innerWidth !== layoutWidth && visible && target > 0 && target < 1 && scrollY >= start && scrollY <= start + span;
    const readingPosition = target;
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    start = section.getBoundingClientRect().top + scrollY - headerHeight;
    contentHeight = content.clientHeight;
    span = Math.max(1, section.offsetHeight - contentHeight);
    pinTop = parseFloat(getComputedStyle(stage).top) || 0; frameHeight = stage.clientHeight;
    layoutWidth = innerWidth;
    if (preserve) scrollTo({ top: start + readingPosition * span, behavior: 'instant' });
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
      section.dataset.activeFrame = panels[index].dataset.frame;
      poster.srcset = `/assets/frames/v3/${section.dataset.activeFrame}-mobile.webp 800w, /assets/frames/v3/${section.dataset.activeFrame}.webp 1280w`;
      poster.src = `/assets/frames/v3/${section.dataset.activeFrame}.webp`;
      word.textContent = panels[index].dataset.word;
      panels.forEach((panel, i) => { panel.setAttribute('aria-hidden', String(i !== index)); panel.inert = i !== index; });
      clearTimeout(announce); announce = setTimeout(() => { if (!disposed) status.textContent = panels[index].querySelector('h1,h2,h3').textContent; }, 250);
    }
    const opacity = mobile.matches ? 1 : (index === 0 ? 1 : smooth(0, .14, fraction)) * (index === panels.length - 1 ? 1 : 1 - smooth(.65, .96, fraction));
    panels.forEach((panel, i) => {
      panel.style.opacity = i === index ? String(opacity) : '0';
      panel.style.transform = mobile.matches ? 'none' : i === index ? `translateY(${fraction < .14 ? (1 - opacity) * 26 : -(1 - opacity) * 20}px)` : 'translateY(26px)';
    });
    // Six transitions reach 01…07 at their reading positions; the final
    // interval keeps 07's fragments and light alive beneath the closing CTA.
    const lastRead = panels.length - 1 + .3;
    const filmPhase = phase <= lastRead ? Math.max(0, phase - .3)
      : panels.length - 1 + (phase - lastRead) / (panels.length - lastRead);
    moviePosition = clamp(filmPhase / panels.length);
    player?.render(moviePosition, { interacting: target > 0 });
    section.dataset.scenePosition = travel.toFixed(3);
    if (visual !== target) frame = requestAnimationFrame(paint);
  }
  function update() {
    target = clamp((scrollY - start) / span);
    if (target > 0) player?.suspend();
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(paint);
  }
  async function initializeFilm() {
    if (!film.source || motionProfile().simple || !visible || player || filmLoading || disposed) return;
    filmLoading = true;
    try {
      // Paint the responsive first frame before transferring the larger film.
      await poster.decode().catch(() => {});
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (disposed || !visible) return;
      const source = innerWidth <= 600 && film.sourceMobile ? film.sourceMobile : film.source;
      player = createFilmPlayer(section.querySelector('video'), source,
        () => { if (!disposed) { section.dataset.renderer = 'video'; update(); } },
        () => { if (!disposed) section.dataset.renderer = 'poster'; },
        { intro: scrollY <= start + 1 && target === 0, segments: panels.length });
      player.render(moviePosition, { interacting: target > 0 });
    } finally { filmLoading = false; }
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (!visible) {
      player?.suspend();
      cancelAnimationFrame(frame); frame = undefined;
      if (mobile.matches) { stage.style.visibility = 'hidden'; stage.inert = true; }
    }
    else { initializeFilm(); update(); }
  });
  observer.observe(section);
  window.addEventListener('scroll', update, { passive: true, signal: events.signal });
  window.addEventListener('resize', measure, { passive: true, signal: events.signal });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { player?.suspend(); cancelAnimationFrame(frame); frame = undefined; } else update();
  }, { signal: events.signal });
  const size = new ResizeObserver(measure); size.observe(stage);
  measure(); visual = target;
  section.dataset.renderer = 'poster';
  document.dispatchEvent(new Event('snc:layout'));
  return () => {
    disposed = true; events.abort(); observer.disconnect(); size.disconnect(); cancelAnimationFrame(frame); clearTimeout(announce); player?.dispose();
    delete section.dataset.enhanced; delete section.dataset.renderer; delete section.dataset.scenePosition; delete section.dataset.activeFrame;
    panels.forEach(panel => { panel.removeAttribute('aria-hidden'); panel.inert = false; panel.style.removeProperty('opacity'); panel.style.removeProperty('transform'); });
    stage.style.removeProperty('background-color');
    stage.style.removeProperty('clip-path'); stage.style.removeProperty('visibility'); stage.inert = false;
    status.textContent = ''; document.dispatchEvent(new Event('snc:layout'));
  };
}
