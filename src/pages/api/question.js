// Серверная функция (не статика, prerender=false).
// Принимает вопрос с формы /sprosit/ и пересылает его в тот же Telegram-бот,
// что и заявки — просто с другой пометкой, чтобы отличать вопросы от заказов.
// Нужны те же переменные окружения, что и для /api/lead.js.

export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, contact, question } = data;

    if (!question) {
      return new Response(JSON.stringify({ ok: false, error: 'Напиши сам вопрос' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = import.meta.env.TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы в переменных окружения');
      return new Response(JSON.stringify({ ok: false, error: 'Приём вопросов временно не настроен' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = [
      '❓ Новый вопрос с priehali.com',
      name ? `Имя: ${name}` : null,
      contact ? `Контакт: ${contact}` : null,
      `Вопрос: ${question}`,
    ].filter(Boolean).join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error('Telegram API error:', errText);
      return new Response(JSON.stringify({ ok: false, error: 'Не удалось отправить вопрос' }), {
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
