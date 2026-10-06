import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Award } from "lucide-react";
import CertificatePopup from "./CertificatePopup";
import { useLanguage } from "@/contexts/LanguageContext";

const certifications = [
  {
    title: "Adobe Certified Professional",
    issuer: "Adobe",
    date: "2024",
    credentialURL: "https://www.adobe.com/certificates/",
    image: "/certificate-adobe.png",
  },
  {
    title: "UI/UX Design Professional Certificate",
    issuer: "Google",
    date: "2023",
    credentialURL: "https://www.coursera.org/account/accomplishments/professional-cert/",
    image: "/certificate-google.png",
  },
  {
    title: "Web Design & Development",
    issuer: "Meta",
    date: "2023",
    credentialURL: "https://www.coursera.org/account/accomplishments/",
    image: "/certificate-meta.png",
  },
  {
    title: "Graphic Design Specialization",
    issuer: "Coursera",
    date: "2023",
    credentialURL: "https://www.coursera.org/account/accomplishments/specialization/",
    image: "/certificate-graphic.png",
  },
];

export const Certifications = () => {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<(typeof certifications)[0] | null>(null);
  
  const reduce = useReducedMotion();
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mb-12 max-w-3xl"
        >
          <p className="editorial-kicker mb-4">03 — Credentials</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{t("certificationsTitle")}</h2>
          <p className="text-muted-foreground text-lg">{t("certificationsSubtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border">
          {certifications.map((cert, index) => (
            <motion.button
              type="button"
              key={cert.title}
              initial={reduce ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              onClick={() => setSelectedCert(cert)}
              className="group relative text-left p-6 md:p-8 border-r border-b border-border overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="absolute inset-0 bg-primary origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100 motion-reduce:transition-none" />
              <div className="relative flex items-start gap-5 transition-colors duration-300 group-hover:text-primary-foreground">
                <span className="font-jetbrains text-sm opacity-60 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{cert.title}</h3>
                  <p className="text-sm opacity-70">{cert.issuer} • {cert.date}</p>
                </div>
                <Award className="w-6 h-6 transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <CertificatePopup 
            certificate={selectedCert} 
            onClose={() => setSelectedCert(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
