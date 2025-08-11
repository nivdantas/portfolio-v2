import { sortRepo } from "./data";
import type { GitAPI } from "./data";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import Footer from "@/components/Footer";
import Typed from "@/components/Typed";
import CardStatic from "@/components/CardStatic";
import { use } from "react";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  let repo: GitAPI[] | null = null;
  try {
    repo = await sortRepo();
  } catch (e) {
    console.error("Failed to load repo:", e);
  }
  if (!repo) {
    return <div>No repositories found</div>;
  }
  return (
    <>
      <Header />
      <MainContent>
        <Typed strings={["Nivaldo Dantas"]} loop={false}></Typed>
      </MainContent>
      {repo.map((e) => (
        <CardStatic
          key={e.id}
          title={e.name}
          subtitle={e.language ? e.language : ""}
        ></CardStatic>
      ))}
      <Footer />
    </>
  );
}
