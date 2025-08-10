import Image from "next/image";
import { sortRepo } from "./data";
import type { GitAPI } from "./data";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import Footer from "@/components/Footer";
export default async function Home() {
  "use server";

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
      <MainContent />
      <Footer />
    </>
  );
}
