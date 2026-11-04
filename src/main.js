import './style.css';
import { initNavigation } from './components/ResponsiveNavigation.js';
import { initGithubProjects } from './components/GithubProjects.js';
import { initServiceInteractions } from './components/ServiceInteractions.js';
import { initScrollJourney } from './components/ScrollJourney.js';
let cleanups = [];
let disposeScroll, scrollEvents;
let motionGeneration = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function stopMotion() {
  motionGeneration++;
  scrollEvents?.abort(); disposeScroll?.();
  disposeScroll = undefined;
}
function startMotion() {
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
  // The film owns the entrance. A second, late GSAP text entrance would move
  // an already visible headline down after the user's first scroll.
}
function start() {
  reduced.addEventListener('change', startMotion);
  document.querySelector('#year').textContent = String(new Date().getFullYear());
  cleanups = [initNavigation(), initGithubProjects(), initServiceInteractions(), initScrollJourney()];
  startMotion();
}
window.addEventListener('pagehide', () => {
  reduced.removeEventListener('change', startMotion); stopMotion();
  cleanups.forEach((cleanup) => cleanup()); cleanups = [];
});
window.addEventListener('pageshow', (event) => { if (event.persisted) start(); });
start();
