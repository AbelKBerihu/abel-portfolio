import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { isVideoMedia } from '@/lib/media-utils';

interface ImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  externalUrl?: string | null;
  externalLabel?: string;
}

export function ImageModal({ open, onOpenChange, src, alt, externalUrl, externalLabel = 'Open in new tab' }: ImageModalProps) {
  const isVideo = isVideoMedia(src);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-border p-0 overflow-hidden bg-black/95 text-foreground">
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        {/* Ambient blurred backdrop for visual depth */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-30 blur-2xl pointer-events-none">
          {isVideo ? (
            <video src={src} muted autoPlay loop playsInline className="w-full h-full object-cover scale-125" />
          ) : (
            <img src={src} alt="" className="w-full h-full object-cover scale-125" />
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 left-4 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-background/85 backdrop-blur-md border border-border text-foreground hover:bg-background transition-colors shadow-lg active:scale-95"
          aria-label="Close viewer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Media Viewport */}
        <div className="relative flex items-center justify-center min-h-[280px] max-h-[82vh] overflow-hidden p-2 sm:p-6">
          {isVideo ? (
            <video
              src={src}
              controls
              autoPlay
              loop
              playsInline
              className="w-full max-h-[72vh] sm:max-h-[78vh] object-contain rounded"
            />
          ) : (
            <img
              src={src}
              alt={alt}
              className="w-full max-h-[72vh] sm:max-h-[78vh] object-contain rounded"
            />
          )}

          {/* External Link */}
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-md bg-background/85 px-3 py-1.5 text-xs font-jetbrains font-medium backdrop-blur-md border border-border hover:bg-background transition-colors shadow-lg"
            >
              {externalLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
