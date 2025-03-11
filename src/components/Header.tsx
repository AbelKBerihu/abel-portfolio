
import { motion, AnimatePresence } from "framer-motion";
import { Code, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

export const Header = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
      
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
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
            className={`flex items-center gap-2 ${isMobile ? '' : 'cursor-none'}`}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Code className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </motion.div>
            <span className="text-base md:text-lg font-bold tracking-wider">ABEL.DEV</span>
          </motion.button>
          
          <div className="flex items-center">
            {isMobile ? (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            ) : (
              <div className="flex items-center">
                <motion.nav
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-8 mr-8"
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
                
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 hidden"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-background border-b overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  <motion.button
                    onClick={() => scrollToSection('projects')}
                    className="py-2 text-sm hover:text-primary transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t("projects")}
                  </motion.button>
                  <motion.button
                    onClick={() => scrollToSection('certifications')}
                    className="py-2 text-sm hover:text-primary transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t("certifications")}
                  </motion.button>
                  <motion.button
                    onClick={() => scrollToSection('skills')}
                    className="py-2 text-sm hover:text-primary transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t("skills")}
                  </motion.button>
                  <motion.button
                    onClick={() => scrollToSection('contact')}
                    className="py-2 text-sm hover:text-primary transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t("contact")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </header>
  );
};
