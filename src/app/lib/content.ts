export interface BlogPost {
  id: string | number;
  title_en: string;
  title_pt: string;
  slug: string;
  content_en: string;
  content_pt: string;
  imageUrl?: string | null;
  createdAt: string;
  status?: string;
  publishedAt?: string | null;
}

export interface Repository {
  id: string | number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  language: string | null;
  topics: string[];
}

export function isBlogPost(value: unknown): value is BlogPost {
  if (!value || typeof value !== "object") return false;
  const post = value as Record<string, unknown>;
  return (
    (typeof post.id === "string" || typeof post.id === "number") &&
    [
      "slug",
      "title_en",
      "title_pt",
      "content_en",
      "content_pt",
      "createdAt",
    ].every((key) => typeof post[key] === "string") &&
    Boolean(post.id) &&
    Boolean(post.slug) &&
    (post.status === undefined || typeof post.status === "string") &&
    (post.imageUrl == null || typeof post.imageUrl === "string") &&
    (post.publishedAt == null ||
      (typeof post.publishedAt === "string" &&
        Number.isFinite(Date.parse(post.publishedAt)))) &&
    Number.isFinite(Date.parse(post.createdAt as string))
  );
}

export function isPublicPost(post: BlogPost) {
  return post.status === undefined || post.status.toUpperCase() === "PUBLISHED";
}

export function publicationDate(post: BlogPost) {
  return post.publishedAt || post.createdAt;
}

export function localizedPost(post: BlogPost, locale: string) {
  const primary =
    locale === "pt"
      ? { title: post.title_pt, content: post.content_pt }
      : { title: post.title_en, content: post.content_en };
  const fallback =
    locale === "pt"
      ? { title: post.title_en, content: post.content_en }
      : { title: post.title_pt, content: post.content_pt };
  return {
    title: primary.title.trim() ? primary.title : fallback.title,
    content: primary.content.trim() ? primary.content : fallback.content,
  };
}

export function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*`_>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(content: string) {
  return Math.max(1, Math.ceil(plainText(content).split(/\s+/).length / 220));
}

export function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
