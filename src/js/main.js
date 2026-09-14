import "../scss/main.scss";
import { initAnalytics, initClickTracking } from "./analytics.js";
import { applyConfig, initMobileNav } from "./bind-config.js";
import { renderInventory } from "./inventory-render.js";
import { initQuiz } from "./quiz.js";
import { initModals } from "./modal.js";
import { initWaterDrops } from "./parallax.js";
import { initVideoSlider } from "./video-slider.js";

document.addEventListener("DOMContentLoaded", () => {
  initAnalytics();
  applyConfig();
  renderInventory();
  initModals();
  initQuiz();
  initMobileNav();
  initClickTracking();
  if (
    !window.matchMedia("(max-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    initWaterDrops();
  }
  initVideoSlider();
});
