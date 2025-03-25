export default function initAnimeNumbers() {
  function animeNumbers() {
    const numbers = document.querySelectorAll("[data-number]");
    numbers.forEach((num) => {
      const total = +num.innerText;
      const increase =
        Math.floor(total / 100) > 0 ? Math.floor(total / 100) : 1;
      let start = 0;
      num.innerText = start;
      setTimeout(() => {
        const timer = setInterval(() => {
          start = start + increase;
          num.innerText = start;
          if (start > total) {
            num.innerText = total;
            clearInterval(timer);
          }
        }, 25);
      }, 50);
    });
  }

  function handleMutation(mutation) {
    if (mutation[0].target.classList.contains("aos-animate")) {
      observer.disconnect();
      animeNumbers();
    }
  }

  const observerTarget = document.querySelector(".numbers__list");
  const observer = new MutationObserver(handleMutation);

  observer.observe(observerTarget, { attributes: true });
}
