import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import Footer from "@/components/Footer";
import { setRequestLocale } from "next-intl/server";
import GitRepos from "@/components/GitRepos";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <MainContent>
        <GitRepos></GitRepos>
      </MainContent>
      <Footer />
    </>
  );
};
export default Home;
