/**
 * Демо-наличие под Якутск. Замените на живые модели и фото из зала.
 * Фото салона и отзывы — в карточке 2ГИС.
 */
import outlanderPhoto from "../assets/images/inventory/outlander-650.webp";
import suzukiPhoto from "../assets/images/inventory/suzuki-df30.webp";
import trailerPhoto from "../assets/images/inventory/trailer-mzsa.webp";
import taigaPhoto from "../assets/images/inventory/taiga.webp";

export const INVENTORY = [
  {
    id: "outlander-650",
    category: "atv",
    categoryLabel: "Квадроцикл",
    brand: "BRP",
    model: "Outlander 650",
    title: "BRP Outlander 650",
    badge: "Пример",
    image: outlanderPhoto,
    imageWidth: 661,
    imageHeight: 480,
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
    image: suzukiPhoto,
    imageWidth: 473,
    imageHeight: 883,
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
    image: trailerPhoto,
    imageWidth: 960,
    imageHeight: 483,
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
    image: taigaPhoto,
    imageWidth: 576,
    imageHeight: 442,
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
