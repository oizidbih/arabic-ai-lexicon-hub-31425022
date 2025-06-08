import React from "react";
import { useLanguageProvider } from "./useLanguage";
import { LanguageContext } from "./languageContext";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useLanguageProvider();

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Re-export the hook for convenience
export { useLanguage } from "./useLanguage";
