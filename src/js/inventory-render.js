import { INVENTORY } from "./inventory.js";

export function renderInventory() {
  const root = document.querySelector("#in-stock-grid");
  if (!root) return;

  root.innerHTML = INVENTORY.map(
    (item) => `
      <article class="instock-card">
        <div class="instock-card__visual is-${item.category}">
          <span class="instock-card__category">${item.categoryLabel}</span>
        </div>
        <div class="instock-card__body">
          <span class="instock-card__badge">${item.badge}</span>
          <h3 class="instock-card__title">${item.title}</h3>
          <p class="instock-card__price">от ${item.priceFrom}</p>
          <ul class="instock-card__specs">
            ${item.specs.map((spec) => `<li>${spec}</li>`).join("")}
          </ul>
          <button
            type="button"
            class="btn btn--primary btn--full"
            data-open-intent="testdrive"
            data-model-id="${item.id}"
          >
            ${item.cta}
          </button>
        </div>
      </article>
    `,
  ).join("");
}

export function fillModelSelect(select) {
  if (!select) return;
  const current = select.value;
  select.innerHTML = INVENTORY.map(
    (item) =>
      `<option value="${item.title}">${item.title} — от ${item.priceFrom}</option>`,
  ).join("");
  if (current) select.value = current;
}
