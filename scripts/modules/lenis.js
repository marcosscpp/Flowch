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

  document.addEventListener("scroll", onScroll);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        lenis.scrollTo(target, {
          offset: -100,
          duration: 2,
        });
      }
    });
  });

  function setupFormFocusPause() {
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => lenis.stop());
      input.addEventListener("blur", () => lenis.start());
    });
  }

  setupFormFocusPause();

  function onScroll() {
    // Você pode adicionar lógica adicional aqui se necessário
    // Por exemplo, mostrar/esconder elementos com base no scroll
  }

  return lenis;
}
