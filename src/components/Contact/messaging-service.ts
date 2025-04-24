
import { ContactFormValues } from './schema';
import emailjs from '@emailjs/browser';
import { format } from "date-fns";

export class MessagingService {
  constructor(
    private telegramBotToken: string,
    private telegramChatId: string,
    private emailJSServiceId: string,
    private emailJSTemplateId: string,
    private emailJSPublicKey: string
  ) {}

  async sendToTelegram(data: ContactFormValues): Promise<boolean> {
    console.log("Starting Telegram send process with new token");
    
    const text = `
📧 New Contact Form Submission 📧

👤 Name: ${data.name}
📩 Email: ${data.email}
📱 Phone: ${data.phone || "Not provided"}
📅 Preferred Contact Date: ${format(data.preferredDate, "PPP")}
💬 Message: ${data.message}
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
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.description || "Failed to send to Telegram");
      }
      
      return true;
    } catch (error) {
      console.error("Telegram API error:", error);
      throw error;
    }
  }

  async sendViaEmailJS(data: ContactFormValues): Promise<boolean> {
    try {
      // Skip EmailJS if credentials are not set
      if (this.emailJSServiceId === "YOUR_EMAILJS_SERVICE_ID" || 
          this.emailJSTemplateId === "YOUR_EMAILJS_TEMPLATE_ID" || 
          this.emailJSPublicKey === "YOUR_EMAILJS_PUBLIC_KEY") {
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
          to_email: 'ks.avebina7@gmail.com',
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
