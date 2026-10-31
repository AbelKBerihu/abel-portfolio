export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { name, email, phone, preferredDate, projectNeeds, message } = body || {};

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || '8738536556';

    if (!token) {
      console.warn('TELEGRAM_BOT_TOKEN is not set in Vercel environment variables.');
      return new Response(JSON.stringify({ ok: false, notice: 'Token not configured on server' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = `🔔 *New Portfolio Inquiry*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📞 *Phone:* ${phone || 'Not provided'}\n` +
      `📅 *Preferred Date:* ${preferredDate || 'Not specified'}\n` +
      `💼 *Project Needs:* ${projectNeeds || 'General Inquiry'}\n\n` +
      `💬 *Message:*\n${message}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await tgRes.json();
    return new Response(JSON.stringify({ ok: data?.ok === true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Server contact handler error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
