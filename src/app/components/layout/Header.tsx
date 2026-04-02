import LanguageButton from "../ui/LanguageButton";
import Image from 'next/image'
import {useTranslations} from "next-intl";
const Header = () => {
    const t = useTranslations("Header");
    return (
        <header className="grid grid-cols-1 justify-items-center mt-4 z-50 text-site-800 dark:text-site-100 md:h-dvh">
            <Image src={"n.svg"} alt={"N logo"} width={60} height={60} className="dark:invert md:absolute md:left-10 xl:size-16"></Image>
            <LanguageButton/>
            <nav className="mx-10 mt-7.5 md:mt-4">
                <ul className="flex gap-15 font-poppins 2xl:text-2xl xl:text-xl">
                    <li>{t("navAbout")}</li>
                    <li>{t("navProjects")}</li>
                    <li>{t("navBlog")}</li>
                </ul>
            </nav>
            <h1 className="font-archivo font-black text-4xl md:text-7xl xl:text-9xl tracking-tight md:tracking-normal text-center mt-10 md:mt-14 leading-9 md:leading-26">{t.rich("devTitle", {
                br: () => <br />,
            })}</h1>
            <p className="hidden md:block md:mt-0 font-poppins text-xl leading-9 max-w-[50%] text-center xl:text-3xl">{t("devDesc")}</p>
            <nav className="mt-12.5 mb-12 md:mb-0 md:h-min md:mt-4">
                <ul className="flex gap-22 md:gap-11">
                    <li><a href="https://github.com/NivDantas">
                            <Image src={"github.svg"} alt={"Github logo"} width={50} height={50} className="dark:invert w-10 h-10 md:w-[50px] md:h-[50px] xl:size-15"></Image>
                        </a></li>
                        <li><a href="mailto:nivdantas@icloud.com">
                            <Image src={"envelope.svg"} alt={"Email logo"} width={50} height={50} className="dark:invert w-10 h-10 md:w-[50px] md:h-[50px] xl:size-15"></Image>
                        </a></li>
                        <li><a href="https://linkedin.com/in/nivaldo-dantas">
                            <Image src={"linkedin.svg"} alt={"Linkedin logo"} width={50} height={50} className="dark:invert w-10 h-10 md:w-[50px] md:h-[50px] xl:size-15"></Image>
                        </a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
