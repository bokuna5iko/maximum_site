import { CONFIG, getWhatsAppUrl, isTelegramConfigured } from "./config.js";
import { trackGoal } from "./analytics.js";

const LEAD_TITLES = {
  testdrive: "Запись на тест-драйв / визит в салон",
  quiz: "Квиз: подбор техники и визит",
  service: "Запись на сервис / ТО",
  parts: "Подбор запчастей по VIN",
};

const LEAD_GOALS = {
  testdrive: "lead_testdrive",
  quiz: "lead_quiz",
  service: "lead_service",
  parts: "lead_parts",
};

function formatLead(type, fields) {
  const title = LEAD_TITLES[type] || "Заявка с сайта";
  const lines = [title, `Сайт: ${CONFIG.BRAND}`, ""];

  for (const [label, value] of Object.entries(fields)) {
    if (value) lines.push(`• ${label}: ${value}`);
  }

  return lines.join("\n");
}

async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CONFIG.TELEGRAM_CHAT_ID,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram HTTP ${response.status}`);
  }
}

/**
 * Отправляет заявку менеджеру. WhatsApp клиенту не открывается сам.
 * @returns {{ text: string, deliveredVia: "telegram" | "pending", whatsappUrl: string }}
 */
export async function sendLead({ type, fields }) {
  const text = formatLead(type, fields);
  let deliveredVia = "pending";

  if (isTelegramConfigured()) {
    try {
      await sendToTelegram(text);
      deliveredVia = "telegram";
    } catch (error) {
      console.warn("Не удалось отправить в Telegram, оставляем WhatsApp как канал:", error);
    }
  } else {
    console.warn(
      "Telegram-бот не настроен: заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в src/js/config.js",
    );
  }

  trackGoal(LEAD_GOALS[type]);

  return {
    text,
    deliveredVia,
    whatsappUrl: getWhatsAppUrl(text),
  };
}
