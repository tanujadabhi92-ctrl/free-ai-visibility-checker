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
        <meta name="msvalidate.01" content="E065EB5C5E5BC4218F7C322ED5ECE262" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Free AI Visibility Checker",
              "alternateName": "AEO Grader",
              "url": "https://free-brand-ai-visibility-checker.vercel.app/",
              "description": "Free AI Visibility Checker that measures how often your brand appears in AI-generated answers. Get your AI Visibility Score, find hot topics, explore competitor strategies, and optimize your domain for AI.",
              "applicationCategory": "SEO Tool",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Person",
                "name": "Pintu Dabhi",
                "url": "https://www.linkedin.com/in/pintudabhi/"
              },
              "about": [
                {
                  "@type": "DefinedTerm",
                  "name": "AI Visibility Tool",
                  "sameAs": [
                    "https://en.wikipedia.org/wiki/Artificial_intelligence",
                    "https://www.google.com/search?q=ai+visibility+tool"
                  ]
                },
                {
                  "@type": "DefinedTerm",
                  "name": "free ai visibility checker",
                  "sameAs": [
                    "https://www.semrush.com/free-tools/ai-search-visibility-checker/",
                    "https://www.google.com/search?q=free+ai+visibility+checker"
                  ]
                },
                {
                  "@type": "DefinedTerm",
                  "name": "Get Your Free AI Visibility Report",
                  "sameAs": [
                    "https://amplitude.com/try-ai-visibility",
                    "https://www.google.com/search?q=Get+Your+Free+AI+Visibility+Report"
                  ]
                },
                {
                  "@type": "DefinedTerm",
                  "name": "AEO Grader",
                  "sameAs": [
                    "https://www.hubspot.com/aeo-grader",
                    "https://www.google.com/search?q=AI+Search+Grader"
                  ]
                }
              ],
              "featureList": [
                "AI Visibility Score",
                "Hot Topics Discovery",
                "Competitor Strategy Analysis",
                "Domain AI Optimization Check"
              ]
            })
          }}
        />
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
