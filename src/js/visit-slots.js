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
  if (sameDay(date, addDays(today, 1))) return `Завтра, ${dateText}`;
  if (date.getDay() === 6) return `Суббота, ${dateText}`;
  return dateText;
}

function slot(date, today, hour) {
  const label = `${dayLabel(date, today)}, ${hour}:00`;
  return { value: label, label };
}

export function visitSlots(now = new Date()) {
  const slots = [];
  const tomorrow = addDays(now, 1);
  const tomorrowHours = hoursFor(tomorrow);

  if (tomorrowHours.open <= 12 && 12 < tomorrowHours.close) {
    slots.push(slot(tomorrow, now, 12));
  }

  const afternoon = tomorrowHours.close <= 16 ? 14 : 16;
  if (tomorrowHours.open < afternoon && afternoon < tomorrowHours.close) {
    slots.push(slot(tomorrow, now, afternoon));
  }

  let daysUntilSaturday = (6 - now.getDay() + 7) % 7;
  if (daysUntilSaturday === 0) daysUntilSaturday = 7;
  let saturday = addDays(now, daysUntilSaturday);
  if (sameDay(saturday, tomorrow)) saturday = addDays(saturday, 7);
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

  const select = document.querySelector("#testdrive-slot");
  if (select) {
    select.innerHTML = slots
      .map(
        (item) =>
          `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`,
      )
      .join("");
  }

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
