import { INVENTORY } from "./inventory.js";

export function renderInventory() {
  const root = document.querySelector("#in-stock-grid");
  if (!root) return;

  root.innerHTML = INVENTORY.map(
    (item) => `
      <article class="instock-card">
        ${cardVisual(item)}
        <div class="instock-card__body">
          <span class="instock-card__badge">${item.badge}</span>
          <h3 class="instock-card__title">
            <button
              type="button"
              class="instock-card__open"
              data-open-intent="testdrive"
              data-model-id="${item.id}"
            >${item.title}</button>
          </h3>
          <ul class="instock-card__specs">
            ${item.specs.map((spec) => `<li>${spec}</li>`).join("")}
          </ul>
          <button
            type="button"
            class="instock-card__action"
            data-open-intent="testdrive"
            data-model-id="${item.id}"
          >Записаться на показ</button>
        </div>
      </article>
    `,
  ).join("");
}

function cardVisual(item) {
  if (!item.image) {
    return `<div class="instock-card__visual"></div>`;
  }

  return `<button type="button" class="instock-card__visual" data-open-intent="testdrive" data-model-id="${escapeHtml(item.id)}" aria-label="Записаться на показ: ${escapeHtml(item.title)}"><img src="${item.image}" alt="" width="${item.imageWidth}" height="${item.imageHeight}" decoding="async"></button>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function fillModelSelect(select, { direction = "", category, selectedTitle = "" } = {}) {
  if (!select) return;

  const scoped = Boolean(direction);
  const items = scoped
    ? INVENTORY.filter((item) => category && item.category === category)
    : INVENTORY;
  const sole = scoped && items.length === 1 ? items[0] : null;
  const options = [];

  if (!sole) {
    options.push(`<option value="">Выберите пример</option>`);
  }

  for (const item of items) {
    options.push(
      `<option value="${escapeHtml(item.title)}">${escapeHtml(item.title)}</option>`,
    );
  }

  select.innerHTML = options.join("");

  if (selectedTitle && [...select.options].some((option) => option.value === selectedTitle)) {
    select.value = selectedTitle;
  } else if (sole) {
    select.value = sole.title;
  } else {
    select.value = "";
  }
}
