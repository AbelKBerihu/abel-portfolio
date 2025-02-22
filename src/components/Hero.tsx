import { motion } from "framer-motion";
import { ArrowDown, Phone, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export const Hero = () => {
  const text = "ABEL KEBEDE";
  const characters = Array.from(text);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);

  const nameVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.section 
      id="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-primary/80 font-medium tracking-wider uppercase">
            Web Developer & Video Editor
          </span>
          <motion.h1 
            variants={nameVariants}
            initial="initial"
            animate="animate"
            className="text-4xl md:text-6xl font-bold mt-4 mb-6 flex justify-center items-center gap-[2px]"
          >
            {characters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-[4px] h-[40px] md:h-[60px] bg-primary ml-2"
            />
          </motion.h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            I create engaging web experiences and compelling video content that
            captivate audiences and drive results.
          </p>

          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                variant="outline"
                size="lg"
                onMouseEnter={() => setIsPhoneHovered(true)}
                onMouseLeave={() => setIsPhoneHovered(false)}
                className="glass hover:bg-primary/10 transition-all duration-500 ease-in-out transform hover:scale-110 text-lg w-48 h-[48px] relative overflow-hidden cursor-none"
                asChild
              >
                <a href="tel:+251 930 466 887">
                  <AnimatePresence mode="wait">
                    {!isPhoneHovered ? (
                      <motion.div
                        initial={{ y: 0 }}
                        exit={{ y: -30 }}
                        className="flex items-center justify-center gap-2 absolute inset-0"
                      >
                        <Phone className="h-6 w-6" />
                        <span>Call Me</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        initial={{ y: 30 }}
                        animate={{ y: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        +251 930 466 887
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="glass hover:bg-[#14A800]/10 transition-all duration-500 text-lg h-[48px] cursor-none"
                asChild
              >
                <a 
                  href="https://www.upwork.com/your-profile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#14A800] hover:text-[#14A800]"
                >
                  <span>Hire me on Upwork</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="glass hover:bg-primary/10 transition-all duration-500 text-lg h-[48px] cursor-none"
                asChild
              >
                <a 
                  href="/resume.pdf" 
                  download 
                  className="flex items-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>Download CV</span>
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <ArrowDown className="animate-bounce" />
      </motion.div>
    </motion.section>
  );
};
