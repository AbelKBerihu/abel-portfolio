
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState("7016841695:AAE_6o9pE62kaZbnEBeaoqtF3ElCpd_E76M"); // Updated with your bot token
  const [telegramChatId, setTelegramChatId] = useState("7566668762"); // Updated with your chat ID

  // Initialize form with validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to send message to Telegram
  const sendToTelegram = async (data: ContactFormValues) => {
    const text = `
📧 New Contact Form Submission 📧

👤 Name: ${data.name}
📩 Email: ${data.email}
💬 Message: ${data.message}
    `;

    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    
    try {
      const response = await fetch(telegramApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: text,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || "Failed to send to Telegram");
      }
      
      return true;
    } catch (error) {
      console.error("Telegram API error:", error);
      throw error;
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      // Send via EmailJS
      await emailjs.send(
        'service_wne1zy9',
        'template_8z2ypcj',
        {
          from_name: data.name,
          from_email: data.email,
          to_email: 'ks.avebina7@gmail.com',
          message: data.message,
        },
        'RwhyRBgaROGXAK2j_'
      );

      // Also send to Telegram
      await sendToTelegram(data);

      toast.success(t("messageSent"));
      form.reset();
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
          className="max-w-md mx-auto"
        >
          <div className="glass rounded-lg p-6 shadow-lg backdrop-blur-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("yourName")}
                            className="bg-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("emailAddress")}
                            type="email"
                            className="bg-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder={t("yourMessage")}
                            className="bg-white/50 min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full bg-primary/80 hover:bg-primary transition-all duration-300 cursor-none text-primary-foreground font-semibold"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {!isMobile && <Send className="w-4 h-4 mr-2" />}
                    {isSubmitting ? t("sending") : t("sendMessage")}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
