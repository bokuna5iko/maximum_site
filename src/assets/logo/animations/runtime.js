import { allKnobs, getTickAngles, getToothAngles, mechanics } from '../mark.config.js';

const registry = allKnobs();

export const REST_KNOBS = Object.fromEntries(
  Object.entries(registry).map(([key, knob]) => [key, knob.rest]),
);

/** Site header rest — intro v2 final pose (wordGap open around blade). */
export const HEADER_REST = {
  ...REST_KNOBS,
  wordGap: 1,
  plateOpen: 1,
  wordSpread: 1,
  tickReact: 1,
  toothReact: 0,
  markOpacity: 1,
  markScale: 1,
  redDraw: 1,
  needleImpact: 1,
  redHeat: 0,
  hubPulse: 1,
};

export const cssName = Object.fromEntries(
  Object.entries(registry).map(([key, knob]) => [key, knob.css]),
);

const cssToKey = Object.fromEntries(Object.entries(cssName).map(([key, cssVar]) => [cssVar, key]));

const DEG_KEYS = new Set(
  Object.entries(registry).filter(([, knob]) => knob.unit === 'deg').map(([key]) => key),
);

const tickAngles = getTickAngles();
const toothAngles = getToothAngles();

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

/** True if GSAP's numeric needle path from prev→curr passes targetDeg. */
function crossedAngle(prev, curr, targetDeg) {
  if (prev === curr) return false;
  const lo = Math.min(prev, curr);
  const hi = Math.max(prev, curr);
  const t0 = normalizeAngle(targetDeg);
  for (let k = -2; k <= 2; k++) {
    const t = t0 + k * 360;
    if (t > lo && t < hi) return true;
  }
  return false;
}

function detectCrossedTicks(prevAngle, currAngle) {
  const crossed = [];
  for (let i = 0; i < tickAngles.length; i++) {
    if (crossedAngle(prevAngle, currAngle, tickAngles[i])) {
      crossed.push(i);
    }
  }
  return crossed;
}

function detectCrossedTeeth(prevAngle, currAngle) {
  const crossed = [];
  for (let i = 0; i < toothAngles.length; i++) {
    if (crossedAngle(prevAngle, currAngle, toothAngles[i])) {
      crossed.push(i);
    }
  }
  return crossed;
}

const tweenStore = new WeakMap();
const pulseStore = new WeakMap();
const latchStore = new WeakMap();

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

function getLatchTweens(svgEl) {
  return latchStore.get(svgEl) ?? svgEl._markLatchTweens ?? {};
}

function setLatchTweens(svgEl, tweens) {
  if (Object.keys(tweens).length) {
    latchStore.set(svgEl, tweens);
    svgEl._markLatchTweens = tweens;
  } else {
    latchStore.delete(svgEl);
    delete svgEl._markLatchTweens;
  }
}

function killLatchTweens(svgEl) {
  for (const tween of Object.values(getLatchTweens(svgEl))) {
    tween.kill();
  }
  setLatchTweens(svgEl, {});
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

function latchToothReveal(svgEl, state, gsap, toothIndex) {
  const revealKey = `toothReveal${toothIndex}`;
  if (state[revealKey] >= 1) return;
  const latches = { ...getLatchTweens(svgEl) };
  latches[toothIndex]?.kill();
  const tween = gsap.to(state, {
    duration: mechanics.toothReveal.durationSec,
    ease: 'back.out(1.7)',
    [revealKey]: 1,
    onUpdate: () => applyKnobs(svgEl, state),
    onComplete: () => {
      const next = { ...getLatchTweens(svgEl) };
      if (next[toothIndex] === tween) delete next[toothIndex];
      setLatchTweens(svgEl, next);
    },
  });
  latches[toothIndex] = tween;
  setLatchTweens(svgEl, latches);
}

/** Scroll / manual needle updates — pulse ticks and latch teeth on angle crossings. */
export function createNeedleDriver(svgEl, gsap, state) {
  let prevAngle = state.needleAngle;

  return {
    onNeedleMove() {
      const currAngle = state.needleAngle;
      if (prevAngle === currAngle) return;
      if (state.tickReact > 0) {
        for (const i of detectCrossedTicks(prevAngle, currAngle)) {
          pulseTickKick(svgEl, state, gsap, i);
        }
      }
      if (state.toothReact > 0) {
        for (const i of detectCrossedTeeth(prevAngle, currAngle)) {
          latchToothReveal(svgEl, state, gsap, i);
        }
      }
      prevAngle = currAngle;
    },
    resetPrevAngle(angle) {
      prevAngle = angle;
    },
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
  killLatchTweens(svgEl);
  if (snapToRest) applyKnobs(svgEl, REST_KNOBS);
}

/** Play a declarative scene on the given <svg>. Returns a GSAP timeline. */
export function play(svgEl, scene, gsap, options = {}) {
  const restKnobs = options.restKnobs ?? REST_KNOBS;
  stop(svgEl, gsap, false);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (options.state) Object.assign(options.state, restKnobs);
    applyKnobs(svgEl, restKnobs);
    return gsap.timeline();
  }

  const fromState = { ...restKnobs, ...normalizePartial(scene.from) };
  if (options.state) {
    Object.assign(options.state, fromState);
  }
  const state = options.state ?? { ...fromState };
  applyKnobs(svgEl, state);

  const needleDriver = createNeedleDriver(svgEl, gsap, state);
  const tl = gsap.timeline();

  for (const step of scene.steps ?? []) {
    const targets = normalizePartial(step.vars ?? {});
    tl.to(state, {
      duration: step.duration,
      ease: step.ease ?? 'none',
      ...targets,
      onUpdate: () => {
        needleDriver.onNeedleMove();
        applyKnobs(svgEl, state);
      },
    });
  }

  setTween(svgEl, tl);
  return tl;
}
