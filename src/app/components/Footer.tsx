"use client";
import { tObject } from "@/translation";
import useTranslation from "@/hooks/useTranslation";
export default function Footer() {
  const t = useTranslation(tObject);
  return (
    <footer className="grid place-items-center h-full mt-6 mb-4">
      <p
        id="footer-text"
        className="text-center text-xs text-site dark:text-white h-full"
      >
        {t.footer}
      </p>
    </footer>
  );
}
