/** Default rest pose — matches mark.config.js css defaults (numeric). */
export const REST_KNOBS = {
  needleAngle: 34,
  wordSpread: 1,
  redDraw: 1,
  ringSpin: 0,
  markScale: 1,
  markOpacity: 1,
};

export const cssName = {
  needleAngle: '--needle-angle',
  wordSpread: '--word-spread',
  redDraw: '--red-draw',
  ringSpin: '--ring-spin',
  markScale: '--mark-scale',
  markOpacity: '--mark-opacity',
};

const cssToKey = Object.fromEntries(Object.entries(cssName).map(([key, cssVar]) => [cssVar, key]));

const DEG_KEYS = new Set(['needleAngle', 'ringSpin']);

function parseKnobValue(key, value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.endsWith('deg')) return parseFloat(trimmed);
    return parseFloat(trimmed);
  }
  return value;
}

function normalizePartial(partial) {
  const out = {};
  for (const [rawKey, rawValue] of Object.entries(partial || {})) {
    const key = rawKey.startsWith('--') ? cssToKey[rawKey] : rawKey;
    if (!key || !(key in cssName)) continue;
    out[key] = parseKnobValue(key, rawValue);
  }
  return out;
}

function formatKnobValue(key, value) {
  if (DEG_KEYS.has(key)) return `${value}deg`;
  return String(value);
}

/** Apply knob values to the root <svg> via CSS custom properties. */
export function applyKnobs(svgEl, partial) {
  const knobs = normalizePartial(partial);
  for (const [key, value] of Object.entries(knobs)) {
    svgEl.style.setProperty(cssName[key], formatKnobValue(key, value));
  }
}

const tweenStore = new WeakMap();

function getTween(svgEl) {
  return tweenStore.get(svgEl) ?? svgEl._markTween ?? null;
}

function setTween(svgEl, tween) {
  if (tween) {
    tweenStore.set(svgEl, tween);
    svgEl._markTween = tween;
  } else {
    tweenStore.delete(svgEl);
    delete svgEl._markTween;
  }
}

/** Kill any active timeline and optionally snap to rest. */
export function stop(svgEl, gsap, snapToRest = true) {
  const tween = getTween(svgEl);
  if (tween) {
    tween.kill();
    setTween(svgEl, null);
  }
  if (snapToRest) applyKnobs(svgEl, REST_KNOBS);
}

/** Play a declarative scene on the given <svg>. Returns a GSAP timeline. */
export function play(svgEl, scene, gsap) {
  stop(svgEl, gsap, false);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyKnobs(svgEl, REST_KNOBS);
    return gsap.timeline();
  }

  const fromState = { ...REST_KNOBS, ...normalizePartial(scene.from) };
  applyKnobs(svgEl, fromState);

  const state = { ...fromState };
  const tl = gsap.timeline();

  for (const step of scene.steps ?? []) {
    const targets = normalizePartial(step.vars);
    tl.to(state, {
      duration: step.duration,
      ease: step.ease ?? 'none',
      ...targets,
      onUpdate: () => applyKnobs(svgEl, state),
    });
  }

  setTween(svgEl, tl);
  return tl;
}
