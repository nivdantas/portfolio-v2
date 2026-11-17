import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";
import Arrow from "@/components/ui/Arrow";

export default function MainContent({
  repositoryContent,
  blogContent,
}: {
  repositoryContent: ReactNode;
  blogContent: ReactNode;
}) {
  const work = useTranslations("Work");
  const about = useTranslations("About");
  const career = useTranslations("Experience");
  const education = useTranslations("Education");
  const writing = useTranslations("Writing");
  const skills = useTranslations("Capabilities");
  const roles = [
    {
      dates: `${career("bellusStart")} — ${career("present")}`,
      company: "Bellus",
      role: career("bellusRole"),
      body: career("bellusBody"),
    },
    {
      dates: `${career("worktablesStart")} — ${career("present")}`,
      company: "Worktables",
      role: career("worktablesRole"),
      body: career("worktablesBody"),
    },
    {
      dates: `2026 — ${career("present")}`,
      company: career("independent"),
      role: career("freelanceRole"),
      body: career("freelanceBody"),
    },
    {
      dates: "2024 — 2025",
      company: career("court"),
      role: career("courtRole"),
      body: career("courtBody"),
    },
    {
      dates: "2021 — 2024",
      company: career("research"),
      role: career("researchRole"),
      body: career("researchBody"),
    },
  ];
  const groups = [
    { key: "interface", tags: ["React", "Svelte", "React Native", "TypeScript"] },
    { key: "systems", tags: ["Express", "REST", "SQL", "Laravel", "PHP"] },
    { key: "automation", tags: ["n8n", "Webhooks", "REST"] },
    { key: "intelligence", tags: ["Gemini", "SQLite", "Docker"] },
  ] as const;
  return (
    <div className="main-sections">
      <section id="about" className="section container" tabIndex={-1}>
        <ScrollReveal>
          <div className="section-label">
            <span>01 / {about("label")}</span>
            <span aria-hidden="true">↙</span>
          </div>
          <div className="split">
            <h2>
              {about("title")} <em>{about("titleAccent")}</em>
            </h2>
            <div className="about-copy">
              <p className="lead">{about("body")}</p>
              <p>{about("body2")}</p>
            </div>
          </div>
          <ul id="skills" className="facts" tabIndex={-1}>
            <li id="education" tabIndex={-1} data-sound-hover="tick">
              <span className="fact-label">{education("label")}</span>
              <span className="fact-value">
                {education("degree")}
                <small>
                  {education("institution")} · IFAM · 2020 — 2025
                </small>
              </span>
              <span className="fact-meta">
                {education("gpa")} <strong>9.0</strong>
              </span>
            </li>
            {groups.map((group) => (
              <li key={group.key} data-sound-hover="tick">
                <span className="fact-label">{skills(group.key)}</span>
                <span className="fact-value">
                  {skills(`${group.key}Body`)}
                </span>
                <span className="fact-meta">{group.tags.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </section>
      <section id="experience" className="section container" tabIndex={-1}>
        <ScrollReveal>
          <div className="section-label">
            <span>02 / {career("label")}</span>
            <span>2021 — {new Date().getFullYear()}</span>
          </div>
          <h2>
            {career("title")} <em>{career("titleAccent")}</em>
          </h2>
          <ol className="timeline">
            {roles.map((role) => (
              <li key={role.company} data-sound-hover="tick">
                <span className="timeline-date">{role.dates}</span>
                <div className="timeline-role">
                  <h3>{role.company}</h3>
                  <p>{role.role}</p>
                </div>
                <p className="timeline-body">{role.body}</p>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </section>
      <section id="repositories" className="section container" tabIndex={-1}>
        <ScrollReveal>
          <div className="section-label">
            <span>03 / {work("repositoryLabel")}</span>
            <a
              className="text-link"
              href="https://github.com/NivDantas?tab=repositories"
              target="_blank"
              rel="noreferrer"
            >
              {work("allRepos")} <Arrow diagonal />
            </a>
          </div>
          <h2>{work("repositoryTitle")}</h2>
        </ScrollReveal>
        {repositoryContent}
      </section>
      <section id="blog" className="section container" tabIndex={-1}>
        <ScrollReveal>
          <div className="section-label">
            <span>04 / {writing("label")}</span>
            <Link href="/blog" className="text-link">
              {writing("all")} <Arrow diagonal />
            </Link>
          </div>
          <div className="split">
            <h2>
              {writing("title")} <em>{writing("titleAccent")}</em>
            </h2>
            <p className="lead">{writing("intro")}</p>
          </div>
        </ScrollReveal>
        {blogContent}
      </section>
    </div>
  );
}
