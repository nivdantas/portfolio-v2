import { NextResponse } from "next/server";
import { fetchPosts } from "@/lib/blog";

export async function GET() {
  if (!process.env.BLOG_API_URL) return NextResponse.json([]);
  try {
    return NextResponse.json(await fetchPosts());
  } catch {
    return NextResponse.json(
      { error: "Blog service is temporarily unavailable" },
      { status: 502 },
    );
  }
}
