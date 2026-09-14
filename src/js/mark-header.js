import gsap from "gsap";
import markSvg from "../assets/logo/maximum-mark.svg?raw";
import {
  play,
  applyKnobs,
  HEADER_REST,
} from "../assets/logo/animations/runtime.js";
import { createIntroV3 } from "../assets/logo/animations/intro-v3.js";

const COMPACT_HEIGHT = 65;

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

function getSafeTop() {
  const header = getHeaderEl();
  if (!header) return 0;
  return parseFloat(getComputedStyle(header).paddingTop) || 0;
}

function getCollapseDistance() {
  const spacer = document.querySelector(".header-spacer");
  const compact = COMPACT_HEIGHT + getSafeTop();
  const expanded = spacer?.offsetHeight || compact + 280;
  return Math.max(1, expanded - compact);
}

function getPageScrollDistance() {
  const collapse = getCollapseDistance();
  const page = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(collapse, page);
}

function getFilmUnits() {
  return getPageScrollDistance() / getCollapseDistance();
}

function getProgress() {
  if (reducedMotion) return 1;
  return Math.min(1, Math.max(0, window.scrollY / getCollapseDistance()));
}

function updateHeaderLayout() {
  const progress = getProgress();
  document.documentElement.style.setProperty(
    "--header-progress",
    String(progress),
  );
  getHeaderEl()?.classList.toggle("is-compact", progress >= 0.85);
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
  const scene = createIntroV3({ units: lastFilmUnits });

  introTl = play(svgEl, scene, gsap, {
    restKnobs: HEADER_REST,
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
  updateHeaderLayout();
  if (!reducedMotion) applyScrub(window.scrollY);
}

function onResize() {
  updateHeaderLayout();
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

  state = { ...HEADER_REST };
  applyKnobs(svgEl, state);

  if (reducedMotion) {
    document.documentElement.style.setProperty("--header-progress", "1");
    document.documentElement.classList.add("header-reduced");
    getHeaderEl()?.classList.add("is-compact");
    applyKnobs(svgEl, HEADER_REST);
    return;
  }

  updateHeaderLayout();
  mountFilm();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onResize, { passive: true });
}
