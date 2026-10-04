import { isValidRuPhone, SEASON_DIRECTIONS } from "./config.js";
import { sendLead } from "./lead-sender.js";
import { showSuccessModal } from "./modal.js";
import { renderVisitSlots } from "./visit-slots.js";

export function initQuiz() {
  let currentStep = 1;
  const totalSteps = 3;

  const nextBtn = document.querySelector("#quiz-next-btn");
  const prevBtn = document.querySelector("#quiz-prev-btn");
  const progressBar = document.querySelector("#quiz-progress-bar");
  const sendBtn = document.querySelector("#send-quiz-btn");
  const phoneInput = document.querySelector("#quiz-phone");
  const errorNode = document.querySelector("#quiz-error");
  const stepError = document.querySelector("#quiz-nav-error");
  const stepLabel = document.querySelector("#quiz-step-label");

  if (!nextBtn || !prevBtn) return;

  renderVisitSlots();

  let categoryTouched = false;

  function seasonCategory() {
    const slide = Number(document.querySelector(".season-card.active")?.dataset.slide);
    return SEASON_DIRECTIONS[slide] || "";
  }

  function applySeasonCategory() {
    if (categoryTouched || currentStep > 2) return;
    const value = seasonCategory();
    const radio = [...document.querySelectorAll('input[name="category"]')].find(
      (input) => input.value === value,
    );
    if (!radio) return;
    radio.checked = true;
    if (currentStep === 1) {
      currentStep = 2;
      updateQuiz();
    }
  }

  document.querySelectorAll('input[name="category"]').forEach((input) => {
    input.addEventListener("change", () => {
      categoryTouched = true;
    });
  });

  document.addEventListener("season-change", applySeasonCategory);

  function updateQuiz() {
    document.querySelectorAll(".quiz-step").forEach((step) => {
      step.classList.toggle("active", parseInt(step.dataset.step, 10) === currentStep);
    });

    if (progressBar) {
      progressBar.style.transform = `scaleX(${currentStep / totalSteps})`;
    }
    if (stepLabel) stepLabel.textContent = `Шаг ${currentStep} из ${totalSteps}`;
    prevBtn.style.display = currentStep > 1 ? "inline-flex" : "none";
    nextBtn.style.display = currentStep === totalSteps ? "none" : "inline-flex";
  }

  function validateStep(step) {
    if (!stepError) return true;
    if (step === 1 && !document.querySelector('input[name="category"]:checked')) {
      stepError.textContent = "Выберите категорию.";
      return false;
    }
    if (step === 2 && !document.querySelector('input[name="purpose"]:checked')) {
      stepError.textContent = "Выберите, для каких целей подбираете.";
      return false;
    }
    stepError.textContent = "";
    return true;
  }

  nextBtn.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      currentStep += 1;
      updateQuiz();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (stepError) stepError.textContent = "";
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
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const purpose = document.querySelector('input[name="purpose"]:checked')?.value;

    if (!category) {
      errorNode.textContent = "Выберите категорию.";
      return;
    }
    if (!purpose) {
      errorNode.textContent = "Выберите, для каких целей подбираете.";
      return;
    }

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
          Категория: category,
          Цель: purpose,
          "Слот визита": slot,
          Телефон: phone,
        },
      });
      showSuccessModal(result);
    } finally {
      sendBtn.disabled = false;
    }
  });

  updateQuiz();
}
