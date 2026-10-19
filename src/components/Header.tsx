import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useSettings } from "@/hooks/use-portfolio";

export const Header = () => {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [showPicture, setShowPicture] = useState(false);
  const links = [["about", "About"], ["projects", t("projects")], ["certifications", t("certifications")], ["skills", t("skills")]];
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setOpen(false);
  };

  const handleNameDoubleClick = () => {
    setShowPicture((prev) => !prev);
  };

  const profileImage = settings.profile_image || 'https://i.pravatar.cc/300?img=11';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <button
          type="button"
          onClick={() => scrollTo("home")}
          onDoubleClick={handleNameDoubleClick}
          className="font-jetbrains text-base font-extrabold uppercase md:text-lg cursor-pointer relative group"
        >
          <span className="relative z-10 flex items-center gap-0">
            <span className={showPicture ? "inline-block w-1/2 text-right pr-2 transition-all duration-300" : "inline-block"}>
              ABEL
            </span>
            <span className="text-primary">.</span>
            <span className={showPicture ? "inline-block w-1/2 text-left pl-2 transition-all duration-300" : "inline-block"}>
              K
            </span>
          </span>
          {showPicture && (
            <AnimatePresence mode="wait">
              <motion.div
                key="profile-pic"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-black/85 flex items-center justify-center rounded-full transition-all duration-300"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 bg-card shadow-2xl"
                >
                  <img
                    src={profileImage}
                    alt="Profile picture"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </button>

        <div className="hidden items-center gap-7 md:flex">
          <nav className="flex items-center gap-7" aria-label="Main navigation">
            {links.map(([id, label]) => (
              <button key={id} type="button" onClick={() => scrollTo(id)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </button>
            ))}
          </nav>
          <ThemeToggle />
          <Button size="sm" onClick={() => scrollTo("contact")}>{t("contact")}</Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-background md:hidden">
            <nav className="container mx-auto flex flex-col px-4 py-4" aria-label="Mobile navigation">
              {[...links, ["contact", t("contact")]].map(([id, label]) => (
                <button key={id} type="button" onClick={() => scrollTo(id)} className="border-b border-border py-4 text-left text-sm uppercase last:border-0">{label}</button>
              ))}
              <div className="mt-3"><ThemeToggle /></div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
