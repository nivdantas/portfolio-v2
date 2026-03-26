import {Analytics} from '@vercel/analytics/next';
import {RepoProvider} from "@/context/RepoContext";
import {ReactNode} from "react";
import "@/globals.css";
import {ExpandProvider} from "./context/ExpandContext";
import {NameWriteProvider} from "./context/NameWriteContext";
import {BlogProvider} from "@/context/BlogContext";

const RootLayout = ({children}: { children: ReactNode }) => {
    return (
        <RepoProvider>
            <BlogProvider>
                <ExpandProvider>
                    <NameWriteProvider>
                        {children}
                        <Analytics/>
                    </NameWriteProvider>
                </ExpandProvider>
            </BlogProvider>
        </RepoProvider>
    );
};

export default RootLayout;
