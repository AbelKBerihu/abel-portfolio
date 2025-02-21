
import { motion } from "framer-motion";
import { Github, MessageSquare, Mail, Youtube, Linkedin } from "lucide-react";
import { useState } from "react";

export const Footer = () => {
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [isDiscordHovered, setIsDiscordHovered] = useState(false);

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
              className="relative cursor-none"
              onHoverStart={() => setIsGithubHovered(true)}
              onHoverEnd={() => setIsGithubHovered(false)}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                animate={{
                  opacity: isGithubHovered ? 0 : 1,
                  scale: isGithubHovered ? 0.8 : 1,
                }}
                className="flex items-center gap-2 text-primary"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </motion.div>
              {isGithubHovered && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-0 left-0 text-primary font-medium whitespace-nowrap"
                >
                  @abelkm99
                </motion.span>
              )}
            </motion.a>

            {/* Discord */}
            <motion.a
              href="https://discord.com/users/abelk"
              target="_blank"
              rel="noopener noreferrer"
              className="relative cursor-none"
              onHoverStart={() => setIsDiscordHovered(true)}
              onHoverEnd={() => setIsDiscordHovered(false)}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                animate={{
                  opacity: isDiscordHovered ? 0 : 1,
                  scale: isDiscordHovered ? 0.8 : 1,
                }}
                className="flex items-center gap-2 text-primary"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Discord</span>
              </motion.div>
              {isDiscordHovered && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-0 left-0 text-primary font-medium whitespace-nowrap"
                >
                  @abelk
                </motion.span>
              )}
            </motion.a>

            {/* LinkedIn */}
            <motion.a
              href="https://www.linkedin.com/in/abel-ks"
              target="_blank"
              rel="noopener noreferrer"
              className="relative cursor-none hover:text-[#0A66C2] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </div>
            </motion.a>

            {/* YouTube */}
            <motion.a
              href="https://youtube.com/your-channel"
              target="_blank"
              rel="noopener noreferrer"
              className="relative cursor-none hover:text-red-500 transition-colors"
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
              className="relative cursor-none"
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
