/**
 * Контакты салона. Источник: карточка 2ГИС Maximum, Якутск.
 * https://2gis.ru/yakutsk/firm/7037402698753912
 *
 * TELEGRAM_BOT_TOKEN попадёт в клиентскую сборку. Бот должен слать
 * только в указанные chat_id. Позже вынесите отправку на endpoint.
 */
export const CONFIG = {
  BRAND: "Центр Техники МАКСИМУМ",
  CITY: "Якутск",
  ADDRESS: "ул. 50 лет Советской Армии, 77, 1–2 этаж",
  ADDRESS_FULL: "г. Якутск, ул. 50 лет Советской Армии, 77, 1–2 этаж",
  POSTAL_CODE: "677004",
  DISTRICT: "Промышленный округ",
  HOURS: "Пн–Сб: 09:00 – 18:00 | Вс: 10:00 – 16:00",
  LAT: 62.096611,
  LON: 129.802778,

  PHONE_SALES: "+79247659421",
  PHONE_SALES_DISPLAY: "+7 (924) 765-94-21",
  PHONE_SALES_NOTE: "магазин, 2 этаж",
  PHONE_SALES_FLOOR1: "+79247650172",
  PHONE_SALES_FLOOR1_DISPLAY: "+7 (924) 765-01-72",
  PHONE_SERVICE: "+79247659728",
  PHONE_SERVICE_DISPLAY: "+7 (924) 765-97-28",
  PHONE_SERVICE_NOTE: "ремонт и запчасти: моторы, снегоходы",
  PHONE_BOATS_REPAIR: "+79241786931",
  PHONE_BOATS_REPAIR_DISPLAY: "+7 (924) 178-69-31",
  PHONE_WHATSAPP: "79247659421",
  PHONE_WHATSAPP_SERVICE: "79247659728",

  EMAIL: "suzuki2006@mail.ru",
  TELEGRAM_CHANNEL: "https://t.me/maximum_centre",
  VK_URL: "https://vk.com/maximumykt",

  FIRM_2GIS_ID: "7037402698753912",
  MAPS_URL: "https://2gis.ru/yakutsk/firm/7037402698753912",
  MAPS_ROUTE:
    "https://2gis.ru/yakutsk/firm/7037402698753912?m=129.802778%2C62.096611%2F16",
  MAPS_REVIEWS: "https://2gis.ru/yakutsk/firm/7037402698753912/tab/reviews",
  MAPS_PHOTOS: "https://2gis.ru/yakutsk/firm/7037402698753912/tab/photos",
  MAPS_EMBED:
    "https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A62.096611%2C%22lon%22%3A129.802778%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22yakutsk%22%7D%2C%22org%22%3A%227037402698753912%22%7D",

  GIS_RATING: "4.9",
  GIS_RATINGS_COUNT: "353",
  GIS_REVIEWS_COUNT: "146",
  GIS_PHOTOS_COUNT: "81",

  TELEGRAM_BOT_TOKEN: "",
  TELEGRAM_CHAT_ID: "",
  TELEGRAM_CHAT_ID_SALES: "",
  TELEGRAM_CHAT_ID_SERVICE: "",
  METRIKA_ID: "",
};

export const GIS_HIGHLIGHTS = [
  "Отличный магазин",
  "Большой выбор",
  "Приятный персонал",
  "Свободная парковка",
];

export const GIS_REVIEWS = [
  {
    author: "Ольга Т.",
    text: "Свободная парковка, просторное здание, большой ассортимент. Креативное оформление зала.",
  },
  {
    author: "Покупатель запчастей",
    text: "Брала запчасти для моторки. Продавец спокойно объяснил, что к чему, нашёл деталь и показал.",
  },
];

const SALES_LEAD_TYPES = new Set(["testdrive", "quiz"]);

export function isTelegramConfigured(type) {
  return Boolean(CONFIG.TELEGRAM_BOT_TOKEN && getTelegramChatId(type));
}

export function getTelegramChatId(type) {
  if (SALES_LEAD_TYPES.has(type)) {
    return CONFIG.TELEGRAM_CHAT_ID_SALES || CONFIG.TELEGRAM_CHAT_ID;
  }
  return CONFIG.TELEGRAM_CHAT_ID_SERVICE || CONFIG.TELEGRAM_CHAT_ID;
}

export function isValidRuPhone(value) {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return true;
  }
  return digits.length === 10;
}

export function getWhatsAppUrl(text = "", type = "testdrive") {
  const phone = SALES_LEAD_TYPES.has(type)
    ? CONFIG.PHONE_WHATSAPP
    : CONFIG.PHONE_WHATSAPP_SERVICE || CONFIG.PHONE_WHATSAPP;
  const base = `https://wa.me/${phone}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function getSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 11 || month <= 3) return "snow";
  if (month >= 6 && month <= 8) return "water";
  return "offroad";
}
