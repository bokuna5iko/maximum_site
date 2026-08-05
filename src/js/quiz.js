import { sendToWhatsApp } from "./lead-sender.js";

export function initQuiz() {
  let currentStep = 1;
  const totalSteps = 3;

  const nextBtn = document.querySelector("#quiz-next-btn");
  const prevBtn = document.querySelector("#quiz-prev-btn");
  const progressBar = document.querySelector("#quiz-progress-bar");
  const sendBtn = document.querySelector("#send-quiz-btn");
  const phoneInput = document.querySelector("#quiz-phone");

  if (!nextBtn || !prevBtn) return;

  // Обновление отображения шагов и прогресса
  function updateQuiz() {
    document.querySelectorAll(".quiz-step").forEach((step) => {
      step.classList.remove("active");
      if (parseInt(step.dataset.step) === currentStep) {
        step.classList.add("active");
      }
    });

    const progressPercent = (currentStep / totalSteps) * 100;
    progressBar.style.width = `${progressPercent}%`;

    prevBtn.style.display = currentStep > 1 ? "inline-flex" : "none";
    nextBtn.style.display = currentStep === totalSteps ? "none" : "inline-flex";
  }

  // Перемещение по шагам
  nextBtn.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateQuiz();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateQuiz();
    }
  });

  // Отправка данных квиза
  sendBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();
    if (!phone) {
      alert("Пожалуйста, введите ваш номер телефона!");
      return;
    }

    const category =
      document.querySelector('input[name="category"]:checked')?.value ||
      "Не указано";
    const purpose =
      document.querySelector('input[name="purpose"]:checked')?.value ||
      "Не указано";

    // Собираем текст заявки
    const message =
      `⚡ *Заявка с сайта: Результат Квиза*\n\n` +
      `📌 *Категория:* ${category}\n` +
      `🎯 *Цель:* ${purpose}\n` +
      `📞 *Телефон клиента:* ${phone}\n\n` +
      `Жду подборку вариантов и консультацию!`;

    // Отправляем через наш единый модуль lead-sender
    sendToWhatsApp(message);
  });
}
