
import { motion } from "framer-motion";
import { ArrowDown, DownloadIcon, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// Custom Upwork Icon component since Lucide doesn't have an official one
const UpworkIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="1em"
    height="1em"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M357.2 296.9c-17 0-32.8-7.2-47.3-19l3.5-16.6.1-.6c3.2-17.6 13.1-47.2 43.6-47.2 22.9 0 41.5 18.6 41.5 41.5.1 23-18.5 41.9-41.4 41.9zm0-125.5c-40.9 0-72.7 26.5-85.6 70.1-19.8-29.7-34.8-65.4-43.7-95.3h-44.7v115.1c0 21.6-17.6 39.2-39.2 39.2s-39.2-17.6-39.2-39.2V146.2H60.2v115.1c0 46.1 37.5 83.8 83.7 83.8 46.1 0 83.7-37.7 83.7-83.8v-19.3c8.7 18.1 19.3 36.3 32.1 52.6l-27.2 128.2h45.8l19.8-93c17.3 11 37.1 18 58.2 18 49.3 0 89.4-40.1 89.4-89.4 0-49.4-40.2-89.5-89.5-89.5z" />
  </svg>
);

export const Hero = () => {
  const text = "ABEL KEBEDE";
  const characters = Array.from(text);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);
  const [isUpworkHovered, setIsUpworkHovered] = useState(false);

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
            Web Developer | Graphics Designer
          </span>
          <motion.h1 
            variants={nameVariants}
            initial="initial"
            animate="animate"
            className="text-4xl md:text-6xl font-bold mt-4 mb-6 flex justify-center items-center gap-[2px] font-playfair"
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
            I create engaging web experiences and compelling visual content that
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
                onMouseEnter={() => setIsUpworkHovered(true)}
                onMouseLeave={() => setIsUpworkHovered(false)}
                className="glass hover:bg-[#14A800]/10 transition-all duration-500 text-lg h-[48px] cursor-none relative overflow-hidden"
                asChild
              >
                <a 
                  href="https://www.upwork.com/your-profile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#14A800] hover:text-[#14A800]"
                >
                  <AnimatePresence mode="wait">
                    {!isUpworkHovered ? (
                      <motion.span
                        initial={{ y: 0 }}
                        exit={{ y: -30 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <UpworkIcon className="h-5 w-5" />
                        <span>Upwork</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ y: 30 }}
                        animate={{ y: 0 }}
                        className="flex items-center justify-center"
                      >
                        <UpworkIcon className="h-5 w-5 mr-2" />
                        <span>Let's talk!</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
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
                  <ArrowDown className="h-5 w-5" />
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
