import { useTranslations } from "next-intl";
import Wordmark from "@/components/ui/Wordmark";
import CopyEmail from "@/components/ui/CopyEmail";
import Arrow from "@/components/ui/Arrow";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Footer() {
  const t = useTranslations("Contact");
  return (
    <footer id="contact" className="contact-section" tabIndex={-1}>
      <div className="container">
        <ScrollReveal>
          <div className="section-label">
            <span>05 / {t("label")}</span>
            <span aria-hidden="true">↙</span>
          </div>
          <h2>
            {t("title")} <em>{t("titleAccent")}</em>
          </h2>
          <div className="contact-details">
            <a
              className="email-link"
              href="mailto:nivdantas@icloud.com"
              aria-label={t("email")}
            >
              nivdantas@icloud.com <Arrow diagonal />
            </a>
            <CopyEmail />
          </div>
        </ScrollReveal>
        <div className="footer-bottom">
          <Wordmark />
          <p>
            © {new Date().getFullYear()} Nivaldo Dantas. {t("crafted")}
          </p>
          <div>
            <a
              href="https://github.com/NivDantas"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/nivaldo-dantas"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
            <a href="#top">{t("backTop")} ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
