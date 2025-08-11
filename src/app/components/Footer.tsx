import { useTranslations } from "next-intl";
export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="grid place-items-center h-full mt-6 mb-4">
      <p
        id="footer-text"
        className="text-center text-xs text-site dark:text-white h-full"
      >
        {t("footer")}
      </p>
    </footer>
  );
}
