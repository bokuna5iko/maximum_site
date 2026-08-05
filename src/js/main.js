import "../scss/main.scss";
import { initSpeedometerAnimation } from "./animation.js";
import { initQuiz } from "./quiz.js";
import { initModals } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  initSpeedometerAnimation();
  initQuiz();
  initModals(); // <-- Запуск Модалок
});
