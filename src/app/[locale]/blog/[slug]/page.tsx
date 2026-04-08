import type {Metadata} from "next";
import {type BlogPost} from "@/context/BlogContext";
import {setRequestLocale} from "next-intl/server";
import Footer from "@/components/layout/Footer";
import ReactMarkdown from 'react-markdown';
import LanguageButton from "@/components/ui/LanguageButton";


const formatDate = (dateStr: string, locale: string) => {
    const date = new Date(dateStr);
    if (locale === "pt") {
        return date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const fetchPost = async (slug: string): Promise<BlogPost | null> => {
    try {
        const res = await fetch(`${process.env.BLOG_API_URL}/posts/${slug}`, {
            next: {revalidate: 60 * 60},
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
};

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await fetchPost(slug);

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    const title = locale === "pt" ? post.title_pt : post.title_en;
    const content = locale === "pt" ? post.content_pt : post.content_en;

    const cleanDescription = content.replace(/[#*`_>]/g, "").substring(0, 160) + "...";

    return {
        title: title,
        description: cleanDescription,
        openGraph: {
            title: title,
            description: cleanDescription,
            images: [
                {
                    url: post.imageUrl || "/Phos.gif",
                    width: 800,
                    height: 600,
                    alt: title,
                },
            ],
        },
    };
}

const BlogPostPage = async ({
                                params,
                            }: {
    params: Promise<{ locale: string; slug: string }>;
}) => {
    const {locale, slug} = await params;
    setRequestLocale(locale);
    const post = await fetchPost(slug);

    if (!post) {
        return (
            <>
                <LanguageButton/>
                <main className="flex justify-center mt-20 text-site-800 dark:text-site-100">
                    <h1 className="font-poppins text-2xl">Post not found</h1>
                </main>
            </>
        );
    }

    return (
        <>
            <LanguageButton/>
            <main className="flex justify-center md:mt-10 text-site-800 dark:text-site-100">
                <article className="max-w-3xl w-full">
                    <div
                        className="flex justify-center my-0 mx-auto w-fit h-fit min-w-xs min-h-40 xl:min-w-3xl xl:min-h-80 bg-cover bg-center"
                        style={
                            post.imageUrl
                                ? { backgroundImage: `url(${post.imageUrl})` }
                                : undefined
                        }
                    />
                    {locale === "pt" ? (
                            <div className="ml-5">
                                <h1 className="font-archivo font-black text-3xl md:text-5xl mt-8">
                                    {post.title_pt}
                                </h1>
                                <p className="font-poppins text-site-700 dark:text-site-200 mt-2">
                                    {formatDate(post.createdAt, locale)}
                                </p>
                                <div className="flex flex-col gap-4 font-poppins mt-8 prose dark:prose-invert max-w-none">
                                    <ReactMarkdown>{post.content_pt}</ReactMarkdown>
                                </div>
                            </div>
                        ) :
                        (<div className="ml-5"><h1 className="font-archivo font-black text-3xl md:text-5xl mt-8">
                            {post.title_en}
                        </h1>
                            <p className="font-poppins text-site-700 dark:text-site-200 mt-2">
                                {formatDate(post.createdAt, locale)}
                            </p>
                            <div
                                className="flex flex-col gap-4 font-poppins mt-8 prose dark:prose-invert max-w-none"
                            >
                                <ReactMarkdown>{post.content_en}</ReactMarkdown>
                            </div>
                        </div>)
                    }

                </article>
            </main>
            <Footer/>
        </>
    );
};

export default BlogPostPage;