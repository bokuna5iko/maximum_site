import gsap from 'gsap';
import markSvg from './maximum-mark.svg?raw';
import { play, stop, applyKnobs, REST_KNOBS } from './animations/runtime.js';
import { animations } from './animations/index.js';

const markWrap = document.getElementById('mark-wrap');
const loadError = document.getElementById('load-error');
const animSelect = document.getElementById('anim-select');
const btnPlay = document.getElementById('btn-play');
const btnReplay = document.getElementById('btn-replay');
const btnReset = document.getElementById('btn-reset');

/** @type {SVGSVGElement | null} */
let svgEl = null;

for (const scene of animations) {
  const option = document.createElement('option');
  option.value = scene.id;
  option.textContent = scene.title;
  animSelect.appendChild(option);
}

function selectedScene() {
  const id = animSelect.value;
  return animations.find((scene) => scene.id === id) ?? animations[0];
}

function setControlsEnabled(enabled) {
  btnPlay.disabled = !enabled;
  btnReplay.disabled = !enabled;
  btnReset.disabled = !enabled;
}

function showLoadError(message) {
  loadError.textContent = message;
  loadError.hidden = false;
  setControlsEnabled(false);
}

async function loadMark() {
  setControlsEnabled(false);

  try {
    let markup = markSvg.replace(/^<!--[\s\S]*?-->\s*/, '');

    const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('Could not parse maximum-mark.svg');
    }

    svgEl = document.importNode(doc.documentElement, true);
    svgEl.id = 'mark-root';

    markWrap.replaceChildren(svgEl);
    applyKnobs(svgEl, REST_KNOBS);
    setControlsEnabled(true);
    runScene();
  } catch (err) {
    showLoadError(err instanceof Error ? err.message : 'Failed to load SVG');
  }
}

function runScene() {
  if (!svgEl) return;
  play(svgEl, selectedScene(), gsap);
}

btnPlay.addEventListener('click', runScene);
btnReplay.addEventListener('click', runScene);
btnReset.addEventListener('click', () => {
  if (!svgEl) return;
  stop(svgEl, gsap);
});

loadMark();
