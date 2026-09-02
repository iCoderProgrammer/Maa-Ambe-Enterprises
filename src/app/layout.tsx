import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";

import "./globals.css";

import { MotionProvider } from "@/components/common/motion-provider";
import { SkipLink } from "@/components/common/skip-link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { siteConfig } from "@/config/site";
import { localKeywords } from "@/lib/seo";

/** Body face — high legibility at small sizes on Indian mid-tier Android. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Display face — geometric, wide, automotive. Headings only. */
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.title} | ${siteConfig.dealership.dealershipName}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Generated from the dealership config, so city-qualified terms appear the
  // moment a real address replaces the placeholder.
  keywords: localKeywords(),
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="pb-action-bar flex min-h-full flex-col">
        <MotionProvider>
          <SkipLink />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileActionBar />
          <WhatsAppFab />
        </MotionProvider>
      </body>
    </html>
  );
}
