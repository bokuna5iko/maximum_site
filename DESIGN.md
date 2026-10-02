---
name: Центр Техники МАКСИМУМ
description: Светлый зал салона, тёмные плиты техники, оранжевый только на действие.
colors:
  orange: "#ff5500"
  orange-ink: "#cc3c00"
  red: "#ff2a00"
  red-ink: "#d23219"
  cyan: "#00b4d8"
  graphite: "#18191c"
  graphite-hover: "#222429"
  hall: "#f4f6f9"
  hall-alt: "#e9ecef"
  surface: "#ffffff"
  field: "#f8fafc"
  ink: "#1e293b"
  muted: "#556070"
  on-dark: "#ffffff"
  on-dark-muted: "#94a3b8"
  on-dark-soft: "#e2e8f0"
  line: "#cbd5e1"
  line-soft: "#e2e8f0"
typography:
  display:
    fontFamily: "Russo One, Montserrat, sans-serif"
    fontSize: "clamp(2.15rem, 4.8vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "1px"
  headline:
    fontFamily: "Russo One, Montserrat, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.4rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "1px"
  title:
    fontFamily: "Russo One, Montserrat, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "1px"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Russo One, Montserrat, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.5px"
rounded:
  sm: "8px"
  md: "16px"
  chip: "6px"
  pill: "20px"
spacing:
  container-x: "20px"
  container-x-mobile: "16px"
  action-gap: "16px"
  section-y: "80px"
  section-y-mobile: "60px"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, #cc3c00 0%, #d23219 100%)"
    textColor: "{colors.on-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
    height: "44px"
  button-outline-dark:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
    height: "44px"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
  card-dark:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-dark}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "30px 24px"
  chip-stock:
    backgroundColor: "rgba(0, 180, 216, 0.15)"
    textColor: "{colors.cyan}"
    rounded: "{rounded.chip}"
    padding: "4px 10px"
  nav-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
---

# Design System: Центр Техники МАКСИМУМ

## Overview

**Creative North Star: "Фасад салона"**

Страница устроена как зал: светлый пол, тёмные плиты с техникой, оранжевый как вывеска на двери. Заголовки технические и прямые, набор Russo One. Текст спокойный, Inter. Контраст зала и плит — характер системы, не украшение.

Плотность средняя: контейнер 1200px, секции с большим вертикальным воздухом, карточки плотнее текста. Новые элементы остаются сдержанными. Свечение и подъём при наведении есть у текущей главной кнопки и у ховера тёмной карточки; это не образец, который копируют.

**Key Characteristics:**

- Светлый зал и тёмные плиты
- Заголовки Russo One, текст Inter
- Оранжевый на действие и фокус, красный только в паре с ним на главной кнопке
- Голубой только на метке наличия
- Новые элементы без свечения и без подъёма

## Colors

Палитра нейтральная по именам: оранжевый, красный, голубой, графит, светло-серый. Роли узкие.

### Primary

