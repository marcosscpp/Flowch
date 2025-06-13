import Lenis from "lenis";

export default function initLenis() {
  const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  const linksList = document.querySelectorAll('a[href^="#"]');
  if (linksList.length > 0) {
    linksList.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          lenis.scrollTo(target, {
            offset: -window.innerHeight / 2 + target.offsetHeight / 2,
            duration: 2,
          });
        }
      });
    });
  }

  return lenis;
}