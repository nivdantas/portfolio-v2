"use client";
import { LanguageContext } from "@/context/Language";
import { useContext } from "react";
export default function LanguageButton() {
  const { language, handleChangeLanguage } = useContext(LanguageContext);
  return (
    <>
      <button
        id="button-PT"
        aria-label="Change language to Portuguese"
        onClick={() => {
          handleChangeLanguage("pt");
        }}
        className={`text-xs lg:text-sm xl:text-lg text-site-800 dark:text-white hover-underline px-2 py-1 mt-4 ${
          language === "pt" ? "opacity-100" : "opacity-50"
        }`}
      >
        PT
      </button>
      <span className="self-center text-neutral-500 text-xs lg:text-sm xl:text-lg text-center py-1 mt-4">
        /
      </span>
      <button
        id="button-en"
        aria-label="Change language to English"
        onClick={() => handleChangeLanguage("en")}
        className={`text-xs lg:text-sm xl:text-lg text-site-800 dark:text-white hover-underline px-2 py-1 mt-4 ${
          language === "en" ? "opacity-100" : "opacity-50"
        }`}
      >
        EN
      </button>
    </>
  );
}
