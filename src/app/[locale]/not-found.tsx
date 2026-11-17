import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
export default function NotFound() {
  const t = useTranslations("Writing");
  return (
    <div id="top">
      <Navigation />
      <main id="main-content" className="container not-found">
        <p className="eyebrow">404 / ✳</p>
        <h1>{t("notFound")}</h1>
        <p>{t("notFoundBody")}</p>
        <Link className="text-link" href="/portfolio">
          {t("return")} ↗
        </Link>
      </main>
      <Footer />
    </div>
  );
}
