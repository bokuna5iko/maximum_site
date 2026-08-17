import { CONFIG, getWhatsAppUrl } from "./config.js";

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
    if (key === "PHONE_SERVICE") node.href = `tel:${CONFIG.PHONE_SERVICE}`;
    if (key === "MAPS_URL") node.href = CONFIG.MAPS_URL;
    if (key === "PHONE_WHATSAPP") node.href = getWhatsAppUrl();
  });

  document.querySelectorAll("[data-bind-text]").forEach((node) => {
    const value = CONFIG[node.dataset.bindText];
    if (value) node.textContent = value;
  });

  injectJsonLd();
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
    address: {
      "@type": "PostalAddress",
      addressLocality: CONFIG.CITY,
      streetAddress: CONFIG.ADDRESS,
      addressCountry: "RU",
    },
    openingHours: CONFIG.HOURS,
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
  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}
