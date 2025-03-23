
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { VoiceInput } from "./VoiceInput";
import { UseFormSetValue } from "react-hook-form";
import { ContactFormValues } from "./ContactForm";

interface ContactSubmitButtonProps {
  isSubmitting: boolean;
  isMobile: boolean;
  setValue: UseFormSetValue<ContactFormValues>;
}

export const ContactSubmitButton = ({ isSubmitting, isMobile, setValue }: ContactSubmitButtonProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex justify-end items-center space-x-2"
    >
      <VoiceInput setValue={setValue} isSubmitting={isSubmitting} />
      <Button
        className="bg-primary/80 hover:bg-primary transition-all duration-300 cursor-none text-primary-foreground font-semibold"
        type="submit"
        disabled={isSubmitting}
      >
        {!isMobile && <Send className="w-4 h-4 mr-2" />}
        {isSubmitting ? t("sending") : t("sendMessage")}
      </Button>
    </motion.div>
  );
};
