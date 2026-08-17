/**
 * Демо-наличие под Якутск. Замените на живые модели и фото из зала.
 * Фото салона и отзывы — в карточке 2ГИС.
 */
export const INVENTORY = [
  {
    id: "outlander-650",
    category: "atv",
    categoryLabel: "Квадроцикл",
    brand: "BRP",
    model: "Outlander 650",
    title: "BRP Outlander 650",
    priceFrom: "1 290 000 ₽",
    badge: "Тест-драйв",
    specs: ["4x4, охота и хозяйство", "Смотрим в салоне в Якутске"],
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
    cta: "Записаться на осмотр",
  },
  {
    id: "trailer-mzsa",
    category: "trailer",
    categoryLabel: "Прицеп",
    brand: "МЗСА",
    model: "Прицеп",
    title: "Прицеп МЗСА",
    priceFrom: "95 000 ₽",
    badge: "В зале",
    specs: ["Под технику и хозяйство", "Основное направление салона"],
    cta: "Узнать наличие в салоне",
  },
  {
    id: "taiga",
    category: "snow",
    categoryLabel: "Снегоход",
    brand: "Русская Механика",
    model: "Тайга",
    title: "РМ Тайга",
    priceFrom: "890 000 ₽",
    badge: "Запись на сезон",
    specs: ["Лес и глубокий снег Якутии", "Осмотр и бронь до сезона"],
    cta: "Записаться на осмотр",
  },
  {
    id: "brp-gear",
    category: "gear",
    categoryLabel: "Экипировка",
    brand: "BRP",
    model: "Комплект экипировки",
    title: "Экипировка и защита",
    priceFrom: "28 000 ₽",
    badge: "В зале",
    specs: ["Костюм, перчатки, базовый слой", "Размер подберём в салоне"],
    cta: "Забронировать в салоне",
  },
];

export function getInventoryItem(id) {
  return INVENTORY.find((item) => item.id === id);
}
