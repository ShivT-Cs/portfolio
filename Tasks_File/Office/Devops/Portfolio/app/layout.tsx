import type { Metadata } from "next";
import { IBM_Plex_Sans, Sora } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const sora = Sora({ subsets: ["latin"], variable: "--font-heading" });
const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ShivT-Cs | Azure Solutions Architect and DevOps Engineer",
  description:
    "Portfolio of ShivT-Cs, focused on Azure solutions architecture, DevOps, platform engineering, and secure cloud delivery.",
  openGraph: {
    title: "Shivkumar Tiwari | Azure Solutions Architect and DevOps Engineer",
    description:
      "Cloud architecture, DevOps, and platform engineering portfolio with draft case studies and reusable delivery patterns.",
    url: siteUrl,
    siteName: "ShivT-Cs Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShivT-Cs | Azure Solutions Architect and DevOps Engineer",
    description:
      "Cloud architecture, DevOps, and platform engineering portfolio with draft case studies and reusable delivery patterns.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${plex.variable}`}>
      <body className="font-[var(--font-body)] antialiased">{children}</body>
    </html>
  );
}
