import {useTranslations} from "next-intl";
import React from "react";
import ScrollReveal from "../ui/ScrollReveal";

interface MainContentProps {
    portfolioContent?: React.ReactNode;
    blogContent?: React.ReactNode;
}

const MainContent = ({portfolioContent, blogContent}: MainContentProps) => {
    const t = useTranslations("MainContent");
    return (
        <main className="flex justify-center ml-10 md:ml-30 md:mt-10 text-site-800 dark:text-site-100">

            <div className="flex flex-col justify-center">
                <ScrollReveal delay={200}>
                    <section className="md:mr-90 2xl:mr-15 lg:mr-5 xl:mb-13">
                        <h1 className="font-poppins font-medium text-[9px] xl:text-xl md:text-base xl:mb-6">{t("experienceTitle")}</h1>
                        <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5 md:text-lg xl:text-3xl xl:mb-13">{t("experienceSubTitle")}</h2>
                        <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                            <div className="font-poppins">
                                <h3 className="text-[8px] xl:text-2xl md:text-sm font-medium xl:mb-3">{t("experienceMobileTitle")}</h3>
                                <p className="text-[6px] md:text-xs xl:text-base mt-1 text-site-700 dark:text-site-200">{t("experienceMobileParagraph")}</p>
                            </div>
                            <h3 className="font-poppins text-[7px] md:text-xs xl:text-lg text-center font-medium">2024 -
                                2025</h3>
                        </div>
                        <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-6 min-w-0 shrink-0">
                            <div className="font-poppins">
                                <h3 className="text-[8px] md:text-sm xl:text-2xl font-medium xl:mb-3">Freelancer</h3>
                                <p className="text-[6px] mt-1 md:text-xs xl:text-base text-site-700 dark:text-site-200">{t("experienceMobileParagraph2")}</p>
                            </div>
                            <h3 className="font-poppins text-[7px] md:text-xs xl:text-lg text-center font-medium">2026 - Now</h3>
                        </div>

                    </section>

                    <section className="mt-5 md:mr-90 2xl:mr-15 lg:mr-5">
                        <h1 className="font-poppins font-medium text-[9px] md:text-base xl:text-xl xl:mb-6">{t("educationTitle")}</h1>
                        <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5 md:text-lg xl:text-3xl xl:mb-13">{t("educationSubTitle")}</h2>
                        <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                            <div className="font-poppins">
                                <h3 className="text-[8px] md:text-sm font-medium xl:text-2xl xl:mb-3">{t("educationMobileTitle")}</h3>
                                <p className="text-[6px] mt-1 md:text-xs text-site-700 xl:text-base dark:text-site-200">{t("educationMobileParagraph")}</p>
                            </div>
                            <h3 className="font-poppins text-[7px] md:text-xs text-center font-medium xl:text-lg">2020 - 2025</h3>
                        </div>
                        <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-6 min-w-0 shrink-0">
                            <div className="font-poppins">
                                <h3 className="text-[8px] md:text-sm font-medium xl:text-2xl xl:mb-3">{t("papeTitle")}</h3>
                                <p className="text-[6px] md:text-xs text-site-700 dark:text-site-200 mt-1 xl:text-base">{t("papeParagraph")}</p>
                            </div>
                            <h3 className="font-poppins text-[7px] md:text-xs text-center font-medium xl:text-lg">2021 - 2024</h3>
                        </div>
                    </section>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <section className="mt-10 md:mt-40">
                        <h1 className="font-poppins font-medium text-[9px] md:text-base xl:text-xl xl:mb-6">Portfolio</h1>
                        <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5 md:text-lg xl:text-3xl xl:mb-14">{t("portfolioSubTitle")}</h2>

                        <article className="md:grid xl:grid xl:grid-cols-3 md:grid-cols-2 md:gap-4 mt-4 mr-30 justify-items-stretch">
                                {portfolioContent}
                        </article>
                    </section>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <section className="mt-10 md:mt-40">
                        <h1 className="font-poppins font-medium text-[9px] xl:text-xl md:text-base xl:mb-6">Blogspot</h1>
                        <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5 md:text-lg xl:text-3xl xl:mb-14">{t("blogSubTitle")}</h2>
                        {blogContent}
                    </section>
                </ScrollReveal>
            </div>
        </main>
    );
};

export default MainContent;
