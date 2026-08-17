import { getSeason } from "./config.js";

export function initVideoSlider() {
  const slides = document.querySelectorAll(".hero__video-slide");
  const tabs = document.querySelectorAll(".season-card");

  if (!slides.length || !tabs.length) return;

  const startBySeason = { offroad: 0, water: 1, snow: 3 };
  let currentIndex = startBySeason[getSeason()] ?? 0;
  const slideInterval = 6500;
  let timer = null;

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    tabs.forEach((tab, i) => {
      tab.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, slideInterval);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const slideIndex = parseInt(e.currentTarget.dataset.slide);
      goToSlide(slideIndex);
      startAutoPlay();
    });
  });

  document.querySelectorAll(".hero__video").forEach((video) => {
    video.addEventListener("error", () => {
      video.style.display = "none";
    });
    const source = video.querySelector("source");
    source?.addEventListener("error", () => {
      video.style.display = "none";
    });
  });

  goToSlide(currentIndex);
  startAutoPlay();
}
