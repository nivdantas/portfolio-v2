import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Nivaldo Dantas - Website",
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};
const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return (
          <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
  );
};
export default RootLayout;
