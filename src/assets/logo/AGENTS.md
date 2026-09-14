# Maximum mark — инструкция для агента

Не анализируй SVG с нуля и не правь path руками. Источник правды — этот файл + `mark.config.js`.

Это **интерпретация** знака для анимации, не копия `reference.png`. Растр — вдохновение. Не подгонять плашку под чёрно-белый шильдик оригинала и не трассировать PNG.

## Карта файлов

| Файл | Роль |
|---|---|
| `mark.config.js` | Геометрия, реестр ручек (`knobs`), `mechanics`, хелперы |
| `build-mark.js` | Генератор. Пишет `maximum-mark.svg` и статичный `preview.html` |
| `maximum-mark.svg` | Картинка. Слои + CSS-переменные. Без `@keyframes` и SMIL |
| `preview.html` | Статичные состояния ручек. **Перезаписывается генератором** |
| `play.js` | Песочница. SVG через `?raw` (только Vite) |
| `logo-play.html` | Корень репо. Плеер: `/logo-play.html` |
| `animations/runtime.js` | Единственный плеер: выставляет ручки на `<svg>` |
| `animations/intro.js` | Зафиксированная intro-сцена |
| `animations/index.js` | Реестр сцен |
| `reference.png` | Исторический оригинал, не эталон пиксель-в-пиксель |

Сайт (`index.html`, шапка) не трогать, пока пользователь явно не попросит вставить знак.

## Координаты

- viewBox `0 0 200 200`, центр `(100, 100)`
- Стрелка: `0deg` = 12 часов, дальше по часовой
- Покой (identity): `--needle-angle: 34deg`, `--plate-open: 1`, `--word-spread: 1`, `--red-draw: 1`, `--ring-spin: 0deg`, `--mark-scale: 1`, `--mark-opacity: 1`, `--tick-react: 0`, все `--tick-kick-N: 0`, `--needle-impact: 1`, `--red-heat: 0`, `--hub-pulse: 1`

## Ручки (анимация только ими)

Реестр в `mark.config.js` → `knobs` + сгенерированные `tickKick0`…`tickKick{n-1}` через `allKnobs()`. Runtime импортирует `allKnobs()` — не дублировать rest/css в `runtime.js`.

На корневом `<svg>`:

- `--needle-angle` — `deg`, вращение `#mark-needle`
- `--needle-impact` — `1` в покое, `scale` на `#mark-needle-mass`
- `--plate-open` — `0` шильдик в оси, `1` раскрыт (`scaleX` у `#mark-banner`)
- `--word-spread` — `0` MAXI/MUM спрятаны в клипах, `1` выехали
- `--red-draw` — `0..1` дорисовка красной дуги (`#mark-red`)
- `--red-heat` — `0..1` оверлей `#mark-red-heat` (тот же path/dash, opacity overlay; базовый красный не трогать)
- `--ring-spin` — `deg`, крутит только `#mark-teeth`
- `--mark-scale`, `--mark-opacity` — появление всего знака
- `--tick-react` — `0..1`, включает авто-удар рисок при движении стрелки (runtime)
- `--tick-kick-N` — `0..1` на каждую риску; CSS `scale` от центра viewBox; runtime пульсирует при пересечении угла стрелкой
- `--hub-pulse` — `1` в покое, `scale` на `#mark-hub` (внутри `#mark-needle-mass`)

`--red-start` / `--red-end` в SVG для справки; дуга запечена. Сектор менять в `mark.config.js` + пересборка, не анимировать эти две переменные.

### Tick strike (риски)

Конструктор эмитит `--tick-kick-N` + `data-angle` на группах `#mark-tick-N`. CSS: `scale(calc(1 + var(--tick-react) * var(--tick-kick-N) * kickScale))`. Runtime при `tickReact > 0` смотрит числовой путь GSAP `prev→curr` (рост = по часовой, спад = против) и пульсирует kick → 0 за `mechanics.tickStrike.decaySec`, если развёрнутый угол риски попал в интервал. Сцены **не** ключируют каждую риску — только `tickReact` и движение стрелки.

### Needle waypoints (стрелка)

Сцены **не** хардкодят градусы для intro-пути стрелки. Источник — `introNeedleSweep()` в `mark.config.js` + хелперы `normalizeDeg`, `unwindClockwise`, `unwindCounterclockwise`.

