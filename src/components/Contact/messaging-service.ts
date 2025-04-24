
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
    const approvalButtons = JSON.stringify({
      inline_keyboard: [[
        { text: "✅ Approve", callback_data: `approve_${data.email}` },
        { text: "❌ Decline", callback_data: `decline_${data.email}` }
      ]]
    });

    const text = `
📧 New Contact Request (Pending Approval) 📧

👤 Name: ${data.name}
📩 Email: ${data.email}
📱 Phone: ${data.phone || "Not provided"}
📅 Preferred Contact Date: ${format(data.preferredDate, "PPP")}
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
      // Skip EmailJS if credentials are not set
      if (!this.emailJSServiceId || !this.emailJSTemplateId || !this.emailJSPublicKey) {
        console.log("EmailJS credentials not set, skipping email send");
        return false;
      }
      
      const response = await emailjs.send(
        this.emailJSServiceId,
        this.emailJSTemplateId,
        {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone || "Not provided",
          preferred_date: format(data.preferredDate, "PPP"),
          message: data.message,
        },
        this.emailJSPublicKey
      );
      
      console.log("EmailJS response:", response);
      return true;
    } catch (error) {
      console.error("EmailJS error:", error);
      return false;
    }
  }
}
