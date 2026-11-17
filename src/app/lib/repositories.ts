import type { Repository } from "./content";

export async function fetchRepositories(): Promise<Repository[]> {
  const response = await fetch(
    "https://api.github.com/users/NivDantas/repos?per_page=100&sort=updated",
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.MY_TOKEN
          ? { Authorization: `Bearer ${process.env.MY_TOKEN}` }
          : {}),
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error("Repositories are temporarily unavailable");
  const data = await response.json();
  return data
    .filter(
      (repo: { fork: boolean; archived: boolean }) =>
        !repo.fork && !repo.archived,
    )
    .map((repo: Repository) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      homepage: repo.homepage,
      topics: repo.topics || [],
    }));
}
