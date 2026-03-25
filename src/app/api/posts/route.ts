import { NextResponse } from "next/server";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
}

export const GET = async () => {
  try {
    const res = await fetch(`${process.env.BLOG_API_URL}/posts`, {
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    const posts: BlogPost[] = await res.json();
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
};