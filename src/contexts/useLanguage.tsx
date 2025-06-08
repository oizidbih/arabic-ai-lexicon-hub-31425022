import { useContext, useState, useEffect } from "react";
import { translations } from "@/translations";
import { LanguageContext } from "./LanguageContext";
import type { Language, Direction, LanguageContextType } from "./types";

export function useLanguageProvider(): LanguageContextType {
  const [language, setLanguage] = useState<Language>("ar");
  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["en"]] || key
    );
  };

  return { language, direction, toggleLanguage, t };
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
