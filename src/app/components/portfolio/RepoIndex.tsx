"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Repository } from "@/lib/content";
import Arrow from "@/components/ui/Arrow";

export default function RepoIndex({
  repositories,
}: {
  repositories: Repository[];
}) {
  const [query, setQuery] = useState("");
  const t = useTranslations("Work");
  const filtered = repositories.filter((repo) =>
    `${repo.name} ${repo.description ?? ""} ${repo.language ?? ""} ${repo.topics.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="repo-index">
      <label className="repo-search">
        <span aria-hidden="true">⌕</span>
        <span className="sr-only">{t("search")}</span>
        <input
          type="search"
          placeholder={t("search")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span aria-hidden="true">
          {filtered.length.toString().padStart(2, "0")}
        </span>
      </label>
      <div className="repo-rows">
        {filtered.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="repo-row"
          >
            <span>{repo.name}</span>
            <span className="repo-language">{repo.language || "—"}</span>
            <Arrow diagonal />
          </a>
        ))}
      </div>
      {!filtered.length && (
        <p role="status" className="empty-search">
          {t("noResults")}
        </p>
      )}
    </div>
  );
}
