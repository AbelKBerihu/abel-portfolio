
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CustomCursor } from "@/components/CustomCursor";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen font-jetbrains relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative z-10">
          <CustomCursor />
          <ThemeToggle />
          <Header />
          <div id="home">
            <Hero />
          </div>
          <div id="projects">
            <Projects />
          </div>
          <div id="skills">
            <Skills />
          </div>
          <div id="contact">
            <Contact />
          </div>
          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
