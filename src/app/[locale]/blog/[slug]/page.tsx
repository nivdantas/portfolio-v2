import { setRequestLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const fetchPost = async (slug: string): Promise<BlogPost | null> => {
    try {
        // Fetch from your API — adjust the URL to your portfolio-api endpoint
        const res = await fetch(`${process.env.BLOG_API_URL}/posts/${slug}`, {
            next: { revalidate: 60 * 60 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
};

const BlogPostPage = async ({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) => {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = await fetchPost(slug);

    if (!post) {
        return (
            <>
                <Header />
                <main className="flex justify-center mt-20 text-site-800 dark:text-site-100">
                    <h1 className="font-poppins text-2xl">Post not found</h1>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <main className="flex justify-center ml-10 md:ml-30 md:mt-10 text-site-800 dark:text-site-100">
                <article className="max-w-3xl w-full">
                    {post.imageUrl && (
                        <div
                            className="w-full h-[200px] md:h-[400px] bg-gray-800 rounded-2xl overflow-hidden bg-cover bg-center"
                            style={{ backgroundImage: `url(${post.imageUrl})` }}
                        />
                    )}
                    <h1 className="font-archivo font-black text-3xl md:text-5xl mt-8">
                        {post.title}
                    </h1>
                    <p className="font-poppins text-site-700 dark:text-site-200 mt-2">
                        Niv — {formatDate(post.createdAt)}
                    </p>
                    <div
                        className="font-poppins mt-8 prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>
            <Footer />
        </>
    );
};

export default BlogPostPage;