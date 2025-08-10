"use client";
import { useEffect, createContext, useState } from "react";
export type Languages = "en" | "pt";

interface Props {
  language: Languages;
  handleChangeLanguage(lan: Languages): void;
}

export const LanguageContext = createContext<Props>({
  language: "en",
} as Props);

export function LanguageProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [language, setLanguage] = useState<Languages>("en");

  useEffect(() => {
    const navigatorLanguage = window.navigator.language;
    if (navigatorLanguage.includes("en")) {
      setLanguage("en");
    } else if (navigatorLanguage.includes("pt")) {
      setLanguage("pt");
    } else {
      setLanguage("pt");
    }
  }, []);

  function handleChangeLanguage(lan: Languages): void {
    setLanguage(lan);
  }

  return (
    <LanguageContext.Provider value={{ language, handleChangeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
