import { RepoProvider } from "@/context/RepoContext";
import { Work_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import "@/globals.css";
import { ExpandProvider } from "./context/ExpandContext";
import { NameWriteProvider } from "./context/NameWriteContext";
const workSans = Work_Sans({
  subsets: ["latin"],
});
const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body className={`${workSans.className} antialiased`}>
        <ThemeProvider enableSystem={true} defaultTheme="system">
          <RepoProvider>
            <ExpandProvider>
              <NameWriteProvider>{children}</NameWriteProvider>
            </ExpandProvider>
          </RepoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
