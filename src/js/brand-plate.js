const PLATE_RATIO = 26 / 118;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function initBrandPlate() {
  const plate = document.getElementById("brand-plate");
  const anchor = document.getElementById("brand-anchor");
  const slot = document.getElementById("brand-slot");
  const header = document.querySelector(".header");
  if (!plate || !anchor || !slot || !header) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pinned = false;

  function parkInAnchor() {
    pinned = false;
    if (plate.parentElement !== anchor) anchor.appendChild(plate);
    plate.classList.remove("is-fixed");
    plate.style.width = "";
    plate.style.height = "";
    plate.style.left = "";
    plate.style.top = "";
    plate.style.right = "";
    plate.style.bottom = "";
    plate.style.transform = "";
  }

  function place(x, y, width) {
    if (!pinned) {
      pinned = true;
      header.appendChild(plate);
      plate.classList.add("is-fixed");
    }
    plate.style.width = `${width}px`;
    plate.style.height = `${width * PLATE_RATIO}px`;
    plate.style.left = `${x}px`;
    plate.style.top = `${y}px`;
    plate.style.transform = "translate(-50%, -50%)";
  }

  function layout() {
    const anchorRect = anchor.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const headerBottom = header.getBoundingClientRect().bottom;

    const anchorCx = anchorRect.left + anchorRect.width / 2;
    const anchorCy = anchorRect.top + anchorRect.height / 2;
    const slotCx = slotRect.left + slotRect.width / 2;
    const slotCy = slotRect.top + slotRect.height / 2;

    // Header has not reached the title's place yet — stay in document flow
    // so finger scrolling moves the plate with the page, not via JS.
    const covered = headerBottom - anchorRect.top;
    const travel = headerBottom + anchorRect.height / 2 - slotCy;

    if (covered <= 0 || travel <= 0) {
      parkInAnchor();
      return;
    }

    // 0 when the header edge touches the title, 1 when the title center
    // meets the slot. Linear with scroll, so the plate tracks the finger.
    const t = reduced ? 1 : clamp(covered / travel, 0, 1);
    const contactCy = headerBottom + anchorRect.height / 2;

    place(
      anchorCx + (slotCx - anchorCx) * t,
      contactCy + (slotCy - contactCy) * t,
      anchorRect.width + (slotRect.width - anchorRect.width) * t,
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
  window.visualViewport?.addEventListener("resize", requestLayout, {
    passive: true,
  });
  window.visualViewport?.addEventListener("scroll", requestLayout, {
    passive: true,
  });
}
