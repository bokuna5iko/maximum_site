/** Intro v3 — linear scroll film. No appear, no needle bounce. */
import { knobs } from '../mark.config.js';

/** One unit = header collapse. Text finishes in the last `textUnits` (compact). */
export const introV3Film = {
  units: 8,
  textUnits: 1,
  degPerUnit: 60,
};

const restNeedle = knobs.needleAngle.rest;

export function createIntroV3({ units = introV3Film.units } = {}) {
  const { textUnits, degPerUnit } = introV3Film;
  const safeUnits = Math.max(textUnits, units);
  const travel = safeUnits * degPerUnit;
  const needleOnlyDur = safeUnits - textUnits;

  const steps = [];
  if (needleOnlyDur > 0) {
    steps.push({
      duration: needleOnlyDur,
      ease: 'none',
      vars: {
        needleAngle: restNeedle - degPerUnit * textUnits,
      },
    });
  }
  steps.push({
    duration: textUnits,
    ease: 'none',
    vars: {
      needleAngle: restNeedle,
      plateOpen: 1,
      wordSpread: 1,
      wordGap: 1,
    },
  });

  return {
    id: 'intro-v3',
    title: 'Intro v3',
    from: {
      markOpacity: 1,
      markScale: 1,
      redDraw: 1,
      wordSpread: 0,
      plateOpen: 0,
      wordGap: 0,
      needleAngle: restNeedle - travel,
      ringSpin: 0,
      tickReact: 1,
      toothReact: 0,
      hubPulse: 1,
      needleImpact: 1,
      redHeat: 0,
    },
    steps,
  };
}

export const introV3 = createIntroV3();
