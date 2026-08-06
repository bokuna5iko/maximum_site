import "../scss/main.scss";
import { initQuiz } from "./quiz.js";
import { initModals } from "./modal.js";
import { initHeroParallax, initWaterDrops } from "./parallax.js";

document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
  initModals();
  initHeroParallax(); // 3D-параллакс мыши
  initWaterDrops(); // Стекающие капли на экране
});
