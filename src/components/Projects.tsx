import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MessageSquare, Network, Shield, Terminal, Sparkles } from 'lucide-react';
import { usePortfolio, safeUrl } from '@/hooks/use-portfolio';
import { Button } from './ui/button';
import { SectionHeading } from './SectionHeading';
import { ProjectComments } from './ProjectComments';
import { ImageModal } from './ui/image-modal';

const glyphs = [Shield, Terminal, Network];

export const Projects = () => {
  const { data = [], isLoading, isError } = usePortfolio('projects');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; link?: string | null } | null>(null);
  const reduced = useReducedMotion();

  return (
    <section className="section-rule py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading number="02 / Selected work" title="Projects & practical work" subtitle="Security tools, hands-on labs and things I've learned along the way." />
        {isLoading && <p role="status">Loading projects…</p>}
        {isError && <p role="alert">Projects are temporarily unavailable.</p>}
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {data.map((p, i) => {
            const Icon = glyphs[i % glyphs.length];
            const image = safeUrl(p.image_url);
            const link = safeUrl(p.link_url);
            const open = expanded === p.id;
            return (
              <motion.article key={p.id} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="min-w-0">
                <Button
                  variant="ghost"
                  onClick={() => image ? setModalImage({ src: image, alt: p.title, link }) : setExpanded(open ? null : p.id)}
                  aria-expanded={open}
                  aria-label={`View details for ${p.title}`}
                  className="project-visual group relative mb-5 flex aspect-[16/9] h-auto w-full items-center justify-center overflow-hidden rounded-md border border-border bg-card p-0"
                >
                  {image ? (
                    <img src={image} alt={p.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
                  ) : (
                    <>
                      <div className="project-grid absolute inset-0" />
                      <Icon className="relative h-16 w-16 text-primary/65 transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute bottom-5 left-5 font-jetbrains text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')} / {p.tags.slice(0, 2).join(' · ')}</span>
                    </>
                  )}
                  <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-muted-foreground" />
                </Button>
                <p className="editorial-kicker mb-3">{p.discipline}</p>
                <h3 className="break-words text-xl font-semibold md:text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{p.tags.map(tag => <span key={tag} className="border-l border-primary/40 px-2 text-xs text-muted-foreground">{tag}</span>)}</div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {link && <Button variant="outline" size="sm" asChild><a href={link} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight /></a></Button>}
                  <Button variant="ghost" size="sm" onClick={() => setExpanded(open ? null : p.id)} aria-expanded={open}><MessageSquare />{open ? 'Close notes' : 'Project notes'}</Button>
                </div>
                {open && <ProjectComments projectId={p.id} />}
              </motion.article>
            );
          })}
          {!isLoading && !isError && data.length > 0 && data.length < 3 && (
            <ComingSoonCard label="More projects" />
          )}
        </div>
        {!isLoading && !isError && data.length === 0 && <ComingSoonSection label="Projects" />}
      </div>
      <ImageModal
        open={!!modalImage}
        onOpenChange={(open) => !open && setModalImage(null)}
        src={modalImage?.src ?? ''}
        alt={modalImage?.alt ?? ''}
        externalUrl={modalImage?.link ?? null}
        externalLabel="View project"
      />
    </section>
  );
};

function ComingSoonCard({ label }: { label: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card/50 p-8 text-center">
      <Sparkles className="mb-4 h-8 w-8 text-primary/50" />
      <p className="font-jetbrains text-sm uppercase tracking-wider text-muted-foreground">Coming soon</p>
      <p className="mt-2 text-lg font-semibold">{label} in progress</p>
      <p className="mt-1 text-sm text-muted-foreground">New work is being developed — check back soon.</p>
    </div>
  );
}

function ComingSoonSection({ label }: { label: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card/50 p-12 text-center">
      <Sparkles className="mb-4 h-10 w-10 text-primary/50" />
      <p className="font-jetbrains text-sm uppercase tracking-wider text-muted-foreground">Coming soon</p>
      <p className="mt-2 text-xl font-semibold">{label} are on the way</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">I'm currently working on building out this section with real projects. Stay tuned for updates.</p>
    </div>
  );
}
