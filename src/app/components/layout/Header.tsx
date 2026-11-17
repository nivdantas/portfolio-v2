import { useTranslations } from "next-intl";
import PersonalMark from "@/components/ui/PersonalMark";
import Arrow from "@/components/ui/Arrow";

export default function Header() {
  const t = useTranslations("Hero");
  return (
    <section
      id="introduction"
      data-gallery-panel
      className="gallery-panel hero"
      aria-labelledby="hero-title"
      tabIndex={-1}
    >
      <div className="hero-topline">
        <span className="eyebrow">{t("role")}</span>
        <span className="eyebrow">{t("colophon")}</span>
      </div>
      <div className="hero-main panel-content">
        <h1 id="hero-title">
          <span className="hero-line">
            <span>NIVALDO</span>
          </span>
          <span className="hero-line">
            <em>
              Dantas<span className="name-dot">.</span>
            </em>
          </span>
        </h1>
        <PersonalMark />
      </div>
      <div className="hero-bottom">
        <p>{t.rich("intro", { name: (chunks) => <strong>{chunks}</strong> })}</p>
        <a
          className="round-link"
          href="#project-bolota"
          aria-label={t("explore")}
          data-sound="none"
        >
          <Arrow />
        </a>
      </div>
      <div className="hero-colophon">
        <span className="hero-process">
          <span>01</span> {t("interface")} <i /> <span>02</span> API <i />{" "}
          <span>03</span> {t("data")}
        </span>
        <div>
          <a
            href="https://github.com/NivDantas"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow diagonal />
          </a>
          <a
            href="https://linkedin.com/in/nivaldo-dantas"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <Arrow diagonal />
          </a>
          <a href="mailto:nivdantas@icloud.com">
            {t("sayHello")} <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}
