import type { PublisherConfig } from "./publisher.ts";
import { RedisPublicationStore } from "./store.ts";

export function publishingEnabled() {
  return (
    process.env.LINKEDIN_PUBLISH_ENABLED === "true" &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production")
  );
}

export function publicationConfig(): PublisherConfig {
  const author = process.env.LINKEDIN_MEMBER_URN || "";
  const token = process.env.LINKEDIN_ACCESS_TOKEN || "";
  const siteUrl = process.env.SITE_URL || "";
  const version = process.env.LINKEDIN_API_VERSION || "202610";
  const expiry = Date.parse(process.env.LINKEDIN_ACCESS_TOKEN_EXPIRES_AT || "");
  const maxAgeHours = Number(process.env.LINKEDIN_MAX_AGE_HOURS || 48);
  if (
    !/^urn:li:person:[a-zA-Z0-9_-]+$/.test(author) ||
    !token ||
    !/^\d{6}$/.test(version) ||
    !Number.isFinite(expiry) ||
    expiry <= Date.now() + 300_000 ||
    !Number.isFinite(maxAgeHours) ||
    maxAgeHours < 1 ||
    maxAgeHours > 168
  )
    throw new Error("LinkedIn configuration requires attention");
  const url = new URL(siteUrl);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error("SITE_URL must be the canonical HTTPS origin");
  if (
    process.env.LINKEDIN_POST_LOCALE &&
    !["pt", "en"].includes(process.env.LINKEDIN_POST_LOCALE)
  )
    throw new Error("Invalid publishing locale");
  return {
    author,
    token,
    siteUrl: url.origin,
    version,
    locale: process.env.LINKEDIN_POST_LOCALE === "en" ? "en" : "pt",
    maxAgeHours,
  };
}

export function publicationStore(
  config: Pick<PublisherConfig, "author" | "siteUrl">,
) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || new URL(url).protocol !== "https:")
    throw new Error("Durable publication storage is not configured");
  return new RedisPublicationStore(url, token, config.author, config.siteUrl);
}
