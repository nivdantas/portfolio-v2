"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

export default function LanguageButton() {
  const locale = useLocale();
  const t = useTranslations("UI");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  return (
    <div
      className="language-control"
      role="group"
      aria-label={t("language")}
      aria-busy={pending}
    >
      {(["pt", "en"] as const).map((value) => (
        <button
          key={value}
          type="button"
          data-sound="toggle"
          aria-pressed={locale === value}
          disabled={pending}
          onClick={() => {
            if (value !== locale)
              startTransition(() => {
                router.replace(
                  `${pathname}${window.location.search}${window.location.hash}`,
                  { locale: value, scroll: false },
                );
                // Unprefixed locale URLs are identical, so the route cache must
                // be refreshed after next-intl updates the locale cookie.
                router.refresh();
              });
          }}
        >
          {value.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
