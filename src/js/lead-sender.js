import {
  CONFIG,
  getTelegramChatId,
  getWhatsAppUrl,
  isTelegramConfigured,
} from "./config.js";
import { trackGoal } from "./analytics.js";

const LEAD_TITLES = {
  testdrive: "ПРОДАЖИ: запись на тест-драйв / визит",
  quiz: "ПРОДАЖИ: квиз, подбор и визит",
  service: "СЕРВИС: запись на ТО",
  parts: "СЕРВИС: подбор запчастей",
};

const LEAD_GOALS = {
  testdrive: "lead_testdrive",
  quiz: "lead_quiz",
  service: "lead_service",
  parts: "lead_parts",
};

function formatLead(type, fields) {
  const title = LEAD_TITLES[type] || "Заявка с сайта";
  const lines = [title, `Сайт: ${CONFIG.BRAND}`, `Город: ${CONFIG.CITY}`, ""];

  for (const [label, value] of Object.entries(fields)) {
    if (value) lines.push(`• ${label}: ${value}`);
  }

  return lines.join("\n");
}

async function sendToTelegram(text, type) {
  const chatId = getTelegramChatId(type);
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram HTTP ${response.status}`);
  }
}

/**
 * @returns {{ text: string, deliveredVia: "telegram" | "pending", whatsappUrl: string, type: string, fields: object }}
 */
export async function sendLead({ type, fields }) {
  const text = formatLead(type, fields);
  let deliveredVia = "pending";

  if (isTelegramConfigured(type)) {
    try {
      await sendToTelegram(text, type);
      deliveredVia = "telegram";
    } catch (error) {
      console.warn("Не удалось отправить в Telegram:", error);
    }
  } else {
    console.warn(
      "Telegram-бот не настроен: заполните TELEGRAM_BOT_TOKEN и chat_id в src/js/config.js",
    );
  }

  trackGoal(LEAD_GOALS[type]);

  return {
    type,
    fields,
    text,
    deliveredVia,
    whatsappUrl: getWhatsAppUrl(text, type),
  };
}
