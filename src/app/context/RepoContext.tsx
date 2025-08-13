"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface GitAPI {
  id: number;
  name: string;
  created_at: string;
  language: string | null;
  description: string | null;
  topics: string[];
  html_url: string;
}

interface RepoContextType {
  repos: GitAPI[] | null;
  isLoading: boolean;
  error: string | null;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);


export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const [repos, setRepos] = useState<GitAPI[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setError(null);
      try {
        const res = await fetch("/api/repos");
		  console.log("Fetch feito");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Failed to parse error response." }));
          throw new Error(
            `Failed to fetch repositories: ${res.status} ${res.statusText}. ${errorData.error || ''}`
          );
        }

        const repositories = await res.json();
        if (repositories.error) {
          throw new Error(repositories.error);
        }
        setRepos(repositories);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Failed to load repo:", errorMessage);
        setError(errorMessage);
        setRepos(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepos();
  }, []);

  return (
    <RepoContext.Provider value={{ repos, isLoading, error }}>
      {children}
    </RepoContext.Provider>
  );
};

export const useRepos = () => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error("useRepos must be used within a RepoProvider");
  }
  return context;
};
