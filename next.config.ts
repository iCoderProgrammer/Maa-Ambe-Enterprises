import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * Applied to every response. Nothing here is optional for a public site that
 * takes names and phone numbers through a form.
 *
 * No Content-Security-Policy is set. A useful one has to allow whatever tag
 * manager the dealership adds later (the analytics façade deliberately bundles
 * no vendor script), and a CSP written against scripts that are not here yet
 * would either block them on the day they land or be so loose it protects
 * nothing. Add it once the tag list is known — that is the one header meant to
 * be revisited.
 */
const securityHeaders = [
  // Two years, subdomains included, preload-eligible. HTTPS is a given on
  // Vercel; this stops a downgrade attempt on a later request.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // No MIME sniffing: an uploaded or proxied file cannot be re-read as script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The site is never meant to be framed. Clickjacking a "Book Test Ride"
  // button is a real, cheap attack against a lead form.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send the full URL to ourselves, origin only to third parties — enough for
  // referral analytics without leaking a customer's query string.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on this site needs a camera, a microphone, geolocation or payment.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  // Isolates the browsing context from windows it opens, and vice versa.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // The framework version is not the customer's business, and it is free
  // reconnaissance for anyone scanning.
  poweredByHeader: false,

  images: {
    // Modern formats for the product, showroom and team photography. No remote
    // patterns: every image is served from `public/`, so there is no host to
    // allow — keep it that way rather than opening the optimizer to the web.
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
