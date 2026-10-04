import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Phone } from "lucide-react";
import { Button } from "./ui/button";
import projectPreview from "@/assets/projects/portfolio.jpg";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const Hero = () => {
  const reduceMotion = useReducedMotion();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });

  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-24 md:pt-28">
      <div className="container relative mx-auto grid min-h-[calc(92vh-7rem)] items-center gap-14 px-4 pb-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="relative z-10 max-w-4xl">
          <motion.div variants={reveal} className="editorial-kicker mb-8 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for selected projects
          </motion.div>

          <motion.h1 variants={reveal} className="max-w-5xl text-5xl font-extrabold leading-[0.95] md:text-7xl lg:text-8xl">
            Building digital experiences that <span className="text-primary">matter.</span>
          </motion.h1>

          <motion.p variants={reveal} className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            I’m Abel Kebede — a web developer and graphic designer creating fast, expressive interfaces where code and visual identity move together.
          </motion.p>

          <motion.div variants={reveal} className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => scrollTo("projects")} className="h-12 px-6 font-semibold">
              View selected work <ArrowDownRight />
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-6">
              <a href="tel:+251930466887"><Phone /> Let’s talk</a>
            </Button>
          </motion.div>

          <motion.div variants={reveal} className="mt-20 flex items-center gap-4 text-xs uppercase text-muted-foreground">
            <span className="h-12 w-px bg-gradient-to-b from-primary to-transparent" />
            Scroll to explore
          </motion.div>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => scrollTo("projects")}
          initial={{ opacity: 0, x: 40, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          whileHover={reduceMotion ? undefined : { rotate: 0, y: -8 }}
          className="group relative hidden aspect-[4/5] overflow-hidden border border-border bg-card text-left shadow-2xl lg:block"
          aria-label="View featured portfolio project"
        >
          <img src={projectPreview} alt="Featured portfolio website project" className="h-[58%] w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
          <div className="p-6">
            <p className="editorial-kicker">Featured / 04</p>
            <h2 className="mt-3 text-2xl font-semibold">Portfolio Website</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Interactive direction, responsive build, and a focused visual system.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase text-primary">Explore project <ArrowUpRight className="h-4 w-4" /></span>
          </div>
        </motion.button>
      </div>
    </section>
  );
};