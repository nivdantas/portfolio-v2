import {useTranslations} from "next-intl";
import React from "react";

interface MainContentProps {
    children?: React.ReactNode;
}

const MainContent = ({children}: MainContentProps) => {
    const t = useTranslations("MainContent");
    return (
        <main className="flex justify-center mx-10 text-site-800 dark:text-site-100">

            <div className="max-w-lg xl:max-w-xl flex flex-col justify-center">
                <section>
                    <h1 className="font-poppins font-medium text-[9px]">{t("experienceTitle")}</h1>
                    <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5">{t("experienceSubTitle")}</h2>
                    <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                       <div className="font-poppins">
                           <h3 className="text-[8px] font-medium">{t("experienceMobileTitle")}</h3>
                           <p className="text-[6px] mt-1">{t("experienceMobileParagraph")}</p>
                       </div>
                        <h3 className="font-poppins text-[7px] text-center font-medium">2024 - 2025</h3>
                    </div>
                    <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                        <div className="font-poppins">
                            <h3 className="text-[8px] font-medium">Freelancer</h3>
                            <p className="text-[6px] mt-1">{t("experienceMobileParagraph2")}</p>
                        </div>
                        <h3 className="font-poppins text-[7px] text-center font-medium">2026 - Now</h3>
                    </div>

                </section>
                <section className="mt-5">
                    <h1 className="font-poppins font-medium text-[9px]">{t("educationTitle")}</h1>
                    <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5">{t("educationSubTitle")}</h2>
                    <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                        <div className="font-poppins">
                            <h3 className="text-[8px] font-medium">{t("educationMobileTitle")}</h3>
                            <p className="text-[6px] mt-1">{t("educationMobileParagraph")}</p>
                        </div>
                        <h3 className="font-poppins text-[7px] text-center font-medium">2020 - 2025</h3>
                    </div>
                    <div className="grid grid-cols-[2.5fr_1fr] gap-6 mt-5 min-w-0 shrink-0">
                        <div className="font-poppins">
                            <h3 className="text-[8px] font-medium">{t("papeTitle")}</h3>
                            <p className="text-[6px] mt-1">{t("papeParagraph")}</p>
                        </div>
                        <h3 className="font-poppins text-[7px] text-center font-medium">2021 - 2024</h3>
                    </div>
                </section>

                <section className="mt-10">
                    <h1 className="font-poppins font-medium text-[9px]">Portfolio</h1>
                    <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5">{t("portfolioSubTitle")}</h2>
                    <div id="PLACEHOLDER" className="w-[295px] h-[94px] bg-gray-500 mt-4 rounded-[10px]"></div>
                    <div id="PLACEHOLDER" className="w-[295px] h-[94px] bg-gray-500 mt-5 rounded-[10px]"></div>
                    <div id="PLACEHOLDER" className="w-[295px] h-[94px] bg-gray-500 mt-5 rounded-[10px]"></div>
                </section>

                <section className="mt-20">
                    <h1 className="font-poppins font-medium text-[9px]">Blogspot</h1>
                    <h2 className="font-poppins text-xs max-w-[24ch] mt-2.5">{t("blogSubTitle")}</h2>
                    <article id="PLACEHOLDER" className="w-[288px] h-[156px] bg-gray-800 mt-3 rounded-2xl"></article>
                    <article id="PLACEHOLDER" className="grid grid-cols-[1fr_4fr] mt-7 gap-3">
                       <div id="PLACEHOLDER" className="w-[73px] h-[53px] bg-gray-800 rounded-md"></div>
                        <div className="flex flex-col gap-2 justify-center">
                            <h1 className="font-poppins text-[8px]">Title</h1>
                            <h2 className="font-poppins text-[8px]">Niv - Data</h2>
                        </div>
                    </article>
                </section>
            </div>
        </main>
    );
};

export default MainContent;
