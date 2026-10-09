import { motion, useReducedMotion } from 'framer-motion';
import { Award, ArrowUpRight } from 'lucide-react';
import { usePortfolio, safeUrl } from '@/hooks/use-portfolio';
import { SectionHeading } from './SectionHeading';
import { Button } from './ui/button';
export const Certifications = () => {
  const { data = [], isError } = usePortfolio('certifications');
  const reduced = useReducedMotion();
  return <section className="section-rule py-20 md:py-28"><div className="container mx-auto px-4 lg:px-8"><SectionHeading number="03 / Credentials" title="Certifications & training"/>{isError && <p role="alert">Credentials are temporarily unavailable.</p>}<div className="grid md:grid-cols-2">{data.map((c, i) => { const link = safeUrl(c.credential_url), image = safeUrl(c.image_url); return <motion.article key={c.id} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .05 }} className="flex min-w-0 items-start gap-5 border-b border-border py-7 md:pr-8"><Award className="mt-1 h-6 w-6 shrink-0 text-primary"/><div className="min-w-0"><h3 className="break-words text-lg font-semibold">{c.title}</h3><p className="mt-2 text-sm text-muted-foreground">{c.issuer}{c.date && c.date !== '—' ? ` · ${c.date}` : ''}</p>{image && <a href={image} target="_blank" rel="noopener noreferrer" className="mt-4 block"><img src={image} alt={`${c.title} certificate`} loading="lazy" className="max-h-48 max-w-full rounded-md object-contain"/></a>}{link && <Button size="sm" variant="ghost" asChild className="mt-3"><a href={link} target="_blank" rel="noopener noreferrer">View credential <ArrowUpRight/></a></Button>}</div></motion.article>; })}</div></div></section>;
};
