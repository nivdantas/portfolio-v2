import { cache } from "react";
import { isBlogPost, isPublicPost, type BlogPost } from "./content";

function blogUrl(path: string) {
  const base = process.env.BLOG_API_URL;
  if (!base) throw new Error("Blog service is not configured");
  return `${base.replace(/\/$/, "")}${path}`;
}

export async function fetchPosts(uncached = false): Promise<BlogPost[]> {
  const response = await fetch(blogUrl("/posts"), {
    ...(uncached
      ? { cache: "no-store" as const }
      : { next: { revalidate: 300, tags: ["posts"] } }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Blog service is unavailable");
  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isBlogPost))
    throw new Error("Invalid blog response");
  return data
    .filter(isPublicPost)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export const fetchPost = cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!process.env.BLOG_API_URL) return null;
    const response = await fetch(
      blogUrl(`/posts/${encodeURIComponent(slug)}`),
      {
        next: { revalidate: 300, tags: ["posts"] },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Blog service is unavailable");
    const data: unknown = await response.json();
    if (!isBlogPost(data)) throw new Error("Invalid blog response");
    return isPublicPost(data) ? data : null;
  },
);
