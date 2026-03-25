import {useTranslations} from "next-intl";
import React from "react";
import ScrollReveal from "../ui/ScrollReveal";

interface MainContentProps {
    children?: React.ReactNode;
}

const MainContent = ({children}: MainContentProps) => {
    const t = useTranslations("MainContent");
    return (
        <main className="flex justify-center ml-10 md:ml-30 md:mt-10 text-site-800 dark:text-site-100">

            <div className="flex flex-col justify-center">
                <ScrollReveal delay={200}>
                    <section className="md:mr-90">
                        <h1 className="font-poppins font-medium text-[9px] md:text-base">{t("experienceTitle")}</h1>
                        <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5 md:text-lg">{t("experienceSubTitle")}</h2>
                        <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                            <div className="font-poppins">
                                <h3 className="text-[8px] md:text-sm font-medium">{t("experienceMobileTitle")}</h3>
                                <p className="text-[6px] md:text-xs mt-1 text-site-700 dark:text-site-200">{t("experienceMobileParagraph")}</p>
                            </div>
                            <h3 className="font-poppins text-[7px] md:text-xs text-center font-medium">2024 -
                                2025</h3>
                        </div>
                        <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                            <div className="font-poppins">
                                <h3 className="text-[8px] md:text-sm font-medium">Freelancer</h3>
                                <p className="text-[6px] mt-1 md:text-xs text-site-700 dark:text-site-200">{t("experienceMobileParagraph2")}</p>
                            </div>
                            <h3 className="font-poppins text-[7px] md:text-xs text-center font-medium">2026 - Now</h3>
                        </div>

                    </section>

                    <section className="mt-5 md:mr-90">
                        <h1 className="font-poppins font-medium text-[9px] md:text-base">{t("educationTitle")}</h1>
                        <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5 md:text-lg">{t("educationSubTitle")}</h2>
                        <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                            <div className="font-poppins">
                                <h3 className="text-[8px] md:text-sm font-medium">{t("educationMobileTitle")}</h3>
                                <p className="text-[6px] mt-1 md:text-xs text-site-700 dark:text-site-200">{t("educationMobileParagraph")}</p>
                            </div>
                            <h3 className="font-poppins text-[7px] md:text-xs text-center font-medium">2020 - 2025</h3>
                        </div>
                        <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                            <div className="font-poppins">
                                <h3 className="text-[8px] md:text-sm font-medium">{t("papeTitle")}</h3>
                                <p className="text-[6px] md:text-xs text-site-700 dark:text-site-200 mt-1">{t("papeParagraph")}</p>
                            </div>
                            <h3 className="font-poppins text-[7px] md:text-xs text-center font-medium">2021 - 2024</h3>
                        </div>
                    </section>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <section className="mt-10 md:mt-25">
                        <h1 className="font-poppins font-medium text-[9px] md:text-base">Portfolio</h1>
                        <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5 md:text-lg">{t("portfolioSubTitle")}</h2>
                        <article className="md:flex md:flex-wrap md:gap-4 mt-4">
                                {children}
                        </article>
                    </section>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <section className="mt-10 md:mt-25">
                        <h1 className="font-poppins font-medium text-[9px] md:text-base">Blogspot</h1>
                        <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5 md:text-lg">{t("blogSubTitle")}</h2>
                        <article className="md:grid md:grid-cols-[1fr_1fr] md:gap-4">
                        <div id="PLACEHOLDER"
                                 className="w-[288px] h-[156px] md:w-[692px] md:h-[375px] bg-gray-800 mt-3 rounded-2xl">
                        </div>
                        <div className="hidden md:flex flex-col gap-2 justify-center">
                            <h1 className="font-poppins text-[8px] md:text-xl">Title</h1>
                            <h2 className="font-poppins text-[8px] md:text-xl">Niv - Data</h2>
                        </div>
                        </article>
                        <article id="PLACEHOLDER" className="grid grid-cols-[1fr_4fr] md:grid-cols-[175px_1fr] mt-7 gap-3 md:gap-8">
                            <div id="PLACEHOLDER" className="w-[73px] md:w-[175px] h-[53px] md:h-[125px] bg-gray-800 rounded-md"></div>
                            <div className="flex flex-col gap-2 justify-center">
                                <h1 className="font-poppins text-[8px] md:text-base">Title</h1>
                                <h2 className="font-poppins text-[8px] md:text-base">Niv - Data</h2>
                            </div>
                            <div id="PLACEHOLDER" className="hidden md:block w-[73px] md:w-[175px] h-[53px] md:h-[125px] bg-gray-800 rounded-md"></div>
                            <div className="hidden md:flex flex-col gap-2 justify-center">
                                <h1 className="font-poppins text-[8px] md:text-base">Title</h1>
                                <h2 className="font-poppins text-[8px] md:text-base">Niv - Data</h2>
                            </div>
                            <div id="PLACEHOLDER" className="hidden md:block w-[73px] md:w-[175px] h-[53px] md:h-[125px] bg-gray-800 rounded-md"></div>
                            <div className="hidden md:flex flex-col gap-2 justify-center">
                                <h1 className="font-poppins text-[8px] md:text-base">Title</h1>
                                <h2 className="font-poppins text-[8px] md:text-base">Niv - Data</h2>
                            </div>
                        </article>
                    </section>
                </ScrollReveal>
            </div>
        </main>
    );
};

export default MainContent;
