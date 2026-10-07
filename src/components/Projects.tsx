import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useProjects } from "@/lib/portfolio-content";

export const Projects = () => {
  const [active, setActive] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const { data: projects = [], isLoading } = useProjects();

  return (
    <section className="section-rule bg-card/35 py-24" aria-labelledby="projects-title">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div><p className="editorial-kicker">01 / Selected work</p><h2 id="projects-title" className="mt-3 text-4xl font-bold md:text-6xl">Projects with a point of view.</h2></div>
          <p className="max-w-sm text-muted-foreground">Digital products and visual systems shaped for clarity, speed, and memorable interaction.</p>
        </div>

        {isLoading && <div className="grid gap-8 md:grid-cols-2">{[0, 1].map((i) => <div key={i} className="aspect-[4/3] animate-pulse bg-secondary" />)}</div>}

        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {projects.map((project, index) => {
            const expanded = active === project.id;
            return (
              <motion.article key={project.id} initial={reduceMotion ? false : { opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: (index % 2) * 0.06 }} className={index % 2 ? "md:mt-20" : ""}>
                <button type="button" onClick={() => setActive(expanded ? null : project.id)} className="group block w-full text-left" aria-expanded={expanded}>
                  <div className="relative aspect-[4/3] overflow-hidden border border-border bg-secondary">
                    {project.image && <motion.img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover opacity-80" whileHover={reduceMotion ? undefined : { scale: 1.04 }} transition={{ duration: 0.6 }} />}
                    <span className="absolute left-4 top-4 border border-border bg-background/85 px-3 py-1 font-jetbrains text-xs text-primary backdrop-blur">{String(index + 1).padStart(2, "0")}</span>
                    <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center bg-primary text-primary-foreground"><ArrowUpRight /></span>
                  </div>
                  <div className="border-b border-border py-5">
                    <p className="editorial-kicker">{project.discipline}</p>
                    <h3 className="mt-2 text-2xl font-semibold transition-colors group-hover:text-primary">{project.title}</h3>
                    <motion.div initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }} className="max-w-xl overflow-hidden">
                      <p className="pt-3 leading-relaxed text-muted-foreground">{project.description}</p>
                      {project.link_url && (
                        <a href={project.link_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="mt-3 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline">
                          View project <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </motion.div>
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
