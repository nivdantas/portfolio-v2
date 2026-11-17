import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ReactMarkdown from "react-markdown";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { fetchPost } from "@/lib/blog";
import {
  localizedPost,
  plainText,
  formatDate,
  readingMinutes,
} from "@/lib/content";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await fetchPost(slug);
  if (!post)
    return {
      title: locale === "pt" ? "Artigo não encontrado" : "Article not found",
    };
  const { title, content } = localizedPost(post, locale);
  const description = plainText(content).slice(0, 160);
  const url = `${siteUrl()}/blog/${encodeURIComponent(post.slug)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.createdAt,
      authors: ["Nivaldo Dantas"],
      ...(post.imageUrl
        ? { images: [{ url: post.imageUrl, alt: title }] }
        : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await fetchPost(slug);
  if (!post) notFound();
  const t = await getTranslations("Writing");
  const { title, content } = localizedPost(post, locale);
  const url = `${siteUrl()}/blog/${encodeURIComponent(post.slug)}`;
  return (
    <div id="top">
      <Navigation />
      <main id="main-content" className="article-page container">
        <Link href="/blog" className="back-link">
          ← {t("back")}
        </Link>
        <article>
          <header className="article-header">
            <p className="eyebrow">{t("label")}</p>
            <h1>{title}</h1>
            <div className="article-meta">
              <span>{t("by")}</span>
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt, locale)}
              </time>
              <span>
                {readingMinutes(content)} {t("minute")}
              </span>
            </div>
          </header>
          {post.imageUrl && (
            <div
              className="article-cover"
              role="img"
              aria-label={title}
              style={{
                backgroundImage: `url(${JSON.stringify(post.imageUrl)})`,
              }}
            />
          )}
          <div className="article-prose">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h2>{children}</h2>,
                h2: ({ children }) => <h3>{children}</h3>,
                h3: ({ children }) => <h4>{children}</h4>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    {...(href?.startsWith("https://")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          <div className="article-end">
            <Link href="/blog">← {t("back")}</Link>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noreferrer"
            >
              {t("share")} ↗
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
