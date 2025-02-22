
import { motion } from "framer-motion";
import { Github, MessageCircle, Mail, Youtube, Linkedin, MessageSquare } from "lucide-react";

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

            {/* Discord */}
            <motion.a
              href="https://discord.com/users/abelk"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-none hover:text-[#5865F2] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Discord</span>
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
