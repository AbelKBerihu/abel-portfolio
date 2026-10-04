
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialURL: string;
  image: string;
}

interface CertificatePopupProps {
  certificate: Certificate;
  onClose: () => void;
}

const CertificatePopup = ({ certificate, onClose }: CertificatePopupProps) => {
  const { t } = useLanguage();
  const [autoCloseTimeout, setAutoCloseTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    // Auto close after 30 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 30000);
    
    setAutoCloseTimeout(timeout);
    
    return () => {
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
      }
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{certificate.title}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-muted-foreground mb-1">
              <span className="font-medium">{t("issuer")}:</span> {certificate.issuer}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium">{t("date")}:</span> {certificate.date}
            </p>
          </div>
          
          <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg border">
            <img
              src={certificate.image}
              alt={certificate.title}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          
          <div className="flex justify-center">
            <a 
              href={certificate.credentialURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {t("view")}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CertificatePopup;
