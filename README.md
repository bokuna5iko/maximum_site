# 🏎️ Сайт-Витрина «Центр Техники МАКСИМУМ»

Высокопроизводительный, плавный PWA-ready сайт-витрина с гибридной конверсией (лидогенератор) для дилерского центра мото/автотехники.

---

## 🛠 Технический Стек

- **Build Tool & Dev Environment:** Vite (быстрая сборка, Hot Module Replacement, подготовка к PWA).
- **Frontend Core:** HTML5, Modern JavaScript (ES6+ Modules).
- **Styling & Preprocessor:** SCSS (Sass) — с архитектурой 7-1 pattern (переменные, вложенность, миксины, модульные файлы).
- **Animations & Motion:** GSAP (GreenSock Animation Platform) — плавные микроанимации, интерактив и запуск Hero-спидометра.
- **PWA Capability:** Service Worker + `manifest.json` (быстрая загрузка, офлайн-кэш, возможность установки на главный экран).
- **Zero-DB LeadGen:** Модульная отправка лидов напрямую в Telegram Bot API / WhatsApp Webhooks без использования баз данных и e-commerce бэкенда.

---

## 📁 Структура Проекта

```text
maximum-pwa/
├── public/                     # Статические ресурсы (без обработки Vite)
│   ├── favicon.ico
│   ├── manifest.json            # Манифест PWA (иконки, цвет темы, имя)
│   ├── sw.js                    # Service Worker для офлайн-кэширования
│   └── icons/                   # PWA-иконки для экранов смартфонов
│
├── src/
│   ├── assets/                 # Изображения и векторная графика
│   │   ├── images/              # Фото техники (BRP, Suzuki, Yamaha и др.)
│   │   └── svg/
│   │       ├── logo-speedometer.svg  # Интерактивный SVG-логотип из Corel
│   │       └── icons/           # Иконки категорий, мессенджеров, UI
│   │
│   ├── scss/                   # Модульные SCSS-стили
│   │   ├── abstract/            # Переменные, миксины, функции
│   │   │   ├── _variables.scss  # Цвета (темная палитра, акценты), шрифты, Z-indices
│   │   │   ├── _mixins.scss     # Флекс/грид миксины, медиазапросы (@include respond-to)
│   │   │   └── _reset.scss      # Сброс базовых стилей
│   │   │
│   │   ├── components/          # Компоненты UI
│   │   │   ├── _buttons.scss    # Акцентные драйвовые кнопки, эффекты наведения
│   │   │   ├── _cards.scss      # Карточки 6 категорий техники
│   │   │   ├── _modal.scss      # Модальные окна (Запись на ТО, Запчасти)
│   │   │   └── _quiz.scss       # Интерактивный квиз-лидогенератор
│   │   │
│   │   ├── layout/              # Основные блоки страницы
│   │   │   ├── _header.scss     # Шапка и навигация
│   │   │   ├── _hero.scss       # Первый экран + CSS для спидометра
│   │   │   ├── _showcase.scss   # Сетка 6 категорий
│   │   │   ├── _service-hub.scss# Блок Запчастей и ТО
│   │   │   ├── _contacts.scss   # Яндекс/Google карта, дилерский статус
│   │   │   └── _mobile-bar.scss # Нижняя фиксированная панель для PWA
│   │   │
│   │   └── main.scss            # Главный точку входа стилей (собирает все @use)
│   │
│   └── js/                     # Логика и скрипты
│       ├── main.js              # Точка входа приложения
│       ├── animation.js         # GSAP-сценарий (запуск двигателя, шкала спидометра)
│       ├── quiz.js              # Интерактивный квиз подбора
│       ├── modal.js             # Управление модальными окнами (ТО / Запчасти)
│       └── lead-sender.js       # Формирование и отправка заявок в Telegram/WhatsApp
│
├── index.html                   # Каркас главной страницы (Все 6 блоков)
├── package.json                 # Зависимости и npm-скрипты
└── vite.config.js               # Конфигурация Vite & SCSS
```
