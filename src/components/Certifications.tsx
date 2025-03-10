
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import CertificatePopup from "./CertificatePopup";
import { useLanguage } from "@/contexts/LanguageContext";

// Certificate data with images
const certifications = [
  {
    title: "Meta Front-End Developer",
    issuer: "Meta (Facebook)",
    date: "2024",
    credentialURL: "https://www.coursera.org/account/accomplishments/professional-cert/",
    image: "/certificate-meta.png",
  },
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialURL: "https://www.credly.com/badges/",
    image: "/certificate-aws.png",
  },
  {
    title: "Google UX Design",
    issuer: "Google",
    date: "2023",
    credentialURL: "https://www.coursera.org/account/accomplishments/professional-cert/",
    image: "/certificate-google.png",
  },
  {
    title: "Microsoft Certified: Azure Developer",
    issuer: "Microsoft",
    date: "2023",
    credentialURL: "https://www.credly.com/badges/",
    image: "/certificate-microsoft.png",
  },
  {
    title: "React Native Specialist",
    issuer: "Meta",
    date: "2023",
    credentialURL: "https://www.coursera.org/account/accomplishments/",
    image: "/certificate-react-native.png",
  },
  {
    title: "Graphic Design Specialist",
    issuer: "Adobe",
    date: "2023",
    credentialURL: "https://www.adobe.com/certificates/",
    image: "/certificate-graphic.png",
  },
  {
    title: "Advanced TypeScript Development",
    issuer: "Udacity",
    date: "2023",
    credentialURL: "https://confirm.udacity.com/",
    image: "/certificate-typescript.png",
  },
];

export const Certifications = () => {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<(typeof certifications)[0] | null>(null);
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">{t("certificationsTitle")}</h2>
          <p className="text-muted-foreground">{t("certificationsSubtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.1 
              }}
              viewport={{ once: true }}
              className="group"
              onClick={() => setSelectedCert(cert)}
            >
              <motion.div 
                className="p-6 rounded-lg glass bg-background/50 backdrop-blur-sm border border-primary/10 cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(var(--primary), 0.1)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="p-2 rounded-lg bg-primary/10"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5 
                    }}
                  >
                    <Award className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer} • {cert.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
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
