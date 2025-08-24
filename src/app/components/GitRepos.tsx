"use client";
import CardStatic from "./CardStatic";
import { useRepos } from "@/context/RepoContext";
import { useState } from "react";
import { useTranslations } from "next-intl";

const SearchBar = ({
  search,
  setSearch,
  placeholder,
}: {
  search: string;
  setSearch: (value: string) => void;
  placeholder: string;
}) => {
  return (
    <div className="grid grid-cols-[50px_1fr] lg:w-xl md:w-md w-xs bg-neutral-100 dark:bg-neutral-800 h-10 rounded-md self-center mt-10 mb-3 items-center focus-within:ring-2 focus-within:ring-neutral-500 dark:focus-within:ring-neutral-400 transition-all duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
        className="text-neutral-400 dark:text-neutral-200 ml-4"
      >
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        className="text-neutral-600 dark:text-neutral-50 lg:text-xs bg-transparent border-none outline-none text-[16px] placeholder:text-neutral-400 placeholder:text-xs lg:placeholder:text-[16px] dark:placeholder:text-neutral-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

const GitRepos = () => {
  const { repos, isLoading } = useRepos();
  const [search, setSearch] = useState("");
  const t = useTranslations("Projects");
  if (isLoading) {
    return <div className="self-center mt-4">{t("repoLoading")}</div>;
  }
  if (!repos) {
    return (
      <div className="self-center mt-4 text-red-500">{t("repoError")}</div>
    );
  }
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

  const filteredRepos =
    search.length > 0
      ? repos.filter(
          (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            (r.description &&
              r.description.toLowerCase().includes(search.toLowerCase())) ||
            r.topics.some((topic) =>
              topic.toLowerCase().includes(search.toLowerCase())
            ) ||
            (r.language &&
              r.language.toLowerCase().includes(search.toLowerCase()))
        )
      : repos.slice(0, 5);
  return (
    <>
      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder={t("search")}
      />
      <div className="self-center lg:min-h-[696px]">
        {filteredRepos.map((r) => {
          if (r.name === "nivdantas") return null;
          const topics = getLanguage(r.topics);
          const languages = getLanguage(r.language ?? "");

          const combined = [
            ...(Array.isArray(topics) ? topics : [topics]),
            ...(Array.isArray(languages) ? languages : [languages]),
          ];

          const uniqueSubtitleStrings = [...new Set(combined.filter(Boolean))];

          const languagesForCard = uniqueSubtitleStrings.map((tag) => ({
            id: tag,
            name: tag,
          }));
          return (
            <CardStatic
              key={r.id}
              title={r.name}
              subtitle={r.description as string}
              languages={languagesForCard}
              project={r.html_url}
            ></CardStatic>
          );
        })}
      </div>
    </>
  );
};
export default GitRepos;
