import AOS from "aos";
import "aos/dist/aos.css";
import BasicForm from "./modules/form";
import triggerEvent from "./modules/triggerEvent";
import initLenis from "./modules/lenis";
import initSwiper from "./modules/swiper-init";

const lenis = initLenis();
const swiper = initSwiper();

triggerEvent("Pageview");

AOS.init({
  once: true,
  startEvent: "DOMContentLoaded",
  disableMutationObserver: false,
});

// const basicForm = new BasicForm("[data-form]");
