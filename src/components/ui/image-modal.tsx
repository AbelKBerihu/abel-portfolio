import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowLeft, RotateCw, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
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
  const [rotation, setRotation] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

  // Reset adjustments whenever a new image is opened or modal closes
  useEffect(() => {
    if (!open) {
      setRotation(0);
      setFitMode('contain');
    }
  }, [open, src]);

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFitMode = () => {
    setFitMode(prev => prev === 'contain' ? 'cover' : 'contain');
  };

  const handleReset = () => {
    setRotation(0);
    setFitMode('contain');
  };

  const isAdjusted = rotation !== 0 || fitMode !== 'contain';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-border p-0 overflow-hidden bg-black/95 text-foreground">
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        {/* Ambient blurred backdrop for auto-fill depth */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-30 blur-2xl pointer-events-none">
          {isVideo ? (
            <video src={src} muted autoPlay loop playsInline className="w-full h-full object-cover scale-125" />
          ) : (
            <img src={src} alt="" className="w-full h-full object-cover scale-125" />
          )}
        </div>

        {/* Floating Top Control Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Back/Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-background/85 backdrop-blur-md border border-border text-foreground hover:bg-background transition-colors shadow-lg active:scale-95"
            aria-label="Close"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Interactive Tools: Rotation & Auto-Adjust to Fill Format */}
          <div className="pointer-events-auto flex items-center gap-2 bg-background/85 backdrop-blur-md border border-border px-2 py-1 rounded-full shadow-lg">
            {/* Auto-adjust Fill / Fit toggle */}
            <button
              onClick={toggleFitMode}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-jetbrains font-medium rounded-full transition-colors ${
                fitMode === 'cover'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              title={fitMode === 'cover' ? 'Fit original aspect ratio' : 'Auto-adjust to fill format'}
            >
              {fitMode === 'cover' ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Fit</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Auto-Fill</span>
                </>
              )}
            </button>

            {/* Rotate 90deg button */}
            <button
              onClick={handleRotate}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-jetbrains font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-card transition-colors active:scale-95"
              title="Rotate 90° clockwise"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Rotate</span>
              {rotation > 0 && (
                <span className="ml-0.5 rounded bg-primary/20 px-1 py-0.2 text-[10px] text-primary font-mono">
                  {rotation}°
                </span>
              )}
            </button>

            {/* Reset button if modified */}
            {isAdjusted && (
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Reset view and rotation"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Media Viewport */}
        <div className="relative flex items-center justify-center min-h-[300px] max-h-[80vh] overflow-hidden p-2 sm:p-6">
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {isVideo ? (
              <video
                src={src}
                controls
                autoPlay
                loop
                playsInline
                className={`transition-all duration-300 rounded ${
                  fitMode === 'cover'
                    ? 'w-full h-[65vh] sm:h-[75vh] object-cover'
                    : 'w-full max-h-[70vh] sm:max-h-[75vh] object-contain'
                }`}
              />
            ) : (
              <img
                src={src}
                alt={alt}
                className={`transition-all duration-300 rounded ${
                  fitMode === 'cover'
                    ? 'w-full h-[65vh] sm:h-[75vh] object-cover'
                    : 'w-full max-h-[70vh] sm:max-h-[75vh] object-contain'
                }`}
              />
            )}
          </div>

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
