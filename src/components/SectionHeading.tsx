import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface TerminalConfig {
  path?: string;
  command?: string;
}

function TypingPrompt({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const [displayText, setDisplayText] = useState(reduced ? text : '');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDisplayText(text);
      return;
    }

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < text.length) {
        timer = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, 85);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2600);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length - 1));
        }, 40);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
        }, 550);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, reduced]);

  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/75 px-3 py-1.5 font-jetbrains text-xs shadow-sm backdrop-blur-md select-none">
      <span className="text-primary font-bold text-sm">$</span>
      <span className="font-mono text-foreground font-semibold tracking-wide">
        {displayText}
      </span>
      <span className="inline-block h-3.5 w-1.5 bg-primary animate-pulse ml-0.5" />
    </div>
  );
}

export function SectionHeading({
  number,
  title,
  subtitle,
  terminal,
  terminalText,
}: {
  number: string;
  title: string;
  subtitle?: string;
  terminal?: TerminalConfig;
  terminalText?: string;
}) {
  const reduced = useReducedMotion();
  const promptText = terminalText || terminal?.path || number;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12 max-w-3xl"
    >
      <TypingPrompt text={promptText} />
      <h2 className="text-3xl font-bold md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}
