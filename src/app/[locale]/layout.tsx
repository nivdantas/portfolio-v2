import "@/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import SoundEffects from "@/components/ui/SoundEffects";
import { siteUrl } from "@/lib/site";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-technical",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Nivaldo Dantas — Interfaces, APIs & connections",
    template: "%s — Nivaldo Dantas",
  },
  description:
    "Niv Dantas, software engineer. Interfaces, APIs, and the connections between them. Selected web, mobile, and AI projects, plus notes from the process.",
  openGraph: {
    type: "website",
    siteName: "Nivaldo Dantas",
    title: "Nivaldo Dantas — Interfaces, APIs & connections",
    description:
      "Selected projects, notes, and the connections between interface, API, and data.",
    url: "/portfolio",
  },
  alternates: { canonical: "/portfolio" },
  icons: { icon: "/icon.svg" },
};
export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }));

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html suppressHydrationWarning lang={locale}>
      <body className={`${sans.variable} ${display.variable} ${mono.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          {<NextIntlClientProvider>{children}</NextIntlClientProvider>}
          <SoundEffects />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
