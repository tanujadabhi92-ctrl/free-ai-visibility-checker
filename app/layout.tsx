import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "AEO Grader — AI Answer Engine Optimization",
  description:
    "Discover how visible your brand is in AI answer engines like Perplexity, ChatGPT, and Gemini.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="s5F1tcq35kyDs9OwjtXmA1EjEa18BiEhLg8z6No6Cbo" />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-J2Z6J1JWYQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-J2Z6J1JWYQ');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
