import { motion } from "framer-motion";
import { Github, MessageCircle, Youtube, Linkedin, MessageSquare, Facebook, WhatsApp } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-8 bg-background/50 backdrop-blur-sm border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex flex-wrap items-center gap-8">
            {/* GitHub */}
            <motion.a
              href="https://github.com/abelkm99"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </div>
            </motion.a>

            {/* Facebook */}
            <motion.a
              href="https://facebook.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none hover:text-[#1877F2] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </div>
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/+251930466887"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none hover:text-[#25D366] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <WhatsApp className="w-5 h-5" />
                <span>WhatsApp</span>
              </div>
            </motion.a>

            {/* LinkedIn */}
            <motion.a
              href="https://www.linkedin.com/in/abel-ks"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none hover:text-[#0A66C2] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </div>
            </motion.a>

            {/* TikTok */}
            <motion.a
              href="https://tiktok.com/@yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none hover:text-[#000000] dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>TikTok</span>
              </div>
            </motion.a>

            {/* Telegram */}
            <motion.a
              href="https://t.me/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none hover:text-[#0088cc] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>Telegram</span>
              </div>
            </motion.a>

            {/* YouTube */}
            <motion.a
              href="https://youtube.com/your-channel"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none hover:text-red-500 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5" />
                <span>YouTube</span>
              </div>
            </motion.a>

            {/* Email */}
            <motion.a
              href="mailto:ks.avebina7@gmail.com"
              className="cursor-none hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </div>
            </motion.a>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            © {new Date().getFullYear()} Abel Kebede. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};
