import CardStatic from "@/components/CardStatic";
import {useTranslations} from "next-intl";
import React from "react";
import Image from "next/image";

interface MainContentProps {
    children?: React.ReactNode;
}

const MainContent = ({children}: MainContentProps) => {
    const t = useTranslations("MainContent");
    return (
        <main className="flex justify-center mx-10">

            <div className="max-w-lg xl:max-w-xl flex flex-col justify-center">
                <section>
                    <h2 className="stroke-gradient text-site-100 font-asap font-light">{t("experienceTitle")}</h2>
                    <div className="grid grid-cols-[45px_1fr_auto] gap-2 mt-5 min-w-0 shrink-0">
                        <Image src={"/noop.png"} alt="No Hiragana Image" width="45" height="45"
                               className="dark:invert"></Image>
                        <h3 className="font-asap text-xs text-balance">
                            {t.rich("experienceMobile", {
                                b: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
                            })}
                        </h3>
                        <h2 className="font-asap text-lg text-nowrap flex items-center">2024 - 2025</h2>
                    </div>
                    <div className="grid grid-cols-[45px_1fr_auto] gap-2 mt-5 min-w-0 shrink-0">
                        <Image src={"/noop.png"} alt="No Hiragana Image" width="45" height="45"
                               className="dark:invert"></Image>
                        <h3 className="font-asap text-xs text-balance flex items-center">
                            <strong>Freelancer</strong>
                        </h3>
                        <h2 className="font-asap text-lg text-nowrap flex items-center">2026</h2>
                    </div>
                </section>
                <section className="mt-10">
                    <h2 className="stroke-gradient text-site-100 font-asap font-light">{t("educationTitle")}</h2>
                    <div className="grid grid-cols-[45px_1fr_auto] gap-2 mt-5 min-w-0 shrink-0">
                        <Image src={"/noop.png"} alt="No Hiragana Image" width="45" height="45"
                               className="dark:invert"></Image>
                        <h3 className="font-asap text-xs text-balance">
                            {t.rich("educationMobile", {
                                b: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
                            })}
                        </h3>
                        <h2 className="font-asap text-lg text-nowrap flex items-center">2020 - 2025</h2>
                    </div>
                    <div className="grid grid-cols-[45px_1fr_auto] gap-2 mt-5 min-w-0 shrink-0">
                        <Image src={"/noop.png"} alt="No Hiragana Image" width="45" height="45"
                               className="dark:invert"></Image>
                        <h3 className="font-asap text-xs flex items-center">
                            <div>
                            {t.rich("papeTitle", {
                                b: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
                            })}
                            </div>
                        </h3>
                        <h2 className="font-asap text-lg text-nowrap flex items-center">2021 - 2024</h2>
                    </div>
                </section>
                <section className="mt-10">
                    <h2 className="stroke-gradient text-site-100 font-asap font-light">Portfolio</h2>
                </section>
            </div>
        </main>
    );
};

export default MainContent;
