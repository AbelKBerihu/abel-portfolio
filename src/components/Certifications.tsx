import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, ArrowUpRight, Sparkles, ExternalLink, ZoomIn, FileCheck } from 'lucide-react';
import { usePortfolio, safeUrl } from '@/hooks/use-portfolio';
import { SectionHeading } from './SectionHeading';
import { Button } from './ui/button';
import { ImageModal } from './ui/image-modal';

export const Certifications = () => {
  const { data = [], isError } = usePortfolio('certifications');
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; link?: string | null } | null>(null);
  const reduced = useReducedMotion();

  return (
    <section id="certifications" className="section-rule py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          number="03 / Credentials"
          terminal={{ path: '03:~/credentials', command: 'gpg --verify certs.sig' }}
          title="Certifications & training"
        />
        {isError && <p role="alert">Credentials are temporarily unavailable.</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((c, i) => {
            const link = safeUrl(c.credential_url);
            const image = safeUrl(c.image_url);
            const isComingSoon = Boolean(c.coming_soon);

            if (isComingSoon) {
              return (
                <motion.article
                  key={c.id}
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col justify-between rounded-lg border border-border/80 bg-card/40 p-6 backdrop-blur-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Sparkles className="h-5 w-5 text-primary/60" />
                      <span className="font-jetbrains text-[10px] uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                        Coming soon
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground/90">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {c.issuer}
                      {c.date && c.date !== '—' ? ` · ${c.date}` : ''}
                    </p>
                  </div>
                </motion.article>
              );
            }

            return (
              <motion.article
                key={c.id}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col justify-between rounded-lg border border-border bg-card/60 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              >
                <div>
                  {/* Certificate Image Frame */}
                  {image ? (
                    <div className="relative mb-4 overflow-hidden rounded-md border border-border/80 bg-background/50">
                      <button
                        type="button"
                        onClick={() => setModalImage({ src: image, alt: `${c.title} certificate`, link })}
                        className="group/img relative block w-full cursor-pointer focus:outline-none"
                        aria-label={`View full certificate: ${c.title}`}
                      >
                        <img
                          src={image}
                          alt={`${c.title} certificate`}
                          loading="lazy"
                          className="h-44 w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/img:bg-black/45">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 font-jetbrains text-xs text-foreground opacity-0 shadow-md transition-opacity group-hover/img:opacity-100">
                            <ZoomIn className="h-3.5 w-3.5 text-primary" /> View Full
                          </span>
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="relative mb-4 flex h-40 w-full flex-col items-center justify-center rounded-md border border-dashed border-border bg-background/30 p-4 text-center">
                      <FileCheck className="h-8 w-8 text-primary/60 mb-2" />
                      <p className="font-jetbrains text-xs text-muted-foreground">Certificate Verified</p>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.issuer}
                        {c.date && c.date !== '—' ? ` · ${c.date}` : ''}
                      </p>
                    </div>
                    <Award className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/60">
                  {image && (
                    <button
                      type="button"
                      onClick={() => setModalImage({ src: image, alt: `${c.title} certificate`, link })}
                      className="inline-flex items-center gap-1 font-jetbrains text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ZoomIn className="h-3 w-3" /> Zoom
                    </button>
                  )}
                  {link ? (
                    <Button size="sm" variant="ghost" asChild className="ml-auto text-xs h-7 px-2 text-primary">
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        Verify <ArrowUpRight className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  ) : image ? (
                    <a
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 font-jetbrains text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> Open
                    </a>
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <ImageModal
        open={Boolean(modalImage)}
        onOpenChange={(open) => !open && setModalImage(null)}
        src={modalImage?.src ?? ''}
        alt={modalImage?.alt ?? ''}
        externalUrl={modalImage?.link ?? null}
        externalLabel="View credential"
      />
    </section>
  );
};