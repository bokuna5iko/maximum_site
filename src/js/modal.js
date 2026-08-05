import { sendToWhatsApp } from "./lead-sender.js";

export function initModals() {
  const modal = document.querySelector("#modal-service");
  const overlay = document.querySelector("#modal-overlay");
  const closeBtn = document.querySelector("#modal-close");

  const btnOpenService = document.querySelector("#btn-open-service");
  const btnOpenParts = document.querySelector("#btn-open-parts");
  const heroServiceBtn = document.querySelector("#open-service-modal");

  if (!modal) return;

  function openModal(tabName = "tab-service") {
    modal.classList.add("active");
    switchTab(tabName);
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  function switchTab(tabName) {
    document.querySelectorAll(".modal__tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });

    document.querySelectorAll(".modal__form").forEach((form) => {
      form.classList.toggle("active", form.dataset.tabContent === tabName);
    });
  }

  // Открытие модального окна по кнопкам
  btnOpenService?.addEventListener("click", () => openModal("tab-service"));
  btnOpenParts?.addEventListener("click", () => openModal("tab-parts"));
  heroServiceBtn?.addEventListener("click", () => openModal("tab-service"));

  // Слушатели для закрытия
  closeBtn?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

  // Слушатели для карточек витрины с атрибутом data-target
  document.querySelectorAll(".card__action").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget.dataset.target;
      if (target === "parts-order") {
        openModal("tab-parts");
      } else {
        openModal("tab-service");
      }
    });
  });

  // Переключение вкладок внутри модального окна
  document.querySelectorAll(".modal__tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // Настройка отправки форм
  setupFormSubmit("#form-service", "Запись на Сервис / ТО");
  setupFormSubmit("#form-parts", "Подбор Запчастей по VIN");
}

function setupFormSubmit(formSelector, title) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    let message = `📩 *${title} с сайта МАКСИМУМ*\n\n`;

    // Динамически проходим по всем полям формы
    for (let [key, value] of formData.entries()) {
      if (value.trim()) {
        message += `• ${value.trim()}\n`;
      }
    }

    // Отправляем через модуль lead-sender
    sendToWhatsApp(message);
  });
}
