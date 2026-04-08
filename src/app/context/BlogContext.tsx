"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface BlogPost {
    id: number;
    title_en: string;
    title_pt: string;
    slug: string;
    content_en: string;
    content_pt: string;
    imageUrl?: string | null;
    createdAt: string;
}

interface BlogContextType {
    posts: BlogPost[] | null;
    isLoading: boolean;
    error: string | null;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
    const [posts, setPosts] = useState<BlogPost[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setError(null);
            try {
                const res = await fetch("/api/posts");
                if (!res.ok) {
                    throw new Error(`Failed to fetch posts: ${res.status}`);
                }
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setPosts(data);
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Unknown error";
                console.error("Failed to load posts:", msg);
                setError(msg);
                setPosts(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <BlogContext.Provider value={{ posts, isLoading, error }}>
            {children}
        </BlogContext.Provider>
    );
};

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error("useBlog must be used within a BlogProvider");
    }
    return context;
};
