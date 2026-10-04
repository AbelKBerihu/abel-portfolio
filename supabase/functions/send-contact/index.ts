import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(10).max(3000),
  preferredDate: z.string().date(),
});

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: jsonHeaders });
  }

  try {
    const parsed = ContactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Please check the submitted details." }), { status: 400, headers: jsonHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const telegramToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!supabaseUrl || !serviceRoleKey || !telegramToken) throw new Error("Contact service is not configured");

    const { name, email, phone, message, preferredDate } = parsed.data;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { error: insertError } = await supabase.from("contact_submissions").insert({
      name,
      email,
      phone: phone || null,
      message,
      preferred_date: preferredDate,
    });
    if (insertError) throw new Error(`Could not save submission: ${insertError.message}`);

    const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "8738536556",
        text: [
          "New portfolio enquiry",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || "Not provided"}`,
          `Preferred date: ${preferredDate}`,
          "",
          `Message: ${message}`,
        ].join("\n"),
      }),
    });

    const telegramResult = await telegramResponse.json();
    if (!telegramResponse.ok || !telegramResult.ok) {
      const details = telegramResult.description ?? "Telegram rejected the message";
      console.error(`Telegram request failed [${telegramResponse.status}]: ${details}`);
      return new Response(JSON.stringify({ error: "Your message was saved, but the Telegram notification failed." }), {
        status: 502,
        headers: jsonHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
  } catch (error) {
    console.error("send-contact failed", error);
    return new Response(JSON.stringify({ error: "Unable to send your message right now." }), { status: 500, headers: jsonHeaders });
  }
});