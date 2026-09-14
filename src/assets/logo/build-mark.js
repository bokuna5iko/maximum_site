/**
 * Generates maximum-mark.svg from mark.config.js
 * Run: node src/assets/logo/build-mark.js
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import config, {
  knobs,
  getTickAngles,
  getToothAngles,
  buildSvgStyleMap,
  mechanics,
  introNeedleSweep,
} from './mark.config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, 'maximum-mark.svg');

const { cx, cy, colors, ring, diskR, ticks, teeth, red, needle, hub, banner, word } = config;
const kickScale = mechanics.tickStrike.kickScale;

/** Stable layer id; suffix keeps preview instances unique */
function elId(name, suffix) {
  return suffix ? `${name}-${suffix}` : name;
}

/** 0° = 12 o'clock, clockwise positive; SVG y-down */
function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.sin(rad),
    y: cy - r * Math.cos(rad),
  };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  let delta = endDeg - startDeg;
  if (delta < 0) delta += 360;
  const largeArc = delta > 180 ? 1 : 0;
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

function buildTicks(suffix) {
  const angles = getTickAngles();
  const hw = ticks.halfWidthDeg;
  return angles
    .map((deg, i) => {
      const outer = polar(cx, cy, ticks.outerR, deg);
      const left = polar(cx, cy, ticks.innerR, deg - hw);
      const right = polar(cx, cy, ticks.innerR, deg + hw);
      const tickId = elId(`mark-tick-${i}`, suffix);
      const points = `${left.x.toFixed(3)},${left.y.toFixed(3)} ${outer.x.toFixed(3)},${outer.y.toFixed(3)} ${right.x.toFixed(3)},${right.y.toFixed(3)}`;
      return `    <g id="${tickId}" data-angle="${deg.toFixed(3)}" data-tick="${i}">
      <polygon points="${points}" fill="${colors.black}"/>
    </g>`;
    })
    .join('\n');
}

function buildTeeth(suffix) {
  const angles = getToothAngles();
  const tipR = teeth.baseR + teeth.depth;
  const baseDegPerPx = 180 / Math.PI / teeth.baseR;
  const tipDegPerPx = 180 / Math.PI / tipR;
  const baseHw = teeth.width / 2;
  const tipHw = teeth.tipWidth / 2;
  return angles
    .map((deg, i) => {
      const baseLeft = polar(cx, cy, teeth.baseR, deg - baseHw * baseDegPerPx);
      const baseRight = polar(cx, cy, teeth.baseR, deg + baseHw * baseDegPerPx);
      const tipLeft = polar(cx, cy, tipR, deg - tipHw * tipDegPerPx);
      const tipRight = polar(cx, cy, tipR, deg + tipHw * tipDegPerPx);
      const d = [
        `M ${baseLeft.x.toFixed(3)} ${baseLeft.y.toFixed(3)}`,
        `L ${tipLeft.x.toFixed(3)} ${tipLeft.y.toFixed(3)}`,
        `L ${tipRight.x.toFixed(3)} ${tipRight.y.toFixed(3)}`,
        `L ${baseRight.x.toFixed(3)} ${baseRight.y.toFixed(3)}`,
        'Z',
      ].join(' ');
      const toothId = elId(`mark-tooth-${i}`, suffix);
      return `    <g id="${toothId}" data-angle="${deg.toFixed(3)}" data-tooth="${i}">
      <path d="${d}" fill="${colors.black}" stroke="${colors.black}" stroke-width="${ring.outerStroke}" stroke-linejoin="miter"/>
    </g>`;
    })
    .join('\n');
}

