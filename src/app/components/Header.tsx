import LanguageButton from "./LanguageButton";
import Image from 'next/image'
import {useTranslations} from "next-intl";
const Header = () => {
    const t = useTranslations("Header");
    return (
        <header className="grid grid-cols-1 justify-items-center mt-4 md:sticky z-50 top-0 font-asap text-site-800 dark:text-site-100">
            <Image src={"n.svg"} alt={"N logo"} width={60} height={60} className="dark:invert"></Image>
            <LanguageButton/>
            <nav className="mx-10 mt-5">
                <ul className="flex gap-15">
                    <li>{t("navAbout")}</li>
                    <li>{t("navProjects")}</li>
                    <li>{t("navBlog")}</li>
                </ul>
            </nav>
            <h1 className="font-sans text-4xl tracking-widest text-center mt-10 leading-11">Dev <br /> Full Stack</h1>
            <nav className="mt-14 mb-12">
                <ul className="flex gap-22">
                    <li><a href="https://github.com/NivDantas">
                        <Image src={"github.svg"} alt={"Github logo"} width={40} height={40} className="dark:invert"></Image>
                    </a></li>
                    <li><a href="mailto:nivdantas@icloud.com">
                        <Image src={"envelope.svg"} alt={"Email logo"} width={40} height={40} className="dark:invert"></Image>
                    </a></li>
                    <li><a href="https://linkedin.com/in/nivaldo-dantas">
                        <Image src={"linkedin.svg"} alt={"Linkedin logo"} width={40} height={40} className="dark:invert"></Image>
                    </a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
