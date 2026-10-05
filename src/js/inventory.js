/**
 * Демо-наличие под Якутск. Замените на живые модели и фото из зала.
 * Фото салона и отзывы — в карточке 2ГИС.
 * Цифры в листах — пример комплектации, не прайс и не склад.
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
    model: "Outlander X MR 650",
    title: "BRP Outlander X MR 650",
    badge: "Пример",
    image: outlanderPhoto,
    imageWidth: 661,
    imageHeight: 480,
    summary:
      "Грязевая версия: высокий клиренс, блокировка передка и колеса под охоту и хозяйство.",
    highlights: ["59 л.с.", "клиренс 299 мм", "бак 20,5 л"],
    specGroups: [
      {
        title: "Двигатель",
        rows: [
          {
            label: "Тип",
            value:
              "Rotax, двухцилиндровый, V-образный, со шноркелем, жидкостного охлаждения",
          },
          { label: "Объем", value: "649,6 см³" },
          { label: "Мощность", value: "59 л.с." },
          {
            label: "Трансмиссия",
            value: "Вариатор, 2WD / 4WD / Lock 4WD, передний дифференциал Visco-4Lok",
          },
        ],
      },
      {
        title: "Шасси",
        rows: [
          {
            label: "Передняя подвеска",
            value: "Двойные А-образные рычаги со стабилизатором",
          },
          { label: "Задняя подвеска", value: "Независимая, продольные рычаги (TTI)" },
          { label: "Тормоза", value: "Диски 214 мм, гидравлика" },
          { label: "Передние колеса", value: "ITP Mega Mayhem 28×8×12" },
          { label: "Задние колеса", value: "ITP Mega Mayhem 28×10×12" },
        ],
      },
      {
        title: "Размеры",
        rows: [
          { label: "Колесная база", value: "1295 мм" },
          { label: "Клиренс", value: "299 мм" },
          { label: "Сухой вес", value: "396 кг" },
          { label: "Задний багажник", value: "90 кг" },
          { label: "Бак", value: "20,5 л" },
        ],
      },
    ],
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
    summary: "Четырехтактный мотор на 30 л.с. с баком 25 л — основа комплекта под рыбалку.",
    highlights: ["30 л.с.", "490 см³", "бак 25 л"],
    sheetNote: "Цифры — у мотора DF 30 ATL в комплекте, не у лодки.",
    specGroups: [
      {
        title: "Двигатель",
        rows: [
          { label: "Тактность", value: "4-тактный" },
          { label: "Цилиндры", value: "3" },
          { label: "Объем", value: "490 см³" },
          { label: "Мощность", value: "30 л.с." },
          { label: "Обороты", value: "5300–6300 об/мин" },
          { label: "Топливо", value: "Бензин АИ-92, инжектор" },
          { label: "Запуск", value: "Ручной и электростартер" },
          { label: "Генератор", value: "12 В, 14 А" },
        ],
      },
      {
        title: "Установка",
        rows: [
          { label: "Управление", value: "Дистанционное" },
          { label: "Подъем", value: "Гидравлический" },
          { label: "Транец", value: "508 мм" },
          { label: "Задний ход", value: "Есть" },
          { label: "Вес", value: "72 кг" },
          { label: "Бак", value: "25 л" },
        ],
      },
    ],
    cta: "Записаться в салон",
  },
  {
    id: "trailer-mzsa",
    category: "trailer",
    categoryLabel: "Прицеп",
    brand: "МЗСА",
    model: "Компакт",
    title: "Прицеп МЗСА Компакт",
    badge: "Пример",
    image: trailerPhoto,
    imageWidth: 960,
    imageHeight: 483,
    summary: "Ложементный прицеп под лодку или каяк: на зиму разбирается и встает в гараж.",
    highlights: ["366 кг", "судно до 4,3 м", "клиренс 234 мм"],
    sheetNote: "Опорное колесо в базовую комплектацию не входит.",
    specGroups: [
      {
        title: "Назначение",
        rows: [
          { label: "Тип", value: "Ложементный, под лодку, каяк или байдарку" },
          { label: "Предельная длина судна", value: "4300 мм" },
          { label: "Грузоподъемность", value: "366 кг" },
          { label: "Полная масса", value: "500 кг" },
        ],
      },
      {
        title: "Шасси",
        rows: [
          { label: "Подвеска", value: "Рессорная" },
          { label: "Оси", value: "1" },
          { label: "Колеса", value: "2, R13" },
          { label: "Тормоз", value: "Нет" },
          { label: "Клиренс", value: "234 мм" },
          { label: "Покрытие", value: "Горячее цинкование" },
        ],
      },
      {
        title: "Размеры",
        rows: [
          { label: "Габариты", value: "4460 × 1550 × 1053 мм" },
          { label: "Носовой упор", value: "С лебедкой, угол и вылет регулируются" },
        ],
      },
    ],
    cta: "Записаться в салон",
  },
  {
    id: "taiga",
    category: "snow",
    categoryLabel: "Снегоход",
    brand: "Русская Механика",
    model: "Тайга Варяг 500",
    title: "РМ Тайга Варяг 500",
    badge: "Запись на сезон",
    image: taigaPhoto,
    imageWidth: 576,
    imageHeight: 442,
    summary:
      "Под лес и глубокий снег: широкая гусеница, телескопическая подвеска и ручной запуск.",
    highlights: ["43 л.с.", "гусеница 500 мм", "бак 40 л"],
    specGroups: [
      {
        title: "Двигатель",
        rows: [
          { label: "Тип", value: "РМЗ-500, 2-тактный" },
          { label: "Объем", value: "497 см³" },
          { label: "Мощность", value: "43 л.с." },
          { label: "Питание", value: "Карбюратор" },
          { label: "Охлаждение", value: "Воздушное" },
          { label: "Запуск", value: "Ручной" },
        ],
      },
      {
        title: "Шасси",
        rows: [
          { label: "Передняя подвеска", value: "Телескопическая, ход 105 мм" },
          { label: "Задняя подвеска", value: "Склизовая, ход 190 мм" },
          {
            label: "Трансмиссия",
            value: "Вариатор, пониженная, повышенная, реверс, нейтраль",
          },
          { label: "Тормоз", value: "Механический дисковый" },
          { label: "Гусеница", value: "3937 × 500 мм, грунтозацеп 22 мм" },
          { label: "Колея лыж", value: "900 мм" },
        ],
      },
      {
        title: "Размеры",
        rows: [
          { label: "Габариты", value: "2990 × 1050 × 1380 мм" },
          { label: "Вес", value: "260 кг" },
          { label: "Бак", value: "40 л" },
          { label: "Сиденье", value: "На двоих, без спинки пассажира" },
          { label: "Скорость", value: "до 80 км/ч" },
        ],
      },
    ],
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
    summary: "Костюм, перчатки и базовый слой — пример комплекта под сезон.",
    cta: "Записаться в салон",
  },
];

export function getInventoryItem(id) {
  return INVENTORY.find((item) => item.id === id);
}
