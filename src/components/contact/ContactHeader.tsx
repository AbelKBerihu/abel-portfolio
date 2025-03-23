
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const ContactHeader = () => {
  const { t } = useLanguage();
  
  return (
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
  );
};
