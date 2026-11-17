"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
export default function ArticleError({ reset }: { reset: () => void }) {
  const t = useTranslations("Writing");
  const ui = useTranslations("UI");
  return (
    <main className="container not-found">
      <h1>{t("articleError")}</h1>
      <button className="text-button" onClick={reset}>
        {ui("retry")} ↻
      </button>
      <Link href="/blog">← {t("back")}</Link>
    </main>
  );
}
