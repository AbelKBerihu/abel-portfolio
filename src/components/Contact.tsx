import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Sparkles, X } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeading } from "./SectionHeading";
import { ContactForm } from "./Contact/ContactForm";
import type { ContactFormValues } from "./Contact/schema";

async function notifyTelegram(data: ContactFormValues) {
  try {
    const formattedDate = format(data.preferredDate, "yyyy-MM-dd");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        preferredDate: formattedDate,
        projectNeeds: data.projectNeeds || "",
        message: data.message,
      }),
    });
    const result = await res.json();
    return Boolean(result?.ok);
  } catch (err) {
    console.warn("Backend notification notice:", err);
    return false;
  }
}

export const Contact = () => {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const onSubmit = async (data: ContactFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      // 1. Direct Telegram Bot Notification to Abel's Telegram
      const telegramOk = await notifyTelegram(data);

      // 2. Persist to Supabase contact_submissions table for Admin portal Inbox
      if (isSupabaseConfigured) {
        try {
          await supabase.from('contact_submissions').insert({
            name: data.name,
            email: data.email,
            phone: data.phone ?? '',
            project_needs: data.projectNeeds ?? '',
            message: data.message,
            preferred_date: format(data.preferredDate, "yyyy-MM-dd"),
            telegram_delivered: telegramOk,
          });
        } catch (dbErr) {
          console.warn("Supabase backup save notice:", dbErr);
        }
      }

      toast.success(t("messageSent"));
      return true;
    } catch (e) {
      console.error("Contact submission failed", e);
      toast.error(t("messageFailed"));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container mx-auto px-4">
        <SectionHeading
          number="05 / contact"
          title={t("contactTitle")}
          subtitle="Have an opportunity, a question, or something to build? Let’s talk."
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <div className="glass rounded-lg p-6 md:p-8">
            <ContactForm onSubmit={onSubmit} isSubmitting={isSubmitting} isMobile={isMobile} />
          </div>
        </motion.div>

        <AnimatePresence>
          {brief && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl mt-6 rounded-lg border border-primary/40 bg-primary/5 p-6 md:p-8 relative"
              role="status"
            >
              <button
                onClick={() => setBrief(null)}
                aria-label="Dismiss brief"
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="editorial-kicker mb-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Your project brief
              </p>
              <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-foreground">{brief}</pre>
              <p className="mt-4 text-xs text-muted-foreground">Abel received this brief on Telegram and will follow up.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
