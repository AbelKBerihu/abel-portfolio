
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  preferredDate: z.date({
    required_error: "Please select a preferred contact date.",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
