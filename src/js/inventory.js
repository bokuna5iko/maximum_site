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
    badge: "Пример",
    specs: ["4x4, охота и хозяйство"],
    cta: "Записаться в салон",
  },
  {
    id: "suzuki-df30",
    category: "boat",
    categoryLabel: "Лодка и мотор",
    brand: "Suzuki",
    model: "DF30 + ПВХ",
    title: "Suzuki DF30 + ПВХ",
    badge: "Пример",
    specs: ["Готовый комплект под рыбалку"],
    cta: "Записаться в салон",
  },
  {
    id: "trailer-mzsa",
    category: "trailer",
    categoryLabel: "Прицеп",
    brand: "МЗСА",
    model: "Прицеп",
    title: "Прицеп МЗСА",
    badge: "Пример",
    specs: ["Под технику и хозяйство"],
    cta: "Записаться в салон",
  },
  {
    id: "taiga",
    category: "snow",
    categoryLabel: "Снегоход",
    brand: "Русская Механика",
    model: "Тайга",
    title: "РМ Тайга",
    badge: "Запись на сезон",
    specs: ["Лес и глубокий снег Якутии"],
    cta: "Записаться в салон",
  },
  {
    id: "brp-gear",
    category: "gear",
    categoryLabel: "Экипировка",
    brand: "BRP",
    model: "Комплект экипировки",
    title: "Экипировка и защита",
    badge: "Пример",
    specs: ["Костюм, перчатки, базовый слой"],
    cta: "Записаться в салон",
  },
];

export function getInventoryItem(id) {
  return INVENTORY.find((item) => item.id === id);
}
