const PLATE_RATIO = 26 / 118;
const FLIGHT_PX = 100;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function easeOut(t) {
  return 1 - (1 - t) ** 3;
}

export function initBrandPlate() {
  const plate = document.getElementById("brand-plate");
  const anchor = document.getElementById("brand-anchor");
  const slot = document.getElementById("brand-slot");
  if (!plate || !anchor || !slot) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.appendChild(plate);

  function place(x, y, width) {
    plate.classList.add("is-fixed");
    plate.style.width = `${width}px`;
    plate.style.height = `${width * PLATE_RATIO}px`;
    plate.style.left = `${x}px`;
    plate.style.top = `${y}px`;
    plate.style.transform = "translate(-50%, -50%)";
  }

  function layout() {
    const header = document.querySelector(".header");
    if (!header) return;

    const anchorRect = anchor.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const headerBottom = header.getBoundingClientRect().bottom;
    let t = clamp((headerBottom - anchorRect.top) / FLIGHT_PX, 0, 1);
    if (reduced) t = t > 0 ? 1 : 0;

    const anchorCx = anchorRect.left + anchorRect.width / 2;
    const anchorCy = anchorRect.top + anchorRect.height / 2;

    if (t <= 0) {
      place(anchorCx, anchorCy, anchorRect.width);
      return;
    }

    const fromCy = headerBottom + anchorRect.height / 2;
    const e = easeOut(t);
    const slotCx = slotRect.left + slotRect.width / 2;
    const slotCy = slotRect.top + slotRect.height / 2;

    place(
      anchorCx + (slotCx - anchorCx) * e,
      fromCy + (slotCy - fromCy) * e,
      anchorRect.width + (slotRect.width - anchorRect.width) * e,
    );
  }

  let ticking = false;
  function requestLayout() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      layout();
    });
  }

  layout();
  window.addEventListener("scroll", requestLayout, { passive: true });
  window.addEventListener("resize", requestLayout, { passive: true });
}
