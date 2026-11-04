import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionProfile } from '../utils/MotionPreferences.js';
gsap.registerPlugin(ScrollTrigger);
export function initScrollExperience() {
  const media = gsap.matchMedia(); let refreshTimer; let disposed = false;
  media.add({ desktop: '(min-width: 901px)', mobile: '(max-width: 900px)', reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
    if (context.conditions.reduced) return;
    const profile = motionProfile();
    if (!profile.simple) {
      const heroScroll = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
      heroScroll.to('.hero-scroll-tint', { opacity: .45, duration: .7, ease: 'none' }, 0);

    }
    // Initialize only nearby sections. Async callbacks are registered with the
    // GSAP context so media changes and pagehide also revert their animations.
    context.add('revealSection', (section) => {
      gsap.from(section.querySelectorAll('[data-reveal]'), { yPercent: 55, duration: .85, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 84%', toggleActions: 'play none none reverse' } });
    });
    context.add('drawDiagram', () => {
      if (profile.simple) return;
      const diagram = document.querySelector(profile.desktop ? '.flow-svg--desktop' : '.flow-svg--mobile');
      const paths = [...diagram.querySelectorAll('[data-flow]')];
      const lengths = paths.map((path) => path.getTotalLength());
      paths.forEach((path, index) => gsap.set(path, { strokeDasharray: lengths[index], strokeDashoffset: lengths[index] }));
      gsap.timeline({ scrollTrigger: { trigger: '.connection-map', start: 'top 85%', end: 'bottom 45%', scrub: .55 } }).to(paths, { strokeDashoffset: 0, stagger: .12, ease: 'none', duration: 1 }).from('[data-flow-node]', { scale: .94, duration: .6, stagger: .15, ease: 'power2.out' }, .25);
    });
    const observer = new IntersectionObserver((entries) => {
      if (disposed || context.isReverted) return;
      for (const entry of entries) if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        if (entry.target.matches('.connection-map')) context.drawDiagram();
        else context.revealSection(entry.target);
      }
    }, { rootMargin: '400px 0px' });
    document.querySelectorAll('section:has([data-reveal]), .connection-map').forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  });
  // Wait for native scrolling to settle before refreshing measurements; a
  // forced refresh can restore a cached position during a preference change.
  const refresh = () => { if (disposed) return; clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(true), 80); };
  document.addEventListener('snc:layout', refresh); document.fonts?.ready.then(refresh);
  return () => { disposed = true; clearTimeout(refreshTimer); document.removeEventListener('snc:layout', refresh); media.revert(); };
}
