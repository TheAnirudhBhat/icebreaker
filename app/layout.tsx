import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Icebreaker",
  description: "Post-match icebreaker game, concept prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Handwriting face for the out-of-frame proto annotations. */}
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
