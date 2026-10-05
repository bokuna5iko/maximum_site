import { CONFIG } from "./config.js";

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const MONTHS_SHORT = [
  "янв",
  "фев",
  "мар",
  "апр",
  "мая",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

const WEEKDAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function hoursFor(date) {
  return date.getDay() === 0 ? { open: 10, close: 16 } : { open: 9, close: 18 };
}

function dayLabel(date, today) {
  const dateText = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  if (sameDay(date, today)) return `Сегодня, ${dateText}`;
  if (sameDay(date, addDays(today, 1))) return `Завтра, ${dateText}`;
  if (date.getDay() === 6) return `Суббота, ${dateText}`;
  if (date.getDay() === 0) return `Воскресенье, ${dateText}`;
  return dateText;
}

function windowsFor(date) {
  return hoursFor(date).close <= 16 ? [10, 12, 14] : [10, 13, 16];
}

function dayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function chipFor(date, today) {
  const meta = `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
  if (sameDay(date, today)) return { title: "Сегодня", meta };
  if (sameDay(date, addDays(today, 1))) return { title: "Завтра", meta };
  return { title: meta, meta: WEEKDAYS_SHORT[date.getDay()] };
}

function slot(date, today, hour) {
  const label = `${dayLabel(date, today)}, ${hour}:00`;
  const chip = chipFor(date, today);
  return {
    value: label,
    label,
    dayKey: dayKey(date),
    chipTitle: chip.title,
    chipMeta: chip.meta,
    time: `${hour}:00`,
  };
}

function pushDay(slots, date, today) {
  const { open, close } = hoursFor(date);
  const isToday = sameDay(date, today);
  const nowHour = today.getHours();
  const hours = windowsFor(date);

  for (const hour of hours) {
    if (hour < open || hour >= close) continue;
    if (isToday && hour <= nowHour) continue;
    slots.push(slot(date, today, hour));
  }
}

export function visitSlots(now = new Date()) {
  const slots = [];
  for (let day = 0; day < 7; day += 1) {
    pushDay(slots, addDays(now, day), now);
  }

  slots.push({
    value: "Перезвоните, согласуем",
    label: "Перезвоните, согласуем",
  });

  return slots;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderVisitSlots(now = new Date()) {
  const slots = visitSlots(now);

  const markup = [
    `<option value="">Выберите время</option>`,
    ...slots.map(
      (item) =>
        `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`,
    ),
  ].join("");

  for (const id of ["#testdrive-slot", "#service-slot"]) {
    const select = document.querySelector(id);
    if (select) select.innerHTML = markup;
  }

  document.querySelectorAll("[data-visit-hours]").forEach((node) => {
    node.textContent = `Часы салона: ${CONFIG.HOURS}`;
  });

  const quiz = document.querySelector("#quiz-slots");
  if (quiz) renderQuizWhen(quiz, slots);
}

function groupDays(slots) {
  const days = [];
  const byKey = new Map();

  for (const item of slots) {
    if (!item.dayKey) continue;
    let day = byKey.get(item.dayKey);
    if (!day) {
      day = {
        key: item.dayKey,
        title: item.chipTitle,
        meta: item.chipMeta,
        times: [],
      };
      byKey.set(item.dayKey, day);
      days.push(day);
    }
    day.times.push(item);
  }

  return days;
}

function renderQuizWhen(quiz, slots) {
  const days = groupDays(slots);
  const callback = slots.find((item) => !item.dayKey);

  const dayButtons = days
    .map(
      (day, index) => `
        <button
          type="button"
          class="quiz-day${index === 0 ? " is-active" : ""}"
          id="quiz-day-${day.key}"
          role="tab"
          aria-selected="${index === 0 ? "true" : "false"}"
          aria-controls="quiz-times-${day.key}"
          tabindex="${index === 0 ? "0" : "-1"}"
        >
          <span class="quiz-day__title">${escapeHtml(day.title)}</span>
          <span class="quiz-day__meta">${escapeHtml(day.meta)}</span>
        </button>`,
    )
    .join("");

  const timePanels = days
    .map(
      (day, index) => `
        <div
          class="quiz-times"
          id="quiz-times-${day.key}"
          role="tabpanel"
          aria-labelledby="quiz-day-${day.key}"
          ${index === 0 ? "" : "hidden"}
        >
          <div class="quiz-times__row" role="radiogroup" aria-label="${escapeHtml(`${day.title}, ${day.meta}`)}">
            ${day.times
              .map(
                (item) => `
                  <label class="quiz-time">
                    <input type="radio" name="visit_slot" value="${escapeHtml(item.value)}" aria-label="${escapeHtml(item.label)}" />
                    <span>${escapeHtml(item.time)}</span>
                  </label>`,
              )
              .join("")}
          </div>
        </div>`,
    )
    .join("");

  const later = callback
    ? `
      <label class="quiz-when__later">
        <input type="radio" name="visit_slot" value="${escapeHtml(callback.value)}" />
        <span>${escapeHtml(callback.label)}</span>
      </label>`
    : "";

  quiz.innerHTML = `
    <div class="quiz-when">
      ${days.length ? `<div class="quiz-days" role="tablist" aria-label="День визита">${dayButtons}</div>` : ""}
      ${timePanels}
      <p class="quiz-when__picked" aria-live="polite" hidden></p>
      ${later}
    </div>`;

  const buttons = [...quiz.querySelectorAll(".quiz-day")];
  const panels = [...quiz.querySelectorAll(".quiz-times")];
  const picked = quiz.querySelector(".quiz-when__picked");

  function activateDay(button) {
    const panelId = button.getAttribute("aria-controls");
    buttons.forEach((node) => {
      const on = node === button;
      node.classList.toggle("is-active", on);
      node.setAttribute("aria-selected", on ? "true" : "false");
      node.tabIndex = on ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== panelId;
    });
    const scroller = button.closest(".quiz-days");
    if (!scroller) return;
    const buttonBox = button.getBoundingClientRect();
    const scrollerBox = scroller.getBoundingClientRect();
    if (buttonBox.left < scrollerBox.left) {
      scroller.scrollLeft += buttonBox.left - scrollerBox.left - 8;
    } else if (buttonBox.right > scrollerBox.right) {
      scroller.scrollLeft += buttonBox.right - scrollerBox.right + 8;
    }
  }

  function syncPicked() {
    const checked = quiz.querySelector('input[name="visit_slot"]:checked');
    const panel = checked?.closest(".quiz-times");
    buttons.forEach((node) => {
      node.classList.toggle("is-picked", Boolean(panel) && node.id === panel.getAttribute("aria-labelledby"));
    });
    if (!picked) return;
    if (!checked) {
      picked.hidden = true;
      picked.textContent = "";
      return;
    }
    picked.hidden = false;
    picked.textContent = `Выбрано: ${checked.value}`;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => activateDay(button));
  });

  quiz.querySelector(".quiz-days")?.addEventListener("keydown", (event) => {
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = buttons.length - 1;
    else return;
    event.preventDefault();
    activateDay(buttons[next]);
    buttons[next].focus();
  });

  quiz.addEventListener("change", (event) => {
    if (event.target?.name === "visit_slot") syncPicked();
  });
}
