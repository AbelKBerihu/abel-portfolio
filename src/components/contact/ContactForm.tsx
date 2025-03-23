
import { useState } from "react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ContactFormFields } from "./ContactFormFields";
import { ContactSubmitButton } from "./ContactSubmitButton";
import { useIsMobile } from "@/hooks/use-mobile";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const ContactForm = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  const [telegramBotToken] = useState("7753468504:AAHaciLonL3pW9YjDgbij1BK4L4R2qcxVFE");
  const [telegramChatId] = useState("7566668762");
  
  // EmailJS credentials
  const [emailJSServiceId] = useState("YOUR_EMAILJS_SERVICE_ID");
  const [emailJSTemplateId] = useState("YOUR_EMAILJS_TEMPLATE_ID");
  const [emailJSPublicKey] = useState("YOUR_EMAILJS_PUBLIC_KEY");

  // Initialize form with validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Function to send message to Telegram
  const sendToTelegram = async (data: ContactFormValues) => {
    console.log("Starting Telegram send process with new token");
    
    const text = `
📧 New Contact Form Submission 📧

👤 Name: ${data.name}
📩 Email: ${data.email}
📱 Phone: ${data.phone || "Not provided"}
💬 Message: ${data.message}
    `;

    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    
    console.log("Sending to Telegram API:", telegramApiUrl);
    console.log("Using chat ID:", telegramChatId);
    
    try {
      const response = await fetch(telegramApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: text,
        }),
      });

      const responseData = await response.json();
      console.log("Telegram API response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.description || "Failed to send to Telegram");
      }
      
      return true;
    } catch (error) {
      console.error("Telegram API error:", error);
      throw error;
    }
  };

  // Function to send email via EmailJS
  const sendViaEmailJS = async (data: ContactFormValues) => {
    try {
      // Skip EmailJS if credentials are not set
      if (emailJSServiceId === "YOUR_EMAILJS_SERVICE_ID" || 
          emailJSTemplateId === "YOUR_EMAILJS_TEMPLATE_ID" || 
          emailJSPublicKey === "YOUR_EMAILJS_PUBLIC_KEY") {
        console.log("EmailJS credentials not set, skipping email send");
        return false;
      }
      
      const response = await emailjs.send(
        emailJSServiceId,
        emailJSTemplateId,
        {
          from_name: data.name,
          from_email: data.email,
          phone: data.phone || "Not provided",
          to_email: 'ks.avebina7@gmail.com',
          message: data.message,
        },
        emailJSPublicKey
      );
      
      console.log("EmailJS response:", response);
      return true;
    } catch (error) {
      console.error("EmailJS error:", error);
      return false;
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    let messageSent = false;

    try {
      // Try to send via Telegram
      try {
        await sendToTelegram(data);
        messageSent = true;
        console.log("Message sent successfully to Telegram");
      } catch (telegramError) {
        console.error("Telegram sending failed:", telegramError);
      }

      // Also try to send via EmailJS if credentials are set
      try {
        const emailSent = await sendViaEmailJS(data);
        if (emailSent) {
          messageSent = true;
          console.log("Message sent successfully via EmailJS");
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }

      // Show success message if at least one method worked
      if (messageSent) {
        toast.success(t("messageSent"));
        form.reset();
      } else {
        toast.error(t("messageFailed"));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t("messageFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass rounded-lg p-6 shadow-lg backdrop-blur-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ContactFormFields />
          <ContactSubmitButton isSubmitting={isSubmitting} isMobile={isMobile} />
        </form>
      </Form>
    </div>
  );
};
