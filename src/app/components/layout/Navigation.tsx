import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageButton from "@/components/ui/LanguageButton";
import SiteControls from "@/components/ui/SiteControls";
import Wordmark from "@/components/ui/Wordmark";

export default function Navigation() {
  const t = useTranslations("Navigation");
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t("skip")}
      </a>
      <header className="site-header">
        <div className="container nav-inner">
          <Wordmark label="Nivaldo Dantas" />
          <nav aria-label={t("label")}>
            <Link href="/portfolio#projects">{t("work")}</Link>
            <Link href="/portfolio#about">{t("about")}</Link>
            <Link href="/portfolio#blog">{t("writing")}</Link>
            <Link href="/portfolio#contact">{t("contact")}</Link>
          </nav>
          <div className="nav-utilities">
            <LanguageButton />
            <SiteControls />
          </div>
        </div>
      </header>
    </>
  );
}
