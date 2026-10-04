import { seasonLineForSlide, seasonSlideIndex } from "./config.js";

export function initVideoSlider() {
  const slides = document.querySelectorAll(".hero__video-slide");
  const tabs = document.querySelectorAll(".season-card");
  const playback = document.querySelector("#hero-playback");
  const seasonLine = document.querySelector("[data-season-line]");

  if (!slides.length || !tabs.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentIndex = seasonSlideIndex();
  const slideInterval = 6500;
  let timer = null;
  let paused = true;

  function loadVideo(video) {
    const source = video.querySelector("source");
    if (!source?.dataset.src || source.getAttribute("src")) return;
    source.src = source.dataset.src;
    video.load();
  }

  function setPlaybackLabel() {
    if (!playback) return;
    const autoplay = !paused;
    playback.setAttribute("aria-pressed", String(autoplay));
    playback.textContent = autoplay
      ? "Остановить автопрокрутку"
      : "Включить автопрокрутку";
  }

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle("active", isActive);

      const video = slide.querySelector("video");
      if (!video) return;
      if (isActive) {
        loadVideo(video);
        if (reduced) video.pause();
        else video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
    });

    if (seasonLine) seasonLine.textContent = seasonLineForSlide(index);
    currentIndex = index;
    document.dispatchEvent(new CustomEvent("season-change", { detail: { index } }));
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
      if (!paused) startAutoPlay();
    });
  });

  playback?.addEventListener("click", () => {
    paused = !paused;
    setPlaybackLabel();
    if (paused) {
      stopAutoPlay();
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
}
