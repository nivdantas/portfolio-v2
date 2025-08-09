import Image from "next/image";
import { sortRepo } from "./data";
import type { GitAPI } from "./data";
export default async function Home() {
  "use server";

  let repo: GitAPI[] | null = null;
  try {
    repo = await sortRepo();
  } catch (e) {
    console.error("Failed to load repo:", e);
  }
  if (!repo) {
    return `No repositories found`;
  }
  return (
    <div>
      {repo.map((r) => (
        <p key={r.id}>{r.name}</p>
      ))}
    </div>
  );
}
