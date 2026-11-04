import { motionProfile } from '../utils/MotionPreferences.js';
import { film } from '../data/film.js';

// A short, silent first shot. The scroll-controlled 02–07 film has its own player.
export function initHeroFilm() {
  const video = document.querySelector('.hero-brand-film');
  if (!video || !film.intro || motionProfile().reduced || motionProfile().simple) return () => {};
  const events = new AbortController();
  let loaded = false, visible = false, disposed = false, canLoad = false, paintFrame;
  const play = () => {
    if (loaded && visible && !document.hidden && !disposed && !video.ended) video.play().catch(() => {});
    else video.pause();
  };
  video.addEventListener('loadeddata', () => { video.dataset.ready = 'true'; play(); }, { signal: events.signal });
  video.addEventListener('error', () => { delete video.dataset.ready; }, { signal: events.signal });
  document.addEventListener('visibilitychange', play, { signal: events.signal });
  const load = () => {
    if (visible && canLoad && !loaded && !disposed) {
      loaded = true; video.muted = true; video.src = film.intro; video.load();
    }
    play();
  };
  // Paint the high-priority poster and local type before transferring video.
  Promise.allSettled([document.fonts.ready, document.querySelector('.hero-film-poster').decode()]).then(() => {
    if (disposed) return;
    paintFrame = requestAnimationFrame(() => {
      paintFrame = requestAnimationFrame(() => { canLoad = true; load(); });
    });
  });
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    load();
  });
  observer.observe(document.querySelector('.hero'));
  return () => {
    disposed = true; observer.disconnect(); events.abort(); cancelAnimationFrame(paintFrame); video.pause();
    video.removeAttribute('src'); video.load(); delete video.dataset.ready;
  };
}
