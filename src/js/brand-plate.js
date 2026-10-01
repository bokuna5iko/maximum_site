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

  let anchorDocTop = 0;
  let anchorHeight = 0;
  let anchorWidth = 0;
  let anchorCx = 0;
  let slotCx = 0;
  let slotCy = 0;
  let slotWidth = 0;
  let mode = "";

  function measure() {
    const scrollY = window.scrollY;
    const anchorRect = anchor.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    anchorDocTop = anchorRect.top + scrollY;
    anchorHeight = anchorRect.height;
    anchorWidth = anchorRect.width;
    anchorCx = anchorRect.left + anchorRect.width / 2;
    slotCx = slotRect.left + slotRect.width / 2;
    slotCy = slotRect.top + slotRect.height / 2;
    slotWidth = slotRect.width;
  }

  function coverScroll() {
    return anchorDocTop - header.offsetHeight;
  }

  function dockScroll() {
    return anchorDocTop + anchorHeight / 2 - slotCy;
  }

  function clearStyles() {
    plate.classList.remove("is-fixed");
    plate.style.width = "";
    plate.style.height = "";
    plate.style.left = "";
    plate.style.top = "";
    plate.style.right = "";
    plate.style.bottom = "";
    plate.style.transform = "";
  }

  function rest() {
    if (mode === "rest" && plate.parentElement === anchor) return;
    mode = "rest";
    if (plate.parentElement !== anchor) anchor.appendChild(plate);
    clearStyles();
  }

  function ride(t) {
    if (plate.parentElement !== anchor) anchor.appendChild(plate);
    plate.classList.remove("is-fixed");
    const width = anchorWidth + (slotWidth - anchorWidth) * t;
    plate.style.right = "auto";
    plate.style.bottom = "auto";
    plate.style.width = `${width}px`;
    plate.style.height = `${width * PLATE_RATIO}px`;
    plate.style.left = `${anchorWidth / 2 + (slotCx - anchorCx) * t}px`;
    plate.style.top = `${anchorHeight / 2}px`;
    plate.style.transform = "translate(-50%, -50%)";
    mode = "ride";
  }

  function pin() {
    if (plate.parentElement !== header) header.appendChild(plate);
    plate.classList.add("is-fixed");
    plate.style.right = "";
    plate.style.bottom = "";
    plate.style.width = `${slotWidth}px`;
    plate.style.height = `${slotWidth * PLATE_RATIO}px`;
    plate.style.left = `${slotCx}px`;
    plate.style.top = `${slotCy}px`;
    plate.style.transform = "translate(-50%, -50%)";
    mode = "pin";
  }

  function layout(fromScroll) {
    if (!fromScroll) measure();

    const y = window.scrollY;
    const cover = coverScroll();
    const dock = Math.max(dockScroll(), cover);

    if (y < cover) {
      rest();
      return;
    }

    if (reduced || y >= dock || dock <= cover) {
      pin();
      return;
    }

    ride(clamp((y - cover) / (dock - cover), 0, 1));
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      layout(true);
    });
  }

  function onResize() {
    layout(false);
  }

  layout(false);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.visualViewport?.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onResize, { passive: true });
  document.fonts?.ready.then(onResize);
}
