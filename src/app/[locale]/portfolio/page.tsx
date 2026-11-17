import Header from "@/components/layout/Header";
import MainContent from "@/components/layout/MainContent";
import Footer from "@/components/layout/Footer";
import Navigation from "@/components/layout/Navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import GitRepos from "@/components/portfolio/GitRepos";
import SelectedWork from "@/components/portfolio/SelectedWork";
import WorkGallery from "@/components/portfolio/WorkGallery";
import BlogPosts from "@/components/portfolio/BlogPosts";
import ScrollRuler from "@/components/ui/ScrollRuler";
import { Suspense } from "react";

export default async function Portfolio({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("UI");
  const loading = (
    <div className="content-loading" role="status" aria-busy="true">
      {t("loading")}
    </div>
  );
  return (
    <div id="top">
      <Navigation />
      <ScrollRuler />
      <main id="main-content">
        <WorkGallery>
          <Header />
          <SelectedWork />
        </WorkGallery>
        <MainContent
          repositoryContent={
            <Suspense fallback={loading}>
              <GitRepos />
            </Suspense>
          }
          blogContent={
            <Suspense fallback={loading}>
              <BlogPosts />
            </Suspense>
          }
        />
      </main>
      <Footer />
    </div>
  );
}
