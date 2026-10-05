import { getInventoryItem } from "./inventory.js";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';

export function initSpecSheet() {
  const root = document.querySelector("#spec-sheet");
  const panel = root?.querySelector(".spec-sheet__panel");
  const body = document.querySelector("#spec-sheet-body");
  const title = document.querySelector("#spec-sheet-title");
  const book = document.querySelector("#spec-sheet-book");
  if (!root || !panel || !body || !title || !book) return;

  let trigger = null;
  let previousOverflow = "";

  function focusable() {
    return [...panel.querySelectorAll(FOCUSABLE)].filter(
      (node) => node instanceof HTMLElement && node.offsetParent !== null,
    );
  }

  function openSpecs(id, source) {
    const item = getInventoryItem(id);
    if (!item?.specGroups?.length) return;

    title.textContent = item.title;
    body.innerHTML = renderBody(item);
    body.scrollTop = 0;
    book.dataset.modelId = item.id;

    trigger = source instanceof HTMLElement ? source : null;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    root.inert = false;
    root.setAttribute("aria-hidden", "false");
    root.classList.add("active");
    window.requestAnimationFrame(() => root.querySelector(".spec-sheet__close")?.focus());
  }

  function closeSpecs({ restore = true } = {}) {
    if (!root.classList.contains("active")) return;

    const returnTo = trigger;
    trigger = null;

    if (restore && returnTo) {
      returnTo.focus();
    } else if (document.activeElement instanceof HTMLElement && panel.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    root.classList.remove("active");
    root.inert = true;
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousOverflow;
  }

  document.addEventListener("click", (event) => {
    const openBtn = event.target.closest("[data-open-specs]");
    if (openBtn) {
      event.preventDefault();
      openSpecs(openBtn.dataset.openSpecs, openBtn);
      return;
    }

    if (event.target.closest("[data-spec-close]")) {
      event.preventDefault();
      closeSpecs();
      return;
    }

    if (root.classList.contains("active") && event.target.closest("#spec-sheet [data-open-intent]")) {
      closeSpecs({ restore: false });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!root.classList.contains("active")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeSpecs();
      return;
    }

    if (event.key !== "Tab") return;

    const items = focusable();
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !panel.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  });
}

function renderBody(item) {
  const note = item.sheetNote
    ? `<p class="spec-sheet__note">${escapeHtml(item.sheetNote)}</p>`
    : "";

  const groups = item.specGroups
    .map(
      (group) => `
        <section class="spec-sheet__group">
          <h3>${escapeHtml(group.title)}</h3>
          <dl>
            ${group.rows
              .map(
                (row) => `
                  <div class="spec-sheet__row">
                    <dt>${escapeHtml(row.label)}</dt>
                    <dd>${escapeHtml(row.value)}</dd>
                  </div>
                `,
              )
              .join("")}
          </dl>
        </section>
      `,
    )
    .join("");

  return `
    <p class="spec-sheet__summary">${escapeHtml(item.summary || "")}</p>
    ${note}
    ${groups}
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