**Почему unwrap:** GSAP интерполирует сырые числа. `248 → 80` уменьшается (против часовой). Чтобы sweep по часовой прошёл через все риски и вошёл в красную зону, нужна развёрнутая возрастающая числовая линия: `236 → 440`, затем отскок `440 → 394`.

Параметры в `mechanics.needleSweep`: `leadDeg` (старт до первой риски), `redInsetDeg` (пик = `red.endDeg - inset`). Текущая геометрия даёт `start ≈ 236`, `peakNorm = 80`, `peak ≈ 440`, `settled ≈ 394`, `restNorm = 34`.

**Покой в реестре** остаётся `knobs.needleAngle.rest = 34`. После intro live CSS может быть `394deg` — тот же визуальный угол. Reset / `prefers-reduced-motion` сбрасывают в `34deg`.

## Зафиксированная intro

Порядок в `animations/intro.js` (не вставляй лишний такт):

1. Появление циферблата (`markOpacity` / `markScale`)
2. Красная зона (`redDraw`)
3. Стрелка: clockwise pre-sweep (`introNeedleSweep().start` → `.peak`) — все риски, вход в красную зону
4. Отскок к покою (`needle.peak` → `needle.settled`)
5. **Одновременно** `plateOpen: 1` и `wordSpread: 1`

В `from` включён `tickReact: 1` — риски кликают при движении стрелки. Не раскрывать пустой шильдик до текста: получается «квадрат, потом буквы». Плашка и слово растут от лезвия вместе.

## Слои (id без суффикса в `maximum-mark.svg`)

`mark-ring` → `mark-teeth` → `mark-disk` → `mark-red` + `mark-red-heat` → `mark-ticks` (`mark-tick-0`… группы, поверх красной дуги) → `mark-banner` → MAXI/MUM → `mark-needle` → `mark-needle-mass` → paths + `mark-hub`

Стрелка — два уровня transform: `#mark-needle` (rotate `--needle-angle`), `#mark-needle-mass` (scale `--needle-impact`). Хаб внутри mass.

Шильдик — один тёмный HUD-бар на диске, светлая обводка. Не чёрно-белый флаг: белая половина сливается с кольцом.

Текст: `MAXI` белый слева, `MUM` красный справа (не `MA`/`IMUM`). Живёт в клипах половинок плашки. Маска вычитает форму лезвия в покое — стрелка тонкий слеш, не толстый ромб поверх букв. Не поднимай `needle.halfWidth` «под оригинал».

В `preview.html` id с суффиксом. Сцены играть на `logo-play.html`, svg id `mark-root`.

## Как добавить анимацию

1. Новый файл `animations/<id>.js` по форме `intro.js`: `{ id, title, from, steps }`.
2. `from` / `steps[].vars` — только ручки из `allKnobs()`.
3. Запись в `animations/index.js`.
4. GSAP только в `runtime.js`.
5. `prefers-reduced-motion`: runtime сразу в покой.
6. Смотреть: `npm run dev` → в терминале `Local: http://localhost:ПОРТ/` → `http://localhost:ПОРТ/logo-play.html`. Не `file://`, не `/play.html`.

### Как добавить ручку

1. Добавить в `knobs` в `mark.config.js` (или расширить генерацию tick kicks).
2. Привязать CSS в `build-mark.js` (style block / inline transform).
3. `node src/assets/logo/build-mark.js`
4. Runtime подхватит из `allKnobs()` автоматически.

## Запрещено

- Править `d="..."` в `maximum-mark.svg`
- `<animate>` / сцену `@keyframes` в SVG
- Копировать SVG в каждый файл анимации
- Гнаться за `reference.png` ценой анимации (трассировка, булевы дырки в каждой букве)
- Отдельный шаг «пустая плашка», потом текст
- Вставлять знак в шапку/герой без явной просьбы
- Анимировать `--red-start` / `--red-end`
- Blade gleam, particles, per-letter knobs

## Пересборка знака

```bash
node src/assets/logo/build-mark.js
```

После смены чисел в `mark.config.js`. `logo-play.html` и `animations/` генератор не трогает (кроме перегенерации `preview.html`).
