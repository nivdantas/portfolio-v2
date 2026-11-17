import { useTranslations } from "next-intl";

/** Monochrome visual studies drawn with HTML and CSS. Decorative only. */
export default function ProjectVisual({ variant }: { variant: string }) {
  const t = useTranslations("ProjectArt");
  return (
    <div className={`project-visual visual-${variant}`} aria-hidden="true">
      {variant === "bolota" ? (
        <div className="study study-chat">
          <div className="study-card chat-question">
            <span className="art-label">01 / {t("input")}</span>
            <p>{t("question")}</p>
          </div>
          <div className="chat-wire">
            <i />
          </div>
          <div className="study-card chat-context">
            <span className="art-label">02 / {t("context")}</span>
            <div>
              <span>{t("inventory")}</span>
              <b>SQLite</b>
            </div>
            <div>
              <span>{t("conversation")}</span>
              <b>Gemini</b>
            </div>
          </div>
        </div>
      ) : variant === "n-store" ? (
        <div className="study study-store">
          <div className="store-shelf">
            <i className="shape-circle" />
            <i className="shape-arch" />
            <i className="shape-square" />
          </div>
          <div className="study-card store-receipt">
            <span className="art-label">{t("structure")}</span>
            {[t("catalog"), t("interface"), t("data")].map((line, i) => (
              <div key={line}>
                <span>0{i + 1}</span>
                <span>{line}</span>
              </div>
            ))}
            <div className="receipt-barcode" />
          </div>
        </div>
      ) : (
        <div className="study study-streak">
          <div className="streak-creature">
            <svg viewBox="0 0 180 96">
              <path d="M12 70C12 5 168 5 168 70M12 70c0 24 26 16 26 0 0 24 26 16 26 0 0 24 26 16 26 0 0 24 26 16 26 0 0 24 26 16 26 0 0 24 26 16 26 0" />
              <circle cx="70" cy="50" r="5" />
              <circle cx="110" cy="50" r="5" />
            </svg>
          </div>
          <div className="streak-week">
            <span className="art-label">{t("oneDay")}</span>
            <div className="streak-bars">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span
                  key={i}
                  className={i < 5 ? "day-done" : ""}
                  data-sound-hover="tick"
                >
                  <i />
                </span>
              ))}
            </div>
            <span className="art-label">{t("illustrativeWeek")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
