import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MessageSquare, Network, Shield, Terminal, Sparkles, ExternalLink, ZoomIn, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { usePortfolio, safeUrl } from '@/hooks/use-portfolio';
import { isVideoMedia, isGifMedia } from '@/lib/media-utils';
import { Button } from './ui/button';
import { SectionHeading } from './SectionHeading';
import { ProjectComments } from './ProjectComments';
import { ImageModal } from './ui/image-modal';

const glyphs = [Shield, Terminal, Network];

function StatusDot({ status }: { status: string }) {
  const inProgress = status === 'in_progress';
  return (
    <span className={`inline-flex items-center gap-1.5 font-jetbrains text-xs ${inProgress ? 'text-amber-500' : 'text-emerald-500'}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${inProgress ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      {inProgress ? 'In progress' : 'Completed'}
    </span>
  );
}

export const Projects = () => {
  const { data = [], isLoading, isError } = usePortfolio('projects');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; link?: string | null } | null>(null);
  const [rotations, setRotations] = useState<Record<string, number>>({});
  const [fitModes, setFitModes] = useState<Record<string, 'cover' | 'contain'>>({});
  const reduced = useReducedMotion();

  return (
    <section className="section-rule py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          number="02 / selected work"
          title="Projects & practical work"
          subtitle="Security tools, hands-on labs and things I've learned along the way."
        />
        {isLoading && <p role="status">Loading projects…</p>}
        {isError && <p role="alert">Projects are temporarily unavailable.</p>}
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {data.map((p, i) => {
            const Icon = glyphs[i % glyphs.length];
            const image = safeUrl(p.image_url);
            const link = safeUrl(p.link_url);
            const open = expanded === p.id;
            const inProgress = p.status === 'in_progress';
            const isComingSoon = Boolean(p.coming_soon);

            if (isComingSoon) {
              return (
                <motion.article key={p.id} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="min-w-0">
                  <div className="project-visual relative mb-5 flex aspect-[16/9] h-auto w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-card/50 p-0">
                    <div className="project-grid absolute inset-0 opacity-40" />
                    <div className="relative flex flex-col items-center gap-3">
                      <Sparkles className="h-10 w-10 text-primary/40" />
                      <span className="font-jetbrains text-xs uppercase tracking-wider text-muted-foreground">Coming soon</span>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <p className="editorial-kicker">{p.discipline}</p>
                    {inProgress && <StatusDot status={p.status} />}
                  </div>
                  <h3 className="break-words text-xl font-semibold md:text-2xl">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
                  {p.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">{p.tags.map(tag => <span key={tag} className="border-l border-primary/40 px-2 text-xs text-muted-foreground">{tag}</span>)}</div>
                  )}
                </motion.article>
              );
            }

            const isVideo = isVideoMedia(image);
            const isGif = isGifMedia(image);
            const currentRotation = rotations[p.id] || 0;
            const currentFit = fitModes[p.id] || 'cover';

            return (
              <motion.article key={p.id} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="min-w-0">
                <div
                  className="project-visual group relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-md border border-border bg-card cursor-pointer"
                  onClick={() => image ? setModalImage({ src: image, alt: p.title, link }) : setExpanded(open ? null : p.id)}
                >
                  {/* Ambient backdrop for contain mode */}
                  {image && currentFit === 'contain' && (
                    <div className="absolute inset-0 -z-10 overflow-hidden opacity-35 blur-md pointer-events-none">
                      {isVideo ? (
                        <video src={image} muted autoPlay loop playsInline className="h-full w-full object-cover scale-110" />
                      ) : (
                        <img src={image} alt="" className="h-full w-full object-cover scale-110" />
                      )}
                    </div>
                  )}

                  {image ? (
                    <div
                      className="h-full w-full flex items-center justify-center transition-transform duration-300 ease-out"
                      style={{ transform: `rotate(${currentRotation}deg)` }}
                    >
                      {isVideo ? (
                        <video
                          src={image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className={`h-full w-full ${currentFit === 'contain' ? 'object-contain' : 'object-cover'} transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none`}
                        />
                      ) : (
                        <img
                          src={image}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          className={`h-full w-full ${currentFit === 'contain' ? 'object-contain' : 'object-cover'} transition-transform duration-500 group-hover:scale-110 motion-reduce:transform-none`}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="project-grid absolute inset-0" />
                      <Icon className="relative h-16 w-16 text-primary/65 transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute bottom-5 left-5 font-jetbrains text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')} / {p.tags.slice(0, 2).join(' · ')}</span>
                    </>
                  )}

                  {/* Media Type & Rotation Badges */}
                  <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
                    {image && (isVideo || isGif) && (
                      <span className="rounded border border-border/70 bg-background/85 px-1.5 py-0.5 font-jetbrains text-[9px] uppercase tracking-wider text-primary backdrop-blur-sm">
                        {isVideo ? '▶ VIDEO DEMO' : 'GIF HIGHLIGHT'}
                      </span>
                    )}
                    {currentRotation > 0 && (
                      <span className="rounded border border-border/70 bg-background/85 px-1.5 py-0.5 font-jetbrains text-[9px] text-foreground backdrop-blur-sm">
                        {currentRotation}°
                      </span>
                    )}
                  </div>

                  {/* Zoom Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/35 pointer-events-none">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  {/* Quick Card Controls: Rotate & Auto-Adjust Fill/Fit */}
                  {image && (
                    <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/85 backdrop-blur-md border border-border px-1.5 py-1 rounded-md shadow-md">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRotations(prev => ({ ...prev, [p.id]: ((prev[p.id] || 0) + 90) % 360 }));
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                        title="Rotate picture 90°"
                        aria-label="Rotate picture 90 degrees"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFitModes(prev => ({ ...prev, [p.id]: prev[p.id] === 'contain' ? 'cover' : 'contain' }));
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                        title={currentFit === 'contain' ? 'Auto-adjust to fill format' : 'Fit original aspect'}
                        aria-label="Toggle auto-adjust fit format"
                      >
                        {currentFit === 'contain' ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}

                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm border border-border hover:bg-background transition-colors"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
                            <div className="mb-3 flex items-center justify-between gap-4">
                              <p className="editorial-kicker">{p.discipline}</p>
                              <StatusDot status={p.status} />
                            </div>
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
        </div>
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
