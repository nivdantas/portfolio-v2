import { getLocale, getTranslations } from "next-intl/server";
import { projects } from "@/lib/projects";
import ProjectVisual from "./ProjectVisual";
import Arrow from "@/components/ui/Arrow";

export default async function SelectedWork() {
  const locale = (await getLocale()) === "pt" ? "pt" : "en";
  const t = await getTranslations("Work");
  return projects.map((project) => (
    <article
      key={project.slug}
      id={`project-${project.slug}`}
      data-gallery-panel
      className={`gallery-panel project-panel panel-${project.slug}`}
      tabIndex={-1}
      aria-labelledby={`title-${project.slug}`}
    >
      <div className="project-art">
        <div className="art-meta">
          <span>
            {project.number} / {t("label")}
          </span>
          <span>{t("studyLabel")}</span>
        </div>
        <ProjectVisual variant={project.slug} />
      </div>
      <div className="project-copy">
        <div className="panel-content">
          <div className="project-meta">
            <span className="eyebrow">{project.category[locale]}</span>
            {project.inDevelopment && (
              <span className="project-status">{t("development")}</span>
            )}
          </div>
          <h2 id={`title-${project.slug}`}>{project.name}</h2>
          <p className="project-description">{project.description[locale]}</p>
          <p className="project-details">{project.detail[locale]}</p>
          <ul className="tags" aria-label={t("stack")}>
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a
            className="project-source"
            href={`https://github.com/nivdantas/${project.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            {t("viewSource")} <Arrow diagonal />
          </a>
        </div>
      </div>
    </article>
  ));
}
