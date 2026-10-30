import { motion, useReducedMotion } from 'framer-motion';

export interface TerminalConfig {
  path: string;
  command?: string;
}

export function SectionHeading({
  number,
  title,
  subtitle,
  terminal,
}: {
  number: string;
  title: string;
  subtitle?: string;
  terminal?: TerminalConfig;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12 max-w-3xl"
    >
      {terminal ? (
        <div className="mb-4 inline-flex flex-col gap-1 rounded-lg border border-border/80 bg-card/75 px-3.5 py-2 font-jetbrains text-xs shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-primary text-[11px] sm:text-xs">
            <span className="text-muted-foreground/60 select-none">┌──</span>
            <span className="font-bold text-primary">(abel㉿security)</span>
            <span className="text-muted-foreground/60 select-none">-[</span>
            <span className="text-foreground font-mono font-medium">{terminal.path}</span>
            <span className="text-muted-foreground/60 select-none">]</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
            <span className="text-primary font-bold select-none">└─$</span>
            <span className="text-muted-foreground">{terminal.command || 'cat path.log'}</span>
            <span className="inline-block h-3.5 w-1.5 bg-primary animate-pulse ml-0.5" />
          </div>
        </div>
      ) : (
        <p className="editorial-kicker mb-4">{number}</p>
      )}
      <h2 className="text-3xl font-bold md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}
