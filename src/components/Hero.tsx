
import { motion } from "framer-motion";
import { ArrowDown, Linkedin, Mail, Phone, Youtube } from "lucide-react";
import { Button } from "./ui/button";

export const Hero = () => {
  const text = "ABEL KEBEDE";
  const characters = Array.from(text);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
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
              className="flex justify-center gap-4"
            >
              <Button
                variant="outline"
                size="lg"
                className="glass hover:bg-primary/10 transition-all duration-500 ease-in-out transform hover:scale-110 text-lg w-48 h-[48px] group"
                asChild
              >
                <a href="tel:+1234567890" className="relative overflow-hidden">
                  <Phone className="mr-2 h-6 w-6" />
                  <span className="group-hover:translate-y-[-100%] transition-transform duration-300 inline-block">
                    Call Me
                  </span>
                  <span className="absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-[100%] group-hover:translate-y-[-50%] transition-transform duration-300 text-lg font-medium whitespace-nowrap">
                    +1234567890
                  </span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="glass hover:bg-[#14A800]/10 transition-all duration-300 ease-in-out transform hover:scale-110 text-lg w-48"
                asChild
              >
                <a href="https://upwork.com/your-profile" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2 h-6 w-6 text-[#14A800]"
                  >
                    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.917 2.37 5.297 5.281 5.297 2.913 0 5.283-2.38 5.283-5.297V9.06c.53 1.086 1.181 2.185 1.971 3.15l-1.67 7.873h2.833l1.213-5.727c1.063.679 2.285 1.109 3.652 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.441-5.439z" />
                  </svg>
                  <span className="text-[#14A800]">Upwork</span>
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                variant="outline"
                size="lg"
                className="glass hover:bg-[#0A66C2]/10 transition-all duration-300 ease-in-out transform hover:scale-105"
                asChild
              >
                <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Linkedin className="mr-2 h-5 w-5 text-[#0A66C2] transition-transform duration-300 ease-in-out group-hover:rotate-12" />
                  <span className="text-[#0A66C2] transition-colors duration-300">LinkedIn</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="glass hover:bg-red-500/10"
                asChild
              >
                <a
                  href="https://youtube.com/your-channel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Youtube className="mr-2 h-6 w-6 text-red-500" />
                  <span className="text-red-500">YouTube</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="glass hover:bg-[#0088cc]/10"
                asChild
              >
                <a href="https://t.me/your-username" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2 h-5 w-5 text-[#0088cc]"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-[#0088cc]">Telegram</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="glass hover:bg-[#25D366]/10"
                asChild
              >
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2 h-5 w-5 text-[#25D366]"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-[#25D366]">WhatsApp</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="glass"
                asChild
              >
                <a href="mailto:your.email@example.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Email
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
