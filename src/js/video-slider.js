import { getSeason } from "./config.js";

export function initVideoSlider() {
  const slides = document.querySelectorAll(".hero__video-slide");
  const tabs = document.querySelectorAll(".season-card");
  const playback = document.querySelector("#hero-playback");

  if (!slides.length || !tabs.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startBySeason = { offroad: 0, water: 1, snow: 3 };
  let currentIndex = startBySeason[getSeason()] ?? 0;
  const slideInterval = 6500;
  let timer = null;
  let paused = reduced;

  function loadVideo(video) {
    const source = video.querySelector("source");
    if (!source?.dataset.src || source.getAttribute("src")) return;
    source.src = source.dataset.src;
    video.load();
  }

  function setPlaybackLabel() {
    if (!playback) return;
    playback.setAttribute("aria-pressed", String(paused));
    playback.textContent = paused ? "Запустить слайды" : "Пауза слайдов";
  }

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle("active", isActive);

      const video = slide.querySelector("video");
      if (!video) return;
      if (isActive && !paused) {
        loadVideo(video);
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
    });

    currentIndex = index;
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (paused) return;
    timer = setInterval(() => {
      goToSlide((currentIndex + 1) % slides.length);
    }, slideInterval);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const slideIndex = parseInt(event.currentTarget.dataset.slide, 10);
      goToSlide(slideIndex);
      startAutoPlay();
    });
  });

  playback?.addEventListener("click", () => {
    paused = !paused;
    setPlaybackLabel();
    if (paused) {
      stopAutoPlay();
      slides.forEach((slide) => slide.querySelector("video")?.pause());
      return;
    }
    goToSlide(currentIndex);
    startAutoPlay();
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

  setPlaybackLabel();
  goToSlide(currentIndex);
  startAutoPlay();
}
