import gsap from "gsap";

export function initSpeedometerAnimation() {
  const arrow = document.querySelector("#arrow");
  const textMaximum = document.querySelector("#text_maximum");

  if (!arrow || !textMaximum) return;

  // 1. Центры элементов
  gsap.set("#arrow", { svgOrigin: "1284 1757.62" });

  // Текст сжимаем по ширине в центре
  gsap.set("#text_maximum", {
    scaleX: 0,
    opacity: 0,
    transformOrigin: "50% 50%",
  });

  // 2. Создаем один чистый прогон при входе на сайт
  const tl = gsap.timeline();

  tl
    // Старт с 30 градусов
    .set("#arrow", { rotation: 30 })

    // --- НАТЯЖЕНИЕ НАЗАД (Имитация стартера) ---
    .to("#arrow", { rotation: -40, duration: 0.15, ease: "power1.inOut" })
    .to("#arrow", { rotation: -37, duration: 0.08 })
    .to("#arrow", { rotation: -52, duration: 0.15, ease: "power1.inOut" })
    .to("#arrow", { rotation: -48, duration: 0.08 })
    .to("#arrow", { rotation: -60, duration: 0.18, ease: "power2.out" })
    .to("#arrow", { rotation: -60, duration: 0.25 })

    // --- ЕДИНЫЙ ПРОЛЁТ СТРЕЛКИ ---
    .to("#arrow", {
      rotation: 400,
      duration: 1.1,
      ease: "power2.out",
    })

    // --- ОСЕДАНИЕ В 390 (ФИНИШ СТРЕЛКИ) ---
    .to("#arrow", {
      rotation: 390,
      duration: 0.55,
      ease: "power2.inOut",
    })

    // --- ВЫЕЗД ТЕКСТА ИЗ ЦЕНТРА В ОБЕ СТОРОНЫ ---
    .to("#text_maximum", {
      scaleX: 1,
      opacity: 1,
      duration: 0.45,
      ease: "back.out(1.5)",
    });
}
