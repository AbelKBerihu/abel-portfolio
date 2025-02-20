
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
      // You'll need to create these API endpoints to handle the different platform messages
      const responses = await Promise.all([
        // Send to Telegram
        fetch("/api/send-telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
        // Send to WhatsApp
        fetch("/api/send-whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
        // Send to Gmail
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
      ]);

      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message to all platforms");
      }
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="glass rounded-lg p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white/50"
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/50"
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-white/50 min-h-[120px]"
                  required
                />
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
