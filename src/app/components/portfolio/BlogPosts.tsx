
"use client";
import { type BlogPost } from "@/context/BlogContext";
import { useBlog } from "@/context/BlogContext";
import { Link } from "@/i18n/navigation"
import {useLocale} from "next-intl";

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

const BlogPosts = () => {
    const { posts, isLoading, error } = useBlog();
    const locale = useLocale();
    const getLocalizedTitle = (post: BlogPost): string => {
        return locale === "pt" ? post.title_pt : post.title_en;
    };

    if (isLoading) {
        return (
            <>
                <article className="md:grid md:grid-cols-[692px_1fr] md:gap-4">
                    <div className="w-[288px] h-[156px] md:w-[692px] md:h-[375px] bg-gray-800 animate-pulse mt-3 rounded-2xl" />
                    <div className="hidden md:flex flex-col gap-2 justify-center">
                        <div className="h-6 w-48 bg-gray-700 animate-pulse rounded" />
                        <div className="h-5 w-32 bg-gray-700 animate-pulse rounded" />
                    </div>
                </article>
                <article className="grid grid-cols-[1fr_4fr] md:grid-cols-[175px_1fr] mt-7 gap-3 md:gap-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={`contents ${i > 0 ? "hidden md:contents" : ""}`}>
                            <div className="w-[73px] md:w-[175px] h-[53px] md:h-[125px] bg-gray-800 animate-pulse rounded-md" />
                            <div className="flex flex-col gap-2 justify-center">
                                <div className="h-4 w-32 bg-gray-700 animate-pulse rounded" />
                                <div className="h-4 w-24 bg-gray-700 animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </article>
            </>
        );
    }

    if (error || !posts || posts.length === 0) {
        return (
            <>
                <article className="md:grid md:grid-cols-[1fr_1fr] md:gap-4">
                    <div className="w-[288px] h-[156px] md:w-[692px] md:h-[375px] bg-gray-800 mt-3 rounded-2xl" />
                    <div className="hidden md:flex flex-col gap-2 justify-center">
                        <h1 className="font-poppins text-[8px] md:text-xl">
                            {error ? (locale === "pt" ? "Erro ao carregar posts" : "Error loading posts") : (locale === "pt" ? "Sem posts ainda" : "No posts yet")}
                        </h1>
                    </div>
                </article>
            </>
        );
    }
    const [featured, ...rest] = posts;
    const secondary = rest.slice(0, 3);

    return (
        <>
            <article className="md:grid md:grid-cols-[692px_1fr] xl:grid-cols-[800px_1fr] md:gap-4">
                <Link href={`/blog/${featured.slug}`} className="block">
                    <div
                        className="w-[288px] h-[156px] md:w-[692px] md:h-[375px] xl:w-[800px] xl:h-[450px] bg-gray-800 mt-3 rounded-2xl overflow-hidden bg-cover bg-center"
                        style={
                            featured.imageUrl
                                ? { backgroundImage: `url(${featured.imageUrl})` }
                                : undefined
                        }
                    />
                </Link>
                <div className="hidden md:flex flex-col gap-2 justify-center">
                    <h1 className="font-poppins text-[8px] md:text-xl xl:text-3xl">{getLocalizedTitle(featured)}</h1>
                    <h2 className="font-poppins text-[8px] md:text-xl xl:text-2xl text-site-700 dark:text-site-200">
                        Niv - {formatDate(featured.createdAt, locale)}
                    </h2>
                </div>
            </article>

            {/* Secondary posts (small rows) */}
            <article className="grid grid-cols-[1fr_4fr] md:grid-cols-[175px_1fr] mt-7 gap-3 md:gap-8">
                {secondary.map((post, i) => (
                    <div key={post.id} className={`contents ${i > 0 ? "hidden md:contents" : ""}`}>
                        <Link href={`/blog/${post.slug}`} className="block">
                            <div
                                className="w-[73px] md:w-[175px] h-[53px] md:h-[125px] xl:w-[350px] xl:h-[220px] bg-gray-800 rounded-md overflow-hidden bg-cover bg-center"
                                style={
                                    post.imageUrl
                                        ? { backgroundImage: `url(${post.imageUrl})` }
                                        : undefined
                                }
                            />
                        </Link>
                        <div className={`flex flex-col gap-2 justify-center ${i > 0 ? "hidden md:flex" : ""}`}>
                            <h1 className="font-poppins text-[8px] md:text-base">{getLocalizedTitle(post)}</h1>
                            <h2 className="font-poppins text-[8px] md:text-base text-site-700 dark:text-site-200">
                                Niv - {formatDate(post.createdAt, locale)}
                            </h2>
                        </div>
                    </div>
                ))}

                {/* Fill remaining slots with empty placeholders if less than 3 secondary posts */}
                {Array.from({ length: Math.max(0, 3 - secondary.length) }).map((_, i) => {
                    const idx = secondary.length + i;
                    return (
                        <div key={`empty-${idx}`} className={`contents ${idx > 0 ? "hidden md:contents" : ""}`}>
                            <div className="w-[73px] md:w-[175px] h-[53px] md:h-[125px] bg-gray-800 rounded-md" />
                            <div className={`flex flex-col w-fit gap-2 justify-center ${idx > 0 ? "hidden md:flex" : ""}`}>
                                <h1 className="font-poppins text-[8px] md:text-base xl:text-xl">{locale === "pt" ? "Em breve" : "Coming soon"}</h1>
                            </div>
                        </div>
                    );
                })}
            </article>
        </>
    );
};

export default BlogPosts;