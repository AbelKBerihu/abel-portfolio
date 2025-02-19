
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
          <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
            Crafting Digital
            <span className="text-primary"> Experiences</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            I create engaging web experiences and compelling video content that
            captivate audiences and drive results.
          </p>
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
    </section>
  );
};
