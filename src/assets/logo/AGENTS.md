# Maximum mark — инструкция для агента

Не анализируй SVG с нуля и не правь path руками. Источник правды — этот файл + `mark.config.js`.

## Карта файлов

| Файл | Роль |
|---|---|
| `mark.config.js` | Геометрия и значения ручек по умолчанию |
| `build-mark.js` | Генератор. Пишет `maximum-mark.svg` и статичный `preview.html` |
| `maximum-mark.svg` | Картинка. Слои + CSS-переменные. Без `@keyframes` и SMIL |
| `preview.html` | Статичные состояния ручек. **Перезаписывается генератором** |
| `play.js` | Песочница анимаций. Страница: корневой `logo-play.html` |
| `animations/runtime.js` | Единственный способ играть сцену: выставляет ручки на `<svg>` |
| `animations/*.js` | Одна сцена = один файл. Реестр: `animations/index.js` |
| `reference.png` | Оригинал для сверки |

Сайт (`index.html`, шапка) не трогать, пока пользователь явно не попросит вставить знак.

## Координаты

- viewBox `0 0 200 200`, центр `(100, 100)`
- Стрелка: `0deg` = 12 часов, дальше по часовой
- Покой знака (финал intro): `--needle-angle: 34deg`, `--word-spread: 1`, `--red-draw: 1`, `--ring-spin: 0deg`, `--mark-scale: 1`, `--mark-opacity: 1`

## Ручки (анимация только ими)

На корневом `<svg>`:

- `--needle-angle` — `deg`
- `--word-spread` — `0` слово на оси, `1` MAXIMUM
- `--red-draw` — `0..1` дорисовка красной дуги
- `--ring-spin` — `deg`, крутит только `#mark-teeth`
- `--mark-scale`, `--mark-opacity` — появление всего знака

`--red-start` / `--red-end` записаны в SVG для справки; дуга запечена генератором. Чтобы сменить сектор — правь `mark.config.js` и пересобери, не анимируй эти две переменные.

Нет ручки на покадровые риски. Не имитируй вспышку рисок правкой DOM/`d`. Нужен stagger — сначала новая ручка в конструкторе.

## Слои (id без суффикса в `maximum-mark.svg`)

`mark-ring` → `mark-teeth` → `mark-ticks` → `mark-disk` → `mark-red` → `mark-banner` → `mark-word-left` → `mark-word-right` → `mark-needle` → `mark-hub`

В `preview.html` id с суффиксом (`-rest`, `-collapsed`, …). Для сцен брать экземпляр из `logo-play.html` с id `mark-root`.

## Как добавить анимацию

1. Новый файл `animations/<id>.js`. Копируй форму `intro.js`: `{ id, title, from, steps }`.
2. `from` — стартовые ручки. `steps` — `{ duration, ease, vars }` только из списка ручек.
3. Зарегистрируй в `animations/index.js`.
4. Не дублируй GSAP-логику: только данные сцены. Играет `runtime.js`.
5. `prefers-reduced-motion`: runtime прыгает в покой из конфига, без таймлайна.
6. Проверка: `npm run dev`, в терминале взять `Local: http://localhost:ПОРТ/`, открыть `http://localhost:ПОРТ/logo-play.html`. Не `file://` и не `/play.html`.

## Запрещено

- Править `d="..."` в `maximum-mark.svg`
- Писать `<animate>` / сцену `@keyframes` в SVG
- Копировать SVG внутрь каждого файла анимации
- Открывать плеер как `file://` или `/play.html` (нужен Vite: `/logo-play.html`)
- Вставлять знак в шапку/герой без явной просьбы

## Пересборка знака

```bash
node src/assets/logo/build-mark.js
```

После смены чисел в `mark.config.js`. `logo-play.html` и `animations/` генератор не трогает.