function buildNeedle() {
  const tip = polar(cx, cy, needle.tipR, 0);
  const tail = polar(cx, cy, needle.tailR, 180);
  const leftHub = polar(cx, cy, needle.halfWidth, 90);
  const rightHub = polar(cx, cy, needle.halfWidth, 270);
  const pt = (p) => `${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
  return {
    left: `M ${pt(tip)} L ${pt(leftHub)} L ${pt(tail)} Z`,
    right: `M ${pt(tip)} L ${pt(tail)} L ${pt(rightHub)} Z`,
  };
}

function cssVarBlock(overrides = {}) {
  const vars = { ...buildSvgStyleMap(), ...overrides };
  return Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
}

function buildSvg(overrides = {}, suffix = '') {
  const varBlock = cssVarBlock(overrides);
  const rootId = suffix ? `mark-root-${suffix}` : 'mark-root';
  const teethId = elId('mark-teeth', suffix);
  const redId = elId('mark-red', suffix);
  const redHeatId = elId('mark-red-heat', suffix);
  const needleId = elId('mark-needle', suffix);
  const needleMassId = elId('mark-needle-mass', suffix);
  const hubId = elId('mark-hub', suffix);
  const bannerId = elId('mark-banner', suffix);
  const wordLeftId = elId('mark-word-left', suffix);
  const wordRightId = elId('mark-word-right', suffix);
  const tickAngles = getTickAngles();
  const toothAngles = getToothAngles();

  const tickCssRules = tickAngles
    .map((_, i) => {
      const tickId = elId(`mark-tick-${i}`, suffix);
      return `    #${rootId} #${tickId} {
      transform: scale(calc(1 + var(--tick-react) * var(--tick-kick-${i}) * ${kickScale}));
      transform-origin: ${cx}px ${cy}px;
      transform-box: view-box;
    }`;
    })
    .join('\n');

  const toothCssRules = toothAngles
    .map((_, i) => {
      const toothId = elId(`mark-tooth-${i}`, suffix);
      return `    #${rootId} #${toothId} {
      transform: scale(var(--tooth-reveal-${i}));
      transform-origin: ${cx}px ${cy}px;
      transform-box: view-box;
    }`;
    })
    .join('\n');

  return `<!--
  Coordinate contract:
  - viewBox 0 0 200 200
  - Center (100, 100)
  - Needle 0° = 12 o'clock, clockwise positive
  - Animate via CSS variables on <svg>; never edit path d
  - No <animate> or @keyframes in this file
-->
<svg id="${rootId}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${config.viewBox} ${config.viewBox}" width="200" height="200" role="img" aria-label="Maximum logo mark" style="
${varBlock}
">
  <style>
    #${rootId} {
      transform: scale(var(--mark-scale));
      transform-origin: ${cx}px ${cy}px;
      opacity: var(--mark-opacity);
    }
    #${rootId} #${teethId} {
      transform: rotate(var(--ring-spin));
      transform-origin: ${cx}px ${cy}px;
      transform-box: view-box;
    }
    #${rootId} #${redId},
    #${rootId} #${redHeatId} {
      stroke-dasharray: 1;
      stroke-dashoffset: calc(1 - var(--red-draw));
    }
    #${rootId} #${redHeatId} {
      opacity: var(--red-heat);
    }
    #${rootId} #${needleId} {
      transform: rotate(var(--needle-angle));
      transform-origin: ${cx}px ${cy}px;
      transform-box: view-box;
    }
    #${rootId} #${needleMassId} {
      transform: scale(var(--needle-impact));
      transform-origin: ${cx}px ${cy}px;
      transform-box: view-box;
    }
    #${rootId} #${hubId} {
      transform: scale(var(--hub-pulse));
      transform-origin: ${cx}px ${cy}px;
      transform-box: view-box;
    }
    #${rootId} #${bannerId} {
      transform: scaleX(var(--plate-open));
      transform-origin: ${cx}px ${cy}px;
    }
    #${rootId} #${wordLeftId} {
      transform: translateX(calc((1 - var(--word-spread)) * ${word.travelPx}px - var(--word-gap) * ${mechanics.wordGapLeftPx}px));
    }
    #${rootId} #${wordRightId} {
      transform: translateX(calc((var(--word-spread) - 1) * ${word.travelPx}px + var(--word-gap) * ${mechanics.wordGapRightPx}px));
    }
    #${rootId} .mark-word {
      font-family: 'Russo One', sans-serif;
      font-style: italic;
      font-size: ${word.fontSize}px;
      font-weight: 400;
      letter-spacing: ${word.letterSpacing};
    }
${tickCssRules}
${toothCssRules}
  </style>

  <g id="${elId('mark-ring', suffix)}">
    <circle cx="${cx}" cy="${cy}" r="${ring.midR}" fill="none" stroke="${colors.white}" stroke-width="${ring.thickness}"/>
    <circle cx="${cx}" cy="${cy}" r="${ringOuterR}" fill="none" stroke="${colors.black}" stroke-width="${ring.outerStroke}"/>
    <circle cx="${cx}" cy="${cy}" r="${ringInnerR}" fill="none" stroke="${colors.black}" stroke-width="${(ring.outerStroke * 0.8).toFixed(2)}"/>
  </g>

  <g id="${teethId}">
