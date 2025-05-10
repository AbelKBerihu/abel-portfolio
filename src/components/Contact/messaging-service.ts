import { ContactFormValues } from './schema';
import emailjs from '@emailjs/browser';
import { format } from "date-fns";

export interface TelegramResponse {
  ok: boolean;
  result?: {
    message_id: number;
  };
}

// Keep track of approvals per day
interface DateApprovals {
  [date: string]: number; // Format: 'YYYY-MM-DD': count
}

// Singleton to manage date approvals across the app
export class DateApprovalManager {
  private static instance: DateApprovalManager;
  private approvals: DateApprovals = {};
  private maxApprovalsPerDay = 10;

  private constructor() {
    // Try to load from localStorage if available
    try {
      const saved = localStorage.getItem('dateApprovals');
      if (saved) {
        this.approvals = JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading date approvals:", e);
    }
  }

  public static getInstance(): DateApprovalManager {
    if (!DateApprovalManager.instance) {
      DateApprovalManager.instance = new DateApprovalManager();
    }
    return DateApprovalManager.instance;
  }

  public getAvailableDates(): Date[] {
    // Return dates that haven't reached the limit
    const availableDates: Date[] = [];
    const today = new Date();
    
    // Generate next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Format as YYYY-MM-DD for lookup
      const dateKey = format(date, 'yyyy-MM-dd');
      
      // Add if not at limit
      if (!this.approvals[dateKey] || this.approvals[dateKey] < this.maxApprovalsPerDay) {
        availableDates.push(date);
      }
    }
    
    return availableDates;
  }

  public isDateAvailable(date: Date): boolean {
    const dateKey = format(date, 'yyyy-MM-dd');
    return !this.approvals[dateKey] || this.approvals[dateKey] < this.maxApprovalsPerDay;
  }

  public recordApproval(date: Date): boolean {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    // Initialize if not exists
    if (!this.approvals[dateKey]) {
      this.approvals[dateKey] = 0;
    }
    
    // Check if under limit
    if (this.approvals[dateKey] < this.maxApprovalsPerDay) {
      this.approvals[dateKey]++;
      
      // Save to localStorage
      try {
        localStorage.setItem('dateApprovals', JSON.stringify(this.approvals));
      } catch (e) {
        console.error("Error saving date approvals:", e);
      }
      
      return true;
    }
    
    return false; // Limit reached
  }

  public getRemainingSlots(date: Date): number {
    const dateKey = format(date, 'yyyy-MM-dd');
    const used = this.approvals[dateKey] || 0;
    return Math.max(0, this.maxApprovalsPerDay - used);
  }
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
    
    // Check if date is available before sending
    if (data.preferredDate) {
      const dateManager = DateApprovalManager.getInstance();
      if (!dateManager.isDateAvailable(data.preferredDate)) {
        throw new Error("Selected date is no longer available");
      }
    }
    
    const approvalButtons = JSON.stringify({
      inline_keyboard: [[
        { text: "✅ Approve", callback_data: `approve_${data.email}_${data.preferredDate ? format(data.preferredDate, 'yyyy-MM-dd') : ''}` },
        { text: "❌ Decline", callback_data: `decline_${data.email}` }
      ]]
    });

    // Format the date safely with a null check
    const formattedDate = data.preferredDate ? format(data.preferredDate, "PPP") : "Not selected";
    const remainingSlots = data.preferredDate ? 
      DateApprovalManager.getInstance().getRemainingSlots(data.preferredDate) : 
      "N/A";

    const text = `
📧 New Contact Request (Pending Approval) 📧

👤 Name: ${data.name}
📩 Email: ${data.email}
📱 Phone: ${data.phone || "Not provided"}
📅 Preferred Contact Date: ${formattedDate}
🔢 Remaining slots for this date: ${remainingSlots}
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
