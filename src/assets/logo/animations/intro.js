/** Intro scene — declarative knobs only; GSAP lives in runtime.js */
export const intro = {
  id: 'intro',
  title: 'Intro',
  from: {
    markOpacity: 0,
    markScale: 0.88,
    wordSpread: 0,
    redDraw: 0,
    needleAngle: -50,
    ringSpin: 0,
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
      duration: 0.7,
      ease: 'power2.out',
      vars: {
        needleAngle: 42,
      },
    },
    {
      duration: 0.28,
      ease: 'power1.inOut',
      vars: {
        needleAngle: 34,
      },
    },
    {
      duration: 0.5,
      ease: 'power2.out',
      vars: {
        wordSpread: 1,
      },
    },
  ],
};
