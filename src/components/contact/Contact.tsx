
import { motion } from "framer-motion";
import { ContactHeader } from "./ContactHeader";
import { ContactForm } from "./ContactForm";

export const Contact = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <ContactHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
};
