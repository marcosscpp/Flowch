import BasicForm from "./modules/form";
import triggerEvent from "./modules/trigger-event";
import Faq from "./modules/faq";
import initLenis from "./modules/lenis";
import initSwiper from "./modules/swiper-init";
import initHotjar from "./modules/hotjar-init";

const lenis = initLenis();
triggerEvent("Pageview");
initHotjar();

const basicForm = new BasicForm("[data-form]");
const swiper = initSwiper();
const faq = new Faq("[data-faq] dt");
