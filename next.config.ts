import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// nivdantas.com layout (routing lives here, NOT in vercel.json — Vercel ignores
// vercel.json `rewrites` for Next.js projects):
//   /            -> landing page that redirects to /portfolio (app/[locale]/page.tsx)
//   /portfolio   -> the portfolio (app/[locale]/portfolio)
//   /uerj/*       -> the separate, password-gated UERJ zone (proxied below)
//   /tako/*       -> the streak service
//
// No basePath: the app owns the domain root so "/" can be a real page. The two
// proxied zones are matched in beforeFiles (ahead of page resolution) and are
// excluded from the next-intl matcher in proxy.ts so the i18n middleware
// doesn't swallow them.
//
// Host is the UERJ zone's Vercel deployment URL (the project is still named
// "ufrj-repo"); the /uerj path prefix matches that app's basePath.
const UERJ_ZONE = "https://ufrj-repo.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/uerj", destination: `${UERJ_ZONE}/uerj` },
        { source: "/uerj/:path*", destination: `${UERJ_ZONE}/uerj/:path*` },
        {
          source: "/tako/:path*",
          destination: "https://tako-streak-production.up.railway.app/:path*",
        },
      ],
    };
  },
};

const withNextIntl = createNextIntlPlugin("./src/app/i18n/request.ts");
export default withNextIntl(nextConfig);
