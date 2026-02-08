import type { Metadata } from "next";
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
      </head>
      <body>{children}</body>
    </html>
  );
}
