import { Analytics } from '@vercel/analytics/next';
import { RepoProvider } from "@/context/RepoContext";
import { ReactNode } from "react";
import "@/globals.css";
import { ExpandProvider } from "./context/ExpandContext";
import { NameWriteProvider } from "./context/NameWriteContext";
const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RepoProvider>
      <ExpandProvider>
        <NameWriteProvider>
        {children}
        <Analytics />
        </NameWriteProvider>
      </ExpandProvider>
    </RepoProvider>
  );
};

export default RootLayout;