- **Оранжевый** (#ff5500): обводка, фокус и текст на тёмном. Заливка кнопки и оранжевый текст на светлом — **оранжевый текст** (#cc3c00), чтобы белый на кнопке и оранжевый на зале были не ниже 4.5:1.

### Secondary

- **Красный** (#ff2a00): второй край градиента главной кнопки и красная метка. Сам по себе кнопки не красит.

### Tertiary

- **Голубой** (#00b4d8): метка «в наличии». Больше нигде.

### Neutral

- **Светло-серый** (#f4f6f9): пол секций, фон `body`.
- **Серый** (#e9ecef): соседняя светлая полоса, когда секции нужно отделить.
- **Белый** (#ffffff): подложка на светлом полу, поле шапки.
- **Поле** (#f8fafc): фон текстового поля.
- **Графит** (#18191c): герой, тёмная карточка, тёмное меню.
- **Графит при наведении** (#222429): фон тёмной карточки в ховере.
- **Тёмный текст** (#1e293b): текст на светлом.
- **Приглушённый текст** (#556070): вторичный текст на светлом.
- **Белый на тёмном** (#ffffff): текст на графите.
- **Приглушённый на тёмном** (#94a3b8): вторичный текст на графите.
- **Мягкий на тёмном** (#e2e8f0): подзаголовок героя и акцент в списке карточки.
- **Линия** (#cbd5e1): обводка поля и тихой кнопки на светлом.
- **Мягкая линия** (#e2e8f0): обводка ссылки шапки.

### Named Rules

**The One Action Color Rule.** Оранжевый красит одно действие на экране и фокус поля. Голубой остаётся меткой наличия. Красный не выходит из градиента главной кнопки и красной метки.

## Typography

**Display Font:** Russo One (with Montserrat, sans-serif)
**Body Font:** Inter (with system-ui, -apple-system, sans-serif)

**Character:** Заголовок брутальный и узкий по начертанию, одно начертание 400. Текст читается спокойно. Пара не смешивается внутри одной строки.

### Hierarchy

- **Display** (400, clamp(2.15rem, 4.8vw, 3.4rem), line-height 1.2): заголовок героя на тёмном, цвет #ffffff, letter-spacing 1px. На узком экране он остаётся крупнее заголовка секции (минимум 1.8rem).
- **Headline** (400, clamp(1.8rem, 3vw, 2.4rem), line-height 1.2): заголовок секции, верхний регистр, цвет #1e293b, letter-spacing 1px.
- **Title** (400, 1.3rem, line-height 1.2): название на тёмной карточке, цвет #ffffff.
- **Body** (400, 1rem, line-height 1.5): основной текст, цвет #1e293b. Подзаголовок секции того же размера, цвет #64748b.
- **Label** (400, 0.95rem, letter-spacing 0.5px): подпись кнопки, Russo One.

### Named Rules

**The Two Families Rule.** Russo One только у заголовков и кнопок. Inter у текста, полей, меток и ссылок шапки. Тело страницы не набирается вывесочным шрифтом.

## Layout

Одна колонка в контейнере 1200px, боковые поля 20px, на ширине до 768px поля 16px. Герой уже: колонка текста до 850px, по центру. Секции дышат: 80px сверху и снизу, на ширине до 768px 60px. Заголовок секции по центру, снизу 45px до контента.

Пороги из миксина: desktop от 993px, tablet до 992px, mobile до 768px, small до 640px. Шапка на desktop высокая (88px, знак 72px), на узком экране ниже (64px, знак 56px).

## Elevation & Depth

Глубина в два слоя. Светлый зал почти плоский: белая карточка на сером поле держит тень `0 4px 15px rgba(0, 0, 0, 0.04)`, при наведении `0 12px 30px rgba(0, 0, 0, 0.08)`. Тёмная плита на этом полу читается собственным цветом #18191c; тень появляется у ховера карточки и у открытого меню. Это рекомендация, которую зафиксировали после просьбы выбрать: свечение не является языком глубины.

Текущая главная кнопка всё ещё светится оранжевым и поднимается на 2px. Тёмная карточка при наведении поднимается на 6px. Новые компоненты этого не повторяют.

### Shadow Vocabulary

- **Зал в покое** (`box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04)`): белая карточка сервиса на светлом поле.
- **Зал при наведении** (`box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08)`): та же карточка в ховере.
- **Плита** (`box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3)`): ховер тёмной карточки. Не ставить в покое.
- **Меню** (`box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35)`): выпадающий слой шапки.
- **Модалка** (`box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25)`): диалог над страницей.
- **Свечение кнопки** (`box-shadow: 0 4px 15px rgba(255, 85, 0, 0.35)`): только текущая главная кнопка. Новым действиям не давать.

### Named Rules

**The Hall and Plate Rule.** Светлая секция остаётся плоской. Тёмная поверхность — плита на этом полу. Оранжевое свечение не создаёт новый слой.

## Shapes

Скругление короткое. Кнопки и поля 8px. Карточки, модалка и крупные панели 16px. Метка 6px. Ссылка шапки — пилюля 20px. В `src/scss/abstract/_variables.scss` объявлен `$radius-lg: 24px`, в компонентах он не используется. Углы не срезают и не делают кружком, кроме пилюли навигации.

Обводка тонкая: 1px. На тёмной карточке `rgba(255, 255, 255, 0.08)`, на поле и тихой кнопке #cbd5e1.

## Components

### Buttons

Кнопка сдержанная по форме и громкая только цветом главного действия. Шрифт Russo One, минимум 44px по высоте.

- **Shape:** 8px (`$radius-sm`), padding 14px 28px.
- **Primary:** градиент 135deg от #cc3c00 к #d23219, текст #ffffff. В коде есть тень `0 4px 15px rgba(204, 60, 0, 0.35)`.
- **Hover / Focus:** у главной кнопки тень гуще и `translateY(-2px)` только при `(hover: hover)`. Новым кнопкам подъём и свечение не добавлять. Фокус поля, не кнопки, красится обводкой #ff5500.
- **Outline:** на тёмном фоне прозрачная, текст #ffffff, обводка `rgba(255, 255, 255, 0.25)`, ховер заливает `rgba(255, 255, 255, 0.1)`.
- **Outline dark:** на светлом прозрачная, текст #1e293b, обводка #cbd5e1. Ховер: фон #f8fafc, обводка и текст #ff5500.

### Chips

- **Style:** метка наличия, верхний регистр, 0.75rem, вес 700, padding 4px 10px, радиус 6px. Фон `rgba(0, 180, 216, 0.15)`, текст #00b4d8, обводка `rgba(0, 180, 216, 0.3)`.
- **State:** красная метка без свечения: фон `rgba(255, 42, 0, 0.2)`, текст #ff2a00.

### Cards / Containers

- **Corner Style:** 16px.
- **Background:** тёмная карточка #18191c, текст #ffffff, вторичный текст #94a3b8. Светлая карточка сервиса сидит на #ffffff.
- **Shadow Strategy:** тёмная карточка в покое без тени. Тень плиты и подъём 6px только в текущем ховере. Светлая карточка использует тени зала.
- **Border:** 1px `rgba(255, 255, 255, 0.08)`; в ховере `rgba(255, 85, 0, 0.5)` и фон #222429.
- **Internal Padding:** 30px 24px у тёмной карточки.

### Inputs / Fields

- **Style:** фон #f8fafc, обводка 1px #cbd5e1, радиус 8px, padding 14px 16px, текст 16px, цвет #1e293b. Подпись поля 0.85rem, цвет #64748b.
- **Focus:** обводка #ff5500, фон #ffffff. Без свечения.
- **Error / Disabled:** сообщение об ошибке квиза занимает минимум 1.2em и не толкает форму. Отдельного disabled-цвета в системе нет.

### Navigation

Ссылка шапки: белая пилюля 20px, обводка #e2e8f0, текст #1e293b, 0.82rem, вес 600, padding 6px 12px. Ховер красит обводку и текст в #ff5500, без заливки. Телефон и быстрые действия остаются в шапке. На ширине до 768px меню уезжает в бургер; открытое меню темнеет до `rgba(24, 25, 28, 0.92)`.

### Mark

Знак MAXIMUM в шапке — отдельный объект, не компонент кнопки. Его геометрию и анимацию не описывает эта система и не меняет без отдельной просьбы.

## Do's and Don'ts

### Do:

- **Do** красить пол секций в #f4f6f9, а тёмные плиты в #18191c.
- **Do** набирать заголовки Russo One, а текст Inter.
- **Do** оставлять оранжевый #ff5500 главному действию и фокусу поля.
- **Do** оставлять голубой #00b4d8 метке наличия.
- **Do** держать новые элементы плоскими: обводка и смена цвета, не тень и не подъём.

### Don't:

- **Don't** добавлять новым компонентам оранжевое свечение или `translateY` при наведении.
- **Don't** перекрашивать зал в тёмный фон или герой в светлый.
- **Don't** менять знак MAXIMUM и его анимацию.
- **Don't** вводить четвёртый акцент. Зелёный #25d366 остаётся только у знака WhatsApp.
