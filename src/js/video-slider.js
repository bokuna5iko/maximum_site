export function initVideoSlider() {
  const slides = document.querySelectorAll(".hero__video-slide");
  const tabs = document.querySelectorAll(".season-card");

  if (!slides.length || !tabs.length) return;

  let currentIndex = 0;
  const slideInterval = 6500; // Автопереключение каждые 6.5 секунд
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

  startAutoPlay();
}
