import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Download, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useSettings } from '@/hooks/use-portfolio';

export const Hero = () => {
  const reduced = useReducedMotion();
  const { settings } = useSettings();
  const cvUrl = settings.cv_url || '/cv.pdf';
  const profileImage = settings.profile_image || 'https://i.pravatar.cc/300?img=11';

  const [isGateOpen, setIsGateOpen] = useState(false);
  const [addisTime, setAddisTime] = useState('');
  const [addisDate, setAddisDate] = useState('');

  // Live Addis Ababa (UTC+3) time for international visitors & recruiters
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        setAddisTime(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'Africa/Addis_Ababa',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }).format(now)
        );
        setAddisDate(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'Africa/Addis_Ababa',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(now)
        );
      } catch {
        setAddisTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Split name for double-door gate reveal
  const fullName = (settings.hero_name || 'Abel Kebede').trim();
  const parts = fullName.split(' ');
  const firstName = parts[0] || 'Abel';
  const lastName = parts.slice(1).join(' ') || 'Kebede';

  return (
    <section className="relative flex min-h-[min(840px,94svh)] items-center overflow-hidden pb-16 pt-28 md:pt-36">
      <div className="container relative mx-auto px-4 lg:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="max-w-5xl"
        >
          {/* Cyber Status & Live Addis Ababa Time HUD */}
          <div className="mb-6 flex flex-wrap items-center gap-3 font-jetbrains text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-muted-foreground backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {settings.status || 'Available for internships & research'}
            </span>

            {addisTime && (
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-muted-foreground backdrop-blur-sm">
                <span className="text-primary font-bold">ETHIOPIA (UTC+3)</span>
                <span>{addisTime}</span>
                <span className="text-border">|</span>
                <span className="text-[11px]">{addisDate}</span>
              </span>
            )}
          </div>

          <p className="editorial-kicker mb-3 flex items-center gap-2 text-primary font-jetbrains">
            <ShieldCheck className="h-4 w-4" />
            {settings.hero_role || 'Cybersecurity Student & Developer'}
          </p>

          {/* Interactive Name & Drop-Down Photo Reveal */}
          <div className="relative inline-block my-2">
            <div
              className="relative inline-flex items-center cursor-pointer select-none group py-1"
              onMouseEnter={() => setIsGateOpen(true)}
              onMouseLeave={() => setIsGateOpen(false)}
              onClick={() => setIsGateOpen((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label={`${fullName} — View identity`}
            >
              <h1 className="hero-name font-bold uppercase leading-[1.08] tracking-tight group-hover:text-primary transition-colors flex items-center gap-3">
                <span>{firstName}</span>
                <span>{lastName}</span>
                <span className="text-primary">.</span>
              </h1>

              {/* Shutter status beacon */}
              <motion.span
                animate={{
                  scale: isGateOpen ? 1.25 : 1,
                  boxShadow: isGateOpen
                    ? '0 0 14px hsl(var(--primary))'
                    : '0 0 0px transparent',
                }}
                className="ml-3 h-2.5 w-2.5 rounded-full bg-primary inline-block transition-transform"
              />
            </div>

            {/* Drop-Down Floating Gate Shutter Card (drags down to not hold layout place) */}
            <AnimatePresence>
              {isGateOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  className="absolute top-full left-0 z-30 pt-2 pointer-events-none"
                >
                  <div className="relative flex items-center gap-4 rounded-xl border-2 border-primary/50 bg-background/95 p-3.5 shadow-2xl backdrop-blur-xl ring-4 ring-primary/15">
                    {/* Portal Avatar Frame */}
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden border border-primary/40 bg-card shadow-md shrink-0">
                      <img
                        src={profileImage}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Cyber Badge */}
                    <div className="flex flex-col pr-3">
                      <span className="font-jetbrains text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" /> Identity Verified
                      </span>
                      <span className="font-jetbrains text-base font-semibold text-foreground">
                        {fullName}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {settings.hero_role || 'Cybersecurity Student & Developer'}
                      </span>
                      <span className="mt-1.5 font-mono text-[9px] text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACCESS GRANTED
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {settings.hero_intro ||
              'A cybersecurity student from Ethiopia exploring how systems work, how they break, and how to protect them.'}
          </p>

          {/* Action Row - CV Button placed directly under the name */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <a href="#projects">
                Explore my work <ArrowDownRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild className="border border-border font-medium shadow-sm hover:border-primary/50">
              <a href={cvUrl} download="Abel_Kebede_CV.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4 text-primary" /> Download CV
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact">
                Get in touch <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 font-jetbrains text-xs text-muted-foreground">
            <span>01 / Security Operations</span>
            <span>02 / Network Analysis</span>
            <span>03 / Full-Stack Development</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
