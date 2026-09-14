import { allKnobs, getTickAngles, mechanics } from '../mark.config.js';

const registry = allKnobs();

export const REST_KNOBS = Object.fromEntries(
  Object.entries(registry).map(([key, knob]) => [key, knob.rest]),
);

export const cssName = Object.fromEntries(
  Object.entries(registry).map(([key, knob]) => [key, knob.css]),
);

const cssToKey = Object.fromEntries(Object.entries(cssName).map(([key, cssVar]) => [cssVar, key]));

const DEG_KEYS = new Set(
  Object.entries(registry).filter(([, knob]) => knob.unit === 'deg').map(([key]) => key),
);

const tickAngles = getTickAngles();

function normalizeAngle(deg) {
  return ((deg % 360) + 360) % 360;
}

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

/** True if GSAP's numeric needle path from prev→curr passes tickDeg. */
function crossedTick(prev, curr, tickDeg) {
  if (prev === curr) return false;
  const lo = Math.min(prev, curr);
  const hi = Math.max(prev, curr);
  const t0 = normalizeAngle(tickDeg);
  for (let k = -2; k <= 2; k++) {
    const t = t0 + k * 360;
    if (t > lo && t < hi) return true;
  }
  return false;
}

function detectCrossedTicks(prevAngle, currAngle) {
  const crossed = [];
  for (let i = 0; i < tickAngles.length; i++) {
    if (crossedTick(prevAngle, currAngle, tickAngles[i])) {
      crossed.push(i);
    }
  }
  return crossed;
}

const tweenStore = new WeakMap();
const pulseStore = new WeakMap();

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

function getPulseTweens(svgEl) {
  return pulseStore.get(svgEl) ?? svgEl._markPulseTweens ?? {};
}

function setPulseTweens(svgEl, tweens) {
  if (Object.keys(tweens).length) {
    pulseStore.set(svgEl, tweens);
    svgEl._markPulseTweens = tweens;
  } else {
    pulseStore.delete(svgEl);
    delete svgEl._markPulseTweens;
  }
}

function killPulseTweens(svgEl) {
  for (const tween of Object.values(getPulseTweens(svgEl))) {
    tween.kill();
  }
  setPulseTweens(svgEl, {});
}

function pulseTickKick(svgEl, state, gsap, tickIndex) {
  const kickKey = `tickKick${tickIndex}`;
  const pulses = { ...getPulseTweens(svgEl) };
  pulses[tickIndex]?.kill();

  state[kickKey] = 1;
  applyKnobs(svgEl, state);

  const tween = gsap.to(state, {
    duration: mechanics.tickStrike.decaySec,
    ease: 'power2.out',
    [kickKey]: 0,
    onUpdate: () => applyKnobs(svgEl, state),
    onComplete: () => {
      const next = { ...getPulseTweens(svgEl) };
      if (next[tickIndex] === tween) delete next[tickIndex];
      setPulseTweens(svgEl, next);
    },
  });

  pulses[tickIndex] = tween;
  setPulseTweens(svgEl, pulses);
}

function makeTickStrikeHandler(svgEl, state, gsap) {
  let prevAngle = state.needleAngle;

  return () => {
    const currAngle = state.needleAngle;
    if (state.tickReact <= 0 || prevAngle === currAngle) {
      prevAngle = currAngle;
      return;
    }

    const crossed = detectCrossedTicks(prevAngle, currAngle);
    for (const i of crossed) {
      pulseTickKick(svgEl, state, gsap, i);
    }
    prevAngle = currAngle;
  };
}

/** Kill any active timeline and optionally snap to rest. */
export function stop(svgEl, gsap, snapToRest = true) {
  const tween = getTween(svgEl);
  if (tween) {
    tween.kill();
    setTween(svgEl, null);
  }
  killPulseTweens(svgEl);
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
  const onTickStrike = makeTickStrikeHandler(svgEl, state, gsap);
  const tl = gsap.timeline();

  for (const step of scene.steps ?? []) {
    const targets = normalizePartial(step.vars);
    tl.to(state, {
      duration: step.duration,
      ease: step.ease ?? 'none',
      ...targets,
      onUpdate: () => {
        onTickStrike();
        applyKnobs(svgEl, state);
      },
    });
  }

  setTween(svgEl, tl);
  return tl;
}