${buildTeeth(suffix)}
  </g>

  <circle id="${elId('mark-disk', suffix)}" cx="${cx}" cy="${cy}" r="${diskR}" fill="${colors.black}"/>

  <path id="${redId}" d="${redArc}" fill="none" stroke="${colors.red}" stroke-width="${ring.thickness}" stroke-linecap="butt" pathLength="1"/>
  <path id="${redHeatId}" d="${redArc}" fill="none" stroke="${colors.redAlt}" stroke-width="${ring.thickness}" stroke-linecap="butt" pathLength="1"/>

  <g id="${elId('mark-ticks', suffix)}">
${buildTicks(suffix)}
  </g>

${clipDefs(suffix)}

  <g id="${bannerId}">
    <rect x="${bannerX.toFixed(3)}" y="${bannerY.toFixed(3)}" width="${banner.width}" height="${banner.height}" rx="${banner.radius}" fill="${colors.plate}" stroke="${colors.plateStroke}" stroke-width="${banner.borderWidth}"/>
    <g clip-path="url(#${elId('clip-banner-left', suffix)})">
      <g mask="url(#${elId('mask-word-slash', suffix)})">
        <text id="${wordLeftId}" class="mark-word" x="${leftTextX}" y="${word.y}" text-anchor="end" fill="${colors.white}">${word.left}</text>
      </g>
    </g>
    <g clip-path="url(#${elId('clip-banner-right', suffix)})">
      <g mask="url(#${elId('mask-word-slash', suffix)})">
        <text id="${wordRightId}" class="mark-word" x="${rightTextX}" y="${word.y}" text-anchor="start" fill="${colors.red}">${word.right}</text>
      </g>
    </g>
  </g>

  <g id="${needleId}">
    <g id="${needleMassId}">
      <path d="${needlePath.left}" fill="${colors.needleDark}" stroke="${colors.needleStroke}" stroke-width="0.45" stroke-linejoin="round"/>
      <path d="${needlePath.right}" fill="${colors.needleFill}" stroke="${colors.needleStroke}" stroke-width="0.45" stroke-linejoin="round"/>
      <circle id="${hubId}" cx="${cx}" cy="${cy}" r="${hub.r}" fill="${colors.hubFill}" stroke="${colors.hubStroke}" stroke-width="${hub.strokeWidth}"/>
    </g>
  </g>
