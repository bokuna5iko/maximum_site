import { isValidRuPhone } from "./config.js";
import { sendLead } from "./lead-sender.js";
import { showSuccessModal } from "./modal.js";

export function initQuiz() {
  let currentStep = 1;
  const totalSteps = 3;

  const nextBtn = document.querySelector("#quiz-next-btn");
  const prevBtn = document.querySelector("#quiz-prev-btn");
  const progressBar = document.querySelector("#quiz-progress-bar");
  const sendBtn = document.querySelector("#send-quiz-btn");
  const phoneInput = document.querySelector("#quiz-phone");
  const errorNode = document.querySelector("#quiz-error");

  if (!nextBtn || !prevBtn) return;

  function updateQuiz() {
    document.querySelectorAll(".quiz-step").forEach((step) => {
      step.classList.toggle("active", parseInt(step.dataset.step, 10) === currentStep);
    });

    if (progressBar) {
      progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
    }
    prevBtn.style.display = currentStep > 1 ? "inline-flex" : "none";
    nextBtn.style.display = currentStep === totalSteps ? "none" : "inline-flex";
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep += 1;
      updateQuiz();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep -= 1;
      updateQuiz();
    }
  });

  sendBtn?.addEventListener("click", async (event) => {
    event.preventDefault();

    const phone = phoneInput.value.trim();
    const slot = document.querySelector('input[name="visit_slot"]:checked')?.value;
    const consent = document.querySelector("#quiz-consent")?.checked;

    if (!slot) {
      errorNode.textContent = "Выберите удобное время визита.";
      return;
    }
    if (!isValidRuPhone(phone)) {
      errorNode.textContent = "Введите номер телефона в формате +7 9XX XXX-XX-XX.";
      return;
    }
    if (!consent) {
      errorNode.textContent = "Нужно согласие на обработку персональных данных.";
      return;
    }

    errorNode.textContent = "";
    sendBtn.disabled = true;

    try {
      const result = await sendLead({
        type: "quiz",
        fields: {
          Категория:
            document.querySelector('input[name="category"]:checked')?.value || "Не указано",
          Цель: document.querySelector('input[name="purpose"]:checked')?.value || "Не указано",
          "Слот визита": slot,
          Телефон: phone,
        },
      });
      showSuccessModal(result);
    } finally {
      sendBtn.disabled = false;
    }
  });
}
