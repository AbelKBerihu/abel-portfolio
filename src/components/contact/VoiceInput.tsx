
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { UseFormSetValue } from 'react-hook-form';
import { ContactFormValues } from './ContactForm';

interface VoiceInputProps {
  setValue: UseFormSetValue<ContactFormValues>;
  isSubmitting: boolean;
}

export const VoiceInput = ({ setValue, isSubmitting }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const { t } = useLanguage();

  const processVoiceInput = (text: string) => {
    // Extract name
    const nameMatch = text.match(/my name is (\w+)/i);
    if (nameMatch?.[1]) {
      setValue('name', nameMatch[1]);
    }

    // Extract email
    const emailMatch = text.match(/my email is ([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    if (emailMatch?.[1]) {
      setValue('email', emailMatch[1]);
    }

    // Extract phone
    const phoneMatch = text.match(/my phone (?:number )?is ([0-9+\s-]+)/i);
    if (phoneMatch?.[1]) {
      setValue('phone', phoneMatch[1]);
    }

    // Extract message (everything after "my message is")
    const messageMatch = text.match(/my message is (.*)/i);
    if (messageMatch?.[1]) {
      setValue('message', messageMatch[1]);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error(t("browserNotSupported") || "Your browser doesn't support voice input");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info(t("listening") || "Listening... Speak now!");
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error(t("voiceInputFailed") || "Voice input failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');

      processVoiceInput(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        recognition.stop();
        toast.success(t("voiceInputCompleted") || "Voice input completed! Edit if needed before sending.");
      }
    };

    recognition.start();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={startListening}
      disabled={isListening || isSubmitting}
      className="mr-2"
    >
      {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
      {isListening ? t("listening") : t("useVoice")}
    </Button>
  );
};
