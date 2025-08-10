import type { Metadata } from "next";
import { Geist, Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/Language";
const workSans = Work_Sans({
  subsets: ["latin"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Nivaldo Dantas - Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={`${workSans.className} antialiased`}>
          <ThemeProvider enableSystem={true} defaultTheme="system">
            {children}
          </ThemeProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
