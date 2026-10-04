import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Layers, Palette, ShoppingBag, Globe } from "lucide-react";
import { useState } from "react";
import brandImage from "@/assets/projects/brand.jpg";
import commerceImage from "@/assets/projects/commerce.jpg";
import systemImage from "@/assets/projects/system.jpg";
import portfolioImage from "@/assets/projects/portfolio.jpg";

const projects = [
  { title: "Brand Identity Design", discipline: "Identity / Direction", description: "A complete visual identity system spanning mark, palette, typography, and practical brand guidelines.", image: brandImage, icon: Palette },
  { title: "E-Commerce Platform", discipline: "Product / Web", description: "A modern storefront concept focused on clear product discovery, inventory visibility, and frictionless purchase flows.", image: commerceImage, icon: ShoppingBag },
  { title: "UI/UX Design System", discipline: "Systems / Interface", description: "A scalable interface language bringing reusable components, patterns, and product guidance into one system.", image: systemImage, icon: Layers },
  { title: "Portfolio Website", discipline: "Creative development", description: "A responsive photographer portfolio where expressive transitions support the work instead of competing with it.", image: portfolioImage, icon: Globe },
];

export const Projects = () => {
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-rule bg-card/35 py-24" aria-labelledby="projects-title">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div><p className="editorial-kicker">01 / Selected work</p><h2 id="projects-title" className="mt-3 text-4xl font-bold md:text-6xl">Projects with a point of view.</h2></div>
          <p className="max-w-sm text-muted-foreground">Digital products and visual systems shaped for clarity, speed, and memorable interaction.</p>
        </div>

        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {projects.map((project, index) => {
            const Icon = project.icon;
            const expanded = active === index;
            return (
              <motion.article key={project.title} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.06 }} className={index % 2 ? "md:mt-20" : ""}>
                <button type="button" onClick={() => setActive(expanded ? null : index)} className="group block w-full text-left" aria-expanded={expanded}>
                  <div className="relative aspect-[4/3] overflow-hidden border border-border bg-secondary">
                    <motion.img src={project.image} alt="" loading="lazy" className="h-full w-full object-cover opacity-80" whileHover={reduceMotion ? undefined : { scale: 1.04 }} transition={{ duration: 0.6 }} />
                    <span className="absolute left-4 top-4 border border-border bg-background/85 px-3 py-1 font-jetbrains text-xs text-primary backdrop-blur">0{index + 1}</span>
                    <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center bg-primary text-primary-foreground"><ArrowUpRight /></span>
                  </div>
                  <div className="border-b border-border py-5">
                    <div className="flex items-center justify-between gap-4"><p className="editorial-kicker">{project.discipline}</p><Icon className="h-5 w-5 text-muted-foreground" /></div>
                    <h3 className="mt-2 text-2xl font-semibold transition-colors group-hover:text-primary">{project.title}</h3>
                    <motion.p initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }} className="max-w-xl overflow-hidden pt-3 leading-relaxed text-muted-foreground">{project.description}</motion.p>
                  </div>
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};