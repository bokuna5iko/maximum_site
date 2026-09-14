/** Intro v2 — same beats as intro, MAXI/MUM land with a gap around the blade */
import { introNeedleSweep, hiddenTeethFrom } from '../mark.config.js';

const needle = introNeedleSweep();

export const introV2 = {
  id: 'intro-v2',
  title: 'Intro v2',
  from: {
    markOpacity: 0,
    markScale: 0.88,
    wordSpread: 0,
    plateOpen: 0,
    wordGap: 0,
    redDraw: 0,
    needleAngle: needle.start,
    ringSpin: 0,
    tickReact: 1,
    toothReact: 1,
    hubPulse: 1,
    needleImpact: 1,
    redHeat: 0,
    ...hiddenTeethFrom(),
  },
  steps: [
    {
      duration: 0.5,
      ease: 'power2.out',
      vars: {
        markOpacity: 1,
        markScale: 1,
        redDraw: 1,
      },
    },
    {
      duration: 0.14,
      ease: 'power2.out',
      vars: {
        hubPulse: 1.28,
      },
    },
    {
      duration: 1.7,
      ease: 'power2.out',
      vars: {
        needleAngle: needle.peak,
        hubPulse: 1,
        needleImpact: 1.04,
        redHeat: 1,
      },
    },
    {
      duration: 0.32,
      ease: 'power1.inOut',
      vars: {
        needleAngle: needle.settled,
        needleImpact: 1,
        redHeat: 0,
      },
    },
    {
      duration: 0.55,
      ease: 'power2.out',
      vars: {
        plateOpen: 1,
        wordSpread: 1,
        wordGap: 1,
      },
    },
    {
      duration: 0.38,
      ease: 'none',
      vars: {},
    },
  ],
};
