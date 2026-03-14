import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Asap, Fira_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

const asap = Asap({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-asap",
});

const firSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-sans",
});

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
    <html suppressHydrationWarning lang={locale}>
      <body
        className={`${asap.variable} ${firSans.variable} ${asap.className} antialiased`}
      >
        <ThemeProvider enableSystem={true} defaultTheme="system">
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};
export default RootLayout;
