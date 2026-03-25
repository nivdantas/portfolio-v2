"use client";
import {usePathname, useRouter} from "@/i18n/navigation";
import {useLocale} from "next-intl";

const LanguageButton = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const switchLocale = (newLocale: string) => {
        if (newLocale !== locale) {
            router.replace(pathname, {locale: newLocale, scroll: false});
            router.refresh()
        }
    };

    return (
        <div className={`absolute border rounded-3xl w-20 h-7.5 flex items-center justify-center md:top-6 md:right-18 -top-2.5 right-2.5`}>
            <button
                id="button-en"
                aria-label="Change language to English"
                onClick={() => switchLocale("en")}
                className={`text-xs font-poppins font-light text-site-800 dark:text-site-100 hover-underline ${
                    locale === "en" ? "opacity-100" : "opacity-50"
                }`}
            >
                EN
            </button>

            <span className="self-center text-neutral-500 text-xs lg:text-sm xl:text-lg text-center mx-1">
         |
      </span>

            <button
                id="button-PT"
                aria-label="Change language to Portuguese"
                onClick={() => switchLocale("pt")}
                className={`text-xs font-poppins font-light text-site-800 dark:text-site-100 hover-underline  ${
                    locale === "pt" ? "opacity-100" : "opacity-50"
                }`}
            >
                PT
            </button>

        </div>
    );
};

export default LanguageButton;
