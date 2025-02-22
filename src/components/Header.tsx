
import { motion } from "framer-motion";
import { Code } from "lucide-react";

export const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/50 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Code className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="text-lg font-bold tracking-wider">ABEL.DEV</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <nav className="hidden md:flex items-center gap-8 mr-8">
              <motion.button
                onClick={() => scrollToSection('projects')}
                className="text-sm hover:text-primary transition-colors cursor-none"
                whileHover={{ scale: 1.05 }}
              >
                Projects
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('skills')}
                className="text-sm hover:text-primary transition-colors cursor-none"
                whileHover={{ scale: 1.05 }}
              >
                Skills
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="text-sm hover:text-primary transition-colors cursor-none"
                whileHover={{ scale: 1.05 }}
              >
                Contact
              </motion.button>
            </nav>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
