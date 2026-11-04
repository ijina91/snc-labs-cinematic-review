export async function initCinematicExperience(isCurrent = () => true) {
  // The actual 01 film supplies the entrance motion. Touch layouts paint the
  // poster immediately, without an opacity animation delaying the LCP image.
  if (matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches) return () => {};
  const { gsap } = await import('gsap');
  if (!isCurrent()) return () => {};
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (scrollY > innerHeight) return;
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.site-header .brand', { y: -5, duration: .5 }, 0)
      .from('.hero-display', { y: 12, duration: .8 }, .05)
      .from('.hero-line', { y: 8, duration: .7, stagger: .06 }, .12)
      .from('.hero-actions', { y: 8, duration: .65 }, .2);
  });
  return () => media.revert();
}
