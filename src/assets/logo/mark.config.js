/**
 * Maximum mark geometry & CSS variable defaults.
 *
 * Change numbers here, then rerun:
 *   node src/assets/logo/build-mark.js
 *
 * Do NOT hand-edit path data in maximum-mark.svg.
 */

export const config = {
  viewBox: 200,
  cx: 100,
  cy: 100,

  colors: {
    black: '#201E1E',
    red: '#ED3237',
    redAlt: '#c41218',
    white: '#FFFFFF',
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
    halfWidth: 7,
  },

  hub: {
    r: 2.2,
    strokeWidth: 0.8,
  },

  banner: {
    width: 148,
    height: 28,
    /** Left black panel meets the needle at center */
    blackInsertWidth: 74,
    borderWidth: 1.6,
    y: 100,
  },

  word: {
    fontSize: 20,
    travelPx: 22,
    centerGapPx: 0,
    y: 106,
    skewDeg: -9,
    letterSpacing: '-0.06em',
  },

  /** Default CSS custom properties on the root <svg> */
  css: {
    '--needle-angle': '34deg',
    '--word-spread': '1',
    '--red-start': '12deg',
    '--red-end': '88deg',
    '--red-draw': '1',
    '--ring-spin': '0deg',
    '--mark-scale': '1',
    '--mark-opacity': '1',
  },
};

export default config;
