import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import BlogPosts from "@/components/portfolio/BlogPosts";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Blog({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Writing");
  return (
    <div id="top">
      <Navigation />
      <main id="main-content" className="container blog-index">
        <Link href="/portfolio" className="back-link">
          ← {t("return")}
        </Link>
        <p className="eyebrow">{t("label")}</p>
        <h1>
          {t("title")} <em>{t("titleAccent")}</em>
        </h1>
        <p className="blog-index-intro">{t("intro")}</p>
        <BlogPosts all />
      </main>
      <Footer />
    </div>
  );
}
