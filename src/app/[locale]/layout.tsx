import "@/globals.css";
import type {Metadata} from "next";
import type {ReactNode} from "react";
import {Analytics} from '@vercel/analytics/next';

import {hasLocale, NextIntlClientProvider} from "next-intl";
import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {Archivo, Poppins} from "next/font/google";
import {ThemeProvider} from "@/components/ui/ThemeProvider";
import {BlogProvider} from "@/context/BlogContext";
import {ExpandProvider} from "@/context/ExpandContext";
import {RepoProvider} from "@/context/RepoContext";


const archivo = Archivo({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-archivo",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Portfolio",
    description: "Nivaldo Dantas - Website",
};



export const generateStaticParams = () => {
    return routing.locales.map((locale) => ({locale}));
};
const RootLayout = async ({
                              children,
                              params,
                          }: Readonly<{
    children: ReactNode;
    params: Promise<{ locale: string }>;
}>) => {
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);
    return (
        <html suppressHydrationWarning lang={locale}>
        <body
            className={`${archivo.variable} ${poppins.variable} antialiased`}
        >

        <ThemeProvider enableSystem={true} defaultTheme="system">
            <RepoProvider>
                <BlogProvider>
                    <ExpandProvider>
                            <NextIntlClientProvider>{children}</NextIntlClientProvider>
                            <Analytics/>
                    </ExpandProvider>
                </BlogProvider>
            </RepoProvider>
        </ThemeProvider>
        </body>
        </html>
    );
};
export default RootLayout;
