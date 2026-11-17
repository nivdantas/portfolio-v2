import { getTranslations } from "next-intl/server";
import { projects } from "@/lib/projects";
import { fetchRepositories } from "@/lib/repositories";
import RepoIndex from "./RepoIndex";

export default async function GitRepos() {
  const t = await getTranslations("Work");
  const repos = await fetchRepositories().catch(() => null);
  return repos ? (
    <RepoIndex
      repositories={repos.filter(
        (repo) =>
          !["nivdantas", ...projects.map((project) => project.slug)].includes(
            repo.name.toLowerCase(),
          ),
      )}
    />
  ) : (
    <p className="service-message">{t("repoUnavailable")}</p>
  );
}
