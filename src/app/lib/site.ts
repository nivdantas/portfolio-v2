export function siteUrl() {
  return (process.env.SITE_URL || "https://nivdantas.com").replace(/\/$/, "");
}
