export async function initCinematicExperience(isCurrent = () => true) {
  // On touch-sized screens, let the browser composite the white-to-blue
  // entrance. Copy stays still and readable; GSAP still owns desktop motion.
  if (matchMedia('(max-width: 900px)').matches) {
    const skip = scrollY > innerHeight;
    const start = document.timeline.currentTime;
    const animations = [
      ['.hero-ambient', 0, 2100, 0],
      ['.hero-art-intro', .08, 1900, 120],
    ].map(([selector, opacity, duration, delay]) => {
      const animation = document.querySelector(selector).animate(
        [{ opacity: skip ? 1 : opacity }, { opacity: 1 }],
        { duration: skip ? 0 : duration, delay: skip ? 0 : delay, fill: 'both', easing: 'cubic-bezier(.22,1,.36,1)' },
      );
      if (start !== null) animation.startTime = start;
      return animation;
    });
    return () => animations.forEach(animation => animation.cancel());
  }
  const { gsap } = await import('gsap');
  if (!isCurrent()) return () => {};
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (scrollY > innerHeight) {
      gsap.set('.hero-art-intro, .hero-ambient', { opacity: 1 });
      return;
    }
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro.fromTo('.hero-ambient', { opacity: 0, xPercent: 15, scale: 1.12 }, { opacity: 1, xPercent: 0, scale: 1, duration: 2.1, ease: 'power2.out' }, 0)
      .fromTo('.hero-art-intro', { opacity: .08 }, { opacity: 1, duration: 1.9 }, .12)
      .fromTo('.hero-light-sweep', { xPercent: -30, opacity: 0 }, { xPercent: 30, opacity: .7, duration: 1.7, ease: 'power1.inOut' }, .15)
      .to('.hero-light-sweep', { opacity: 0, duration: .4 }, 1.85)
      .from('.site-header .brand', { y: -5, opacity: .6, duration: .5 }, .05)
      .from('.hero-kicker', { y: 8, duration: .65 }, .08)
      .from('.hero-line', { y: 12, duration: .75, stagger: .1 }, .14)
      .from('.hero-actions', { y: 12, duration: .8 }, .38)
      .from('.scroll-cue', { y: -8, duration: .7 }, .48);
  });
  return () => media.revert();
}
