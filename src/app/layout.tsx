import { RepoProvider } from "@/context/RepoContext";
import { Work_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import "@/globals.css";
const workSans = Work_Sans({
  subsets: ["latin"],
});
const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body className={`${workSans.className} antialiased`}>
        <ThemeProvider enableSystem={true} defaultTheme="system">
          <RepoProvider>{children}</RepoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
