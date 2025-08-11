export interface GitAPI {
  id: number;
  name: string;
  created_at: string;
  framework?: string;
  language: string | null;
  description: string | null;
  topics: string[];
}
async function fetchApi<T>(url: string): Promise<T> {
  const token = process.env.MY_TOKEN;
  const revalidate = 60 * 60;
  const options = {
    headers: {
      Authorization: `token ${token}`,
    },
    next: {
      revalidate,
    },
  };
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }
  const repos = await res.json();
  return repos;
}
const getRepo = async (): Promise<GitAPI[]> => {
  const repositories = await fetchApi<GitAPI[]>(
    "https://api.github.com/users/Nivdantas/repos"
  );
  const sortedRepo = repositories.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return sortedRepo;
};

export default getRepo;
