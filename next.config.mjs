/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  typescript: {
    // Allow production builds to succeed even when there are TypeScript errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds to succeed even when there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable Next.js image optimization so images from any host load
    // without needing to be whitelisted. This fixes the broken images
    // coming from vercel-storage blobs, svgrepo, and other CDNs.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'apnacounsellor.in' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'www.svgrepo.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
