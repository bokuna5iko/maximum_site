// Конфигурация контактов магазина
const CONFIG = {
  PHONE_WHATSAPP: "79000000000", // Укажи реальный номер менеджера (без +)
  TELEGRAM_BOT_TOKEN: "", // Если захотим использовать Telegram-бота
  TELEGRAM_CHAT_ID: "",
};

/**
 * Отправка сформированного лида в WhatsApp
 * @param {string} text - Готовое форматированное сообщение
 */
export function sendToWhatsApp(text) {
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${CONFIG.PHONE_WHATSAPP}?text=${encodedText}`;
  window.open(whatsappUrl, "_blank");
}

/**
 * Отправка заявки в Telegram-бота (если понадобится бэкенд без БД)
 */
export async function sendToTelegram(text) {
  if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) {
    console.warn(
      "Telegram Bot Credentials не настроены, перенаправляем в WhatsApp",
    );
    sendToWhatsApp(text);
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown",
      }),
    });
    alert("Заявка успешно отправлена менеджеру!");
  } catch (error) {
    console.error("Ошибка отправки в Telegram:", error);
    sendToWhatsApp(text); // Фолбэк на WhatsApp в случае ошибки
  }
}
