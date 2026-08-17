/**
 * Единственное место для контактов салона и каналов заявок.
 * Реальные город, телефоны, карту и токен бота подставляйте сюда.
 *
 * TELEGRAM_BOT_TOKEN попадёт в клиентскую сборку. Для v1 это допустимо:
 * бот должен уметь только слать сообщения в один TELEGRAM_CHAT_ID.
 * Позже вынесите отправку на отдельный endpoint.
 */
export const CONFIG = {
  BRAND: "Центр Техники МАКСИМУМ",
  CITY: "[Ваш Город]",
  ADDRESS: "ул. Автомобильная, д. 15",
  ADDRESS_FULL: "г. [Ваш Город], ул. Автомобильная, д. 15",
  HOURS: "Пн–Пт: 09:00 – 20:00 | Сб–Вс: 10:00 – 18:00",
  PHONE_SALES: "+79000000000",
  PHONE_SALES_DISPLAY: "+7 (900) 000-00-00",
  PHONE_SERVICE: "+79000000001",
  PHONE_SERVICE_DISPLAY: "+7 (900) 000-00-01",
  PHONE_WHATSAPP: "79000000000",
  MAPS_URL: "https://yandex.ru/maps/",
  MAPS_EMBED:
    "https://yandex.ru/map-widget/v1/?um=constructor%3A36e6545b&source=constructor",
  TELEGRAM_BOT_TOKEN: "",
  TELEGRAM_CHAT_ID: "",
  METRIKA_ID: "",
};

export function isTelegramConfigured() {
  return Boolean(CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_CHAT_ID);
}

export function isValidRuPhone(value) {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return true;
  }
  return digits.length === 10;
}

export function getWhatsAppUrl(text = "") {
  const base = `https://wa.me/${CONFIG.PHONE_WHATSAPP}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
