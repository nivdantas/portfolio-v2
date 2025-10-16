import CardStatic from "@/components/CardStatic";
import CardExpandable from "@/components/CardExpandable";
import { useTranslations } from "next-intl";
import React from "react";
import NameWrite from "./NameWrite";

interface MainContentProps {
  children?: React.ReactNode;
}
const MainContent = ({ children }: MainContentProps) => {
  const t = useTranslations("MainContent");
  return (
    <main className="flex justify-center mx-10">
      <div className="max-w-lg xl:max-w-xl flex flex-col justify-center">
        <NameWrite />
        <h3
          id="dev-title"
          className="text-site-500 dark:text-neutral-400 text-sm lg:text-lg text-center mt-1"
        >
          {t("devTitle")}
        </h3>
        <ul className="flex gap-4 justify-center mt-2 xl:gap-6">
          <li className="hover-underline after:-bottom-1 dark:after:bg-neutral-300">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/NivDantas"
              aria-label="Github"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 lg:size-6 xl:size-7 stroke-site-500 dark:stroke-neutral-400"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </li>
          <li className="hover-underline after:-bottom-1 dark:after:bg-neutral-300">
            <a href="mailto:nivdantas@icloud.com" aria-label="Mail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 lg:size-6 xl:size-7 stroke-site-500 dark:stroke-neutral-400"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </li>
          <li className="hover-underline after:-bottom-1 dark:after:bg-neutral-300">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/nivaldo-dantas/"
              aria-label="Linkedin"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 lg:size-6 xl:size-7 stroke-site-500 dark:stroke-neutral-400"

              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </li>
        </ul>
        <p
          id="paragraph"
          className="text-site-700 dark:text-neutral-300 text-xs lg:text-sm xl:text-[16px] mt-5 text-pretty"
        >
          {t("paragraph")}
        </p>
        <div id="stacks" className="mt-2 self-center p-4">
          <h1 className="text-stone-700 dark:text-stone-100 relative overflow-hidden bg-white dark:bg-site text-md">
            Stacks: NextJS, React, TypeScript, NodeJS, TailwindCSS, SQLite
            <div>
              <div className="light:light-frost-item dark:frost-item"></div>
              <div className="light:light-frost-item dark:frost-item"></div>
              <div className="light:light-frost-item dark:frost-item"></div>
              <div className="light:light-frost-item dark:frost-item"></div>
            </div>
          </h1>
        </div>
        <section className="mt-5">
          <h2
            id="title-one"
            className="text-site dark:text-white text-xl xl:text-2xl"
          >
            {t("educationTitle")}
          </h2>
          <CardStatic
            title={t("degreeTitle")}
            subtitle={t("degreeSubtitle")}
            year={t("degreeYear")}
          ></CardStatic>
          <CardExpandable
            cardId="education"
            title={t("continuedTitle")}
            subtitle={t("continuedSubtitle")}
            year={t("continuedYear")}
          >
            <p
              id="ex-paragraph-one"
              className="text-site-800 dark:text-neutral-300 text-sm xl:text-[16px] text-pretty"
            >
              {t("continuedDesc")}
            </p>
          </CardExpandable>

          <h2
            id="title-two"
            className="text-site dark:text-white text-xl xl:text-2xl mt-6"
          >
            {t("experienceTitle")}
          </h2>
          <CardExpandable
            cardId="internship"
            title={t("internTitle")}
            subtitle={t("internSubtitle")}
            year={t("internYear")}
          >
            <ul
              id="ex-paragraph-two"
              className="text-site-800 dark:text-neutral-300 text-sm xl:text-[16px] text-pretty ml-2 list-disc grid gap-4"
            >
              <p className="text-pretty">{t("internDesc1")}</p>
              <p>{t("internDesc2")}</p>
              <p>{t("internDesc3")}</p>
              <p>{t("internDesc4")}</p>
            </ul>
          </CardExpandable>
          <h2
            id="title-three"
            className="text-site dark:text-white text-xl xl:text-2xl mt-6"
          >
            {t("languagesTitle")}
          </h2>
          <CardStatic
            title={t("portuguese")}
            subtitle={t("portugueseLevel")}
          ></CardStatic>
          <CardStatic
            title={t("english")}
            subtitle={t("englishLevel")}
          ></CardStatic>
        </section>
        {children}
      </div>
    </main>
  );
};

export default MainContent;
