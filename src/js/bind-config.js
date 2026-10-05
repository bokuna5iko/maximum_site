import { CONFIG, GIS_HIGHLIGHTS, GIS_REVIEWS, getSeason, getWhatsAppUrl, seasonLineForSlide, seasonSlideIndex } from "./config.js";

export function applyConfig() {
  document.querySelectorAll("[data-bind]").forEach((node) => {
    const key = node.dataset.bind;
    const value = CONFIG[key];
    if (value == null) return;

    if (node.tagName === "A") {
      if (key.startsWith("PHONE_")) {
        node.href = `tel:${value.startsWith("+") ? value : `+${value}`}`;
        if (node.dataset.bindDisplay) {
          node.textContent = CONFIG[node.dataset.bindDisplay] || value;
        }
      } else if (key === "MAPS_URL") {
        node.href = value;
      } else if (key === "PHONE_WHATSAPP") {
        node.href = getWhatsAppUrl();
      }
    } else if (node.tagName === "IFRAME") {
      node.src = value;
    } else {
      node.textContent = value;
    }
  });

  document.querySelectorAll("[data-bind-href]").forEach((node) => {
    const key = node.dataset.bindHref;
    if (key === "PHONE_SALES") node.href = `tel:${CONFIG.PHONE_SALES}`;
    if (key === "PHONE_SALES_FLOOR1") node.href = `tel:${CONFIG.PHONE_SALES_FLOOR1}`;
    if (key === "PHONE_SERVICE") node.href = `tel:${CONFIG.PHONE_SERVICE}`;
    if (key === "PHONE_BOATS_REPAIR") node.href = `tel:${CONFIG.PHONE_BOATS_REPAIR}`;
    if (key === "MAPS_URL" || key === "MAPS_ROUTE") {
      node.href = CONFIG[key] || CONFIG.MAPS_URL;
    }
    if (key === "MAPS_REVIEWS") node.href = CONFIG.MAPS_REVIEWS;
    if (key === "MAPS_PHOTOS") node.href = CONFIG.MAPS_PHOTOS;
    if (key === "PHONE_WHATSAPP") node.href = getWhatsAppUrl();
    if (key === "TELEGRAM_CHANNEL") node.href = CONFIG.TELEGRAM_CHANNEL;
    if (key === "VK_URL") node.href = CONFIG.VK_URL;
    if (key === "EMAIL") node.href = `mailto:${CONFIG.EMAIL}`;
  });

  document.querySelectorAll("[data-bind-text]").forEach((node) => {
    const value = CONFIG[node.dataset.bindText];
    if (value) node.textContent = value;
  });

  injectJsonLd();
  renderSocialProof();
  applySeasonCopy();
}

function renderSocialProof() {
  const highlights = document.querySelector("#gis-highlights");
  if (highlights) {
    highlights.innerHTML = GIS_HIGHLIGHTS.map(
      (tag) => `<span class="gis-tag">${tag}</span>`,
    ).join("");
  }

  const list = document.querySelector("#gis-reviews");
  if (list) {
    list.innerHTML = GIS_REVIEWS.map(
      (item) => `
        <blockquote class="gis-review">
          <p class="gis-review__text">${item.text}</p>
          <footer class="gis-review__author">${item.author} · 2ГИС</footer>
        </blockquote>
      `,
    ).join("");
  }
}

function applySeasonCopy() {
  const line = document.querySelector("[data-season-line]");
  if (!line) return;
  line.textContent = seasonLineForSlide(seasonSlideIndex(getSeason()));
}

function injectJsonLd() {
  const existing = document.querySelector("#local-business-jsonld");
  if (existing) existing.remove();

  const data = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: CONFIG.BRAND,
    description: "Продажа техники, экипировки и авторизованный сервис",
    telephone: CONFIG.PHONE_SALES,
    email: CONFIG.EMAIL,
    url: CONFIG.MAPS_URL,
    sameAs: [CONFIG.MAPS_URL, CONFIG.VK_URL, CONFIG.TELEGRAM_CHANNEL],
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONFIG.LAT,
      longitude: CONFIG.LON,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: CONFIG.CITY,
      streetAddress: CONFIG.ADDRESS,
      postalCode: CONFIG.POSTAL_CODE,
      addressCountry: "RU",
    },
    openingHours: CONFIG.HOURS,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: CONFIG.GIS_RATING,
      reviewCount: CONFIG.GIS_RATINGS_COUNT,
    },
  };

  const script = document.createElement("script");
  script.id = "local-business-jsonld";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function initMobileNav() {
  const burger = document.querySelector("#header-burger");
  const nav = document.querySelector("#header-nav");
  const shield = document.querySelector("#header-shield");
  if (!burger || !nav) return;

  let revealTimer = 0;

  function markClosed() {
    window.clearTimeout(revealTimer);
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
  }

  function markReady() {
    if (!nav.classList.contains("is-open")) return;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Закрыть меню");
  }

  function setMenuOpen(open) {
    window.clearTimeout(revealTimer);
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    shield?.classList.toggle("is-on", open);
    document.body.style.overflow = open ? "hidden" : "";

    if (!open) {
      markClosed();
      return;
    }

    burger.setAttribute("aria-expanded", "true");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      markReady();
      return;
    }
    const onEnd = (event) => {
      if (event.target !== nav || event.propertyName !== "grid-template-rows") return;
      nav.removeEventListener("transitionend", onEnd);
      markReady();
    };
    nav.addEventListener("transitionend", onEnd);
    revealTimer = window.setTimeout(markReady, 480);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenuOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || burger.contains(e.target)) return;

    const link = [...nav.querySelectorAll("a")].find((item) => {
      const rect = item.getBoundingClientRect();
      return (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
    });
    if (link) {
      e.preventDefault();
      link.click();
      return;
    }
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
    }
  });
}
