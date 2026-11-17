"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { play } from "@/lib/sound";

export default function CopyEmail() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations("Contact");
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <div className="copy-email">
      <button
        className="text-button"
        type="button"
        data-sound="none"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText("nivdantas@icloud.com");
            setStatus("copied");
            play("success", { throttleMs: 0 });
          } catch {
            setStatus("failed");
            play("error", { throttleMs: 0 });
          }
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setStatus("idle"), 4000);
        }}
      >
        {status === "copied" ? t("copied") : t("copy")}{" "}
        <span aria-hidden="true">{status === "copied" ? "✓" : "⧉"}</span>
      </button>
      <span className="sr-only" role="status">
        {status === "copied"
          ? t("copied")
          : status === "failed"
            ? t("copyFailed")
            : ""}
      </span>
      {status === "failed" && <p className="copy-error">{t("copyFailed")}</p>}
    </div>
  );
}
