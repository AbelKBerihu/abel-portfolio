
import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CustomCursor } from "@/components/CustomCursor";
import { Certifications } from "@/components/Certifications";
import { Marquee } from "@/components/Marquee";
import { ScrollProgress } from "@/components/ScrollProgress";
import { useEffect, useState } from "react";
import { About } from "@/components/About";
import { CyberBackground } from "@/components/CyberBackground";
import { CalendarRails } from "@/components/CalendarRails";

const Index = () => {
  const [isMobile, setIsMobile] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Abel Kebede | Cybersecurity Student",
    url: siteUrl,
    sameAs: [
      "https://github.com/abelkm99",
      "https://www.linkedin.com/in/abel-ks"
    ]
  };

  useEffect(() => {
    const link: HTMLLinkElement = (document.querySelector('link[rel="canonical"]') as HTMLLinkElement) || document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", window.location.href);
    if (!link.parentElement) document.head.appendChild(link);

    const ogUrl: HTMLMetaElement = (document.querySelector('meta[property="og:url"]') as HTMLMetaElement) || document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    ogUrl.setAttribute("content", window.location.href);
    if (!ogUrl.parentElement) document.head.appendChild(ogUrl);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
    <CalendarRails />
    <motion.div 
      className="min-h-screen font-sans relative overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
        <CyberBackground />
        <div className="relative z-10">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {!isMobile && <CustomCursor />}
          <ScrollProgress />
          <Header />
          <div id="home">
            <Hero />
          </div>
          <About />
          <div id="projects">
            <Projects />
          </div>
          <div id="certifications">
            <Certifications />
          </div>
          <div id="skills">
            <Skills />
          </div>
          <div id="contact">
            <Contact />
          </div>
          <Marquee />
          <Footer />
        </div>
      </motion.div>
    </>
  );
};

export default Index;
