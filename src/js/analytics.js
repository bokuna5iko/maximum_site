import { CONFIG } from "./config.js";

export function initAnalytics() {
  if (!CONFIG.METRIKA_ID) return;
  if (window.ym) return;

  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  window.ym(CONFIG.METRIKA_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
}

export function trackGoal(name) {
  if (!name || !CONFIG.METRIKA_ID) return;
  if (typeof window.ym === "function") {
    window.ym(CONFIG.METRIKA_ID, "reachGoal", name);
  }
}

export function initClickTracking() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (href.startsWith("tel:")) {
      trackGoal("click_phone");
      return;
    }
    if (link.dataset.track === "route" || href.includes("2gis.ru")) {
      trackGoal("click_route");
      return;
    }
    if (link.dataset.track === "reviews") {
      trackGoal("click_reviews");
      return;
    }
    if (link.dataset.track === "whatsapp" || href.includes("wa.me")) {
      trackGoal("click_whatsapp");
    }
  });
}
