import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { usePortfolio, safeUrl } from '@/hooks/use-portfolio';
import { SectionHeading } from './SectionHeading';
import { Button } from './ui/button';
import { ImageModal } from './ui/image-modal';

export const Certifications = () => {
  const { data = [], isError } = usePortfolio('certifications');
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; link?: string | null } | null>(null);
  const reduced = useReducedMotion();

  return (
    <section className="section-rule py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading number="03 / Credentials" title="Certifications & training" />
        {isError && <p role="alert">Credentials are temporarily unavailable.</p>}
        <div className="grid md:grid-cols-2">
          {data.map((c, i) => {
            const link = safeUrl(c.credential_url), image = safeUrl(c.image_url);
            return (
              <motion.article key={c.id} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .05 }} className="flex min-w-0 items-start gap-5 border-b border-border py-7 md:pr-8">
                <Award className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div className="min-w-0">
                  <h3 className="break-words text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.issuer}{c.date && c.date !== '—' ? ` · ${c.date}` : ''}</p>
                  {image && (
                    <button onClick={() => setModalImage({ src: image, alt: `${c.title} certificate`, link })} className="mt-4 block cursor-pointer">
                      <img src={image} alt={`${c.title} certificate`} loading="lazy" className="max-h-48 max-w-full rounded-md object-contain transition-opacity hover:opacity-80" />
                    </button>
                  )}
                  {link && <Button size="sm" variant="ghost" asChild className="mt-3"><a href={link} target="_blank" rel="noopener noreferrer">View credential <ArrowUpRight /></a></Button>}
                </div>
              </motion.article>
            );
          })}
          {!isError && data.length === 0 && (
            <div className="col-span-full flex min-h-[280px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card/50 p-12 text-center">
              <Sparkles className="mb-4 h-10 w-10 text-primary/50" />
              <p className="font-jetbrains text-sm uppercase tracking-wider text-muted-foreground">Coming soon</p>
              <p className="mt-2 text-xl font-semibold">Certifications in progress</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">I'm currently pursuing industry certifications. Check back soon for updates.</p>
            </div>
          )}
        </div>
      </div>
      <ImageModal
        open={!!modalImage}
        onOpenChange={(open) => !open && setModalImage(null)}
        src={modalImage?.src ?? ''}
        alt={modalImage?.alt ?? ''}
        externalUrl={modalImage?.link ?? null}
        externalLabel="View credential"
      />
    </section>
  );
};
