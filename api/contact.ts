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

    // Generate cryptographic integrity checksum (SHA-256)
    const payloadSignature = `${name}|${email}|${message}|${Date.now()}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(payloadSignature));
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const checksum = hashHex.substring(0, 12).toUpperCase();
    const refId = `INQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    if (!token) {
      console.warn('TELEGRAM_BOT_TOKEN is not set in Vercel environment variables.');
      return new Response(JSON.stringify({ ok: false, refId, checksum, notice: 'Token not configured on server' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format clean, cyber-themed Telegram notification
    const text =
      `🛡️ *NEW SECURE INQUIRY DETECTED*\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Client:* ${name}\n` +
      `📧 *Email:* \`${email}\`\n` +
      `📞 *Phone:* ${phone || 'Not provided'}\n` +
      `📅 *Target Date:* ${preferredDate || 'Not specified'}\n` +
      `💼 *Focus:* ${projectNeeds || 'General Inquiry'}\n\n` +
      `💬 *Message:*\n${message}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔒 *Transport:* TLS 1.3 End-to-Edge\n` +
      `🛡️ *Integrity SHA-256:* \`${checksum}\`\n` +
      `🆔 *Ref:* \`${refId}\``;

    // Build inline interactive quick-action buttons
    const inlineKeyboard: Array<Array<{ text: string; url?: string; callback_data?: string }>> = [
      [
        {
          text: `📧 Reply to ${name.split(' ')[0]}`,
          url: `mailto:${email}?subject=Re:%20Your%20Inquiry%20-%20Abel%20Kebede`,
        },
        {
          text: `⚡ Review in Admin`,
          url: `https://abelkberihu.vercel.app/admin`,
        },
      ],
    ];

    if (phone && phone.trim().length >= 7) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone) {
        inlineKeyboard.push([
          {
            text: `💬 Chat on WhatsApp`,
            url: `https://wa.me/${cleanPhone}`,
          },
        ]);
      }
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      }),
    });

    const data = await tgRes.json();
    return new Response(JSON.stringify({ ok: data?.ok === true, refId, checksum }), {
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
