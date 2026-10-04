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
  return dateText;
}

function slot(date, today, hour) {
  const label = `${dayLabel(date, today)}, ${hour}:00`;
  return { value: label, label };
}

function pushDay(slots, date, today) {
  const { open, close } = hoursFor(date);
  const isToday = sameDay(date, today);
  const nowHour = today.getHours();
  const hours = [12, close <= 16 ? 14 : 16];

  for (const hour of hours) {
    if (hour < open || hour >= close) continue;
    if (isToday && hour <= nowHour) continue;
    slots.push(slot(date, today, hour));
  }
}

export function visitSlots(now = new Date()) {
  const slots = [];
  const tomorrow = addDays(now, 1);
  const dayAfter = addDays(now, 2);
  pushDay(slots, now, now);
  pushDay(slots, tomorrow, now);
  pushDay(slots, dayAfter, now);

  let daysUntilSaturday = (6 - now.getDay() + 7) % 7;
  if (daysUntilSaturday === 0) daysUntilSaturday = 7;
  let saturday = addDays(now, daysUntilSaturday);
  if (sameDay(saturday, now) || sameDay(saturday, tomorrow) || sameDay(saturday, dayAfter)) {
    saturday = addDays(saturday, 7);
  }
  slots.push(slot(saturday, now, 12));

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
  if (quiz) {
    quiz.innerHTML = slots
      .map(
        (item) => `
        <label class="quiz-option">
          <input type="radio" name="visit_slot" value="${escapeHtml(item.value)}" />
          <div class="quiz-option__content">
            <span class="quiz-option__title">${escapeHtml(item.label)}</span>
          </div>
        </label>`,
      )
      .join("");
  }
}
