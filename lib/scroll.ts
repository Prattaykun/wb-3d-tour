// utils/scroll.ts
export function smoothScrollTo(
  id: string,
  opts: { offset?: number; duration?: number } = {}
) {
  const target = document.getElementById(id);
  if (!target) return;

  const header = document.getElementById("site-header");
  const offset = opts.offset ?? (header?.offsetHeight ?? 0); // accounts for sticky navbar
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY - offset;
  const distance = end - start;
  const duration = opts.duration ?? 800;
  const startTime = performance.now();

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    window.scrollTo({ top: start + distance * easeInOutCubic(t) });
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
