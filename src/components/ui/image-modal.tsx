import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';

interface ImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  externalUrl?: string | null;
  externalLabel?: string;
}

export function ImageModal({ open, onOpenChange, src, alt, externalUrl, externalLabel = 'Open in new tab' }: ImageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border p-0 overflow-hidden">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative">
          <img src={src} alt={alt} className="w-full max-h-[75vh] object-contain bg-card" />
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-md bg-background/80 px-3 py-1.5 text-sm font-medium backdrop-blur-sm border border-border hover:bg-background transition-colors"
            >
              {externalLabel}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
