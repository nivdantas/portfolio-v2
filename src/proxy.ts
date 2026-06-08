import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude `ufrj` and `tako` so the i18n middleware doesn't claim them — they
  // are proxied to other zones by the rewrites in next.config.ts.
  matcher: "/((?!api|trpc|_next|_vercel|ufrj|tako|.*\\..*).*)",
};
