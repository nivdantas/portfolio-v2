"use client";
import { useRepos } from "@/context/RepoContext";
import { useTranslations } from "next-intl";

const GitRepos = () => {
  const { repos, isLoading } = useRepos();
  const t = useTranslations("Projects");

  const getLanguage = (param: string | string[]): string | string[] => {
    function camelCase(string: string): string {
      string = string.charAt(0).toUpperCase() + string.slice(1);
      string = string.includes("js") ? string.replace("js", "JS") : string;
      return string;
    }
    if (Array.isArray(param)) {
      const st: string[] = [];
      param.forEach((p) => {
        st.push(camelCase(p));
      });
      return st;
    }
    switch (param) {
      case "CSS":
        return ["CSS", "HTML"];
      case "HTML":
        return ["CSS", "HTML"];
      case "JavaScript":
        return ["JavaScript", "CSS", "HTML"];
      case "TypeScript":
        return ["TypeScript", "CSS", "HTML"];
      default:
        return camelCase(param);
    }
  };

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-[295px] h-[94px] md:w-[320px] md:h-[240px] bg-gray-500 animate-pulse rounded-[10px] ${
              i >= 3 ? "hidden md:block" : ""
            } ${i > 0 ? "mt-5 md:mt-0" : ""}`}
          />
        ))}
      </>
    );
  }

  if (!repos) {
    return (
      <div className="self-center mt-4 text-red-500">{t("repoError")}</div>
    );
  }

  const filtered = repos.filter((r) => r.name !== "nivdantas").slice(0, 6);

  return (
    <>
      {filtered.map((r, i) => {
        const topics = getLanguage(r.topics);
        const languages = getLanguage(r.language ?? "");
        const combined = [
          ...(Array.isArray(topics) ? topics : [topics]),
          ...(Array.isArray(languages) ? languages : [languages]),
        ];
        const uniqueTags = [...new Set(combined.filter(Boolean))];

        return (
          <a
            key={r.id}
            href={r.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Project: ${r.name}`}
            style={r.openGraphImageUrl ? { backgroundImage: `url(${r.openGraphImageUrl})`, backgroundSize: "cover", backgroundPosition: "center", } : undefined}
            className={`group relative w-[295px] h-[94px] md:w-[320px] md:h-[240px] bg-site-800 dark:bg-site-600 rounded-[10px] overflow-hidden flex flex-col justify-end p-4 hover:shadow-xl transition-all duration-500 ${
              i >= 3 ? "hidden md:flex" : ""
            } ${i > 0 ? "mt-5 md:mt-0" : ""}`}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-[10px]" />

            {/* Content */}
            <div className="relative z-10">
              <h3 className="font-poppins font-medium text-white text-[10px] md:text-base leading-tight">
                {r.name}
              </h3>
              {r.description && (
                <p className="font-poppins text-site-200 text-[7px] md:text-xs mt-1 line-clamp-2">
                  {r.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-1.5 md:mt-2">
                {uniqueTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="font-poppins text-[6px] md:text-[10px] text-site-100 bg-white/15 backdrop-blur-sm px-1.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        );
      })}
    </>
  );
};

export default GitRepos;
