import './style.css';
import { initNavigation } from './components/ResponsiveNavigation.js';
import { initGithubProjects } from './components/GithubProjects.js';
import { initServiceInteractions } from './components/ServiceInteractions.js';
let cleanups = [];
let disposeMotion, disposeScroll, scrollEvents;
let motionGeneration = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function stopMotion() {
  motionGeneration++;
  scrollEvents?.abort(); disposeMotion?.(); disposeScroll?.();
  disposeMotion = undefined; disposeScroll = undefined;
}
async function startMotion() {
  stopMotion();
  const generation = motionGeneration;
  if (reduced.matches) return;
  scrollEvents = new AbortController();
  const startScroll = async () => {
    if (scrollY < 2) return;
    scrollEvents.abort();
    try {
      const { initScrollExperience } = await import('./animations/ScrollExperience.js');
      if (generation === motionGeneration && !reduced.matches) disposeScroll = initScrollExperience();
    } catch { /* Static diagrams and ordinary scrolling remain functional. */ }
  };
  window.addEventListener('scroll', startScroll, { passive: true, signal: scrollEvents.signal });
  if (scrollY >= 2) startScroll();
  try {
    const { initCinematicExperience } = await import('./animations/CinematicExperience.js');
    // Let the locally hosted type settle and paint before measuring GSAP transforms.
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (generation === motionGeneration && !reduced.matches) disposeMotion = initCinematicExperience();
  } catch { document.documentElement.dataset.motion = 'static'; }
}
function start() {
  reduced.addEventListener('change', startMotion);
  document.querySelector('#year').textContent = String(new Date().getFullYear());
  cleanups = [initNavigation(), initGithubProjects(), initServiceInteractions()];
  startMotion();
}
window.addEventListener('pagehide', () => {
  reduced.removeEventListener('change', startMotion); stopMotion();
  cleanups.forEach((cleanup) => cleanup()); cleanups = [];
});
window.addEventListener('pageshow', (event) => { if (event.persisted) start(); });
start();
