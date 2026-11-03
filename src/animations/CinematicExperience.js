import { gsap } from 'gsap';
export function initCinematicExperience() {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (scrollY > innerHeight) return;
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro.fromTo('.hero-ambient', { opacity: 0, xPercent: 12, scale: 1.07 }, { opacity: 1, xPercent: 0, scale: 1, duration: 1.7, ease: 'power2.out' }, 0)
      .from('.hero-art-intro', { x: 32, y: 22, scale: .96, opacity: .08, duration: 1.45 }, .12)
      .from('.site-header .brand', { y: -5, opacity: .6, duration: .5 }, .05)
      .from('.hero-kicker', { y: 8, duration: .65 }, .08)
      .from('.hero-line', { y: 12, duration: .75, stagger: .1 }, .14)
      .from('.hero-actions', { y: 12, duration: .8 }, .38)
      .from('.ribbon-highlight', { opacity: 0, duration: .75 }, .55)
      .from('.scroll-cue', { y: -8, duration: .7 }, .48);
  });
  return () => media.revert();
}
