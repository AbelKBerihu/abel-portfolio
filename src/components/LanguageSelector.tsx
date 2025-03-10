
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["English", "Tigrigna", "Amharic"];
  
  // Language names in their native language
  const nativeNames: Record<Language, string> = {
    "English": "English",
    "Tigrigna": "ትግርኛ",
    "Amharic": "አማርኛ"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed z-50 bottom-4 left-4 md:top-4 md:right-14 md:left-auto md:bottom-auto"
    >
      <div className="relative group">
        <button
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border transition-transform hover:scale-110 cursor-none flex items-center justify-center"
          aria-label="Change language"
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </button>
        
        <div className="absolute bottom-full mb-2 left-0 md:bottom-auto md:right-0 md:left-auto md:top-full md:mt-2 w-36 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === lang ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              } transition-colors cursor-none`}
            >
              {nativeNames[lang]}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
