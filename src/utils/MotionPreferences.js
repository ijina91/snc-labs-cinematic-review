export function motionProfile() {
  return { reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    simple: navigator.connection?.saveData === true || (navigator.hardwareConcurrency || 8) <= 2,
    desktop: matchMedia('(min-width: 901px)').matches };
}
