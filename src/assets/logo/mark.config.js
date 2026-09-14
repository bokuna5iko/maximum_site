/**
 * Maximum mark geometry & CSS variable defaults.
 *
 * Change numbers here, then rerun:
 *   node src/assets/logo/build-mark.js
 *
 * Do NOT hand-edit path data in maximum-mark.svg.
 */

export const knobs = {
  needleAngle: { css: '--needle-angle', rest: 34, unit: 'deg' },
  wordSpread: { css: '--word-spread', rest: 1, unit: '' },
  plateOpen: { css: '--plate-open', rest: 1, unit: '' },
  redDraw: { css: '--red-draw', rest: 1, unit: '' },
  ringSpin: { css: '--ring-spin', rest: 0, unit: 'deg' },
  markScale: { css: '--mark-scale', rest: 1, unit: '' },
  markOpacity: { css: '--mark-opacity', rest: 1, unit: '' },
  tickReact: { css: '--tick-react', rest: 0, unit: '' },
  toothReact: { css: '--tooth-react', rest: 0, unit: '' },
  needleImpact: { css: '--needle-impact', rest: 1, unit: '' },
  redHeat: { css: '--red-heat', rest: 0, unit: '' },
  hubPulse: { css: '--hub-pulse', rest: 1, unit: '' },
  wordGap: { css: '--word-gap', rest: 0, unit: '' },
};

export const mechanics = {
  tickStrike: {
    kickScale: 0.07,
    decaySec: 0.12,
  },
  toothReveal: {
    durationSec: 0.18,
  },
  needleSweep: {
    leadDeg: 12,
    redInsetDeg: 8,
  },
  /** Px each half moves from the blade when --word-gap is 1. Right is smaller so M matches I (italic + 34° slash). */
  wordGapLeftPx: 5,
  wordGapRightPx: 2,
  scrollDegPerPx: 0.2,
};

export const config = {
  viewBox: 200,
  cx: 100,
  cy: 100,

  colors: {
    black: '#201E1E',
    red: '#ED3237',
    redAlt: '#c41218',
    white: '#FFFFFF',
    plate: '#1A1B1E',
    plateStroke: '#F2F2F2',
    needleFill: '#F0F0F0',
    needleDark: '#3A3A3A',
    needleHighlight: '#FFFFFF',
    needleStroke: '#201E1E',
    hubFill: '#FFFFFF',
    hubStroke: '#201E1E',
  },

  ring: {
    midR: 77,
    thickness: 17,
    outerStroke: 1.5,
  },

  diskR: 65,

  ticks: {
    count: 8,
    /** Degrees clockwise from 12 o'clock — top-left through top */
    startDeg: 248,
    endDeg: 38,
    innerR: 71,
    outerR: 84,
    halfWidthDeg: 1.4,
  },

  teeth: {
    count: 7,
    /** Bottom arc only */
    startDeg: 128,
    endDeg: 232,
    baseR: 85.5,
    depth: 6,
    width: 11,
    tipWidth: 6.5,
  },

  red: {
    startDeg: 12,
    endDeg: 88,
  },

  needle: {
    tipR: 87,
    tailR: 44,
    /** Thin blade so the slash cuts letters instead of covering them */
    halfWidth: 2.3,
  },

  hub: {
    r: 2.2,
    strokeWidth: 0.8,
  },

  banner: {
    width: 118,
    height: 26,
    borderWidth: 1.8,
    radius: 2,
    y: 100,
  },

  word: {
    left: 'MAXI',
    right: 'MUM',
    fontSize: 20,
    /** Must exceed half-word width so spread 0 hides glyphs inside the clip */
    travelPx: 58,
    centerGapPx: 0,
    y: 106,
    skewDeg: -9,
    letterSpacing: '-0.06em',
  },
};

/** 0° = 12 o'clock, clockwise positive; normalizes to 0..360 */
export function lerpAngle(start, end, count) {
  if (count <= 1) return [start];
  const angles = [];
  let span = end - start;
  if (span < 0) span += 360;
  for (let i = 0; i < count; i++) {
    const a = start + (span * i) / (count - 1);
    angles.push(((a % 360) + 360) % 360);
  }
  return angles;
}

export function getTickAngles() {
  const { startDeg, endDeg, count } = config.ticks;
  return lerpAngle(startDeg, endDeg, count);
}

export function getToothAngles() {
  const { startDeg, endDeg, count } = config.teeth;
  return lerpAngle(startDeg, endDeg, count);
}

/** Normalize any degree to 0..360 */
export function normalizeDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

/** Unwrapped clockwise target on GSAP's numeric line (no extra full revolution when already there) */
export function unwindClockwise(from, toNorm) {
  const fromNorm = normalizeDeg(from);
  const to = normalizeDeg(toNorm);
  const delta = (to - fromNorm + 360) % 360;
  if (delta === 0) return from;
  return from + delta;
}

/** Unwrapped counterclockwise target on GSAP's numeric line */
export function unwindCounterclockwise(from, toNorm) {
  const fromNorm = normalizeDeg(from);
  const to = normalizeDeg(toNorm);
  const delta = (fromNorm - to + 360) % 360;
  if (delta === 0) return from;
  return from - delta;
}

/** Intro needle path: pre-sweep start → redline peak → bounce to rest */
export function introNeedleSweep() {
  const teeth = getToothAngles();
  const start = teeth[0] - mechanics.needleSweep.leadDeg;
  const peakNorm = config.red.endDeg - mechanics.needleSweep.redInsetDeg;
  const restNorm = knobs.needleAngle.rest;
  const peak = unwindClockwise(start, peakNorm);
  const settled = unwindCounterclockwise(peak, restNorm);
  return { start, peak, settled, peakNorm, restNorm };
}

export function allKnobs() {
  const tickAngles = getTickAngles();
  const toothAngles = getToothAngles();
  const tickKicks = {};
  for (let i = 0; i < tickAngles.length; i++) {
    tickKicks[`tickKick${i}`] = { css: `--tick-kick-${i}`, rest: 0, unit: '' };
  }
  const toothReveals = {};
  for (let i = 0; i < toothAngles.length; i++) {
    toothReveals[`toothReveal${i}`] = { css: `--tooth-reveal-${i}`, rest: 1, unit: '' };
  }
  return { ...knobs, ...tickKicks, ...toothReveals };
}

/** Intro from-state: all tooth reveals hidden */
export function hiddenTeethFrom() {
  const toothAngles = getToothAngles();
  const out = {};
  for (let i = 0; i < toothAngles.length; i++) {
    out[`toothReveal${i}`] = 0;
  }
  return out;
}

export function formatKnobCssValue(knob) {
  const { rest, unit } = knob;
  return unit ? `${rest}${unit}` : String(rest);
}

export function buildSvgStyleMap() {
  const map = {};
  for (const knob of Object.values(allKnobs())) {
    map[knob.css] = formatKnobCssValue(knob);
  }
  map['--red-start'] = `${config.red.startDeg}deg`;
  map['--red-end'] = `${config.red.endDeg}deg`;
  return map;
}

export default config;
