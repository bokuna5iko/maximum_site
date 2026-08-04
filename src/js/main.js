import "../scss/main.scss";
import { initSpeedometerAnimation } from "./animation.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("MAXIMUM Website Initialized 🏎️");

  // Запуск GSAP анимации спидометра
  initSpeedometerAnimation();
});
