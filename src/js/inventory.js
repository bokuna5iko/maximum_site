/**
 * Демо-наличие салона. Замените карточки на реальные модели и фото.
 */
export const INVENTORY = [
  {
    id: "sea-doo-gti",
    category: "jetski",
    categoryLabel: "Гидроцикл",
    brand: "BRP",
    model: "Sea-Doo GTI",
    title: "BRP Sea-Doo GTI",
    priceFrom: "1 150 000 ₽",
    badge: "В салоне",
    specs: ["Три места, спокойная вода", "Идеален для семьи и прогулок"],
    cta: "Записаться на тест-драйв",
  },
  {
    id: "outlander-650",
    category: "atv",
    categoryLabel: "Квадроцикл",
    brand: "BRP",
    model: "Outlander 650",
    title: "BRP Outlander 650",
    priceFrom: "1 290 000 ₽",
    badge: "Тест-драйв",
    specs: ["4x4, утилитарный", "Охота, лес, хозяйство"],
    cta: "Записаться на тест-драйв",
  },
  {
    id: "suzuki-df30",
    category: "boat",
    categoryLabel: "Лодка и мотор",
    brand: "Suzuki",
    model: "DF30 + ПВХ",
    title: "Suzuki DF30 + ПВХ",
    priceFrom: "420 000 ₽",
    badge: "Комплект",
    specs: ["Готовый комплект под рыбалку", "Мотор 30 л.с., 4 такта"],
    cta: "Записаться на тест-драйв",
  },
  {
    id: "taiga",
    category: "snow",
    categoryLabel: "Снегоход",
    brand: "Русская Механика",
    model: "Тайга",
    title: "РМ Тайга",
    priceFrom: "890 000 ₽",
    badge: "Предзаказ сезона",
    specs: ["Лес и глубокий снег", "Запись на осмотр до сезона"],
    cta: "Записаться на осмотр",
  },
  {
    id: "brp-gear",
    category: "gear",
    categoryLabel: "Экипировка",
    brand: "BRP",
    model: "Комплект экипировки",
    title: "Экипировка BRP",
    priceFrom: "28 000 ₽",
    badge: "В зале",
    specs: ["Костюм, перчатки, базовый слой", "Подберём размер в салоне"],
    cta: "Забронировать в салоне",
  },
];

export function getInventoryItem(id) {
  return INVENTORY.find((item) => item.id === id);
}
