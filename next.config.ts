import type { NextConfig } from 'next';

/**
 * Security headers on every response. A marketing site is mostly a target for
 * being framed or having its forms hijacked, so it gets the same basics as
 * anything else: no framing, no MIME sniffing, a strict referrer policy, and
 * no access to the camera, microphone or location from the page.
 */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // The root layout sits under [lang], so a URL outside every language
    // (only possible for paths the proxy skips, like /x.php) needs its own 404.
    globalNotFound: true,
  },
  async headers() {
    // Static assets under /_next/static are content-hashed and already served
    // with an immutable Cache-Control by Next itself.
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
