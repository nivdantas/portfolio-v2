"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
const LanguageButton = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
        router.replace(pathname, { locale: newLocale, scroll: false });
        router.refresh()
    }
  };

  return (
    <>
      <button
        id="button-PT"
        aria-label="Change language to Portuguese"
        onClick={() => switchLocale("pt")}
        className={`text-xs lg:text-sm xl:text-lg text-site-800 dark:text-white hover-underline px-2 py-1 mt-4 ${
          locale === "pt" ? "opacity-100" : "opacity-50"
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
        onClick={() => switchLocale("en")}
        className={`text-xs lg:text-sm xl:text-lg text-site-800 dark:text-white hover-underline px-2 py-1 mt-4 ${
          locale === "en" ? "opacity-100" : "opacity-50"
        }`}
      >
        EN
      </button>
    </>
  );
};

export default LanguageButton;
