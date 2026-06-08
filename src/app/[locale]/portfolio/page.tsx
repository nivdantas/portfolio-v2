import Header from "@/components/layout/Header";
import MainContent from "@/components/layout/MainContent";
import Footer from "@/components/layout/Footer";
import { setRequestLocale } from "next-intl/server";
import GitRepos from "@/components/portfolio/GitRepos";
import BlogPosts from "@/components/portfolio/BlogPosts";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <MainContent
        portfolioContent={<GitRepos />}
        blogContent={<BlogPosts />}
      />
      <Footer />
    </>
  );
};
export default Home;
