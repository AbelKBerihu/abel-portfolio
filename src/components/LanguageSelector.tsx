
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["English", "Tigrigna", "Amharic"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-14 z-50"
    >
      <div className="relative group">
        <button
          className="p-2 rounded-full transition-transform hover:scale-110 cursor-none flex items-center justify-center"
          aria-label="Change language"
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </button>
        
        <div className="absolute right-0 mt-2 w-36 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === lang ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              } transition-colors cursor-none`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
