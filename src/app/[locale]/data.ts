export interface GitAPI {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  created_at: string;
}
export async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }
  const repos = await res.json();
  return repos;
}

export async function sortRepo(): Promise<GitAPI[]> {
  const repositories = await fetchApi<GitAPI[]>(
    "https://api.github.com/users/Nivdantas/repos"
  );
  const sortedRepo = repositories.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return sortedRepo;
}
