"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
export default function RetryButton() {
  const router = useRouter();
  const t = useTranslations("UI");
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="text-button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {t("retry")} <span aria-hidden="true">↻</span>
    </button>
  );
}
