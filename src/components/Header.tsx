
import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const { t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.button
            onClick={() => scrollToSection('home')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-none"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Code className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="text-lg font-bold tracking-wider">ABEL.DEV</span>
          </motion.button>
          
          <div className="flex items-center space-x-8">
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-8"
            >
              <motion.button
                onClick={() => scrollToSection('projects')}
                className="text-sm hover:text-primary transition-colors cursor-none"
                whileHover={{ scale: 1.05 }}
              >
                {t("projects")}
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('certifications')}
                className="text-sm hover:text-primary transition-colors cursor-none"
                whileHover={{ scale: 1.05 }}
              >
                {t("certifications")}
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('skills')}
                className="text-sm hover:text-primary transition-colors cursor-none"
                whileHover={{ scale: 1.05 }}
              >
                {t("skills")}
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="text-sm hover:text-primary transition-colors cursor-none"
                whileHover={{ scale: 1.05 }}
              >
                {t("contact")}
              </motion.button>
            </motion.nav>
          </div>
        </div>
      </div>
    </header>
  );
};
