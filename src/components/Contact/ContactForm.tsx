import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { contactFormSchema, type ContactFormValues } from './schema';

interface ContactFormProps {
  onSubmit: (data: ContactFormValues) => Promise<void>;
  isSubmitting: boolean;
  isMobile: boolean;
  availableDates?: Date[];
}

export const ContactForm = ({ onSubmit, isSubmitting, isMobile, availableDates = [] }: ContactFormProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredDate: undefined,
    },
  });

  return (
    <Form {...form}>
      <div className="flex flex-col md:flex-row gap-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      className="bg-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email Address"
                      type="email"
                      className="bg-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Phone Number (optional)"
                        type="tel"
                        className="bg-white/50 pl-9"
                        {...field}
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Your Message"
                      className="bg-white/50 min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full bg-primary/80 hover:bg-primary transition-all duration-300 text-primary-foreground font-semibold"
              type="submit"
              disabled={isSubmitting}
            >
              {!isMobile && <Send className="w-4 h-4 mr-2" />}
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </motion.div>
        </form>

        <div className="w-full md:w-[350px] bg-black/80 rounded-lg p-4 shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-white text-center">Select a Date</h3>
          <div className="text-sm text-gray-300 mb-2 text-center">
            {form.watch("preferredDate") ? (
              <p>Selected date: <span className="text-white">{format(form.watch("preferredDate"), "PPP")}</span></p>
            ) : (
              <p>Please select a date from the calendar</p>
            )}
          </div>
          <Calendar
            mode="single"
            selected={form.watch("preferredDate")}
            onSelect={(date) => form.setValue("preferredDate", date)}
            disabled={(date) => date < new Date()} // Only disable past dates
            className="border rounded-md bg-black pointer-events-auto text-white"
          />
        </div>
      </div>
    </Form>
  );
};
