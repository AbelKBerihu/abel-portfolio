
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessagingService } from "./Contact/messaging-service";
import { ContactForm } from "./Contact/ContactForm";
import type { ContactFormValues } from "./Contact/schema";

export const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Updated with real credentials
  const [telegramBotToken] = useState("7753468504:AAHaciLonL3pW9YjDgbij1BK4L4R2qcxVFE");
  const [telegramChatId] = useState("7566668762");
  const [emailJSServiceId] = useState("service_ogkb0kd");
  const [emailJSTemplateId] = useState("template_5ye8huc");
  const [emailJSPublicKey] = useState("BTvPy-Xmd6EnmeXGn");

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
    let demoMode = false;

    try {
      // Check if we're in demo mode (All credentials should now be real)
      if (emailJSServiceId === "YOUR_EMAILJS_SERVICE_ID") {
        demoMode = true;
      }

      // Try to send via Telegram
      try {
        await messagingService.sendToTelegram(data);
        messageSent = true;
        console.log("Message sent successfully to Telegram");
      } catch (telegramError) {
        console.error("Telegram sending failed:", telegramError);
      }

      // Also try to send via EmailJS (we now have real credentials)
      if (!messageSent || emailJSServiceId === "service_ogkb0kd") {
        try {
          const emailSent = await messagingService.sendViaEmailJS(data);
          if (emailSent) {
            messageSent = true;
            console.log("Message sent successfully via EmailJS");
          }
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
        }
      }

      // Show success message if any method succeeded
      if (messageSent) {
        toast.success(t("messageSent"));
      } else {
        // Only show error if both methods failed and we're not in demo mode
        if (!demoMode) {
          toast.error(t("messageFailed"));
        } else {
          // In demo mode with real credentials but failed to send
          // Still show success to improve UX
          toast.success(t("messageSent"));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // In demo mode, still show success
      if (demoMode) {
        toast.success(t("messageSent"));
        console.log("Demo mode: Message submission simulated");
      } else {
        toast.error(t("messageFailed"));
      }
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
              availableDates={[]}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
