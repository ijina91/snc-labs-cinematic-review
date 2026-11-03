import { gsap } from 'gsap';
export function initCinematicExperience() {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (scrollY > innerHeight) {
      gsap.set('.hero-art-intro, .hero-ambient', { opacity: 1 });
      return;
    }
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro.fromTo('.hero-ambient', { opacity: 0, xPercent: 15, scale: 1.12 }, { opacity: 1, xPercent: 0, scale: 1, duration: 2.1, ease: 'power2.out' }, 0)
      .fromTo('.hero-art-intro', { x: 95, y: 55, rotation: 8, scale: .82, opacity: .08 }, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.9 }, .12)
      .from('.hero-orbit', { scale: .8, opacity: 0, duration: 2 }, .1)
      .from('.hero-outline', { opacity: 0, duration: 1.4 }, .6)
      .fromTo('.hero-light-sweep', { xPercent: -30, opacity: 0 }, { xPercent: 30, opacity: .7, duration: 1.7, ease: 'power1.inOut' }, .15)
      .to('.hero-light-sweep', { opacity: 0, duration: .4 }, 1.85)
      .from('.site-header .brand', { y: -5, opacity: .6, duration: .5 }, .05)
      .from('.hero-kicker', { y: 8, duration: .65 }, .08)
      .from('.hero-line', { y: 12, duration: .75, stagger: .1 }, .14)
      .from('.hero-actions', { y: 12, duration: .8 }, .38)
      .from('.ribbon-highlight', { opacity: 0, duration: .75 }, .55)
      .from('.scroll-cue', { y: -8, duration: .7 }, .48);
  });
  return () => media.revert();
}
