
import { translations } from "@/translations";
import { ReactNode } from "react";

export type Language = "English" | "Tigrigna" | "Amharic";

export type TranslationKey = keyof typeof translations[Language];

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface LanguageProviderProps {
  children: ReactNode;
}
