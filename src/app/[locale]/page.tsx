import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Landing page at "/". It bounces to /portfolio (the meta-refresh covers
// no-JS clients too) and shows an explicit link as a fallback. Intentionally
// links ONLY to /portfolio — the /uerj zone stays unlinked.
const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/portfolio" />
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          textAlign: "center",
          padding: "2rem",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
        }}
      >
        <p style={{ opacity: 0.7 }}>Redirecting to the portfolio…</p>
        <Link
          href="/portfolio"
          style={{ fontWeight: 600, textDecoration: "underline" }}
        >
          Go to the portfolio →
        </Link>
      </main>
    </>
  );
};

export default Home;
