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

          {/* Interactive Gate Open Name Title */}
          <div className="my-2 max-w-full overflow-visible">
            <div
              className="relative inline-flex flex-nowrap items-center cursor-pointer select-none group py-2 max-w-full"
              onMouseEnter={() => setIsGateOpen(true)}
              onMouseLeave={() => setIsGateOpen(false)}
              onClick={() => setIsGateOpen((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label={`${fullName} — Hover or tap to open gate and view picture`}
            >
              {/* Left Gate Door */}
              <motion.div
                animate={{
                  x: isGateOpen ? (typeof window !== 'undefined' && window.innerWidth < 640 ? -6 : -20) : 0,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 25 }}
                className="relative flex items-center shrink-0"
              >
                <h1
                  className={`font-jetbrains font-bold uppercase leading-none tracking-tight transition-all duration-300 ${
                    isGateOpen
                      ? 'text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl'
                      : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
                  }`}
                >
                  {firstName}
                </h1>
                <motion.span
                  animate={{
                    opacity: isGateOpen ? 1 : 0,
                    scaleY: isGateOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="ml-1 sm:ml-2 h-7 sm:h-10 md:h-16 w-[2px] sm:w-[3px] bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary))]"
                />
              </motion.div>

              {/* Central Gate Aperture / Picture Reveal */}
              <AnimatePresence>
                {isGateOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0, scale: 0.5 }}
                    animate={{ width: 'auto', opacity: 1, scale: 1 }}
                    exit={{ width: 0, opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 25 }}
                    className="relative mx-1.5 sm:mx-3 md:mx-6 flex items-center justify-center overflow-visible z-20 shrink-0"
                  >
                    <div className="relative">
                      {/* Cyber ring glow halo */}
                      <div className="absolute -inset-1 sm:-inset-2 rounded-full bg-primary/20 blur-md sm:blur-lg animate-pulse" />
                      
                      {/* Portal Avatar Frame */}
                      <div className="relative h-12 w-12 sm:h-16 sm:w-16 md:h-24 md:w-24 lg:h-28 lg:w-28 rounded-full overflow-hidden border-2 border-primary bg-card shadow-2xl ring-2 sm:ring-4 ring-primary/20">
                        <img
                          src={profileImage}
                          alt={fullName}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>

                      {/* HUD Badge */}
                      <div className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 sm:px-2 py-0.5 rounded bg-background/95 border border-primary/50 font-jetbrains text-[8px] sm:text-[9px] tracking-wider text-primary shadow-lg flex items-center gap-1">
                        <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                        ACCESS GRANTED
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Right Gate Door */}
              <motion.div
                animate={{
                  x: isGateOpen ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 20) : 0,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 25 }}
                className="relative flex items-center shrink-0"
              >
                <motion.span
                  animate={{
                    opacity: isGateOpen ? 1 : 0,
                    scaleY: isGateOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="mr-1 sm:mr-2 h-7 sm:h-10 md:h-16 w-[2px] sm:w-[3px] bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary))]"
                />
                <h1
                  className={`font-jetbrains font-bold uppercase leading-none tracking-tight transition-all duration-300 ${
                    isGateOpen
                      ? 'text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl'
                      : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
                  }`}
                >
                  {lastName}
                  <span className="text-primary">.</span>
                </h1>
              </motion.div>
            </div>
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
