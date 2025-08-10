"use client";
import React, { useState, useId, useEffect } from "react";

interface Card {
  title: string;
  subtitle: string;
  year: string;
  children: React.ReactNode;
}

export default function CardExpandable({
  title,
  subtitle,
  year,
  children,
}: Card) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  if (!isMobile)
    return (
      <div className="border-1 border-site-300 dark:border-detalhe rounded-lg mt-5 group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className="w-full p-4 grid grid-cols-1 relative text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-site-500 dark:focus-visible:ring-neutral-400 rounded-lg"
        >
          <h3 className="text-site dark:text-white text-sm lg:text-lg break-normal">
            {title}
          </h3>
          <h4 className="text-site-500 dark:text-neutral-400 text-[10px] lg:text-sm mt-1">
            {subtitle}
          </h4>
          <h4 className="text-site-500 dark:text-neutral-400 text-[10px] lg:text-sm mt-2 justify-self-end">
            {year}
          </h4>
          <span className="w-5 h-1 absolute bg-gradient-to-b from-site-300 to-site-700 dark:from-[#344C50] dark:to-[#356C6C] left-4 top-17 lg:top-21"></span>
          <svg
            width="30"
            height="30"
            viewBox="0 0 22 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden absolute -bottom-4.5 justify-self-center fill-white dark:fill-site stroke-site-300 dark:stroke-detalhe group motion-safe:lg:animate-bounce lg:block"
          >
            <path
              d="M1.25 10.76C1.25 12.36 2.373 13.754 3.957 13.987C5.025 14.144 6.105 14.266 7.195 14.351C7.661 14.388 8.088 14.632 8.348 15.022L11 19L13.652 15.022C13.912 14.632 14.339 14.388 14.805 14.352C15.895 14.266 16.975 14.144 18.043 13.987C19.627 13.754 20.75 12.361 20.75 10.759V4.741C20.75 3.139 19.627 1.746 18.043 1.513C15.711 1.17072 13.357 0.99926 11 1C8.608 1 6.256 1.175 3.957 1.513C2.373 1.746 1.25 3.14 1.25 4.741V10.759V10.76Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isExpanded && (
          <div id={contentId} className="mt-4 p-4 rounded cursor-default">
            {children}
          </div>
        )}
      </div>
    );
  return (
    <div className="border-1 border-site-300 dark:border-detalhe rounded-lg mt-5 group w-full p-4 grid grid-cols-1 relative text-left">
      <h3 className="text-site dark:text-white text-sm lg:text-lg break-normal">
        {title}
      </h3>
      <h4 className="text-site-500 dark:text-neutral-400 text-[10px] lg:text-sm mt-1">
        {subtitle}
      </h4>
      <h4 className="text-site-500 dark:text-neutral-400 text-[10px] lg:text-sm mt-2 justify-self-end">
        {year}
      </h4>
      <span className="w-5 h-1 absolute bg-gradient-to-b from-site-300 to-site-700 dark:from-[#344C50] dark:to-[#356C6C] left-4 top-17 lg:top-21"></span>
    </div>
  );
}
