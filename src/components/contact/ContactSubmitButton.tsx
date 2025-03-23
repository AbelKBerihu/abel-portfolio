
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactSubmitButtonProps {
  isSubmitting: boolean;
  isMobile: boolean;
}

export const ContactSubmitButton = ({ isSubmitting, isMobile }: ContactSubmitButtonProps) => {
  const { t } = useLanguage();

  return (
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
  );
};
