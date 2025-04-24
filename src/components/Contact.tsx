
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessagingService } from "./Contact/messaging-service";
import { ContactForm } from "./Contact/ContactForm";
import type { ContactFormValues } from "./Contact/schema";

// These would typically come from your backend/API
const AVAILABLE_DATES = [
  new Date(2024, 3, 25),  // April 25, 2024
  new Date(2024, 3, 26),  // April 26, 2024
  new Date(2024, 3, 29),  // April 29, 2024
  new Date(2024, 4, 1),   // May 1, 2024
];

export const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Replace these with your actual credentials
  const [telegramBotToken] = useState("YOUR_BOT_TOKEN");
  const [telegramChatId] = useState("YOUR_CHAT_ID");
  const [emailJSServiceId] = useState("YOUR_EMAILJS_SERVICE_ID");
  const [emailJSTemplateId] = useState("YOUR_EMAILJS_TEMPLATE_ID");
  const [emailJSPublicKey] = useState("YOUR_EMAILJS_PUBLIC_KEY");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const messagingService = new MessagingService(
    telegramBotToken,
    telegramChatId,
    emailJSServiceId,
    emailJSTemplateId,
    emailJSPublicKey
  );

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    let messageSent = false;

    try {
      // Try to send via Telegram
      try {
        await messagingService.sendToTelegram(data);
        messageSent = true;
        console.log("Message sent successfully to Telegram");
      } catch (telegramError) {
        console.error("Telegram sending failed:", telegramError);
      }

      // Also try to send via EmailJS if credentials are set
      try {
        const emailSent = await messagingService.sendViaEmailJS(data);
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
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">{t("contactTitle")}</h2>
          <p className="text-muted-foreground">{t("contactSubtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-lg p-6 shadow-lg backdrop-blur-lg">
            <ContactForm
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              isMobile={isMobile}
              availableDates={AVAILABLE_DATES}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
