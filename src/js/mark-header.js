import gsap from "gsap";
import markSvg from "../assets/logo/maximum-mark.svg?raw";
import {
  play,
  applyKnobs,
  HEADER_REST,
} from "../assets/logo/animations/runtime.js";

/** Header gauge: needle and dial only. The word stays in the hero title. */
const HEADER_GAUGE = {
  ...HEADER_REST,
  wordGap: 0,
  plateOpen: 0,
  wordSpread: 0,
};
import { createIntroV3 } from "../assets/logo/animations/intro-v3.js";

/** @type {SVGSVGElement | null} */
let svgEl = null;
/** @type {Record<string, number> | null} */
let state = null;
/** @type {gsap.core.Timeline | null} */
let introTl = null;
let reducedMotion = false;
let lastFilmUnits = 0;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getHeaderEl() {
  return document.querySelector(".header");
}

function getCollapseDistance() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-collapse-scroll",
  );
  const scrollRange = parseFloat(raw);
  return Math.max(1, Number.isFinite(scrollRange) ? scrollRange : 280);
}

function getPageScrollDistance() {
  const collapse = getCollapseDistance();
  const page = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(collapse, page);
}

function getFilmUnits() {
  return getPageScrollDistance() / getCollapseDistance();
}

function setDocked(docked) {
  const header = getHeaderEl();
  if (!header) return;
  header.classList.toggle("is-docked", docked);

  if (!docked) {
    const burger = header.querySelector(".header__burger");
    header.querySelector(".header__nav")?.classList.remove("is-open");
    burger?.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
}

/** @type {IntersectionObserver | null} */
let dockObserver = null;

function bindHeroDock() {
  dockObserver?.disconnect();
  const hero = document.getElementById("hero");
  const header = getHeaderEl();
  if (!hero || !header || typeof IntersectionObserver === "undefined") return;

  const offset = Math.max(1, Math.ceil(header.getBoundingClientRect().height));
  const seasonBar = hero.querySelector(".hero__season-bar");
  const seasonHeight = seasonBar
    ? Math.ceil(seasonBar.getBoundingClientRect().height)
    : 0;
  dockObserver = new IntersectionObserver(
    ([entry]) => {
      setDocked(!entry.isIntersecting);
    },
    {
      root: null,
      rootMargin: `-${offset + seasonHeight}px 0px 0px 0px`,
      threshold: 0,
    },
  );
  dockObserver.observe(hero);
}

function injectMark(mount) {
  const markup = markSvg.replace(/^<!--[\s\S]*?-->\s*/, "");
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("Could not parse maximum-mark.svg");
  }

  svgEl = document.importNode(doc.documentElement, true);
  svgEl.id = "mark-root";
  mount.replaceChildren(svgEl);
}

function applyScrub(scrollY) {
  if (!introTl) return;

  const rewind = clamp(scrollY / getPageScrollDistance(), 0, 1);
  const t = introTl.duration() * (1 - rewind);

  introTl.pause();
  introTl.time(t, false);
}

function mountFilm() {
  if (!svgEl || !state) return;

  lastFilmUnits = getFilmUnits();
  const scene = createIntroV3({ units: lastFilmUnits, showWord: false });

  introTl = play(svgEl, scene, gsap, {
    restKnobs: HEADER_GAUGE,
    state,
  });
  introTl.pause();
  applyScrub(window.scrollY);
}

function syncFilm() {
  if (Math.abs(getFilmUnits() - lastFilmUnits) > 0.05) {
    mountFilm();
    return;
  }
  applyScrub(window.scrollY);
}

function onScroll() {
  if (!reducedMotion) applyScrub(window.scrollY);
}

function onResize() {
  bindHeroDock();
  if (!reducedMotion) syncFilm();
}

export function initMarkHeader() {
  const mount = document.getElementById("header-mark");
  if (!mount) return;

  reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  try {
    injectMark(mount);
  } catch {
    return;
  }

  state = { ...HEADER_GAUGE };
  applyKnobs(svgEl, state);

  bindHeroDock();

  if (reducedMotion) {
    document.documentElement.classList.add("header-reduced");
    applyKnobs(svgEl, HEADER_GAUGE);
    window.addEventListener("resize", onResize, { passive: true });
    return;
  }

  mountFilm();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onResize, { passive: true });
}
