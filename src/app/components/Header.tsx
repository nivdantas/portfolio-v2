import LanguageButton from "./LanguageButton";
import Image from 'next/image'
import {useTranslations} from "next-intl";
const Header = () => {
    const t = useTranslations("Header");
    return (
        <header className="grid grid-cols-1 justify-items-center mt-4 md:sticky z-50 top-0">
            <Image src={"n.svg"} alt={"N logo"} width={60} height={60}></Image>
            <LanguageButton/>
            <nav className="mx-10 mt-5">
                <ul className="flex gap-15">
                    <li>{t("navAbout")}</li>
                    <li>{t("navProjects")}</li>
                    <li>{t("navBlog")}</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
