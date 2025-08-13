import { NextResponse } from "next/server";

export interface GitAPI {
  id: number;
  name: string;
  created_at: string;
  framework?: string;
  language: string | null;
  description: string | null;
  topics: string[];
  html_url: string;
}
const fetchApi = async (url: string): Promise<GitAPI[]> => {
  const token = process.env.MY_TOKEN;
  if (!token) {
    throw new Error("Invalid token");
  }
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
  const repos: GitAPI[] = await res.json();
  const sortedRepo = repos.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return sortedRepo;
};
export const GET = async () => {
	try{
		const repos = await fetchApi('https://api.github.com/users/NivDantas/repos');
		return NextResponse.json(repos);
	}
	catch(error){
		console.error(error);
		return NextResponse.json({error: error}, {status: 500})
	}
};

export default GET;
