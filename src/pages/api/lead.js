// Серверная функция (не статика, prerender=false).
// Принимает заявку с формы /zayavka/ и пересылает её в Telegram-бота.
// Нужны две переменные окружения в Vercel: TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
// (как их получить — см. README_ЗАЯВКИ.md в этом же пакете).

export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, contact, service, comment } = data;

    if (!name || !contact || !service) {
      return new Response(JSON.stringify({ ok: false, error: 'Заполни имя, контакт и услугу' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = import.meta.env.TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      // Бот ещё не настроен — не роняем форму, просто честно говорим об этом.
      console.error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы в переменных окружения');
      return new Response(JSON.stringify({ ok: false, error: 'Приём заявок временно не настроен' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = [
      '🆕 Новая заявка с priehali.com',
      `Услуга: ${service}`,
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      comment ? `Комментарий: ${comment}` : null,
    ].filter(Boolean).join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error('Telegram API error:', errText);
      return new Response(JSON.stringify({ ok: false, error: 'Не удалось отправить заявку' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: 'Ошибка сервера' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
