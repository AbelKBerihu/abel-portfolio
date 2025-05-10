
import { ContactFormValues } from './schema';
import emailjs from '@emailjs/browser';
import { format } from "date-fns";

export interface TelegramResponse {
  ok: boolean;
  result?: {
    message_id: number;
  };
}

export class MessagingService {
  constructor(
    private telegramBotToken: string,
    private telegramChatId: string,
    private emailJSServiceId: string,
    private emailJSTemplateId: string,
    private emailJSPublicKey: string
  ) {}

  async sendToTelegram(data: ContactFormValues): Promise<TelegramResponse> {
    // Skip if using placeholder values
    if (this.telegramBotToken === "YOUR_BOT_TOKEN" || this.telegramChatId === "YOUR_CHAT_ID") {
      console.log("Using placeholder Telegram credentials, skipping Telegram message");
      throw new Error("Telegram credentials not configured");
    }
    
    const approvalButtons = JSON.stringify({
      inline_keyboard: [[
        { text: "✅ Approve", callback_data: `approve_${data.email}` },
        { text: "❌ Decline", callback_data: `decline_${data.email}` }
      ]]
    });

    // Format the date safely with a null check
    const formattedDate = data.preferredDate ? format(data.preferredDate, "PPP") : "Not selected";

    const text = `
📧 New Contact Request (Pending Approval) 📧

👤 Name: ${data.name}
📩 Email: ${data.email}
📱 Phone: ${data.phone || "Not provided"}
📅 Preferred Contact Date: ${formattedDate}
💬 Message: ${data.message}

Please approve or decline this request:
    `;

    const telegramApiUrl = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
    
    try {
      const response = await fetch(telegramApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: this.telegramChatId,
          text: text,
          reply_markup: approvalButtons
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.description || "Failed to send to Telegram");
      }
      
      return responseData;
    } catch (error) {
      console.error("Telegram API error:", error);
      throw error;
    }
  }

  async sendViaEmailJS(data: ContactFormValues): Promise<boolean> {
    try {
      // Updated check for EmailJS credentials - now we expect real values
      if (
        !this.emailJSServiceId || 
        !this.emailJSTemplateId || 
        !this.emailJSPublicKey ||
        this.emailJSServiceId === "YOUR_EMAILJS_SERVICE_ID" ||
        this.emailJSTemplateId === "YOUR_EMAILJS_TEMPLATE_ID" ||
        this.emailJSPublicKey === "YOUR_EMAILJS_PUBLIC_KEY"
      ) {
        console.log("EmailJS credentials not properly configured, skipping email send");
        throw new Error("EmailJS credentials not configured");
      }
      
      // Format the date safely with a null check
      const formattedDate = data.preferredDate ? format(data.preferredDate, "PPP") : "Not selected";
      
      const response = await emailjs.send(
        this.emailJSServiceId,
        this.emailJSTemplateId,
        {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone || "Not provided",
          preferred_date: formattedDate,
          message: data.message,
        },
        this.emailJSPublicKey
      );
      
      console.log("EmailJS response:", response);
      return true;
    } catch (error) {
      console.error("EmailJS error:", error);
      throw error;
    }
  }
}