</svg>`;
}

function buildPreviewHtml(svgBody) {
  const needle = introNeedleSweep();
  const states = [
    { label: 'Rest / final logo', overrides: {}, suffix: 'rest' },
    { label: 'Plate closed (--plate-open: 0)', overrides: { '--plate-open': '0', '--word-spread': '0' }, suffix: 'plate-shut' },
    { label: 'Plate open, words hidden (--word-spread: 0)', overrides: { '--word-spread': '0' }, suffix: 'collapsed' },
    {
      label: `Needle pre-sweep (--needle-angle: ${needle.start}deg)`,
      overrides: { '--needle-angle': `${needle.start}deg` },
      suffix: 'needle-presweep',
    },
    {
      label: `Needle redline (--needle-angle: ${needle.peakNorm}deg)`,
      overrides: { '--needle-angle': `${needle.peakNorm}deg` },
      suffix: 'needle-red',
    },
    {
      label: 'Red undrawn + teeth spun (--red-draw: 0, --ring-spin: 20deg)',
      overrides: { '--red-draw': '0', '--ring-spin': '20deg' },
      suffix: 'red-spin',
    },
    {
      label: 'Tick 7 kicked (--tick-react: 1, --tick-kick-7: 1)',
      overrides: { '--tick-react': '1', '--tick-kick-7': '1' },
      suffix: 'tick-kick',
    },
    {
      label: 'Tooth 3 hidden (--tooth-reveal-3: 0)',
      overrides: { '--tooth-reveal-3': '0' },
      suffix: 'tooth-hidden',
    },
    {
      label: 'Needle impact (--needle-impact: 1.04)',
      overrides: { '--needle-impact': '1.04' },
      suffix: 'needle-impact',
    },
    {
      label: 'Red heat (--red-heat: 1)',
      overrides: { '--red-heat': '1' },
      suffix: 'red-heat',
    },
    {
      label: 'Hub pulse (--hub-pulse: 1.25)',
      overrides: { '--hub-pulse': '1.25' },
      suffix: 'hub-pulse',
    },
    {
      label: 'Word gap (--word-gap: 1)',
      overrides: { '--word-gap': '1' },
      suffix: 'word-gap',
    },
  ];

  const panels = states
    .map(({ label, overrides, suffix }) => {
      const svg = buildSvg(overrides, suffix);
      return `    <figure class="panel">
      <div class="mark-wrap">${svg}</div>
      <figcaption>${label}</figcaption>
    </figure>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Maximum Mark Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 2rem;
      font-family: system-ui, sans-serif;
      background: #fff;
      color: #201E1E;
    }
    h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
    .note { margin: 0 0 2rem; color: #555; font-size: 0.9rem; }
    .compare {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      align-items: flex-start;
      margin-bottom: 2.5rem;
    }
    .compare figure { margin: 0; text-align: center; }
    .compare img, .mark-wrap svg {
      width: 200px;
      height: 200px;
      display: block;
    }
    figcaption {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      max-width: 220px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
    }
    .panel { margin: 0; text-align: center; }
    .mark-wrap { display: inline-block; }
  </style>
</head>
<body>
  <h1>Maximum Mark Preview</h1>
  <p class="note">Rebuild SVG: <code>node src/assets/logo/build-mark.js</code><br/>Play animations (Vite): <code>/logo-play.html</code></p>

  <section class="compare">
    <figure>
      <img src="reference.png" width="200" height="200" alt="Reference PNG"/>
      <figcaption>Original reference.png</figcaption>
    </figure>
    <figure>
      <div class="mark-wrap">${svgBody}</div>
      <figcaption>Generated maximum-mark.svg (defaults)</figcaption>
    </figure>
  </section>

  <section class="grid">
${panels}
  </section>
</body>
</html>`;
}

const ringOuterR = ring.midR + ring.thickness / 2;
const ringInnerR = ring.midR - ring.thickness / 2;
const bannerX = cx - banner.width / 2;
const bannerY = banner.y - banner.height / 2;
const bannerHalf = banner.width / 2;
const leftTextX = cx - word.centerGapPx / 2;
const rightTextX = cx + word.centerGapPx / 2;
const needleRestDeg = knobs.needleAngle.rest;
const redArc = arcPath(cx, cy, ring.midR, red.startDeg, red.endDeg);
const needlePath = buildNeedle();

function clipDefs(suffix) {
  const bannerLeftId = elId('clip-banner-left', suffix);
  const bannerRightId = elId('clip-banner-right', suffix);
  const slashMaskId = elId('mask-word-slash', suffix);
  const clipY = bannerY - 6;
  const clipH = banner.height + 12;
  const clipOverlap = 12;
  return `  <defs>
    <clipPath id="${bannerLeftId}">
      <rect x="${bannerX.toFixed(3)}" y="${clipY.toFixed(3)}" width="${bannerHalf + clipOverlap}" height="${clipH}"/>
    </clipPath>
    <clipPath id="${bannerRightId}">
      <rect x="${cx - clipOverlap}" y="${clipY.toFixed(3)}" width="${bannerHalf + clipOverlap}" height="${clipH}"/>
    </clipPath>
    <mask id="${slashMaskId}" maskUnits="userSpaceOnUse">
      <rect x="0" y="0" width="${config.viewBox}" height="${config.viewBox}" fill="#ffffff"/>
      <g transform="rotate(${needleRestDeg} ${cx} ${cy})">
        <path d="${needlePath.left}" fill="#000000"/>
        <path d="${needlePath.right}" fill="#000000"/>
      </g>
    </mask>
  </defs>`;
}

const svg = buildSvg();
const previewPath = join(__dirname, 'preview.html');

writeFileSync(outPath, svg, 'utf8');
writeFileSync(previewPath, buildPreviewHtml(svg), 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Wrote ${previewPath}`);
