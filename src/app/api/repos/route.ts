import { NextResponse } from "next/server";
import { fetchRepositories } from "@/lib/repositories";
export type { Repository as GitAPI } from "@/lib/content";

export async function GET() {
  try {
    return NextResponse.json(await fetchRepositories());
  } catch {
    return NextResponse.json(
      { error: "Repositories are temporarily unavailable" },
      { status: 502 },
    );
  }
}
