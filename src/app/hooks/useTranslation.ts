"use client";
import { useContext, useMemo } from "react";
import { Languages, LanguageContext } from "@/context/Language";
export type TranslationConfig = { [language in Languages]: string };

export type Translation<T> = {
  [key in keyof T]: string;
};

export type TranslationInput<T> = {
  [key in keyof T]: TranslationConfig;
};

export default function useTranslation<T>(input: TranslationInput<T>) {
  const { language } = useContext(LanguageContext);

  const object: Translation<T> = useMemo(() => {
    let translation: Translation<T> = {} as Translation<T>;

    for (const [key, object] of Object.entries<TranslationConfig>(input)) {
      translation = { ...translation, [key]: object[language] };
    }

    return translation;
  }, [language, input]);

  return object;
}
