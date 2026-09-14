/** Intro scene — declarative knobs only; GSAP lives in runtime.js */
import { introNeedleSweep } from '../mark.config.js';

const needle = introNeedleSweep();

export const intro = {
  id: 'intro',
  title: 'Intro',
  from: {
    markOpacity: 0,
    markScale: 0.88,
    wordSpread: 0,
    plateOpen: 0,
    redDraw: 0,
    needleAngle: needle.start,
    ringSpin: 0,
    tickReact: 1,
  },
  steps: [
    {
      duration: 0.45,
      ease: 'power2.out',
      vars: {
        markOpacity: 1,
        markScale: 1,
      },
    },
    {
      duration: 0.55,
      ease: 'sine.out',
      vars: {
        redDraw: 1,
      },
    },
    {
      duration: 1.25,
      ease: 'power2.out',
      vars: {
        needleAngle: needle.peak,
      },
    },
    {
      duration: 0.32,
      ease: 'power1.inOut',
      vars: {
        needleAngle: needle.settled,
      },
    },
    {
      duration: 0.55,
      ease: 'power2.out',
      vars: {
        plateOpen: 1,
        wordSpread: 1,
      },
    },
  ],
};
