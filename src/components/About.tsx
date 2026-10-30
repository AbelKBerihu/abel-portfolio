import { usePortfolio, useSettings } from '@/hooks/use-portfolio';
import { SectionHeading } from './SectionHeading';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function About() {
  const { settings } = useSettings();
  const { data = [], isError } = usePortfolio('timeline_items');
  const reduced = useReducedMotion();

  const learningTopics = (settings.currently_learning || 'Network security, Python scripting, Linux administration, Web development with React')
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section id="about" className="section-rule py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          number="01 / my path"
          title="Curious by nature. Learning by doing."
        />
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{settings.about}</p>
            {settings.languages && (
              <p className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
                {settings.languages}
              </p>
            )}
            <div className="mt-10 rounded-lg border border-border/80 bg-card/60 p-5 font-jetbrains backdrop-blur-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <span className="font-bold select-none">└─$</span>
                  <span className="text-foreground font-medium">cat /etc/learning.conf</span>
                </div>
                <div className="flex items-center gap-1.5 font-jetbrains text-[11px] text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>ACTIVE LABS</span>
                </div>
              </div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3 font-jetbrains">
                Currently Exploring & Learning
              </p>
              <div className="flex flex-wrap gap-2">
                {learningTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-jetbrains bg-secondary/30 border border-border/70 text-foreground hover:border-primary/50 transition-colors"
                  >
                    <span className="text-primary font-bold text-[10px] select-none">└─$</span>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            {isError && <p role="alert">My timeline is temporarily unavailable.</p>}
            {data.map((item, i) => (
              <motion.article
                key={item.id}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.2) }}
                viewport={{ once: true }}
                className="relative border-b border-border py-6 first:pt-0 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 font-jetbrains text-xs">
                    <span className="text-primary font-bold select-none">└─$</span>
                    <span className="text-primary font-semibold uppercase tracking-wider">
                      [{item.kind}]
                    </span>
                  </div>
                  <span className="font-jetbrains text-xs text-muted-foreground">{item.period}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                {item.organization && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground font-jetbrains">
                    <span className="text-primary/70 select-none">├──</span>
                    <ArrowUpRight className="h-3 w-3 text-primary" />
                    <span>{item.organization}</span>
                  </p>
                )}
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
