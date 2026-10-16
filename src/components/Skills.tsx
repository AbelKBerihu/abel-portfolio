import { motion, animate, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";

const SkillItem = ({ name, level, index }: { name: string; level: number; index: number }) => {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? level : 0);
  const [started, setStarted] = useState(false);

  const handleEnter = () => {
    if (started || reduce) return;
    setStarted(true);
    animate(0, level, { duration: 1.2, delay: 0.2 + (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setDisplay(Math.round(v)) });
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08 }}
      viewport={{ once: true, margin: "-60px" }}
      onViewportEnter={handleEnter}
      className="group border-b border-border py-5"
    >
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <span className="font-jetbrains text-sm text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span className="flex-1 font-medium text-lg transition-transform duration-300 group-hover:translate-x-2">{name}</span>
        <span className="font-jetbrains text-2xl font-bold tabular-nums text-primary">{display}%</span>
      </div>
      <div role="progressbar" aria-label={name} aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} className="h-[3px] bg-secondary overflow-hidden">
        <motion.div
          initial={reduce ? { scaleX: level / 100 } : { scaleX: 0 }}
          whileInView={{ scaleX: level / 100 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{ originX: 0 }}
          className={level >= 100 ? "h-full bg-emerald-500" : "h-full bg-amber-500"}
        />
      </div>
    </motion.div>
  );
};

export const Skills = () => {
  const reduce = useReducedMotion();
  const { data: skills = [], isError } = usePortfolio("skills");
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mb-12 max-w-3xl"
        >
          <p className="editorial-kicker mb-4">04 — Skills</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Skills & tools</h2>
          <p className="text-muted-foreground text-lg">Technologies and tools I work with</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-x-12">
          {isError && <p role="alert">Skills are temporarily unavailable.</p>}
          {skills.map((s, i) => <SkillItem key={s.id} {...s} index={i} />)}
          {!isError && skills.length === 0 && (
            <div className="col-span-full flex min-h-[280px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card/50 p-12 text-center">
              <Sparkles className="mb-4 h-10 w-10 text-primary/50" />
              <p className="font-jetbrains text-sm uppercase tracking-wider text-muted-foreground">Coming soon</p>
              <p className="mt-2 text-xl font-semibold">Skills in progress</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">I'm actively building my skill set. Check back soon for the full list.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
