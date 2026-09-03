import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";

import "./globals.css";

import { MotionProvider } from "@/components/common/motion-provider";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
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
  /*
   * NO `h-full` ON `<html>`, AND THE REASON IS A SCROLLING BUG.
   *
   * `h-full` pins the root element's box to the viewport, so it stops growing
   * with the document. Lenis watches exactly that element with a
   * `ResizeObserver` to know how far the page can scroll — so with the height
   * pinned the observer never fired, the scroll limit stayed at whatever the
   * page measured on load, and anything that made the page TALLER afterwards
   * became unreachable. Opening the FAQ accordions left the last 500px
   * unscrollable; adding a model on /compare left more than half the
   * comparison table below a wall.
   *
   * The root element now sizes to its content, which is what makes that
   * observer work. `min-h-svh` on the body keeps the behaviour `min-h-full`
   * was there for — a full-height column, so the footer's `mt-auto` still
   * holds it to the bottom of a short page — without pinning anything, and
   * `svh` rather than `vh` so a mobile browser's collapsing URL bar does not
   * change it.
   */
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${sora.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="pb-action-bar flex min-h-svh flex-col">
        {/*
          Two providers, two jobs, and neither of them makes the tree below
          them a client tree — `children` arrives as an already-rendered
          server payload.

          `MotionProvider` configures Framer for the entrance reveals.
          `SmoothScrollProvider` runs Lenis and keeps GSAP's ScrollTrigger on
          the same frame as it. Lenis is outermost because it owns the page's
          scroll position, which is the thing every scroll-linked animation
          inside reads.
        */}
        <SmoothScrollProvider>
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
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
