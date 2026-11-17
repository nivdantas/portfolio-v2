import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPosts } from "@/lib/blog";
import {
  formatDate,
  localizedPost,
  plainText,
  readingMinutes,
} from "@/lib/content";
import Arrow from "@/components/ui/Arrow";
import RetryButton from "@/components/ui/RetryButton";

export default async function BlogPosts({ all = false }: { all?: boolean }) {
  const locale = await getLocale();
  const t = await getTranslations("Writing");
  const posts = process.env.BLOG_API_URL
    ? await fetchPosts().catch(() => null)
    : [];
  if (!posts || !posts.length)
    return (
      <div className="writing-empty">
        <span aria-hidden="true">{posts ? "✳" : "↻"}</span>
        <div>
          <h3>{t(posts ? "emptyTitle" : "errorTitle")}</h3>
          <p>{t(posts ? "emptyBody" : "errorBody")}</p>
          {!posts && <RetryButton />}
        </div>
      </div>
    );
  return (
    <div className="writing-list">
      {(all ? posts : posts.slice(0, 4)).map((post, i) => {
        const { title, content } = localizedPost(post, locale);
        return (
          <Link
            key={post.id}
            href={`/blog/${encodeURIComponent(post.slug)}`}
            className="writing-row"
          >
            <span className="writing-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="writing-row-content">
              <div className="writing-meta">
                <time dateTime={post.createdAt}>
                  {formatDate(post.createdAt, locale)}
                </time>
                <span>
                  {readingMinutes(content)} {t("minute")}
                </span>
              </div>
              <h3>{title}</h3>
              <p>{plainText(content).slice(0, 150)}</p>
            </div>
            <span className="writing-arrow">
              <Arrow diagonal />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
