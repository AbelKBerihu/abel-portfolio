import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Phone, Github, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [isDiscordHovered, setIsDiscordHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_wne1zy9', // Your EmailJS service ID
        'template_8z2ypcj', // Your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'RwhyRBgaROGXAK2j_' // Your EmailJS public key
      );

      // Send to Telegram bot
      await fetch('https://api.telegram.org/bot6758334021:AAHb0yd3d6MLaxDhGdjAgp4GiARI7H6dDLg/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '1234567890',
          text: `New Contact Form Submission:\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
        }),
      });

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground">Let's discuss your next project</p>
          
          <div className="flex items-center justify-center gap-8 mt-4">
            <motion.div 
              className="inline-block relative cursor-pointer"
              onHoverStart={() => setIsPhoneHovered(true)}
              onHoverEnd={() => setIsPhoneHovered(false)}
            >
              <AnimatePresence mode="wait">
                {!isPhoneHovered && (
                  <motion.div
                    key="phone-default"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="flex items-center gap-2 text-primary"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Me</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isPhoneHovered && (
                  <motion.div
                    key="phone-number"
                    initial={{ opacity: 0, scale: 0.8, position: 'absolute', top: 0, left: 0 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-primary font-medium whitespace-nowrap"
                  >
                    +251 912 345 678
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className="inline-block relative cursor-pointer"
              onHoverStart={() => setIsGithubHovered(true)}
              onHoverEnd={() => setIsGithubHovered(false)}
            >
              <AnimatePresence mode="wait">
                {!isGithubHovered && (
                  <motion.div
                    key="github-default"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="flex items-center gap-2 text-primary"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isGithubHovered && (
                  <motion.div
                    key="github-username"
                    initial={{ opacity: 0, scale: 0.8, position: 'absolute', top: 0, left: 0 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-primary font-medium whitespace-nowrap"
                  >
                    @abelkm99
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className="inline-block relative cursor-pointer"
              onHoverStart={() => setIsDiscordHovered(true)}
              onHoverEnd={() => setIsDiscordHovered(false)}
            >
              <AnimatePresence mode="wait">
                {!isDiscordHovered && (
                  <motion.div
                    key="discord-default"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="flex items-center gap-2 text-primary"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Discord</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isDiscordHovered && (
                  <motion.div
                    key="discord-username"
                    initial={{ opacity: 0, scale: 0.8, position: 'absolute', top: 0, left: 0 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-primary font-medium whitespace-nowrap"
                  >
                    @abelk
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="glass rounded-lg p-6 shadow-lg backdrop-blur-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white/50"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Input
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/50"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Textarea
                  placeholder="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-white/50 min-h-[120px]"
                  required
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full glass hover:bg-primary/20 transition-all duration-300"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {!isMobile && <Send className="w-4 h-4 mr-2" />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
