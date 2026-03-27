import {NextResponse} from "next/server";

export interface GitAPI {
  id: string; // Changed from number to string for GraphQL compatibility
  name: string;
  created_at: string;
  framework?: string;
  language: string | null;
  description: string | null;
  topics: string[];
  html_url: string;
  openGraphImageUrl: string | null; // New field
}

const GRAPHQL_QUERY = `
  query {
    user(login: "NivDantas") {
      repositories(first: 100, privacy: PUBLIC, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          id
          name
          createdAt
          description
          url
          openGraphImageUrl
          primaryLanguage {
            name
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

const fetchApi = async (): Promise<GitAPI[]> => {
  const token = process.env.MY_TOKEN;
  if (!token) {
    throw new Error("Invalid token");
  }

  const revalidate = 60 * 60;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // GraphQL standardises on Bearer
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY }),
    next: {
      revalidate,
    },
  };

  const res = await fetch("https://api.github.com/graphql", options);

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL Error: ${json.errors[0].message}`);
  }

  // Map the nested GraphQL structure back to your flat GitAPI interface
  // Sorting is now handled directly by the GraphQL query (orderBy: CREATED_AT, DESC)
  return json.data.user.repositories.nodes.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    created_at: repo.createdAt,
    description: repo.description,
    html_url: repo.url,
    openGraphImageUrl: repo.openGraphImageUrl,
    language: repo.primaryLanguage?.name || null,
    topics: repo.repositoryTopics.nodes.map((node: any) => node.topic.name),
  }));
};

export const GET = async () => {
  try {
    const repos = await fetchApi();
    return NextResponse.json(repos);
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};