import { CONFIG, getWhatsAppUrl, isTelegramConfigured, isValidRuPhone } from "./config.js";
import { getInventoryItem } from "./inventory.js";
import { fillModelSelect } from "./inventory-render.js";
import { sendLead } from "./lead-sender.js";
import { renderVisitSlots } from "./visit-slots.js";

const TARGET_TO_INTENT = {
  testdrive: "testdrive",
  "test-drive": "testdrive",
  "boat-kit": "testdrive",
  "store-stock": "testdrive",
  "gear-size": "testdrive",
  service: "service",
  "service-modal": "service",
  parts: "parts",
  "parts-order": "parts",
};

const TAB_BY_INTENT = {
  testdrive: "tab-testdrive",
  service: "tab-service",
  parts: "tab-parts",
};

let returnFocus = null;

function rememberFocus() {
  const current = document.activeElement;
  if (!returnFocus && current instanceof HTMLElement && current !== document.body) {
    returnFocus = current;
  }
}

function focusDialog(dialog) {
  const field = dialog.querySelector(".modal__form.active .form-input");
  const title = dialog.querySelector(".modal__success-title");
  const close = dialog.querySelector(".modal__close");
  (field || title || close)?.focus();
}

function openDialog(dialog) {
  rememberFocus();
  dialog.inert = false;
  dialog.classList.add("active");
  window.requestAnimationFrame(() => focusDialog(dialog));
}

function closeDialog(dialog, { restore = true } = {}) {
  dialog.classList.remove("active");
  dialog.inert = true;
  if (!restore) return;
  const back = returnFocus;
  returnFocus = null;
  if (back?.isConnected) back.focus();
}

export function initModals() {
  const modal = document.querySelector("#modal-lead");
  const overlay = document.querySelector("#modal-overlay");
  const closeBtn = document.querySelector("#modal-close");
  const success = document.querySelector("#modal-success");
  const successOverlay = document.querySelector("#success-overlay");
  const successClose = document.querySelector("#success-close");
  const modelSelect = document.querySelector("#testdrive-model");

  if (!modal) return;

  fillModelSelect(modelSelect);
  renderVisitSlots();

  function openModal(intent = "testdrive", { modelId } = {}) {
    switchTab(TAB_BY_INTENT[intent] || "tab-testdrive");

    if (modelId && modelSelect) {
      const item = getInventoryItem(modelId);
      if (item) modelSelect.value = item.title;
    }

    openDialog(modal);
  }

  function closeModal() {
    closeDialog(modal);
  }

  function switchTab(tabName) {
    document.querySelectorAll(".modal__tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    document.querySelectorAll(".modal__form").forEach((form) => {
      form.classList.toggle("active", form.dataset.tabContent === tabName);
    });
  }

  window.openLeadModal = openModal;
  window.showSuccessModal = showSuccessModal;

  document.querySelector("#btn-open-service")?.addEventListener("click", () => {
    openModal("service");
  });
  document.querySelector("#btn-open-parts")?.addEventListener("click", () => {
    openModal("parts");
  });
  document.querySelector("#open-service-modal")?.addEventListener("click", () => {
    openModal("service");
  });
  document.querySelector("#visit-open-service")?.addEventListener("click", () => {
    openModal("service");
  });

  closeBtn?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);
  successClose?.addEventListener("click", () => success && closeDialog(success));
  successOverlay?.addEventListener("click", () => success && closeDialog(success));

  document.addEventListener("keydown", (event) => {
    const dialog = success?.classList.contains("active")
      ? success
      : modal.classList.contains("active")
        ? modal
        : null;
    if (!dialog) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog(dialog);
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = [...dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
    )].filter((node) => node instanceof HTMLElement && node.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-intent], .card__action");
    if (!trigger) return;

    const raw = trigger.dataset.openIntent || trigger.dataset.target;
    const intent = TARGET_TO_INTENT[raw];
    if (!intent) return;

    event.preventDefault();
    openModal(intent, { modelId: trigger.dataset.modelId });
  });

  document.querySelectorAll(".modal__tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  document.querySelectorAll('#modal-lead a[href="#privacy"]').forEach((link) => {
    link.addEventListener("click", () => {
      closeDialog(modal, { restore: false });
      returnFocus = null;
    });
  });

  setupFormSubmit("#form-testdrive", "testdrive", {
    testdrive_model: "Модель",
    testdrive_slot: "Слот визита",
    client_phone: "Телефон",
  });
  setupFormSubmit("#form-service", "service", {
    service_category: "Категория",
    service_details: "Дата и услуга",
    client_phone: "Телефон",
  });
  setupFormSubmit("#form-parts", "parts", {
    parts_brand: "Марка и модель",
    parts_vin: "VIN",
    parts_needed: "Что подобрать",
    client_phone: "Телефон",
  });
}

