import "../scss/main.scss";
import { initQuiz } from "./quiz.js";
import { initModals } from "./modal.js";
import { initWaterDrops } from "./parallax.js";
import { initVideoSlider } from "./video-slider.js";

document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
  initModals();
  initWaterDrops();
  initVideoSlider(); // <-- Запуск авто-слайдера
});