function setupFormSubmit(formSelector, type, labels) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const phone = String(formData.get("client_phone") || "").trim();
    const errorNode = form.querySelector(".form-error");

    if (!formData.get("consent")) {
      if (errorNode) errorNode.textContent = "Нужно согласие на обработку персональных данных.";
      return;
    }

    if (!isValidRuPhone(phone)) {
      if (errorNode) errorNode.textContent = "Введите номер телефона в формате +7 9XX XXX-XX-XX.";
      return;
    }

    if (errorNode) errorNode.textContent = "";

    const fields = {};
    for (const [name, label] of Object.entries(labels)) {
      const value = String(formData.get(name) || "").trim();
      if (value) fields[label] = value;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const result = await sendLead({ type, fields });
      form.reset();
      const lead = document.querySelector("#modal-lead");
      if (lead?.classList.contains("active")) closeDialog(lead, { restore: false });
      showSuccessModal(result);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

export function showSuccessModal({ deliveredVia, whatsappUrl, type, fields = {} }) {
  const modal = document.querySelector("#modal-success");
  const note = document.querySelector("#success-note");
  const wa = document.querySelector("#success-whatsapp");
  const route = document.querySelector("#success-route");
  const title = document.querySelector("#success-title");
  const text = document.querySelector("#success-text");

  if (!modal) return;

  const slot = fields["Слот визита"];
  const model = fields["Модель"] || fields["Категория"];

  if (type === "testdrive" || type === "quiz") {
    if (title) title.textContent = "Ждём вас в салоне";
    if (text) {
      const when = slot || "в согласованное время";
      text.textContent = model
        ? `Запись: ${when}. Подготовим ${model}. Менеджер подтвердит визит.`
        : `Запись: ${when}. Менеджер подтвердит визит и подготовит модели.`;
    }
  } else if (type === "service") {
    if (title) title.textContent = "Заявка на ТО принята";
    if (text) text.textContent = "Сервис свяжется, чтобы подтвердить дату и работу.";
  } else {
    if (title) title.textContent = "Заявка на запчасти принята";
    if (text) text.textContent = "Подберём по заявке и перезвоним.";
  }

  if (note) {
    if (deliveredVia === "telegram") {
      note.hidden = true;
    } else if (isTelegramConfigured(type)) {
      note.hidden = false;
      note.textContent =
        "Не удалось отправить менеджеру автоматически. Напишите в WhatsApp, чтобы заявка точно дошла.";
    } else {
      note.hidden = false;
      note.textContent =
        "Бот ещё не подключён: чтобы заявка точно дошла, нажмите WhatsApp и отправьте сообщение менеджеру.";
    }
  }

  if (wa) {
    wa.href = whatsappUrl || getWhatsAppUrl();
    wa.dataset.track = "whatsapp";
  }

  if (route) {
    route.href = CONFIG.MAPS_ROUTE || CONFIG.MAPS_URL;
    route.dataset.track = "route";
  }

  openDialog(modal);
}
